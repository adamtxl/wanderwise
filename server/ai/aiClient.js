// @ts-check
const Anthropic = require('@anthropic-ai/sdk').default;

const DEFAULT_MODEL = 'claude-haiku-5-5';
// Per attempt. The SDK retries 429/5xx/timeouts, so worst case is
// TIMEOUT_MS * (MAX_RETRIES + 1).
const TIMEOUT_MS = 15_000;
const MAX_RETRIES = 1;
// Haiku 5.5 defaults to 'medium'. Short structured answers don't need more,
// and thinking tokens count toward maxTokens.
const EFFORT = 'low';

/** @typedef {'timeout' | 'rate_limited' | 'bad_output' | 'api_error'} AIErrorCode */

class AIError extends Error {
  /**
   * @param {AIErrorCode} code
   * @param {string} message
   * @param {{ status?: number, requestId?: string | null }} [details]
   */
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'AIError';
    this.code = code;
    this.status = details.status;
    this.requestId = details.requestId ?? null;
  }
}

/** @type {Anthropic | null} */
let client = null;

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new AIError('api_error', 'ANTHROPIC_API_KEY is not set');
  }
  if (!client) {
    client = new Anthropic({ timeout: TIMEOUT_MS, maxRetries: MAX_RETRIES });
  }
  return client;
}

/**
 * Maps SDK errors to AIError. Only copies status and request id, never the
 * SDK error itself, so callers can't accidentally log request details.
 * @param {unknown} err
 * @returns {AIError}
 */
function toAIError(err) {
  if (err instanceof AIError) return err;
  if (err instanceof Anthropic.APIConnectionTimeoutError) {
    return new AIError('timeout', 'AI request timed out');
  }
  if (err instanceof Anthropic.RateLimitError) {
    return new AIError('rate_limited', 'AI provider rate limit hit', {
      status: err.status,
      requestId: err.requestID,
    });
  }
  if (err instanceof Anthropic.APIError) {
    return new AIError('api_error', `AI provider error (${err.status ?? 'no status'})`, {
      status: err.status,
      requestId: err.requestID,
    });
  }
  return new AIError('api_error', 'Unexpected AI client error');
}

/**
 * Sends one request whose output is constrained to a JSON schema.
 *
 * The schema must follow structured-output rules: every object needs
 * `additionalProperties: false` and a `required` list; no recursive schemas
 * and no min/max/length constraints.
 *
 * @template T
 * @param {{
 *   system: string,
 *   user: string,
 *   schema: Record<string, unknown>,
 *   maxTokens: number,
 * }} params
 * @returns {Promise<{ data: T, usage: { inputTokens: number, outputTokens: number } }>}
 */
async function generateStructured({ system, user, schema, maxTokens }) {
  /** @type {Anthropic.Message} */
  let response;
  try {
    response = await getClient().messages.create({
      model: process.env.AI_MODEL || DEFAULT_MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
      output_config: {
        effort: EFFORT,
        format: { type: 'json_schema', schema },
      },
    });
  } catch (err) {
    throw toAIError(err);
  }

  const usage = {
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
  // Refusals and max_tokens cutoffs can return text that doesn't match the schema.
  if (response.stop_reason !== 'end_turn') {
    throw new AIError('bad_output', `Model stopped with ${response.stop_reason}`);
  }

  // Thinking blocks can come first, so find the text block by type.
  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new AIError('bad_output', 'Model returned no text block');
  }

  /** @type {T} */
  let data;
  try {
    data = JSON.parse(textBlock.text);
  } catch {
    throw new AIError('bad_output', 'Model output was not valid JSON');
  }

  return { data, usage };
}

module.exports = { generateStructured, AIError };
