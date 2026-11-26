#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

APP_URL="${APP_URL:-http://localhost:3000}"
SERVER_PID=""
STARTED_SERVER=0

cleanup() {
  if [ "$STARTED_SERVER" -eq 1 ] && [ -n "$SERVER_PID" ]; then
    echo "Stopping temporary server (PID $SERVER_PID)..."
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo "=== 1. Building production bundle ==="
npm run build

if ! curl -s -o /dev/null "$APP_URL"; then
  echo "=== 2. Starting local server on $APP_URL ==="
  npx serve -s build -l 3000 >/tmp/niramaya-test-server.log 2>&1 &
  SERVER_PID=$!
  STARTED_SERVER=1

  for _ in $(seq 1 30); do
    if curl -s -o /dev/null "$APP_URL"; then
      break
    fi
    sleep 0.5
  done
else
  echo "=== 2. Reusing running server at $APP_URL ==="
fi

echo "=== 3. Running Playwright end-to-end tests ==="
APP_URL="$APP_URL" npx playwright test "$@"