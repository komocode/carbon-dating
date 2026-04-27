#!/usr/bin/env bash
# Build a minimal Chrome Web Store .zip: only files the extension loads at runtime.
# Excludes .git, docs, store-assets, dev tooling, and any other repo-only content.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

VERSION="$(
  python3 -c "import json; print(json.load(open('manifest.json', encoding='utf-8'))['version'])" 2>/dev/null \
  || { echo "error: set version in manifest.json; python3 is required to read it" >&2; exit 1; }
)"

OUT_DIR="${ROOT}/dist"
STAGE="$(mktemp -d "/tmp/carbon-dating-cws.XXXXXX")"
OUT_ZIP="${OUT_DIR}/carbon-dating-v${VERSION}-chrome-web-store.zip"

cleanup() { rm -rf "$STAGE"; }
trap cleanup EXIT

mkdir -p "$OUT_DIR" "$STAGE/icons"

# Only files required by the extension (see manifest + popup).
cp -f manifest.json content.js popup.html popup.js "$STAGE/"
cp -f icons/icon-16.png icons/icon-32.png icons/icon-48.png icons/icon-128.png "$STAGE/icons/"

# Drop accidental macOS / editor junk in copied trees (none expected with cp files).
find "$STAGE" -name '.DS_Store' -delete 2>/dev/null || true

( cd "$STAGE" && zip -r -X -q "$OUT_ZIP" . )

echo "Wrote: $OUT_ZIP"
unzip -l "$OUT_ZIP"
