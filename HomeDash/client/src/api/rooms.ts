import api from './api';

export interface Room {
  _id: string;
  name: string;
  deviceCount: number;
  activeDevices: number;
  icon: string;
}

// Description: Get all rooms
// Endpoint: GET /api/rooms
// Request: {}
// Response: { rooms: Room[] }
export const getRooms = () => {
  console.log('API: Fetching rooms')
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        rooms: [
          {
            _id: '1',
            name: 'Living Room',
            deviceCount: 4,
            activeDevices: 3,
            icon: 'sofa'
          },
          {
            _id: '2',
            name: 'Kitchen',
            deviceCount: 3,
            activeDevices: 1,
            icon: 'chef-hat'
          },
          {
            _id: '3',
            name: 'Bedroom',
            deviceCount: 5,
            activeDevices: 2,
            icon: 'bed'
          },
          {
            _id: '4',
            name: 'Bathroom',
            deviceCount: 2,
            activeDevices: 0,
            icon: 'droplets'
          },
          {
            _id: '5',
            name: 'Office',
            deviceCount: 3,
            activeDevices: 3,
            icon: 'briefcase'
          },
          {
            _id: '6',
            name: 'Entrance',
            deviceCount: 2,
            activeDevices: 1,
            icon: 'door-open'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/rooms');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Control all devices in a room
// Endpoint: POST /api/rooms/:id/control
// Request: { roomId: string, action: 'on' | 'off' }
// Response: { success: boolean, affectedDevices: number }
export const controlRoom = (roomId: string, action: 'on' | 'off') => {
  console.log('API: Controlling room', roomId, action)
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        affectedDevices: Math.floor(Math.random() * 5) + 1
      });
    }, 800);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post(`/api/rooms/${roomId}/control`, { action });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}