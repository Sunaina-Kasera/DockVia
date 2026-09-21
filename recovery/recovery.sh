#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SCRIPT_DIR/restart.sh"

echo "========================================="
echo "        🔄 DockVia Recovery"
echo "========================================="
echo

echo "Host      : $(hostname)"
echo "User      : $(whoami)"
echo "Scan Time : $(date)"
echo

recover_containers

echo
echo "========================================="
echo "      Recovery Scan Completed"
echo "========================================="
