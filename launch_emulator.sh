#!/bin/bash

echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

TOOLS_DIR=~/Android/Sdk/tools
EMULATOR=$TOOLS_DIR/emulator

echo $EMULATOR
AVD=$($EMULATOR -list-avds)
echo $AVD
$EMULATOR -avd $AVD
