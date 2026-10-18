// @ts-check
// Smoke test for server/ai/aiClient. Makes one real (billed) API call.
// Usage: node scripts/ai-smoke.js
require('dotenv').config();
const { generateStructured, AIError } = require('../server/ai/aiClient');

const schema = {
  type: 'object',
  properties: { greeting: { type: 'string' } },
  required: ['greeting'],
  additionalProperties: false,
};

async function main() {
  try {
    const result = await generateStructured({
      system: 'You write short, friendly greetings.',
      user: 'Greet a traveler who is about to pack for a trip.',
      schema,
      maxTokens: 1024,
    });
    console.log('model:', process.env.AI_MODEL || 'claude-haiku-5-5 (default)');
    console.log('data:', result.data);
    console.log('usage:', result.usage);
  } catch (err) {
    if (err instanceof AIError) {
      console.error(`AIError [${err.code}]: ${err.message}`, {
        status: err.status,
        requestId: err.requestId,
      });
    } else {
      console.error('Unexpected error:', err);
    }
    process.exitCode = 1;
  }
}

main();
