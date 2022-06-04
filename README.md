# build
cd android
<!-- ./gradlew bundleRelease -->
./gradlew assembleRelease
./gradlew bundleRelease

npx react-native run-android --variant=release

https://reactnative.dev/docs/signed-apk-android

where you apply version
android/app/build.gradle
app.json
ios/iotapp/Info.plist
package.json