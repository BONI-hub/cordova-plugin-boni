cd ..
cd sample-project-hello-boni
cordova plugin remove cordova.plugin.boni
cordova plugin add ../cordova-plugin-boni
cordova run --device
adb logcat -c
adb logcat chromium *:S
