export interface NetworkDevice {
  id: string;
  name: string;
  ipAddress: string;
  macAddress?: string;
  deviceType: 'router' | 'switch' | 'firewall' | 'access-point' | 'server' | 'printer' | 'camera' | 'other';
  manufacturer?: string;
  model?: string;
  location?: string;
  status: 'online' | 'offline' | 'maintenance' | 'unknown';
  description?: string;
  aiDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  lastSeen?: Date;
  ports?: number;
  firmware?: string;
  notes?: string;
}

export interface DeviceStats {
  total: number;
  online: number;
  offline: number;
  maintenance: number;
  unknown: number;
}

export interface AIDescriptionRequest {
  deviceName: string;
  deviceType: string;
  manufacturer?: string;
  model?: string;
  ipAddress: string;
  location?: string;
}