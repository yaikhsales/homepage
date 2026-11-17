# yaikh-com on Railway.
#
# Why a Dockerfile: Railway's default builder copied the whole app, including
# ~1.4 GB of training videos and images under public/experience/assets, into
# ONE image layer. Any change, even one word, made that layer new, so every
# deploy re-packed and re-uploaded the 1.4 GB (~10 min).
#
# Here the big media sit in their own layer that only changes when the media
# change, and npm packages sit in a layer that only changes with
# package-lock.json. A normal code push rebuilds and uploads just the code.

# --- npm packages: reused until package-lock.json changes -------------------
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# --- build ------------------------------------------------------------------
FROM node:22-slim AS build
WORKDIR /app
# Railway passes service variables to declared build args. Some pages are
# generated at build time and need these (Mongo, Gemini, feeds, prices).
ARG MONGO_URL
ARG GEMINI_API_KEY
ARG M1_LLM_URL
ARG M1_LLM_TOKEN
ARG NEWSROOM_FEED_URL
ARG NEWSROOM_FEED_TOKEN
ARG NEXT_PUBLIC_SUBSCRIPTION_KHR_PER_USD
ARG SUBSCRIPTION_KHR_PER_USD
ARG SUBSCRIPTION_INVOICE_REQUESTS_ENABLED
ARG SUBSCRIPTION_RECEIPTS_ENABLED
ARG PAYWAY_API_KEY
ARG PAYWAY_BASE_URL
ARG PAYWAY_MERCHANT_ID
ARG PAYWAY_RSA_PUBLIC_KEY
ARG PAYWAY_TRANSACTION_LIFETIME_MINUTES
# Private URL of the yai-media service; baked into the rewrites at build time.
ARG MEDIA_ORIGIN
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build \
 && rm -rf .next/cache \
 && mv node_modules /tmp/node_modules \
 && mv public/experience/assets /tmp/experience-assets

# --- run --------------------------------------------------------------------
FROM node:22-slim AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
# Layer order = how often each part changes: rarest first.
COPY --from=deps /app/node_modules ./node_modules
COPY public/experience/assets ./public/experience/assets
COPY --from=build /app ./
CMD ["npm", "run", "start"]
