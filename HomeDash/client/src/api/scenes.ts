import api from './api';

export interface Scene {
  _id: string;
  name: string;
  description: string;
  icon: string;
  devices: Array<{
    deviceId: string;
    deviceName: string;
    action: string;
    properties?: any;
  }>;
  isActive: boolean;
  lastUsed?: string;
}

// Description: Get all automation scenes
// Endpoint: GET /api/scenes
// Request: {}
// Response: { scenes: Scene[] }
export const getScenes = () => {
  console.log('API: Fetching scenes')
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        scenes: [
          {
            _id: '1',
            name: 'Good Morning',
            description: 'Turn on lights, adjust thermostat, unlock door',
            icon: 'sunrise',
            devices: [
              { deviceId: '1', deviceName: 'Living Room Light', action: 'turn_on', properties: { brightness: 80 } },
              { deviceId: '2', deviceName: 'Main Thermostat', action: 'set_temperature', properties: { temperature: 72 } },
              { deviceId: '3', deviceName: 'Front Door Lock', action: 'unlock' }
            ],
            isActive: false,
            lastUsed: '2024-01-15T07:30:00Z'
          },
          {
            _id: '2',
            name: 'Movie Time',
            description: 'Dim lights, turn on TV and sound system',
            icon: 'film',
            devices: [
              { deviceId: '1', deviceName: 'Living Room Light', action: 'dim', properties: { brightness: 20 } },
              { deviceId: '5', deviceName: 'Bedroom Speaker', action: 'turn_on', properties: { volume: 60 } }
            ],
            isActive: false,
            lastUsed: '2024-01-14T20:15:00Z'
          },
          {
            _id: '3',
            name: 'Bedtime',
            description: 'Turn off all lights, lock doors, arm security',
            icon: 'moon',
            devices: [
              { deviceId: '1', deviceName: 'Living Room Light', action: 'turn_off' },
              { deviceId: '4', deviceName: 'Kitchen Light', action: 'turn_off' },
              { deviceId: '3', deviceName: 'Front Door Lock', action: 'lock' }
            ],
            isActive: false,
            lastUsed: '2024-01-14T23:00:00Z'
          },
          {
            _id: '4',
            name: 'Away Mode',
            description: 'Turn off non-essential devices, arm security',
            icon: 'shield',
            devices: [
              { deviceId: '1', deviceName: 'Living Room Light', action: 'turn_off' },
              { deviceId: '5', deviceName: 'Bedroom Speaker', action: 'turn_off' },
              { deviceId: '6', deviceName: 'Security Camera', action: 'arm' }
            ],
            isActive: true,
            lastUsed: '2024-01-15T09:00:00Z'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/scenes');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Activate a scene
// Endpoint: POST /api/scenes/:id/activate
// Request: { sceneId: string }
// Response: { success: boolean, affectedDevices: number }
export const activateScene = (sceneId: string) => {
  console.log('API: Activating scene', sceneId)
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        affectedDevices: Math.floor(Math.random() * 4) + 2
      });
    }, 1200);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post(`/api/scenes/${sceneId}/activate`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Create new scene
// Endpoint: POST /api/scenes
// Request: { name: string, description: string, devices: Array }
// Response: { success: boolean, scene: Scene }
export const createScene = (data: { name: string; description: string; devices: any[] }) => {
  console.log('API: Creating new scene', data)
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        scene: {
          _id: Date.now().toString(),
          ...data,
          icon: 'zap',
          isActive: false,
          lastUsed: null
        }
      });
    }, 800);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/scenes', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}