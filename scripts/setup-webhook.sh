#!/usr/bin/env bash

set -e

# === CONFIG ===
BOT_TOKEN="${BOT_TOKEN:-}"
WEBHOOK_URL="${LAMBDA_FUNCTION_URL:-}"
# === Check ===
if [ -z "$BOT_TOKEN" ]; then
  echo "❌ BOT_TOKEN not found..."
  exit 1
fi

if [ -z "$WEBHOOK_URL" ]; then
  echo "❌ URL Webhook is empty."
  exit 1
fi

echo "🚀 Updating Webhook Telegram → $WEBHOOK_URL"

curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${WEBHOOK_URL}\"}"

printf "\n✅  Webhook Telegram updated!"
