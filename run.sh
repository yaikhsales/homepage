#!/bin/sh
# Start both local Yai applications:
#   marketing site: http://localhost:3001
#   Experience dashboard: http://localhost:3002

set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
MARKETING_DIR="$ROOT_DIR/yaikh-com"
DASHBOARD_DIR="$ROOT_DIR/yaikh-dashboard"
MARKETING_PORT=3001
DASHBOARD_PORT=3002
LOG_DIR=${TMPDIR:-/tmp}/yaikh-homepage-logs

die() {
  echo "run.sh: $*" >&2
  exit 1
}

command -v node >/dev/null 2>&1 || die "Node.js is required (https://nodejs.org/)"
command -v npm >/dev/null 2>&1 || die "npm is required (installing Node.js provides it)"
command -v curl >/dev/null 2>&1 || die "curl is required to verify the local servers"

[ -f "$MARKETING_DIR/package.json" ] || die "missing $MARKETING_DIR/package.json"
[ -f "$DASHBOARD_DIR/package.json" ] || die "missing $DASHBOARD_DIR/package.json"

for port in "$MARKETING_PORT" "$DASHBOARD_PORT"; do
  if command -v lsof >/dev/null 2>&1 && lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    die "port $port is already in use; stop that process and run this script again"
  fi
done

install_if_needed() {
  app_dir=$1
  if [ ! -d "$app_dir/node_modules" ]; then
    echo "Installing dependencies in $(basename "$app_dir")..."
    (cd "$app_dir" && npm install)
  fi
}

install_if_needed "$MARKETING_DIR"
install_if_needed "$DASHBOARD_DIR"

mkdir -p "$LOG_DIR"
marketing_log="$LOG_DIR/marketing.log"
dashboard_log="$LOG_DIR/dashboard.log"

cleanup() {
  trap - INT TERM EXIT
  [ -n "${marketing_pid:-}" ] && kill "$marketing_pid" 2>/dev/null || true
  [ -n "${dashboard_pid:-}" ] && kill "$dashboard_pid" 2>/dev/null || true
}
trap cleanup INT TERM EXIT

echo "Starting marketing site on http://localhost:$MARKETING_PORT"
(cd "$MARKETING_DIR" && npm run dev >"$marketing_log" 2>&1) &
marketing_pid=$!

echo "Starting Experience dashboard on http://localhost:$DASHBOARD_PORT"
(cd "$DASHBOARD_DIR" && PORT=$DASHBOARD_PORT BROWSER=none npm start >"$dashboard_log" 2>&1) &
dashboard_pid=$!

echo "Logs: $marketing_log and $dashboard_log"
echo "Press Ctrl-C to stop both servers."

wait_for_url() {
  url=$1
  attempts=0
  # Next.js can take more than a minute on its first start.  Retry quietly so
  # normal compilation does not look like a server failure in the terminal.
  while [ "$attempts" -lt 120 ]; do
    if curl -fs -o /dev/null "$url"; then
      return 0
    fi
    attempts=$((attempts + 1))
    sleep 1
  done
  return 1
}

if wait_for_url "http://localhost:$MARKETING_PORT/" && \
   wait_for_url "http://localhost:$DASHBOARD_PORT/"; then
  echo "Both applications are ready."
else
  echo "A server did not become ready. Check the logs above." >&2
  exit 1
fi

wait
