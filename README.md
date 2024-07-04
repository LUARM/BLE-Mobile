# BLE Device Scanner App

This application scans for Bluetooth Low Energy (BLE) devices using the `react-native-ble-plx` library. The app requests necessary permissions, scans for nearby BLE devices, and displays them in a list.

## Prerequisites

- Node.js
- npm
- Xcode (for iOS)
- Android Studio (for Android)

## Dependencies

- react-native: `0.74.2` (or compatible version)
- react-native-ble-plx: `3.2.0` (or compatible version)
- react-native-permissions: `4.1.5` (or compatible version)
- expo-status-bar: `1.12.1` (or compatible version)

## Dot Files
- .gitignore: Specifies files and directories that should be ignored by Git.
- babel.config.js: Babel configuration file.
- tsconfig.json: TypeScript configuration file.
- app.json: Expo configuration file.
- metro.config.js: Metro bundler configuration file.


## Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/LUARM/BLE-Mobile.git
    cd BLE-Mobile
    ```

2. **Install dependencies:**
    ```sh
    cd BLEApp
    
    npm install --legacy-peer-deps
    ```
    ## Note: 
    --legacy-peer-deps used to handle issues between Expo version and react-native-ble-plx library, should be dealt with

3. **iOS specific setup:**
    - Open the `ios` folder in Xcode.
    - Add the required permissions in your `Info.plist`:
      ```xml
      <key>NSBluetoothPeripheralUsageDescription</key>
      <string>We use Bluetooth to connect to BLE devices</string>
      <key>NSLocationWhenInUseUsageDescription</key>
      <string>We use your location to scan for BLE devices</string>
      ```
    - Ensure you have permissions added to `Podfile`:
    ```ruby
        permissions_path = '../node_modules/react-native-permissions/ios'
        pod 'Permission-Bluetooth', :path => "#{permissions_path}/Bluetooth/Permission-Bluetooth.podspec"
        pod 'Permission-LocationWhenInUse', :path => "#{permissions_path}/LocationWhenInUse/Permission-LocationWhenInUse.podspec"
      ```

4. **Android specific setup:**
    - Add the required permissions in your `AndroidManifest.xml`:
      ```xml
      <uses-permission android:name="android.permission.BLUETOOTH"/>
      <uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>
      <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
      <uses-permission android:name="android.permission.BLUETOOTH_SCAN"/>
      <uses-permission android:name="android.permission.BLUETOOTH_CONNECT"/>
      ```

## Running the App

### On iOS

1. **Start the Metro bundler:**
    ```sh
    npx expo start
    ```

2. **Run the App Natively:**
    Ensure you have CocoaPods installed:
    ```sh
    sudo gem install cocoapods
    cd ios
    pod install
    cd ..
    ```

    Connect your iOS device and make sure it is recognized by your system:
    ```sh
    xcrun xctrace list devices
    ```

    Then, run the app on your iOS device (replace `<device_id>` with your actual device ID from the previous command):
    ```sh
    npx expo run:ios --device <device_id>
    ```

3. **Trust the Developer Certificate on your Device:**
    - On your iOS device, go to `Settings > General > Device Management` or `Profiles & Device Management`.
    - Find your Apple ID under the `DEVELOPER APP` section.
    - Trust your Apple ID to allow running the app.

### On Android

1. **Start the Metro bundler:**
    ```sh
    npx expo start
    ```

2. **Run the App Natively:**
    Ensure your Android device is connected and recognized by your system:
    ```sh
    adb devices
    ```

    Then, run the app on your Android device:
    ```sh
    npx expo run:android
    ```

## Notes and Caveats

- Ensure that Bluetooth is enabled on your device.
- Location services must be enabled for BLE scanning on Android devices.
- The app requests necessary permissions on startup; if permissions are denied, the app will not function correctly.
- Testing on a real device is recommended as BLE functionality may not work on simulators/emulators.
- Ensure you have the correct permissions declared in your `Info.plist` (iOS) and `AndroidManifest.xml` (Android).
- In Xcode make sure that you have a Team or User signed in `signing & Capabilities` Section 


## Additional Features and Problems Encountered

### Additional Feature Ideas

- Allow users to filter the scanned devices based on RSSI, name, or services.
- Automatically recognize and highlight previously connected devices.
- Pull-to-Refresh: Implement a pull-to-refresh feature for the device list.
- Notify users when a device connects or disconnects.
- Implement authentication features for secure communication with BLE devices.
- Integrate with IoT platforms like AWS to manage BLE devices remotely.

### Interesting Problems

- Permission Management: Dynamically requesting and handling permissions on both Android and iOS can be challenging due to differences in how each platform manages permissions.
- Device Lifecycle Management: Ensuring that BLE operations do not continue after the component unmounts or the BLE manager is destroyed to prevent crashes.


## Native Bridge Code

To work with BLE or device-specific code using Java/Kotlin (Android) and Obj-C/Swift (iOS):

- Native bridge code could help with some of the permission handling and behavior handling issues I have been dealing with.

### Android (Java/Kotlin)
- Ensure Android project is properly configured with the necessary dependencies in build.gradle files.

- Add Bluetooth permissions in AndroidManifest.xml.

### iOS (Obj-C/Swift)
- Ensure iOS project is properly configured with the necessary dependencies in Podfile.

- Add Bluetooth permissions in Info.plist.


### Example: Custom Native Module

1. **Create a native module:**
    - For Android: Create a new Java/Kotlin class `BLEModule` extending `ReactContextBaseJavaModule`.
    - For iOS: Create a new Objective-C/Swift class implementing `RCTBridgeModule`.

2. **Register the module:**
    - For Android: Register the module in the Package class by creating a new file that extends ReactPackage.
    - For iOS: Register the module in the `RCTBridge`.

3. **Invoke from JavaScript:**
    - Import and Uue `NativeModules` to access the custom module and its methods.


