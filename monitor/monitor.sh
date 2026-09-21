#!/bin/bash

echo "========================================="
echo "          🐳 DockVia Monitor"
echo "========================================="
echo

echo "Container Status"
echo "-----------------------------------------"

docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"

echo
echo "Resource Usage"
echo "-----------------------------------------"

docker stats --no-stream \
  --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}"

echo
echo "Docker Disk Usage"
echo "-----------------------------------------"

docker system df

echo
echo "Monitor Summary"
echo "-----------------------------------------"

running=$(docker ps -q | wc -l)
stopped=$(docker ps -aq -f status=exited | wc -l)

echo "Running Containers : $running"
echo "Stopped Containers : $stopped"

echo
echo "========================================="
echo "       Monitor Scan Completed"
echo "========================================="