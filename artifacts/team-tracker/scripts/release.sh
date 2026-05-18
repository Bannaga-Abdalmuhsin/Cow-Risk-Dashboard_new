#!/usr/bin/env bash
# release.sh — Bump version, then trigger Android APK + iOS App Store builds via EAS.
# Must be run from the artifacts/team-tracker directory (or repo root — see below).
#
# Usage (from repo root):
#   export EXPO_TOKEN="<your-robot-token>"
#   bash artifacts/team-tracker/scripts/release.sh [--bump patch|minor|major]
#
# Usage (from artifacts/team-tracker):
#   export EXPO_TOKEN="<your-robot-token>"
#   bash scripts/release.sh [--bump patch|minor|major]
#
# Flags:
#   --bump patch   Increment patch version (1.2.3 → 1.2.4) and bump build number
#   --bump minor   Increment minor version (1.2.3 → 1.3.0) and bump build number
#   --bump major   Increment major version (1.2.3 → 2.0.0) and bump build number
#   (no flag)      Only bump the build number / versionCode; semver unchanged

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

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------
BUMP_TYPE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --bump)
      if [[ -z "${2:-}" ]]; then
        echo "ERROR: --bump requires an argument: patch, minor, or major" >&2
        exit 1
      fi
      BUMP_TYPE="$2"
      shift 2
      ;;
    --bump=*)
      BUMP_TYPE="${1#--bump=}"
      shift
      ;;
    *)
      echo "ERROR: Unknown argument: $1" >&2
      echo "Usage: $0 [--bump patch|minor|major]" >&2
      exit 1
      ;;
  esac
done

if [[ -n "$BUMP_TYPE" ]] && [[ "$BUMP_TYPE" != "patch" && "$BUMP_TYPE" != "minor" && "$BUMP_TYPE" != "major" ]]; then
  echo "ERROR: --bump value must be patch, minor, or major (got: $BUMP_TYPE)" >&2
  exit 1
fi

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
# Version bump — always increments buildNumber/versionCode;
# optionally bumps semver when --bump is provided.
# ---------------------------------------------------------------------------
APP_JSON="$APP_DIR/app.json"

log "--- Version bump ---"

BUMP_SCRIPT=$(cat <<'JSEOF'
const fs = require('fs');
const appJsonPath = process.argv[2];
const bumpType    = process.argv[3] || '';   // 'patch' | 'minor' | 'major' | ''

const data = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
const expo = data.expo;

// --- semver bump ---
let version = expo.version || '1.0.0';
if (bumpType) {
  const parts = version.split('.').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    process.stderr.write(`ERROR: Cannot parse version "${version}" as semver\n`);
    process.exit(1);
  }
  if (bumpType === 'major') { parts[0]++; parts[1] = 0; parts[2] = 0; }
  else if (bumpType === 'minor') { parts[1]++; parts[2] = 0; }
  else { parts[2]++; }
  version = parts.join('.');
  expo.version = version;
}

// --- build number (iOS string) ---
const prevBuildNumber = parseInt(expo.ios?.buildNumber || '0', 10);
const newBuildNumber  = prevBuildNumber + 1;
if (!expo.ios) expo.ios = {};
expo.ios.buildNumber = String(newBuildNumber);

// --- versionCode (Android integer) ---
const prevVersionCode = parseInt(String(expo.android?.versionCode || '0'), 10);
const newVersionCode  = prevVersionCode + 1;
if (!expo.android) expo.android = {};
expo.android.versionCode = newVersionCode;

fs.writeFileSync(appJsonPath, JSON.stringify(data, null, 2) + '\n');

// Output for shell to read
process.stdout.write(JSON.stringify({
  version,
  prevBuildNumber,
  newBuildNumber,
  prevVersionCode,
  newVersionCode,
}));
JSEOF
)

VERSION_INFO=$(node -e "$BUMP_SCRIPT" "$APP_JSON" "$BUMP_TYPE")

APP_VERSION=$(echo "$VERSION_INFO"  | node -e "process.stdout.write(JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')).version)")
NEW_BUILD=$(echo "$VERSION_INFO"    | node -e "process.stdout.write(String(JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')).newBuildNumber))")
PREV_BUILD=$(echo "$VERSION_INFO"   | node -e "process.stdout.write(String(JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')).prevBuildNumber))")
NEW_VC=$(echo "$VERSION_INFO"       | node -e "process.stdout.write(String(JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')).newVersionCode))")
PREV_VC=$(echo "$VERSION_INFO"      | node -e "process.stdout.write(String(JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')).prevVersionCode))")

if [[ -n "$BUMP_TYPE" ]]; then
  log "  Semver bump   : --bump $BUMP_TYPE"
fi
log "  App version   : $APP_VERSION"
log "  iOS build#    : $PREV_BUILD → $NEW_BUILD"
log "  Android VC    : $PREV_VC → $NEW_VC"
log ""

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
log " Version : $APP_VERSION  (build $NEW_BUILD / versionCode $NEW_VC)"
log " Full log saved to: $LOG_FILE"
log "=========================================="
