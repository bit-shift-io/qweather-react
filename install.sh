#!/bin/bash

# setup and install npm and react native

if ! [ -x "$(command -v npm)" ]; then

	yay -S --noconfirm npm

	mkdir ~/.node
	echo 'export PATH=$HOME/.node/bin:$PATH' >> ~/.bashrc
	. ~/.bashrc
	npm config set prefix ~/.node

fi

npm install -g react-native-cli


# setup settings for this project
echo "sdk.dir = /home/$(whoami)/Android/Sdk" > android/local.properties


npm install

react-native link
