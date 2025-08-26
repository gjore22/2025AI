'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NetworkDevice } from '@/types/device';
import { generateDeviceDescription } from '@/lib/openai';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DeviceFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (device: Omit<NetworkDevice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  device?: NetworkDevice;
  title: string;
}

export function DeviceFormDialog({ isOpen, onClose, onSubmit, device, title }: DeviceFormDialogProps) {
  const [formData, setFormData] = useState({
    name: device?.name || '',
    ipAddress: device?.ipAddress || '',
    macAddress: device?.macAddress || '',
    deviceType: device?.deviceType || 'other' as NetworkDevice['deviceType'],
    manufacturer: device?.manufacturer || '',
    model: device?.model || '',
    location: device?.location || '',
    status: device?.status || 'unknown' as NetworkDevice['status'],
    description: device?.description || '',
    aiDescription: device?.aiDescription || '',
    ports: device?.ports || 0,
    firmware: device?.firmware || '',
    notes: device?.notes || '',
  });

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateAIDescription = async () => {
    if (!formData.name || !formData.ipAddress) {
      toast.error('Please fill in device name and IP address first');
      return;
    }

    setIsGeneratingAI(true);
    try {
      const aiDescription = await generateDeviceDescription({
        name: formData.name,
        type: formData.deviceType,
        manufacturer: formData.manufacturer,
        model: formData.model,
        ipAddress: formData.ipAddress,
        location: formData.location,
      });
      
      setFormData(prev => ({ ...prev, aiDescription }));
      toast.success('AI description generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      if (errorMessage.includes('Rate limit exceeded')) {
        toast.error('OpenAI rate limit exceeded. Please wait a moment and try again.');
      } else if (errorMessage.includes('API key')) {
        toast.error('OpenAI API key issue. Please check your configuration.');
      } else {
        toast.error(`Failed to generate AI description: ${errorMessage}`);
      }
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.ipAddress) {
      toast.error('Please fill in required fields');
      return;
    }

    onSubmit({
      ...formData,
      lastSeen: device?.lastSeen,
    });
    
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      ipAddress: '',
      macAddress: '',
      deviceType: 'other',
      manufacturer: '',
      model: '',
      location: '',
      status: 'unknown',
      description: '',
      aiDescription: '',
      ports: 0,
      firmware: '',
      notes: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Device Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Main Router"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ipAddress">IP Address *</Label>
              <Input
                id="ipAddress"
                value={formData.ipAddress}
                onChange={(e) => handleInputChange('ipAddress', e.target.value)}
                placeholder="e.g., 192.168.1.1"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="macAddress">MAC Address</Label>
              <Input
                id="macAddress"
                value={formData.macAddress}
                onChange={(e) => handleInputChange('macAddress', e.target.value)}
                placeholder="e.g., 00:11:22:33:44:55"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deviceType">Device Type</Label>
              <Select value={formData.deviceType} onValueChange={(value) => handleInputChange('deviceType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="router">Router</SelectItem>
                  <SelectItem value="switch">Switch</SelectItem>
                  <SelectItem value="firewall">Firewall</SelectItem>
                  <SelectItem value="access-point">Access Point</SelectItem>
                  <SelectItem value="server">Server</SelectItem>
                  <SelectItem value="printer">Printer</SelectItem>
                  <SelectItem value="camera">Camera</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                placeholder="e.g., Cisco, Netgear, TP-Link"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="e.g., ASA5506-X"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Server Room, Floor 2"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ports">Number of Ports</Label>
              <Input
                id="ports"
                type="number"
                value={formData.ports}
                onChange={(e) => handleInputChange('ports', parseInt(e.target.value) || 0)}
                placeholder="e.g., 24"
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="firmware">Firmware Version</Label>
              <Input
                id="firmware"
                value={formData.firmware}
                onChange={(e) => handleInputChange('firmware', e.target.value)}
                placeholder="e.g., v2.1.4"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of the device and its purpose..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="aiDescription">AI Generated Description</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateAIDescription}
                  disabled={isGeneratingAI}
                  className="text-purple-600 hover:text-purple-700"
                >
                  {isGeneratingAI ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3 mr-1" />
                  )}
                  {isGeneratingAI ? 'Generating...' : 'Generate with AI'}
                </Button>
              </div>
              <Textarea
                id="aiDescription"
                value={formData.aiDescription}
                onChange={(e) => handleInputChange('aiDescription', e.target.value)}
                placeholder="Click 'Generate with AI' to create an intelligent description..."
                rows={4}
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes, configuration details, or reminders..."
                rows={2}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isGeneratingAI}>
              {device ? 'Update Device' : 'Add Device'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}