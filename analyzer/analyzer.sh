#!/bin/bash

echo "========================================="
echo "         🧠 DockVia Analyzer"
echo "========================================="
echo

# Container analysis
running=$(docker ps -q | wc -l)
stopped=$(docker ps -aq -f status=exited | wc -l)

# Docker resources
total_images=$(docker images -q | sort -u | wc -l)
total_volumes=$(docker volume ls -q | wc -l)
total_networks=$(docker network ls -q | wc -l)

# Unused resources
unused_images=$(docker images -q -f dangling=true | sort -u | wc -l)
unused_volumes=$(docker volume ls -qf dangling=true | wc -l)

echo "Environment Analysis"
echo "-----------------------------------------"
echo "Running Containers : $running"
echo "Stopped Containers : $stopped"
echo "Total Images       : $total_images"
echo "Unused Images      : $unused_images"
echo "Total Volumes      : $total_volumes"
echo "Unused Volumes     : $unused_volumes"
echo "Total Networks     : $total_networks"

# Health score
score=100

score=$((score - stopped * 5))
score=$((score - unused_images * 3))
score=$((score - unused_volumes * 3))

if [ "$score" -lt 0 ]; then
    score=0
fi

if [ "$score" -ge 80 ]; then
    risk="LOW"
elif [ "$score" -ge 50 ]; then
    risk="MEDIUM"
else
    risk="HIGH"
fi

echo
echo "Health Assessment"
echo "-----------------------------------------"
echo "Health Score : $score / 100"
echo "Risk Level   : $risk"

echo
echo "Recommendations"
echo "-----------------------------------------"

if [ "$stopped" -gt 0 ]; then
    echo "⚠ $stopped stopped container(s) detected."
    echo "  Review stopped containers and remove unnecessary ones."
fi

if [ "$unused_images" -gt 0 ]; then
    echo "⚠ $unused_images unused image(s) detected."
    echo "  Consider removing unused Docker images."
fi

if [ "$unused_volumes" -gt 0 ]; then
    echo "⚠ $unused_volumes unused volume(s) detected."
    echo "  Review unused volumes before cleanup."
fi

if [ "$stopped" -eq 0 ] && [ "$unused_images" -eq 0 ] && [ "$unused_volumes" -eq 0 ]; then
    echo "✅ No major optimization issues detected."
fi

echo
echo "========================================="
echo "       Analysis Completed"
echo "========================================="
