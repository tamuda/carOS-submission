import BluetoothSerial from 'react-native-bluetooth-serial';

export interface OBDDevice {
  id: string;
  name: string;
  address: string;
  connected: boolean;
}

export interface OBDResponse {
  command: string;
  response: string;
  timestamp: number;
}

class BluetoothService {
  private connectedDevice: OBDDevice | null = null;
  private listeners: Array<(device: OBDDevice | null) => void> = [];

  async isBluetoothEnabled(): Promise<boolean> {
    try {
      return await BluetoothSerial.isEnabled();
    } catch (error) {
      console.error('Bluetooth check error:', error);
      return false;
    }
  }

  async enableBluetooth(): Promise<boolean> {
    try {
      return await BluetoothSerial.enable();
    } catch (error) {
      console.error('Bluetooth enable error:', error);
      return false;
    }
  }

  async scanForDevices(): Promise<OBDDevice[]> {
    try {
      const devices = await BluetoothSerial.list();
      return devices.map(device => ({
        id: device.id,
        name: device.name || 'Unknown Device',
        address: device.address || '',
        connected: false,
      }));
    } catch (error) {
      console.error('Device scan error:', error);
      return [];
    }
  }

  async connectToDevice(device: OBDDevice): Promise<boolean> {
    try {
      await BluetoothSerial.connect(device.id);
      this.connectedDevice = { ...device, connected: true };
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Device connection error:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.connectedDevice) {
        await BluetoothSerial.disconnect();
        this.connectedDevice = null;
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Device disconnect error:', error);
    }
  }

  async sendOBDCommand(command: string): Promise<OBDResponse> {
    if (!this.connectedDevice) {
      throw new Error('No device connected');
    }

    try {
      const cleanCommand = command.trim().toUpperCase();
      const formattedCommand = cleanCommand.endsWith('\r') 
        ? cleanCommand 
        : cleanCommand + '\r';

      const response = await BluetoothSerial.write(formattedCommand);
      
      return {
        command: cleanCommand,
        response: response.trim(),
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('OBD command error:', error);
      throw error;
    }
  }

  async readDiagnosticTroubleCodes(): Promise<string[]> {
    const commands = ['03', '07', '0A'];
    const results: string[] = [];
    
    for (const command of commands) {
      try {
        const response = await this.sendOBDCommand(command);
        if (response.response && response.response !== 'NO DATA') {
          results.push(response.response);
        }
      } catch (error) {
        console.error(`DTC command ${command} failed:`, error);
      }
    }

    return results;
  }

  async readLiveData(): Promise<Record<string, any>> {
    const pidCommands = {
      engineRPM: '010C',
      vehicleSpeed: '010D',
      engineLoad: '0104',
      coolantTemp: '0105',
      fuelLevel: '012F',
      throttlePosition: '0111',
    };

    const liveData: Record<string, any> = {};

    for (const [key, command] of Object.entries(pidCommands)) {
      try {
        const response = await this.sendOBDCommand(command);
        if (response.response && response.response !== 'NO DATA') {
          liveData[key] = this.parseOBDResponse(response.response, key);
        }
      } catch (error) {
        console.error(`Live data command ${command} failed:`, error);
      }
    }

    return liveData;
  }

  private parseOBDResponse(response: string, dataType: string): any {
    const cleanResponse = response.replace(/\s/g, '');
    
    switch (dataType) {
      case 'engineRPM':
        const rpmA = parseInt(cleanResponse.substring(4, 6), 16);
        const rpmB = parseInt(cleanResponse.substring(6, 8), 16);
        return Math.round((rpmA * 256 + rpmB) / 4);
      
      case 'vehicleSpeed':
        return parseInt(cleanResponse.substring(6, 8), 16);
      
      case 'engineLoad':
        const loadA = parseInt(cleanResponse.substring(6, 8), 16);
        return Math.round((loadA / 2.55) * 100) / 100;
      
      case 'coolantTemp':
        const tempA = parseInt(cleanResponse.substring(6, 8), 16);
        return tempA - 40;
      
      case 'fuelLevel':
        const fuelA = parseInt(cleanResponse.substring(6, 8), 16);
        return Math.round((fuelA / 2.55) * 100) / 100;
      
      case 'throttlePosition':
        const throttleA = parseInt(cleanResponse.substring(6, 8), 16);
        return Math.round((throttleA / 2.55) * 100) / 100;
      
      default:
        return response;
    }
  }

  getConnectedDevice(): OBDDevice | null {
    return this.connectedDevice;
  }

  isConnected(): boolean {
    return this.connectedDevice?.connected || false;
  }

  addConnectionListener(listener: (device: OBDDevice | null) => void): void {
    this.listeners.push(listener);
  }

  removeConnectionListener(listener: (device: OBDDevice | null) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.connectedDevice));
  }
}

export default new BluetoothService();
