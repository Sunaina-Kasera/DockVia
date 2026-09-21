#!/bin/bash

echo "========================================="
echo "        🐳 DockVia Inventory"
echo "========================================="
echo

echo "Docker Version"
echo "-----------------------------------------"
docker --version
echo

echo "Containers"
echo "-----------------------------------------"
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"
echo

echo "Images"
echo "-----------------------------------------"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
echo

echo "Volumes"
echo "-----------------------------------------"
docker volume ls
echo

echo "Networks"
echo "-----------------------------------------"
docker network ls

echo
echo "========================================="
echo "      Inventory Scan Completed"
echo "========================================="