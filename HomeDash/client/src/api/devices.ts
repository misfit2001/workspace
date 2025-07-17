import api from './api';

export interface Device {
  _id: string;
  name: string;
  type: 'light' | 'thermostat' | 'lock' | 'camera' | 'speaker' | 'plug';
  room: string;
  status: 'online' | 'offline' | 'connecting';
  isOn: boolean;
  properties: {
    brightness?: number;
    color?: string;
    temperature?: number;
    volume?: number;
    powerUsage?: number;
  };
  lastActivity: string;
}

// Description: Get all smart devices
// Endpoint: GET /api/devices
// Request: {}
// Response: { success: boolean, devices: Device[] }
export const getDevices = async () => {
  console.log('API: Fetching devices')
  try {
    const response = await api.get('/api/devices');
    return response.data;
  } catch (error) {
    console.error('API: Error fetching devices:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Toggle device on/off
// Endpoint: POST /api/devices/:id/toggle
// Request: { deviceId: string }
// Response: { success: boolean, device: Device }
export const toggleDevice = async (deviceId: string) => {
  console.log('API: Toggling device', deviceId)
  try {
    const response = await api.post(`/api/devices/${deviceId}/toggle`);
    return response.data;
  } catch (error) {
    console.error('API: Error toggling device:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Update device properties
// Endpoint: PUT /api/devices/:id
// Request: { deviceId: string, properties: object }
// Response: { success: boolean, device: Device }
export const updateDevice = async (deviceId: string, properties: any) => {
  console.log('API: Updating device', deviceId, properties)
  try {
    const response = await api.put(`/api/devices/${deviceId}`, { properties });
    return response.data;
  } catch (error) {
    console.error('API: Error updating device:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Add new device
// Endpoint: POST /api/devices
// Request: { name: string, type: string, room: string }
// Response: { success: boolean, device: Device }
export const addDevice = async (data: { name: string; type: string; room: string }) => {
  console.log('API: Adding new device', data)
  try {
    const response = await api.post('/api/devices', data);
    return response.data;
  } catch (error) {
    console.error('API: Error adding device:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
}