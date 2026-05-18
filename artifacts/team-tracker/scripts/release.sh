#!/usr/bin/env bash
# release.sh — Trigger Android APK + iOS App Store builds via EAS in one command.
# Must be run from the artifacts/team-tracker directory (or repo root — see below).
#
# Usage (from repo root):
#   export EXPO_TOKEN="<your-robot-token>"
#   bash artifacts/team-tracker/scripts/release.sh
#
# Usage (from artifacts/team-tracker):
#   export EXPO_TOKEN="<your-robot-token>"
#   bash scripts/release.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

LOG_DIR="$APP_DIR/build-logs"
mkdir -p "$LOG_DIR"

TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
LOG_FILE="$LOG_DIR/release-$TIMESTAMP.log"

log() {
  echo "$*" | tee -a "$LOG_FILE"
}

log "=========================================="
log " ACES Field Team Tracker — Release Build"
log " $(date -u)"
log "=========================================="
log ""

if [[ -z "${EXPO_TOKEN:-}" ]]; then
  log "ERROR: EXPO_TOKEN is not set. Export your EAS robot token before running."
  log "  export EXPO_TOKEN=\"<your-robot-token>\""
  exit 1
fi

cd "$APP_DIR"

# ---------------------------------------------------------------------------
# Android — APK (preview profile, internal distribution)
# ---------------------------------------------------------------------------
log "--- Android APK build (profile: preview) ---"
ANDROID_OUTPUT=$(eas build \
  --platform android \
  --profile preview \
  --non-interactive \
  2>&1 | tee -a "$LOG_FILE")

ANDROID_URL=$(echo "$ANDROID_OUTPUT" | grep -Eo 'https://expo\.dev/accounts/[^ ]+' | tail -1 || true)
if [[ -n "$ANDROID_URL" ]]; then
  log ""
  log "Android build URL: $ANDROID_URL"
fi

log ""

# ---------------------------------------------------------------------------
# iOS — IPA (production profile, auto-submitted to App Store Connect)
# ---------------------------------------------------------------------------
log "--- iOS IPA build + submit (profile: production) ---"
IOS_OUTPUT=$(eas build \
  --platform ios \
  --profile production \
  --non-interactive \
  --auto-submit \
  2>&1 | tee -a "$LOG_FILE")

IOS_URL=$(echo "$IOS_OUTPUT" | grep -Eo 'https://expo\.dev/accounts/[^ ]+' | tail -1 || true)
if [[ -n "$IOS_URL" ]]; then
  log ""
  log "iOS build URL: $IOS_URL"
fi

log ""
log "=========================================="
log " All builds queued successfully."
log " Full log saved to: $LOG_FILE"
log "=========================================="
