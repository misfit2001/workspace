const Device = require('../models/Device');

const deviceService = {
  // Get all devices for a user
  async getAllDevices(userId) {
    try {
      console.log(`DeviceService: Fetching all devices for user ${userId}`);
      const devices = await Device.find({ userId }).sort({ createdAt: -1 });
      console.log(`DeviceService: Found ${devices.length} devices`);
      return devices;
    } catch (error) {
      console.error('DeviceService: Error fetching devices:', error);
      throw new Error('Failed to fetch devices');
    }
  },

  // Create a new device
  async createDevice(userId, deviceData) {
    try {
      console.log(`DeviceService: Creating device for user ${userId}:`, deviceData);
      
      const device = new Device({
        ...deviceData,
        userId,
        status: 'connecting',
        lastActivity: new Date()
      });

      const savedDevice = await device.save();
      console.log(`DeviceService: Device created with ID ${savedDevice._id}`);
      
      // Simulate device coming online after a short delay
      setTimeout(async () => {
        try {
          await Device.findByIdAndUpdate(savedDevice._id, { status: 'online' });
          console.log(`DeviceService: Device ${savedDevice._id} status updated to online`);
        } catch (error) {
          console.error('DeviceService: Error updating device status:', error);
        }
      }, 2000);

      return savedDevice;
    } catch (error) {
      console.error('DeviceService: Error creating device:', error);
      if (error.name === 'ValidationError') {
        throw new Error(`Validation error: ${Object.values(error.errors).map(e => e.message).join(', ')}`);
      }
      throw new Error('Failed to create device');
    }
  },

  // Toggle device on/off
  async toggleDevice(userId, deviceId) {
    try {
      console.log(`DeviceService: Toggling device ${deviceId} for user ${userId}`);
      
      const device = await Device.findOne({ _id: deviceId, userId });
      if (!device) {
        throw new Error('Device not found');
      }

      if (device.status === 'offline') {
        throw new Error('Cannot toggle offline device');
      }

      device.isOn = !device.isOn;
      device.lastActivity = new Date();
      
      const updatedDevice = await device.save();
      console.log(`DeviceService: Device ${deviceId} toggled to ${updatedDevice.isOn ? 'ON' : 'OFF'}`);
      
      return updatedDevice;
    } catch (error) {
      console.error('DeviceService: Error toggling device:', error);
      throw error;
    }
  },

  // Update device properties
  async updateDeviceProperties(userId, deviceId, properties) {
    try {
      console.log(`DeviceService: Updating properties for device ${deviceId}:`, properties);
      
      const device = await Device.findOne({ _id: deviceId, userId });
      if (!device) {
        throw new Error('Device not found');
      }

      if (device.status === 'offline') {
        throw new Error('Cannot update offline device');
      }

      // Merge new properties with existing ones
      device.properties = { ...device.properties, ...properties };
      device.lastActivity = new Date();
      
      const updatedDevice = await device.save();
      console.log(`DeviceService: Device ${deviceId} properties updated`);
      
      return updatedDevice;
    } catch (error) {
      console.error('DeviceService: Error updating device properties:', error);
      throw error;
    }
  },

  // Get device by ID
  async getDeviceById(userId, deviceId) {
    try {
      console.log(`DeviceService: Fetching device ${deviceId} for user ${userId}`);
      
      const device = await Device.findOne({ _id: deviceId, userId });
      if (!device) {
        throw new Error('Device not found');
      }
      
      return device;
    } catch (error) {
      console.error('DeviceService: Error fetching device:', error);
      throw error;
    }
  }
};

module.exports = deviceService;