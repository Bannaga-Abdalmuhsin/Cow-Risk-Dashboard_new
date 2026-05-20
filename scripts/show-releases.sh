#!/usr/bin/env bash
# show-releases.sh — Pretty-print the ACES Field Team Tracker release history.
# Usage: ./scripts/show-releases.sh [--last N]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RELEASES_FILE="${SCRIPT_DIR}/../artifacts/team-tracker/build-logs/RELEASES.md"

if [ ! -f "${RELEASES_FILE}" ]; then
  echo "No release history found at: ${RELEASES_FILE}" >&2
  exit 1
fi

# Parse optional --last N flag
LIMIT=0
if [ "${1:-}" = "--last" ] && [ -n "${2:-}" ]; then
  LIMIT="${2}"
fi

# ---------------------------------------------------------------------------
# Print header
# ---------------------------------------------------------------------------
echo ""
echo "  ACES Field Team Tracker — Release History"
echo "  =========================================="
echo ""
printf "  %-12s  %-10s  %-10s  %-20s\n" "Date" "Version" "iOS Build" "Android Code"
printf "  %-12s  %-10s  %-10s  %-20s\n" "------------" "----------" "----------" "--------------------"

# ---------------------------------------------------------------------------
# Parse markdown table rows (skip header rows, blank lines, and non-data lines)
# ---------------------------------------------------------------------------
DATA_LINES=()
while IFS= read -r line; do
  # Match lines that look like table data rows: | date | version | ios | android |
  if [[ "${line}" =~ ^\|[[:space:]]*[0-9]{4}-[0-9]{2}-[0-9]{2} ]]; then
    DATA_LINES+=("${line}")
  fi
done < "${RELEASES_FILE}"

TOTAL=${#DATA_LINES[@]}

if [ "${TOTAL}" -eq 0 ]; then
  echo "  (no releases recorded yet)"
  echo ""
  exit 0
fi

# Apply --last limit (show the last N entries)
START=0
if [ "${LIMIT}" -gt 0 ] && [ "${LIMIT}" -lt "${TOTAL}" ]; then
  START=$((TOTAL - LIMIT))
fi

for (( i=START; i<TOTAL; i++ )); do
  line="${DATA_LINES[$i]}"
  IFS='|' read -ra COLS <<< "${line}"
  DATE=$(echo "${COLS[1]}" | xargs)
  VER=$(echo "${COLS[2]}" | xargs)
  IOS=$(echo "${COLS[3]}" | xargs)
  ANDROID=$(echo "${COLS[4]}" | xargs)
  printf "  %-12s  %-10s  %-10s  %-20s\n" "${DATE}" "${VER}" "${IOS}" "${ANDROID}"
done

echo ""
echo "  Total releases: ${TOTAL}"
echo ""
