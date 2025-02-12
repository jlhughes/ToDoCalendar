#!/bin/bash
if [ "$#" -ne 3 ]; then
    echo "usage: $0 cluster_name journals host_name"
    exit 1
fi

source build/env.sh

CLUSTER_NAME=$1
JOURNALS=$2
HOST_NAME=$3

node foam3/tools/build.js -Ppom,foam3/src/foam/core/medusa/pom -J${JOURNALS},../foam3/deployment/m,../foam3/deployment/mm,${CLUSTER_NAME} -N${HOST_NAME} -ucd
