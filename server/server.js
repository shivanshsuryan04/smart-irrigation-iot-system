require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// ThingSpeak Configuration - Now using environment variables
const THINGSPEAK_CONFIG = {
  READ_API_KEY: process.env.THINGSPEAK_READ_API_KEY,
  WRITE_API_KEY: process.env.THINGSPEAK_WRITE_API_KEY,
  CHANNEL_ID: process.env.THINGSPEAK_CHANNEL_ID,
  BASE_URL: 'https://api.thingspeak.com'
};

// Debug log to verify config
console.log('📊 ThingSpeak Config:', {
  channelId: THINGSPEAK_CONFIG.CHANNEL_ID,
  hasReadKey: !!THINGSPEAK_CONFIG.READ_API_KEY
});

// In-memory storage for latest data (in production, use Redis or database)
let latestSensorData = {
  temperature: 0,
  humidity: 0,
  soilMoisture: 0,
  pumpStatus: false,
  timestamp: new Date(),
  wifiConnected: true,
  thingSpeakConnected: true
};

let systemSettings = {
  autoMode: true,
  moistureThreshold: 30,
  irrigationDuration: 15,
  temperatureAlert: 35
};

// Routes

// Get current sensor data
app.get('/api/sensors/current', (req, res) => {
  res.json({
    success: true,
    data: latestSensorData
  });
});

// Get historical sensor data from ThingSpeak
app.get('/api/sensors/history', async (req, res) => {
  try {
    const { days = 1 } = req.query;
    const url = `${THINGSPEAK_CONFIG.BASE_URL}/channels/${THINGSPEAK_CONFIG.CHANNEL_ID}/feeds.json`;
    
    const response = await axios.get(url, {
      params: {
        api_key: THINGSPEAK_CONFIG.READ_API_KEY,
        results: days * 24 * 4 // Assuming data every 15 minutes
      }
    });

    const formattedData = response.data.feeds.map(feed => ({
      time: new Date(feed.created_at).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      timestamp: feed.created_at,
      temperature: parseFloat(feed.field1) || 0,
      humidity: parseFloat(feed.field2) || 0,
      soilMoisture: parseFloat(feed.field3) || 0
    }));

    res.json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error('Error fetching ThingSpeak data:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch historical data',
      error: error.message
    });
  }
});

// Get system settings
app.get('/api/settings', (req, res) => {
  res.json({
    success: true,
    data: systemSettings
  });
});

// Update system settings
app.post('/api/settings', (req, res) => {
  const { autoMode, moistureThreshold, irrigationDuration, temperatureAlert } = req.body;
  
  if (autoMode !== undefined) systemSettings.autoMode = autoMode;
  if (moistureThreshold !== undefined) systemSettings.moistureThreshold = moistureThreshold;
  if (irrigationDuration !== undefined) systemSettings.irrigationDuration = irrigationDuration;
  if (temperatureAlert !== undefined) systemSettings.temperatureAlert = temperatureAlert;
  
  // Broadcast settings update to all connected clients
  io.emit('settingsUpdate', systemSettings);
  
  res.json({
    success: true,
    data: systemSettings,
    message: 'Settings updated successfully'
  });
});

// Manual pump control
app.post('/api/pump/toggle', (req, res) => {
  if (systemSettings.autoMode) {
    return res.status(400).json({
      success: false,
      message: 'Cannot control pump manually while auto mode is enabled'
    });
  }

  // Toggle pump status
  latestSensorData.pumpStatus = !latestSensorData.pumpStatus;
  
  // In a real implementation, you would send a command to the Arduino
  // For now, we'll simulate it
  console.log(`Pump ${latestSensorData.pumpStatus ? 'started' : 'stopped'} manually`);
  
  // Broadcast pump status update
  io.emit('pumpStatusUpdate', {
    pumpStatus: latestSensorData.pumpStatus,
    timestamp: new Date()
  });
  
  res.json({
    success: true,
    data: {
      pumpStatus: latestSensorData.pumpStatus,
      message: `Pump ${latestSensorData.pumpStatus ? 'started' : 'stopped'}`
    }
  });
});

// Endpoint to receive data from ESP8266 (alternative to ThingSpeak)
app.post('/api/sensors/data', (req, res) => {
  const { temperature, humidity, soilMoisture } = req.body;
  
  // Update latest sensor data
  latestSensorData = {
    ...latestSensorData,
    temperature: parseFloat(temperature),
    humidity: parseFloat(humidity),
    soilMoisture: parseFloat(soilMoisture),
    timestamp: new Date()
  };
  
  // Check for automatic irrigation
  if (systemSettings.autoMode && latestSensorData.soilMoisture < systemSettings.moistureThreshold) {
    if (!latestSensorData.pumpStatus) {
      latestSensorData.pumpStatus = true;
      console.log('Auto irrigation started - soil moisture below threshold');
      
      // Auto-stop after irrigation duration
      setTimeout(() => {
        if (latestSensorData.pumpStatus) {
          latestSensorData.pumpStatus = false;
          console.log('Auto irrigation stopped - duration completed');
          io.emit('pumpStatusUpdate', {
            pumpStatus: false,
            timestamp: new Date(),
            reason: 'auto_stop'
          });
        }
      }, systemSettings.irrigationDuration * 60 * 1000); // Convert minutes to milliseconds
    }
  }
  
  // Broadcast real-time data to connected clients
  io.emit('sensorDataUpdate', latestSensorData);
  
  res.json({
    success: true,
    message: 'Sensor data received',
    autoIrrigationTriggered: systemSettings.autoMode && 
                            latestSensorData.soilMoisture < systemSettings.moistureThreshold &&
                            latestSensorData.pumpStatus
  });
});

// Get system status
app.get('/api/system/status', (req, res) => {
  res.json({
    success: true,
    data: {
      wifiConnected: latestSensorData.wifiConnected,
      thingSpeakConnected: latestSensorData.thingSpeakConnected,
      lastUpdate: latestSensorData.timestamp,
      uptime: process.uptime()
    }
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send current data to newly connected client
  socket.emit('sensorDataUpdate', latestSensorData);
  socket.emit('settingsUpdate', systemSettings);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Simulate periodic data updates (remove this in production)
// This is just for testing without actual hardware
// Around line 220
setInterval(async () => {
  try {
    const url = `${THINGSPEAK_CONFIG.BASE_URL}/channels/${THINGSPEAK_CONFIG.CHANNEL_ID}/feeds/last.json`;
    const response = await axios.get(url, {
      params: {
        api_key: THINGSPEAK_CONFIG.READ_API_KEY
      }
    });
    
    if (response.data && response.data.field1) {  // Check if data exists
      const feed = response.data;
      latestSensorData = {
        ...latestSensorData,
        temperature: parseFloat(feed.field1) || latestSensorData.temperature,
        humidity: parseFloat(feed.field2) || latestSensorData.humidity,
        soilMoisture: parseFloat(feed.field3) || latestSensorData.soilMoisture,
        timestamp: new Date(feed.created_at),
        thingSpeakConnected: true
      };
      
      io.emit('sensorDataUpdate', latestSensorData);
    }
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('⚠️  ThingSpeak channel has no data yet. Upload some data from ESP8266.');
    } else {
      console.error('Failed to fetch from ThingSpeak:', error.message);
    }
    latestSensorData.thingSpeakConnected = false;
  }
}, 30000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🌱 Smart Irrigation Backend running on port ${PORT}`);
  console.log(`📊 ThingSpeak integration ${THINGSPEAK_CONFIG.CHANNEL_ID ? 'enabled' : 'disabled'}`);
});

module.exports = app;