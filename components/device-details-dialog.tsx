'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { NetworkDevice } from '@/types/device';
import { Router, Twitch as Switch, Shield, Wifi, Server, Printer, Camera, HardDrive, MapPin, Calendar, Clock, Network, Cpu, IterationCw as HardwareAcceleration } from 'lucide-react';

interface DeviceDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  device: NetworkDevice | null;
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

export function DeviceDetailsDialog({ isOpen, onClose, device }: DeviceDetailsDialogProps) {
  if (!device) return null;

  const Icon = deviceIcons[device.deviceType];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">{device.name}</DialogTitle>
              <p className="text-muted-foreground capitalize">
                {device.deviceType.replace('-', ' ')}
              </p>
            </div>
            <Badge className={statusColors[device.status]} variant="outline">
              {device.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Network className="h-4 w-4" />
              Network Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">IP Address:</span>
                <p className="font-mono font-medium">{device.ipAddress}</p>
              </div>
              {device.macAddress && (
                <div>
                  <span className="text-muted-foreground">MAC Address:</span>
                  <p className="font-mono font-medium">{device.macAddress}</p>
                </div>
              )}
              {device.ports && device.ports > 0 && (
                <div>
                  <span className="text-muted-foreground">Ports:</span>
                  <p className="font-medium">{device.ports}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <HardwareAcceleration className="h-4 w-4" />
              Hardware Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {device.manufacturer && (
                <div>
                  <span className="text-muted-foreground">Manufacturer:</span>
                  <p className="font-medium">{device.manufacturer}</p>
                </div>
              )}
              {device.model && (
                <div>
                  <span className="text-muted-foreground">Model:</span>
                  <p className="font-medium">{device.model}</p>
                </div>
              )}
              {device.firmware && (
                <div>
                  <span className="text-muted-foreground">Firmware:</span>
                  <p className="font-medium">{device.firmware}</p>
                </div>
              )}
              {device.location && (
                <div>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Location:
                  </span>
                  <p className="font-medium">{device.location}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timeline
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span>{device.createdAt.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{device.updatedAt.toLocaleString()}</span>
              </div>
              {device.lastSeen && (
                <div className="flex items-center gap-2">
                  <Wifi className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Last Seen:</span>
                  <span>{device.lastSeen.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {(device.description || device.aiDescription) && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Description</h3>
                <div className="space-y-4">
                  {device.description && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Manual Description</h4>
                      <p className="text-sm leading-relaxed">{device.description}</p>
                    </div>
                  )}
                  {device.aiDescription && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                        <Cpu className="h-3 w-3" />
                        AI Generated Description
                      </h4>
                      <p className="text-sm leading-relaxed bg-purple-50 p-3 rounded-lg border">
                        {device.aiDescription}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {device.notes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Notes</h3>
                <p className="text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                  {device.notes}
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}