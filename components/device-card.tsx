'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NetworkDevice } from '@/types/device';
import { Router, Twitch as Switch, Shield, Wifi, Server, Printer, Camera, HardDrive, Edit, Trash2, Eye, MapPin, Calendar } from 'lucide-react';

interface DeviceCardProps {
  device: NetworkDevice;
  onEdit: (device: NetworkDevice) => void;
  onDelete: (id: string) => void;
  onView: (device: NetworkDevice) => void;
}

const deviceIcons = {
  router: Router,
  switch: Switch,
  firewall: Shield,
  'access-point': Wifi,
  server: Server,
  printer: Printer,
  camera: Camera,
  other: HardDrive,
};

const statusColors = {
  online: 'bg-green-100 text-green-800 border-green-200',
  offline: 'bg-red-100 text-red-800 border-red-200',
  maintenance: 'bg-amber-100 text-amber-800 border-amber-200',
  unknown: 'bg-gray-100 text-gray-800 border-gray-200',
};

export function DeviceCard({ device, onEdit, onDelete, onView }: DeviceCardProps) {
  const Icon = deviceIcons[device.deviceType];

  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold">{device.name}</CardTitle>
              <p className="text-sm text-muted-foreground capitalize">
                {device.deviceType.replace('-', ' ')}
              </p>
            </div>
          </div>
          <Badge className={statusColors[device.status]} variant="outline">
            {device.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">IP:</span>
            <span className="font-mono">{device.ipAddress}</span>
          </div>
          
          {device.manufacturer && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Manufacturer:</span>
              <span>{device.manufacturer}</span>
            </div>
          )}
          
          {device.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span>{device.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>Added {device.createdAt.toLocaleDateString()}</span>
          </div>
        </div>

        {device.description && (
          <div className="text-sm text-muted-foreground line-clamp-2">
            {device.description}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView(device)}
            className="flex-1"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(device)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(device.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}