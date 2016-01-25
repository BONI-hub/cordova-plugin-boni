cd ..
cd sample-project-retrieve-data
cordova plugin remove cordova.plugin.boni
cordova plugin add ../cordova-plugin-boni
cordova run --device
adb logcat -c
adb logcat chromium *:S
