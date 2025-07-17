const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['light', 'thermostat', 'lock', 'camera', 'speaker', 'plug']
  },
  room: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'connecting'],
    default: 'connecting'
  },
  isOn: {
    type: Boolean,
    default: false
  },
  properties: {
    brightness: {
      type: Number,
      min: 0,
      max: 100
    },
    color: {
      type: String
    },
    temperature: {
      type: Number,
      min: 40,
      max: 100
    },
    volume: {
      type: Number,
      min: 0,
      max: 100
    },
    powerUsage: {
      type: Number,
      min: 0
    }
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
deviceSchema.index({ userId: 1, type: 1 });
deviceSchema.index({ userId: 1, room: 1 });

module.exports = mongoose.model('Device', deviceSchema);