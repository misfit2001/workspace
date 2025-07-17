const express = require('express');
const router = express.Router();
const deviceService = require('../services/deviceService');
const { requireUser } = require('./middleware/auth');

// Apply authentication middleware to all device routes
router.use(requireUser);

// GET /api/devices - Get all devices for the authenticated user
router.get('/', async (req, res) => {
  try {
    console.log(`DeviceRoutes: GET /api/devices - User: ${req.user.id}`);
    
    const devices = await deviceService.getAllDevices(req.user.id);
    
    res.json({
      success: true,
      devices
    });
  } catch (error) {
    console.error('DeviceRoutes: Error in GET /api/devices:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/devices - Create a new device
router.post('/', async (req, res) => {
  try {
    console.log(`DeviceRoutes: POST /api/devices - User: ${req.user.id}`, req.body);
    
    const { name, type, room } = req.body;
    
    // Validation
    if (!name || !type || !room) {
      return res.status(400).json({
        success: false,
        error: 'Name, type, and room are required'
      });
    }

    const device = await deviceService.createDevice(req.user.id, {
      name,
      type,
      room
    });
    
    res.status(201).json({
      success: true,
      device
    });
  } catch (error) {
    console.error('DeviceRoutes: Error in POST /api/devices:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/devices/:id/toggle - Toggle device on/off
router.post('/:id/toggle', async (req, res) => {
  try {
    console.log(`DeviceRoutes: POST /api/devices/${req.params.id}/toggle - User: ${req.user.id}`);
    
    const device = await deviceService.toggleDevice(req.user.id, req.params.id);
    
    res.json({
      success: true,
      device
    });
  } catch (error) {
    console.error(`DeviceRoutes: Error in POST /api/devices/${req.params.id}/toggle:`, error);
    const statusCode = error.message === 'Device not found' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/devices/:id - Update device properties
router.put('/:id', async (req, res) => {
  try {
    console.log(`DeviceRoutes: PUT /api/devices/${req.params.id} - User: ${req.user.id}`, req.body);
    
    const { properties } = req.body;
    
    if (!properties || typeof properties !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Properties object is required'
      });
    }

    const device = await deviceService.updateDeviceProperties(req.user.id, req.params.id, properties);
    
    res.json({
      success: true,
      device
    });
  } catch (error) {
    console.error(`DeviceRoutes: Error in PUT /api/devices/${req.params.id}:`, error);
    const statusCode = error.message === 'Device not found' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/devices/:id - Get specific device
router.get('/:id', async (req, res) => {
  try {
    console.log(`DeviceRoutes: GET /api/devices/${req.params.id} - User: ${req.user.id}`);
    
    const device = await deviceService.getDeviceById(req.user.id, req.params.id);
    
    res.json({
      success: true,
      device
    });
  } catch (error) {
    console.error(`DeviceRoutes: Error in GET /api/devices/${req.params.id}:`, error);
    const statusCode = error.message === 'Device not found' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;