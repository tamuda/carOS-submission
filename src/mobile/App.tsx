import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import BluetoothSerial from 'react-native-bluetooth-serial';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';

interface CarOSAppProps {
  onBluetoothConnected: (device: any) => void;
  onBluetoothDisconnected: () => void;
}

const CarOSApp: React.FC<CarOSAppProps> = ({
  onBluetoothConnected,
  onBluetoothDisconnected,
}) => {
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  useEffect(() => {
    initializeApp();
    return () => {
      if (connectedDevice) {
        BluetoothSerial.disconnect();
      }
    };
  }, []);

  const initializeApp = async () => {
    try {
      const info = {
        deviceId: await DeviceInfo.getUniqueId(),
        systemName: await DeviceInfo.getSystemName(),
        systemVersion: await DeviceInfo.getSystemVersion(),
        model: await DeviceInfo.getModel(),
        brand: await DeviceInfo.getBrand(),
      };
      setDeviceInfo(info);

      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        Alert.alert('No Internet', 'Please check your internet connection');
        return;
      }

      await requestBluetoothPermissions();
      
      const enabled = await BluetoothSerial.isEnabled();
      setIsBluetoothEnabled(enabled);
      
      if (!enabled) {
        Alert.alert(
          'Bluetooth Required',
          'CarOS needs Bluetooth to connect to your OBD-II device. Please enable Bluetooth in settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('App initialization error:', error);
      Alert.alert('Error', 'Failed to initialize CarOS app');
    }
  };

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        
        const allGranted = Object.values(granted).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED
        );
        
        if (!allGranted) {
          Alert.alert(
            'Permissions Required',
            'CarOS needs Bluetooth and location permissions to connect to your OBD-II device.'
          );
        }
      } catch (error) {
        console.error('Permission request error:', error);
      }
    }
  };

  const scanForDevices = async () => {
    if (!isBluetoothEnabled) {
      Alert.alert('Bluetooth Disabled', 'Please enable Bluetooth first');
      return;
    }

    setIsScanning(true);
    try {
      const devices = await BluetoothSerial.list();
      console.log('Available devices:', devices);
      
      const carOSDevice = devices.find(device => 
        device.name?.includes('CarOS') || 
        device.name?.includes('OBD') ||
        device.name?.includes('ELM327')
      );
      
      if (carOSDevice) {
        await connectToDevice(carOSDevice);
      } else {
        Alert.alert(
          'No CarOS Device Found',
          'Please make sure your CarOS device is powered on and in pairing mode.'
        );
      }
    } catch (error) {
      console.error('Scan error:', error);
      Alert.alert('Scan Failed', 'Could not scan for devices');
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (device: any) => {
    try {
      await BluetoothSerial.connect(device.id);
      setConnectedDevice(device);
      onBluetoothConnected(device);
      
      Alert.alert(
        'Connected!',
        `Successfully connected to ${device.name}`
      );
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Connection Failed', 'Could not connect to device');
    }
  };

  const disconnectDevice = async () => {
    try {
      await BluetoothSerial.disconnect();
      setConnectedDevice(null);
      onBluetoothDisconnected();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const sendOBDCommand = async (command: string) => {
    if (!connectedDevice) {
      Alert.alert('Not Connected', 'Please connect to a CarOS device first');
      return;
    }

    try {
      const response = await BluetoothSerial.write(command);
      return response;
    } catch (error) {
      console.error('OBD command error:', error);
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <View style={styles.header}>
        <Text style={styles.title}>CarOS Mobile</Text>
        <Text style={styles.subtitle}>Your car's brain in your pocket</Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Bluetooth: {isBluetoothEnabled ? '✅ Enabled' : '❌ Disabled'}
        </Text>
        <Text style={styles.statusText}>
          Device: {connectedDevice ? `✅ ${connectedDevice.name}` : '❌ Not Connected'}
        </Text>
        <Text style={styles.statusText}>
          Scanning: {isScanning ? '🔄 Scanning...' : '⏹️ Idle'}
        </Text>
      </View>

      <View style={styles.webViewContainer}>
        <WebView
          source={{ uri: 'http://localhost:3000' }}
          style={styles.webView}
          onMessage={(event) => {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'OBD_COMMAND') {
              sendOBDCommand(data.command);
            }
          }}
          injectedJavaScript={`
            window.CarOSMobile = {
              isConnected: ${connectedDevice ? 'true' : 'false'},
              deviceName: '${connectedDevice?.name || 'None'}',
              sendOBDCommand: function(command) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'OBD_COMMAND',
                  command: command
                }));
              }
            };
            true;
          `}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  statusContainer: {
    padding: 16,
    backgroundColor: '#111',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});

export default CarOSApp;
