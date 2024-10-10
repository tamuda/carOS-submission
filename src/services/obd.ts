import BluetoothService from './bluetooth';

export interface DiagnosticTroubleCode {
  code: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
}

export interface LiveDataPoint {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

export interface VehicleDiagnostics {
  dtcs: DiagnosticTroubleCode[];
  liveData: LiveDataPoint[];
  vehicleInfo: {
    vin: string;
    make: string;
    model: string;
    year: number;
  };
  lastScan: number;
}

class OBDService {
  private bluetoothService: BluetoothService;

  constructor() {
    this.bluetoothService = BluetoothService;
  }

  async initialize(): Promise<boolean> {
    try {
      const isEnabled = await this.bluetoothService.isBluetoothEnabled();
      if (!isEnabled) {
        await this.bluetoothService.enableBluetooth();
      }
      return true;
    } catch (error) {
      console.error('OBD initialization error:', error);
      return false;
    }
  }

  async scanForDevices(): Promise<any[]> {
    return await this.bluetoothService.scanForDevices();
  }

  async connectToDevice(device: any): Promise<boolean> {
    return await this.bluetoothService.connectToDevice(device);
  }

  async disconnect(): Promise<void> {
    await this.bluetoothService.disconnect();
  }

  async runFullDiagnostics(): Promise<VehicleDiagnostics> {
    if (!this.bluetoothService.isConnected()) {
      throw new Error('No device connected');
    }

    const dtcs = await this.readDiagnosticTroubleCodes();
    const liveData = await this.readLiveData();
    const vehicleInfo = await this.readVehicleInfo();

    return {
      dtcs,
      liveData,
      vehicleInfo,
      lastScan: Date.now(),
    };
  }

  async readDiagnosticTroubleCodes(): Promise<DiagnosticTroubleCode[]> {
    const commands = ['03', '07', '0A'];
    const allDTCs: DiagnosticTroubleCode[] = [];

    for (const command of commands) {
      try {
        const response = await this.bluetoothService.sendOBDCommand(command);
        const dtcs = this.parseDTCResponse(response.response);
        allDTCs.push(...dtcs);
      } catch (error) {
        console.error(`DTC command ${command} failed:`, error);
      }
    }

    return this.deduplicateDTCs(allDTCs);
  }

  async readLiveData(): Promise<LiveDataPoint[]> {
    const pidCommands = {
      'Engine RPM': '010C',
      'Vehicle Speed': '010D',
      'Engine Load': '0104',
      'Coolant Temperature': '0105',
      'Fuel Level': '012F',
      'Throttle Position': '0111',
      'Intake Air Temperature': '010F',
      'Mass Air Flow': '0110',
    };

    const liveData: LiveDataPoint[] = [];

    for (const [name, command] of Object.entries(pidCommands)) {
      try {
        const response = await this.bluetoothService.sendOBDCommand(command);
        if (response.response && response.response !== 'NO DATA') {
          const value = this.parseLiveDataValue(response.response, name);
          liveData.push({
            name,
            value,
            unit: this.getUnitForParameter(name),
            timestamp: Date.now(),
          });
        }
      } catch (error) {
        console.error(`Live data command ${command} failed:`, error);
      }
    }

    return liveData;
  }

  async readVehicleInfo(): Promise<{ vin: string; make: string; model: string; year: number }> {
    try {
      const vinResponse = await this.bluetoothService.sendOBDCommand('0902');
      const vin = this.parseVIN(vinResponse.response);

      return {
        vin: vin || 'DEMO123456789',
        make: 'Mazda',
        model: 'CX-30',
        year: 2024,
      };
    } catch (error) {
      console.error('Vehicle info read error:', error);
      return {
        vin: 'DEMO123456789',
        make: 'Mazda',
        model: 'CX-30',
        year: 2024,
      };
    }
  }

  private parseDTCResponse(response: string): DiagnosticTroubleCode[] {
    const dtcs: DiagnosticTroubleCode[] = [];
    const cleanResponse = response.replace(/\s/g, '');

    for (let i = 0; i < cleanResponse.length; i += 4) {
      const dtcCode = cleanResponse.substring(i, i + 4);
      if (dtcCode && dtcCode !== '0000') {
        const fullCode = this.formatDTCCode(dtcCode);
        dtcs.push({
          code: fullCode,
          description: this.getDTCDescription(fullCode),
          severity: this.getDTCSeverity(fullCode),
          category: this.getDTCCategory(fullCode),
        });
      }
    }

    return dtcs;
  }

  private formatDTCCode(code: string): string {
    const firstChar = code.charAt(0);
    const categoryMap: { [key: string]: string } = {
      '0': 'P0',
      '1': 'P1',
      '2': 'P2',
      '3': 'P3',
      '4': 'C0',
      '5': 'B0',
      '6': 'U0',
    };

    return categoryMap[firstChar] + code.substring(1);
  }

  private getDTCDescription(code: string): string {
    const descriptions: { [key: string]: string } = {
      'P0300': 'Random/Multiple Cylinder Misfire Detected',
      'P0301': 'Cylinder 1 Misfire Detected',
      'P0302': 'Cylinder 2 Misfire Detected',
      'P0303': 'Cylinder 3 Misfire Detected',
      'P0304': 'Cylinder 4 Misfire Detected',
      'P0171': 'System Too Lean (Bank 1)',
      'P0172': 'System Too Rich (Bank 1)',
      'P0420': 'Catalyst System Efficiency Below Threshold',
      'P0430': 'Catalyst System Efficiency Below Threshold (Bank 2)',
      'P0440': 'Evaporative Emission Control System Malfunction',
      'P0455': 'Evaporative Emission Control System Leak Detected (Large Leak)',
    };

    return descriptions[code] || 'Unknown Diagnostic Trouble Code';
  }

  private getDTCSeverity(code: string): 'low' | 'medium' | 'high' | 'critical' {
    const criticalCodes = ['P0300', 'P0301', 'P0302', 'P0303', 'P0304'];
    const highCodes = ['P0171', 'P0172', 'P0420', 'P0430'];
    const mediumCodes = ['P0440', 'P0455'];

    if (criticalCodes.includes(code)) return 'critical';
    if (highCodes.includes(code)) return 'high';
    if (mediumCodes.includes(code)) return 'medium';
    return 'low';
  }

  private getDTCCategory(code: string): string {
    if (code.startsWith('P0') || code.startsWith('P1')) return 'Powertrain';
    if (code.startsWith('P2')) return 'Powertrain (Manufacturer Specific)';
    if (code.startsWith('P3')) return 'Powertrain (Reserved)';
    if (code.startsWith('C0') || code.startsWith('C1')) return 'Chassis';
    if (code.startsWith('B0') || code.startsWith('B1')) return 'Body';
    if (code.startsWith('U0') || code.startsWith('U1')) return 'Network';
    return 'Unknown';
  }

  private parseLiveDataValue(response: string, parameter: string): number {
    const cleanResponse = response.replace(/\s/g, '');
    
    switch (parameter) {
      case 'Engine RPM':
        const rpmA = parseInt(cleanResponse.substring(4, 6), 16);
        const rpmB = parseInt(cleanResponse.substring(6, 8), 16);
        return Math.round((rpmA * 256 + rpmB) / 4);
      
      case 'Vehicle Speed':
        return parseInt(cleanResponse.substring(6, 8), 16);
      
      case 'Engine Load':
        const loadA = parseInt(cleanResponse.substring(6, 8), 16);
        return Math.round((loadA / 2.55) * 100) / 100;
      
      case 'Coolant Temperature':
        const tempA = parseInt(cleanResponse.substring(6, 8), 16);
        return tempA - 40;
      
      case 'Fuel Level':
        const fuelA = parseInt(cleanResponse.substring(6, 8), 16);
        return Math.round((fuelA / 2.55) * 100) / 100;
      
      case 'Throttle Position':
        const throttleA = parseInt(cleanResponse.substring(6, 8), 16);
        return Math.round((throttleA / 2.55) * 100) / 100;
      
      default:
        return 0;
    }
  }

  private getUnitForParameter(parameter: string): string {
    const units: { [key: string]: string } = {
      'Engine RPM': 'RPM',
      'Vehicle Speed': 'km/h',
      'Engine Load': '%',
      'Coolant Temperature': '°C',
      'Fuel Level': '%',
      'Throttle Position': '%',
      'Intake Air Temperature': '°C',
      'Mass Air Flow': 'g/s',
    };

    return units[parameter] || '';
  }

  private parseVIN(response: string): string {
    const cleanResponse = response.replace(/\s/g, '');
    return cleanResponse.substring(2);
  }

  private deduplicateDTCs(dtcs: DiagnosticTroubleCode[]): DiagnosticTroubleCode[] {
    const seen = new Set<string>();
    return dtcs.filter(dtc => {
      if (seen.has(dtc.code)) {
        return false;
      }
      seen.add(dtc.code);
      return true;
    });
  }

  isConnected(): boolean {
    return this.bluetoothService.isConnected();
  }

  getConnectedDevice(): any {
    return this.bluetoothService.getConnectedDevice();
  }
}

export default new OBDService();
