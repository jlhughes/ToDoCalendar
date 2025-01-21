#!/bin/bash
./build.sh -ckJjournal,demo,u -Njournal_demo "$@"
foam3/tools/bin/install_remote.sh -Njournal_demo -W8100 -Hmoosehead
