FROM node:20-slim AS base

ARG PORT=3000

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Dependencies
FROM base AS dependencies

# Create the .npmrc file using the secret.
# IMPORTANT:  Pass NPM_TOKEN as a build argument.  Example:
# docker build --build-arg NPM_TOKEN=$NPM_TOKEN .
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc

# If your .npmrc has other content beyond the token, use a more complex echo:
# ARG NPM_REGISTRY  # Define more ARGs for other .npmrc values
# ARG NPM_EMAIL
# RUN echo "registry=$NPM_REGISTRY\n_authToken=$NPM_TOKEN\nemail=$NPM_EMAIL\nalways-auth=true" > .npmrc

COPY package.json package-lock.json ./
RUN npm ci

# Build
FROM base AS build

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Run
FROM base AS run

ENV NODE_ENV=production
ENV PORT=$PORT

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE $PORT

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
