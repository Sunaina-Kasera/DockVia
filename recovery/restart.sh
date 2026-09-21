#!/bin/bash

recover_containers() {

    echo "Recovery Actions"
    echo "-----------------------------------------"

    recovered=0
    failed=0

    stopped_containers=$(docker ps -aq -f status=exited)

    if [ -z "$stopped_containers" ]; then
        echo "✅ No stopped containers found."
        return
    fi

    for container in $stopped_containers
    do
        name=$(docker inspect --format='{{.Name}}' "$container" | cut -c2-)

        if docker start "$container" >/dev/null 2>&1; then
            echo "🔄 Starting $name ... ✅ Success"
            ((recovered++))
        else
            echo "🔄 Starting $name ... ❌ Failed"
            ((failed++))
        fi
    done

    echo
    echo "Recovery Summary"
    echo "-----------------------------------------"
    echo "Recovered : $recovered"
    echo "Failed    : $failed"
}