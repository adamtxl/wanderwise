# syntax = docker/dockerfile:1

ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules, including dev deps needed to build the client
COPY --link package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY --link . .

# Build the Vite client. VITE_* vars are inlined at build time, so the
# token has to be present here, not at runtime.
ARG VITE_MAPBOX_TOKEN
ENV VITE_MAPBOX_TOKEN=$VITE_MAPBOX_TOKEN
RUN npm run build

# Drop dev dependencies from the tree we ship
RUN npm prune --omit=dev


# Final stage for app image
FROM base

COPY --from=build /app /app

EXPOSE 8080
CMD [ "npm", "run", "start" ]