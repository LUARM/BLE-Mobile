import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Platform } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';
import { StatusBar } from 'expo-status-bar';

const manager = new BleManager();

const App = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);

  const requestPermissions = async () => {
    console.log('Requesting permissions...');
    if (Platform.OS === 'android') {
      const result = await requestMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT
      ]);
      console.log('Android permissions result:', result);
    }
    if (Platform.OS === 'ios') {
      const result = await requestMultiple([
        PERMISSIONS.IOS.BLUETOOTH,
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      ]);
      console.log('iOS permissions result:', result);
    }
  };

  useEffect(() => {
    requestPermissions();

    return () => {
      manager.destroy();
    };
  }, []);

  const scanForDevices = () => {
    console.log('Scanning for devices...');
    setScanning(true);
    setDevices([]);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Device scan error:', error);
        setScanning(false);
        return;
      }

      console.log('Discovered device:', device);
      if (device) {
        setDevices((prevDevices) => {
          if (!prevDevices.some((d) => d.id === device.id)) {
            console.log('Adding device to list:', device.id);
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
      console.log('Stopped scanning.');
    }, 5000);
  };

  return (
    <View style={styles.container}>
      <Button title={scanning ? 'Scanning...' : 'Scan for Devices'} onPress={scanForDevices} disabled={scanning} />
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.device}>
            <Text>Name: {item.name ? item.name : 'Unknown'}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  device: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default App;
