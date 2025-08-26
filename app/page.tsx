'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { NetworkDevice } from '@/types/device';
import { DeviceStats } from '@/components/device-stats';
import { DeviceCard } from '@/components/device-card';
import { DeviceFormDialog } from '@/components/device-form-dialog';
import { DeviceDetailsDialog } from '@/components/device-details-dialog';
import { DeviceSearch } from '@/components/device-search';
import { getDevices, saveDevices, addDevice, updateDevice, deleteDevice } from '@/lib/device-storage';
import { Plus, Network, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function NetworkDeviceManager() {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<NetworkDevice | undefined>();
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  useEffect(() => {
    setDevices(getDevices());
  }, []);

  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchesSearch = searchQuery === '' || 
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.ipAddress.includes(searchQuery) ||
        device.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
      const matchesType = typeFilter === 'all' || device.deviceType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [devices, searchQuery, statusFilter, typeFilter]);

  const handleAddDevice = () => {
    setEditingDevice(undefined);
    setIsFormOpen(true);
  };

  const handleEditDevice = (device: NetworkDevice) => {
    setEditingDevice(device);
    setIsFormOpen(true);
  };

  const handleDeleteDevice = (id: string) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      if (deleteDevice(id)) {
        setDevices(getDevices());
        toast.success('Device deleted successfully');
      } else {
        toast.error('Failed to delete device');
      }
    }
  };

  const handleViewDevice = (device: NetworkDevice) => {
    setSelectedDevice(device);
    setIsDetailsOpen(true);
  };

  const handleSubmitDevice = (deviceData: Omit<NetworkDevice, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingDevice) {
        const updated = updateDevice(editingDevice.id, deviceData);
        if (updated) {
          setDevices(getDevices());
          toast.success('Device updated successfully');
        } else {
          toast.error('Failed to update device');
        }
      } else {
        addDevice(deviceData);
        setDevices(getDevices());
        toast.success('Device added successfully');
      }
    } catch (error) {
      toast.error('An error occurred while saving the device');
    }
  };

  const handleExportDevices = () => {
    const dataStr = JSON.stringify(devices, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `network-devices-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Device inventory exported successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <Network className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Network Device Manager</h1>
              <p className="text-slate-600">Manage your network infrastructure with AI-powered descriptions</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button 
              onClick={handleAddDevice}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
            
            {devices.length > 0 && (
              <Button 
                variant="outline"
                onClick={handleExportDevices}
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Inventory
              </Button>
            )}
          </div>
        </header>

        <DeviceStats devices={devices} />

        <div className="space-y-6">
          <DeviceSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            devices={devices}
            filteredCount={filteredDevices.length}
          />

          {filteredDevices.length === 0 ? (
            <div className="text-center py-16">
              {devices.length === 0 ? (
                <div className="space-y-4">
                  <Network className="h-16 w-16 text-slate-300 mx-auto" />
                  <h3 className="text-xl font-semibold text-slate-600">No devices found</h3>
                  <p className="text-slate-500">Get started by adding your first network device</p>
                  <Button onClick={handleAddDevice} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Device
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-600">No devices match your filters</h3>
                  <p className="text-slate-500">Try adjusting your search criteria or filters</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDevices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onEdit={handleEditDevice}
                  onDelete={handleDeleteDevice}
                  onView={handleViewDevice}
                />
              ))}
            </div>
          )}
        </div>

        <DeviceFormDialog
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitDevice}
          device={editingDevice}
          title={editingDevice ? 'Edit Device' : 'Add New Device'}
        />

        <DeviceDetailsDialog
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          device={selectedDevice}
        />
      </div>
    </div>
  );
}