#!/bin/sh
#
# Fails when the branch changes Yasgui/packages without adding a patch to yasgui-patches/,
# or when an added patch doesn't match the branch's code.
#
# Usage:
#   ./scripts/check-yasgui-patch.sh <base-ref>     # e.g. origin/main
#

set -eu

BASE="${1:?Usage: $0 <base-ref>}"

changed=$(git diff --name-only "${BASE}...HEAD" -- Yasgui/packages)
if [ -z "${changed}" ]; then
  echo "No changes in Yasgui/packages."
  exit 0
fi

patches=$(git diff --name-only --diff-filter=A "${BASE}...HEAD" -- yasgui-patches)
if [ -z "${patches}" ]; then
  echo "ERROR: Yasgui/packages changed, but no patch was added to yasgui-patches/. Changed files:"
  echo "${changed}"
  echo "See docs/conventions/conventions.md#commits-and-branches."
  exit 1
fi

# A patch whose changes are all present in the code reverts cleanly; one generated before later fixes doesn't.
status=0
echo "${patches}" | while IFS= read -r patch; do
  if git apply --check -R "${patch}"; then
    echo "OK: ${patch}"
  else
    echo "ERROR: ${patch} doesn't match the code in Yasgui/. Regenerate it after the last code change."
    exit 1
  fi
done || status=1

exit "${status}"
