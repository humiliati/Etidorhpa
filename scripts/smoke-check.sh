#!/bin/bash
# Smoke check script for Etidorhpa project
# Verifies syntax of bootstrap files after rename from Septerra
# License: ISC

set -e  # Exit on first error

echo "Running smoke checks on bootstrap files..."

# Define bootstrap files to check
FILES=(
  "src/main.js"
  "src/scenes/BootScene.js"
  "src/scenes/WorldScene.js"
  "src/client/input/InputModeStateMachine.js"
  "src/client/layout/ViewportLayoutManager.js"
  "src/client/ui/createUiShell.js"
)

FAILED=0

for file in "${FILES[@]}"; do
  echo -n "Checking $file... "
  if node --check "$file" 2>&1; then
    echo "OK"
  else
    echo "FAILED"
    FAILED=$((FAILED + 1))
  fi
done

if [ $FAILED -eq 0 ]; then
  echo ""
  echo "✓ All checks passed!"
  exit 0
else
  echo ""
  echo "✗ $FAILED check(s) failed"
  exit 1
fi
