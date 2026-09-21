#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SCRIPT_DIR/lib/privileged.sh"
source "$SCRIPT_DIR/lib/rootuser.sh"
source "$SCRIPT_DIR/lib/exposedports.sh"

echo "========================================="
echo "        🔒 DockVia Security"
echo "========================================="
echo

echo "Running Containers : $(docker ps -q | wc -l)"
echo

check_privileged

echo
check_root_user

echo
check_exposed_ports

echo
echo "========================================="
echo "       Security Scan Completed"
echo "========================================="