#!/bin/sh
#
# Downloads/updates the W3C SPARQL conformance test files from:
#   https://github.com/w3c/rdf-tests/tree/main/sparql
#
# Usage:
#   ./scripts/update-w3c-tests.sh              # update from the main branch
#   ./scripts/update-w3c-tests.sh <branch>     # update from a specific branch/tag/commit
#

set -eu

REPO_URL="https://github.com/w3c/rdf-tests.git"
BRANCH="${1:-main}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
TEST_FILES_DIR="${PROJECT_ROOT}/test-files"
TEMP_DIR="$(mktemp -d)"

cleanup() {
  echo "Cleaning up temporary directory..."
  rm -rf "${TEMP_DIR}"
}
trap cleanup EXIT

echo "============================================================"
echo "  Updating W3C SPARQL test files"
echo "  Repository : ${REPO_URL}"
echo "  Branch/Tag : ${BRANCH}"
echo "============================================================"
echo ""

# Use a sparse checkout to only fetch the sparql/ directory
echo "Cloning repository (sparse checkout of sparql/ directory)..."
git clone --no-checkout --depth 1 --branch "${BRANCH}" --filter=blob:none \
  "${REPO_URL}" "${TEMP_DIR}/rdf-tests"

cd "${TEMP_DIR}/rdf-tests"
git sparse-checkout init --cone
git sparse-checkout set sparql
git checkout

COMMIT_SHA="$(git rev-parse HEAD)"
COMMIT_DATE="$(git log -1 --format=%ci)"
echo ""
echo "Checked out commit: ${COMMIT_SHA}"
echo "Commit date       : ${COMMIT_DATE}"
echo ""

cd "${PROJECT_ROOT}"

# Discover all sparql* subdirectories in the cloned repo automatically
mkdir -p "${TEST_FILES_DIR}"
for src in "${TEMP_DIR}"/rdf-tests/sparql/sparql*/; do
  # Skip if the glob didn't match anything
  [ -d "${src}" ] || continue

  sparql_version="$(basename "${src}")"
  dest="${TEST_FILES_DIR}/${sparql_version}"

  echo "Updating ${sparql_version}..."
  echo "  Source     : sparql/${sparql_version}"
  echo "  Destination: test-files/${sparql_version}"

  # Remove old files and replace with new ones
  rm -rf "${dest}"
  cp -a "${src}" "${dest}"

  echo "  Done."
  echo ""
done

echo "============================================================"
echo "  Update complete!"
echo "  Source commit: ${COMMIT_SHA} (${COMMIT_DATE})"
echo ""
echo "  Review the changes with:"
echo "    git diff --stat test-files/"
echo "============================================================"

