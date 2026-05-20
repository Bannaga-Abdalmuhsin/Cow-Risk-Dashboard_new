#!/usr/bin/env bash
# release.sh — Bump version/build numbers, record in RELEASES.md, and commit.
# Usage: ./scripts/release.sh [patch|minor|major]
#
# Requires: node, jq (>= 1.6)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
APP_JSON="${APP_ROOT}/app.json"
RELEASES_FILE="${APP_ROOT}/build-logs/RELEASES.md"

BUMP="${1:-patch}"

# ---------------------------------------------------------------------------
# Read current values
# ---------------------------------------------------------------------------
CURRENT_VERSION=$(jq -r '.expo.version' "${APP_JSON}")
CURRENT_IOS_BUILD=$(jq -r '.expo.ios.buildNumber' "${APP_JSON}")
CURRENT_ANDROID_CODE=$(jq -r '.expo.android.versionCode' "${APP_JSON}")

# ---------------------------------------------------------------------------
# Bump semantic version
# ---------------------------------------------------------------------------
IFS='.' read -r MAJOR MINOR PATCH <<< "${CURRENT_VERSION}"

case "${BUMP}" in
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  patch) PATCH=$((PATCH + 1)) ;;
  *)
    echo "ERROR: Unknown bump type '${BUMP}'. Use patch, minor, or major." >&2
    exit 1
    ;;
esac

NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
NEW_IOS_BUILD=$((CURRENT_IOS_BUILD + 1))
NEW_ANDROID_CODE=$((CURRENT_ANDROID_CODE + 1))
RELEASE_DATE=$(date -u +%Y-%m-%d)

# ---------------------------------------------------------------------------
# Update app.json
# ---------------------------------------------------------------------------
TMP=$(mktemp)
jq \
  --arg ver "${NEW_VERSION}" \
  --arg ios "${NEW_IOS_BUILD}" \
  --argjson android "${NEW_ANDROID_CODE}" \
  '.expo.version = $ver | .expo.ios.buildNumber = $ios | .expo.android.versionCode = $android' \
  "${APP_JSON}" > "${TMP}" && mv "${TMP}" "${APP_JSON}"

echo "app.json updated: version=${NEW_VERSION}, iOS build=${NEW_IOS_BUILD}, Android versionCode=${NEW_ANDROID_CODE}"

# ---------------------------------------------------------------------------
# Append to RELEASES.md
# ---------------------------------------------------------------------------
mkdir -p "$(dirname "${RELEASES_FILE}")"

if [ ! -f "${RELEASES_FILE}" ]; then
  cat > "${RELEASES_FILE}" <<'EOF'
# ACES Field Team Tracker — Release History

| Date | Version | iOS Build | Android versionCode |
|------|---------|-----------|---------------------|
EOF
fi

echo "| ${RELEASE_DATE} | ${NEW_VERSION} | ${NEW_IOS_BUILD} | ${NEW_ANDROID_CODE} |" >> "${RELEASES_FILE}"

echo "RELEASES.md updated."

# ---------------------------------------------------------------------------
# Git commit
# ---------------------------------------------------------------------------
cd "${APP_ROOT}"
if git rev-parse --is-inside-work-tree &>/dev/null; then
  git add app.json build-logs/RELEASES.md
  if git diff --cached --quiet; then
    echo "Nothing to commit (working tree clean)."
  else
    git commit -m "release: v${NEW_VERSION} (iOS build ${NEW_IOS_BUILD}, Android ${NEW_ANDROID_CODE})"
    echo "Committed: release v${NEW_VERSION}"
  fi
else
  echo "Not a git repository — skipping commit."
fi

echo ""
echo "Released v${NEW_VERSION} — iOS build ${NEW_IOS_BUILD}, Android versionCode ${NEW_ANDROID_CODE}"
