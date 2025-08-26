import { NetworkDevice } from '@/types/device';

const STORAGE_KEY = 'network-devices';

export function getDevices(): NetworkDevice[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const devices = JSON.parse(stored);
    return devices.map((device: any) => ({
      ...device,
      createdAt: new Date(device.createdAt),
      updatedAt: new Date(device.updatedAt),
      lastSeen: device.lastSeen ? new Date(device.lastSeen) : undefined,
    }));
  } catch (error) {
    console.error('Error loading devices:', error);
    return [];
  }
}

export function saveDevices(devices: NetworkDevice[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
  } catch (error) {
    console.error('Error saving devices:', error);
  }
}

export function addDevice(device: Omit<NetworkDevice, 'id' | 'createdAt' | 'updatedAt'>): NetworkDevice {
  const devices = getDevices();
  const newDevice: NetworkDevice = {
    ...device,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  devices.push(newDevice);
  saveDevices(devices);
  return newDevice;
}

export function updateDevice(id: string, updates: Partial<NetworkDevice>): NetworkDevice | null {
  const devices = getDevices();
  const index = devices.findIndex(device => device.id === id);
  
  if (index === -1) return null;
  
  devices[index] = {
    ...devices[index],
    ...updates,
    updatedAt: new Date(),
  };
  
  saveDevices(devices);
  return devices[index];
}

export function deleteDevice(id: string): boolean {
  const devices = getDevices();
  const filteredDevices = devices.filter(device => device.id !== id);
  
  if (filteredDevices.length === devices.length) return false;
  
  saveDevices(filteredDevices);
  return true;
}