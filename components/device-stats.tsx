'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NetworkDevice } from '@/types/device';
import { Activity, Wifi, AlertTriangle, Wrench } from 'lucide-react';

interface DeviceStatsProps {
  devices: NetworkDevice[];
}

export function DeviceStats({ devices }: DeviceStatsProps) {
  const stats = {
    total: devices.length,
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length,
    maintenance: devices.filter(d => d.status === 'maintenance').length,
    unknown: devices.filter(d => d.status === 'unknown').length,
  };

  const statCards = [
    {
      title: 'Total Devices',
      value: stats.total,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Online',
      value: stats.online,
      icon: Wifi,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Offline',
      value: stats.offline,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Maintenance',
      value: stats.maintenance,
      icon: Wrench,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-full`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stats.total > 0 && (
                <p className="text-xs text-muted-foreground">
                  {((stat.value / stats.total) * 100).toFixed(1)}% of total
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}