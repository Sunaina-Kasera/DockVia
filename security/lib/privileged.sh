#!/bin/bash

check_privileged() {

    echo "Privileged Containers"
    echo "-----------------------------------------"

    count=0

    for container in $(docker ps -q); do

        name=$(docker inspect --format='{{.Name}}' "$container" | cut -c2-)
        privileged=$(docker inspect --format='{{.HostConfig.Privileged}}' "$container")

        if [ "$privileged" = "true" ]; then
            echo "⚠ $name"
            ((count++))
        fi
    done

    if [ "$count" -eq 0 ]; then
        echo "✅ No privileged containers found"
    fi

    echo
    echo "Privileged Count : $count"
}