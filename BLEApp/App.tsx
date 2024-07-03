import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { BleManager, Device, BleError } from "react-native-ble-plx";
import { requestMultiple, PERMISSIONS } from "react-native-permissions";
import { StatusBar } from "expo-status-bar";

const manager = new BleManager();

const requestPermissions = async (platform: "android" | "ios") => {
  const permissions = {
    android: [
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    ],
    ios: [PERMISSIONS.IOS.BLUETOOTH, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
  };
  try {
    console.log("Requesting permissions...");
    const result = await requestMultiple(permissions[platform]);
    console.log(`${platform} permissions result:`, result);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Permission request error:", err);
      throw new Error("Failed to request permissions.");
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};

const scanForDevices = async (
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>,
  setScanning: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  managerInstance: BleManager,
  isMountedRef: React.MutableRefObject<boolean>
) => {
  if (!isMountedRef.current) {
    console.log("Component is not mounted, aborting scan.");
    return;
  }

  console.log("Scanning for devices...");
  setScanning(true);
  setDevices([]);
  setError(null);

  managerInstance.startDeviceScan(null, null, (error, device) => {
    if (error) {
      console.error("Device scan error:", error);
      setError(`Device scan error: ${error.message}`);
      setScanning(false);
      return;
    }
    if (device) {
      setDevices((prevDevices) => {
        if (!prevDevices.some((d) => d.id === device.id)) {
          console.log("Discovered device:", device.id);
          return [...prevDevices, device];
        }
        return prevDevices;
      });
    }
  });

  setTimeout(() => {
    if (isMountedRef.current) {
      managerInstance.stopDeviceScan();
      setScanning(false);
      console.log("Stopped scanning.");
    }
  }, 5000);
};

const App = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  // Request permissions on component mount
  useEffect(() => {
    const initPermissions = async () => {
      try {
        await requestPermissions(Platform.OS as "android" | "ios");
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };
    // Cleanup BLE manager on component unmount
    initPermissions();

    return () => {
      isMountedRef.current = false;
      manager.destroy();
      console.log("BleManager destroyed");
    };
  }, []);

  // Set interval to scan for devices every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!scanning) {
        scanForDevices(
          setDevices,
          setScanning,
          setError,
          manager,
          isMountedRef
        ).catch((err) => {
          if (err instanceof Error) {
            console.error("Error during scanForDevices:", err);
            setError(err.message);
          } else {
            setError("An unknown error occurred.");
          }
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [scanning]);

  return (
    <View style={styles.container}>
      <Button
        title={scanning ? "Scanning..." : "Scan for Devices"}
        onPress={() =>
          scanForDevices(
            setDevices,
            setScanning,
            setError,
            manager,
            isMountedRef
          )
        }
        disabled={scanning}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.device}>
            <Text>Name: {item.name ?? "Unknown"}</Text>
            <Text>RSSI: {item.rssi}</Text>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 100,
  },
  device: {
    marginTop: 50,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default App;
