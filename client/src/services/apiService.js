import io from 'socket.io-client';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  // Initialize WebSocket connection
  initSocket() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        upgrade: false
      });

      this.socket.on('connect', () => {
        console.log('Connected to server via WebSocket');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
    return this.socket;
  }

  // Subscribe to real-time sensor data updates
  onSensorDataUpdate(callback) {
    if (!this.socket) this.initSocket();
    
    this.socket.on('sensorDataUpdate', callback);
    this.listeners.set('sensorDataUpdate', callback);
  }

  // Subscribe to settings updates
  onSettingsUpdate(callback) {
    if (!this.socket) this.initSocket();
    
    this.socket.on('settingsUpdate', callback);
    this.listeners.set('settingsUpdate', callback);
  }

  // Subscribe to pump status updates
  onPumpStatusUpdate(callback) {
    if (!this.socket) this.initSocket();
    
    this.socket.on('pumpStatusUpdate', callback);
    this.listeners.set('pumpStatusUpdate', callback);
  }

  // Cleanup socket listeners
  cleanup() {
    if (this.socket) {
      this.listeners.forEach((callback, event) => {
        this.socket.off(event, callback);
      });
      this.listeners.clear();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // HTTP API methods
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get current sensor data
  async getCurrentSensorData() {
    return this.makeRequest('/api/sensors/current');
  }

  // Get historical sensor data
  async getHistoricalData(days = 1) {
    return this.makeRequest(`/api/sensors/history?days=${days}`);
  }

  // Get system settings
  async getSettings() {
    return this.makeRequest('/api/settings');
  }

  // Update system settings
  async updateSettings(settings) {
    return this.makeRequest('/api/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  // Toggle pump manually
  async togglePump() {
    return this.makeRequest('/api/pump/toggle', {
      method: 'POST',
    });
  }

  // Get system status
  async getSystemStatus() {
    return this.makeRequest('/api/system/status');
  }

  // Send sensor data (for testing or alternative data source)
  async sendSensorData(data) {
    return this.makeRequest('/api/sensors/data', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Create singleton instance
const apiService = new ApiService();

// React Hook for using the API service
export const useApiService = () => {
  return apiService;
};

export default apiService;