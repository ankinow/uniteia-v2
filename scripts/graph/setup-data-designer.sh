#!/usr/bin/env bash
# setup-data-designer.sh
# Install NeMo DataDesigner for entity extraction pipeline
#
# Requirements: Python 3.10-3.13 (NOT 3.14 — pyarrow lacks pre-built wheels)
# Tested on: Ubuntu 24.04, Debian 12, macOS 14+

set -euo pipefail

echo "╔═══════════════════════════════════════════╗"
echo "║  NeMo DataDesigner — Setup               ║"
echo "╚═══════════════════════════════════════════╝"

# Check Python version
PY_VER=$(python3 -c 'import sys; v=sys.version_info; print(f"{v.major}.{v.minor}")')
echo "  Python: ${PY_VER}"

if [[ "$PY_VER" == "3.14"* ]]; then
    echo "  ⚠️  Python 3.14 detected — pyarrow lacks pre-built wheels."
    echo "  Use conda or Docker instead:"
    echo "    docker run -it --rm python:3.12-slim bash"
    echo "    (then run this script inside the container)"
    echo ""
    echo "  Or install pyarrow from source:"
    echo "    pip install pyarrow --no-binary pyarrow"
    echo "    # Requires: build-essential, cmake, libarrow-dev"
fi

# Create virtual environment
VENV_DIR="${VENV_DIR:-./.venv-data-designer}"

if [ ! -d "$VENV_DIR" ]; then
    echo "  Creating venv: ${VENV_DIR}"
    python3 -m venv "$VENV_DIR"
fi

source "${VENV_DIR}/bin/activate"

# Install data-designer
echo "  Installing data-designer..."
pip install --quiet --upgrade pip
pip install --quiet 'data-designer>=0.5,<0.7'

echo ""
echo "✅ Setup complete. Activate with:"
echo "    source ${VENV_DIR}/bin/activate"
echo ""
echo "▶ Run pipeline:"
echo "    export NVIDIA_API_KEY='nvapi-...'"
echo "    python3 scripts/graph/run-entity-extraction.py"
echo ""
echo "▶ Or use config directly:"
echo "    python3 -m data_designer config/entity-extraction.yaml"
