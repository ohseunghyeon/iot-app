# build
cd android
<!-- ./gradlew bundleRelease -->
./gradlew assembleRelease

npx react-native run-android --variant=release

https://reactnative.dev/docs/signed-apk-android