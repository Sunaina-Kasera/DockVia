#!/bin/bash

check_exposed_ports() {

    echo "Exposed Ports"
    echo "-----------------------------------------"

    docker ps --format "table {{.Names}}\t{{.Ports}}"
}