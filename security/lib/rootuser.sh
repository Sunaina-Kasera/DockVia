#!/bin/bash

check_root_user() {

    echo "Root User Check"
    echo "-----------------------------------------"

    count=0

    for container in $(docker ps -q); do

        name=$(docker inspect --format='{{.Name}}' "$container" | cut -c2-)
        user=$(docker inspect --format='{{.Config.User}}' "$container")

        if [ -z "$user" ] || [ "$user" = "0" ] || [ "$user" = "root" ]; then
            echo "⚠ $name → root/default user"
            ((count++))
        else
            echo "✅ $name → $user"
        fi
    done

    echo
    echo "Root Containers : $count"
}