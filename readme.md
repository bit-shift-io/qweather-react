 
# tools
yay -S visual-studio-code-bin

yay -S npm4
sudo npm install -g react-native-cli

# Create new project
# https://facebook.github.io/react-native/docs/getting-started.html

react-native init HelloWorld
cd HelloWorld
npm start

# configure android sdk
https://www.decoide.org/react-native/docs/android-setup.html

add to ~/.bashrc
export ANDROID_HOME=$HOME/Android/Sdk/
sh $ANDROID_HOME/tools/bin/sdkmanager --list
sh $ANDROID_HOME/tools/bin/sdkmanager [package_name]
sh $ANDROID_HOME/tools/bin/sdkmanager "platform-tools" "tools" "system-images;android-28;default;x86" "system-images;android-28;default;x86_64"

# configure linux 
sudo adduser your_linux_user kvm
gpasswd -a your_linux_user kvm


# dev tools / debugging
https://facebook.github.io/react-native/docs/debugging.html
npm install -g react-devtools
react-devtools

# tutorial
https://developerlife.com/2017/04/26/flexbox-layouts-and-lists-with-react-native/

# libs
// https://github.com/connected-io/react-native-xml2js
sudo npm install react-native-xml2js

// react-native-event-listeners
sudo npm install react-native-event-listeners

// svg lib
sudo npm install react-native-remote-svg

// may want this one in the future?
https://github.com/react-native-community/react-native-svg

// navigation
sudo npm install react-navigation
sudo npm install react-native-gesture-handler
react-native link react-native-gesture-handler

# linux troubleshooting
ENOSPC: no space left on device when running ...

For Arch/Manajaro look here: https://confluence.jaytaala.com/pages/viewpage.action?pageId=18579505

Run the command:
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p