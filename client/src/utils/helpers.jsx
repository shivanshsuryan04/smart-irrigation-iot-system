// Utility functions for the Smart Irrigation System

/**
 * Format timestamp to readable date string
 * @param {Date|string} timestamp - The timestamp to format
 * @param {string} format - Format type ('short', 'long', 'time', 'date')
 * @returns {string} Formatted date string
 */
export const formatDate = (timestamp, format = 'short') => {
  const date = new Date(timestamp);
  
  const options = {
    short: { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    },
    long: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    },
    time: { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    },
    date: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
  };

  return date.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Format sensor values with appropriate units and precision
 * @param {number} value - The sensor value
 * @param {string} type - Sensor type ('temperature', 'humidity', 'moisture', 'pressure')
 * @returns {object} Object with formatted value and unit
 */
export const formatSensorValue = (value, type) => {
  const configs = {
    temperature: { 
      unit: '°C', 
      precision: 1, 
      suffix: '' 
    },
    humidity: { 
      unit: '%', 
      precision: 1, 
      suffix: 'RH' 
    },
    moisture: { 
      unit: '%', 
      precision: 1, 
      suffix: '' 
    },
    pressure: { 
      unit: 'hPa', 
      precision: 2, 
      suffix: '' 
    }
  };

  const config = configs[type] || { unit: '', precision: 1, suffix: '' };
  const formattedValue = parseFloat(value).toFixed(config.precision);
  
  return {
    value: formattedValue,
    unit: config.unit,
    suffix: config.suffix,
    display: `${formattedValue}${config.unit}${config.suffix ? ' ' + config.suffix : ''}`
  };
};

/**
 * Get status based on sensor value and thresholds
 * @param {number} value - Current sensor value
 * @param {object} thresholds - Object with min, max, optimal ranges
 * @param {string} type - Sensor type for specific logic
 * @returns {object} Status object with level, color, and message
 */
export const getSensorStatus = (value, thresholds, type = 'generic') => {
  const { min = 0, max = 100, optimal = { min: 30, max: 70 } } = thresholds;

  // Define status levels
  const statuses = {
    critical_low: { level: 'critical', color: 'red', priority: 4 },
    low: { level: 'low', color: 'yellow', priority: 3 },
    normal: { level: 'normal', color: 'green', priority: 1 },
    high: { level: 'high', color: 'yellow', priority: 3 },
    critical_high: { level: 'critical', color: 'red', priority: 4 }
  };

  // Determine status based on value
  let status;
  if (value < min * 0.5) status = statuses.critical_low;
  else if (value < optimal.min) status = statuses.low;
  else if (value >= optimal.min && value <= optimal.max) status = statuses.normal;
  else if (value > optimal.max && value < max * 1.2) status = statuses.high;
  else status = statuses.critical_high;

  // Type-specific messages
  const messages = {
    temperature: {
      critical_low: 'Extremely cold - Check heating',
      low: 'Below optimal temperature',
      normal: 'Temperature is optimal',
      high: 'Above optimal temperature',
      critical_high: 'Dangerously hot - Immediate attention needed'
    },
    humidity: {
      critical_low: 'Very dry conditions',
      low: 'Low humidity detected',
      normal: 'Humidity levels are good',
      high: 'High humidity detected',
      critical_high: 'Excessive humidity - Risk of fungal growth'
    },
    moisture: {
      critical_low: 'Soil extremely dry - Immediate irrigation needed',
      low: 'Soil moisture low - Irrigation recommended',
      normal: 'Soil moisture is adequate',
      high: 'Soil moisture high - Reduce irrigation',
      critical_high: 'Soil waterlogged - Stop irrigation'
    }
  };

  const statusKey = Object.keys(statuses).find(key => statuses[key] === status);
  const message = messages[type]?.[statusKey] || `Value is ${status.level}`;

  return {
    ...status,
    message,
    value,
    isActionRequired: status.priority >= 3
  };
};

/**
 * Calculate irrigation duration based on conditions
 * @param {object} conditions - Current environmental conditions
 * @param {object} settings - User-defined irrigation settings
 * @returns {number} Recommended duration in minutes
 */
export const calculateIrrigationDuration = (conditions, settings) => {
  const { soilMoisture, temperature, humidity } = conditions;
  const { baseDuration = 15, moistureThreshold = 30 } = settings;

  let duration = baseDuration;

  // Adjust based on soil moisture deficit
  const moistureDeficit = Math.max(0, moistureThreshold - soilMoisture);
  const moistureMultiplier = 1 + (moistureDeficit / 100);
  duration *= moistureMultiplier;

  // Adjust based on temperature (higher temp = longer duration)
  if (temperature > 30) {
    duration *= 1.2;
  } else if (temperature > 35) {
    duration *= 1.5;
  }

  // Adjust based on humidity (lower humidity = longer duration)
  if (humidity < 40) {
    duration *= 1.3;
  } else if (humidity < 30) {
    duration *= 1.6;
  }

  // Cap duration between 5 and 60 minutes
  return Math.min(Math.max(Math.round(duration), 5), 60);
};

/**
 * Generate alerts based on sensor data and settings
 * @param {object} sensorData - Current sensor readings
 * @param {object} settings - System settings and thresholds
 * @param {array} existingAlerts - Currently active alerts
 * @returns {array} Array of alert objects
 */
export const generateAlerts = (sensorData, settings, existingAlerts = []) => {
  const alerts = [];
  const timestamp = new Date();

  // Check soil moisture
  if (sensorData.soilMoisture < settings.moistureThreshold) {
    alerts.push({
      id: `moisture_${timestamp.getTime()}`,
      type: 'moisture',
      level: sensorData.soilMoisture < settings.moistureThreshold * 0.5 ? 'critical' : 'warning',
      title: 'Low Soil Moisture',
      message: `Soil moisture is ${sensorData.soilMoisture}%, below threshold of ${settings.moistureThreshold}%`,
      timestamp,
      actionRequired: true,
      action: 'Start irrigation cycle'
    });
  }

  // Check temperature
  if (sensorData.temperature > settings.temperatureAlert) {
    alerts.push({
      id: `temp_${timestamp.getTime()}`,
      type: 'temperature',
      level: sensorData.temperature > settings.temperatureAlert * 1.2 ? 'critical' : 'warning',
      title: 'High Temperature Alert',
      message: `Temperature is ${sensorData.temperature}°C, above alert threshold of ${settings.temperatureAlert}°C`,
      timestamp,
      actionRequired: false,
      action: 'Monitor plant stress'
    });
  }

  // Check system connectivity
  if (!sensorData.wifiConnected) {
    alerts.push({
      id: `wifi_${timestamp.getTime()}`,
      type: 'connectivity',
      level: 'critical',
      title: 'WiFi Connection Lost',
      message: 'System is not connected to WiFi network',
      timestamp,
      actionRequired: true,
      action: 'Check network settings'
    });
  }

  // Filter out duplicate alerts (same type within last 5 minutes)
  const fiveMinutesAgo = new Date(timestamp.getTime() - 5 * 60 * 1000);
  const filteredAlerts = alerts.filter(alert => {
    const recentSimilar = existingAlerts.find(existing => 
      existing.type === alert.type && 
      new Date(existing.timestamp) > fiveMinutesAgo
    );
    return !recentSimilar;
  });

  return filteredAlerts;
};

/**
 * Calculate water usage statistics
 * @param {array} irrigationLogs - Array of irrigation events
 * @param {object} pumpSpecs - Pump specifications (flow rate, etc.)
 * @returns {object} Water usage statistics
 */
export const calculateWaterUsage = (irrigationLogs, pumpSpecs = {}) => {
  const { flowRate = 2 } = pumpSpecs; // liters per minute

  const stats = {
    totalVolume: 0,
    totalDuration: 0,
    averageDuration: 0,
    cyclesCount: irrigationLogs.length,
    dailyUsage: {},
    weeklyUsage: 0,
    monthlyUsage: 0
  };

  irrigationLogs.forEach(log => {
    const duration = log.duration || 15; // minutes
    const volume = duration * flowRate;
    
    stats.totalVolume += volume;
    stats.totalDuration += duration;

    // Group by day
    const day = new Date(log.timestamp).toDateString();
    if (!stats.dailyUsage[day]) {
      stats.dailyUsage[day] = { volume: 0, cycles: 0 };
    }
    stats.dailyUsage[day].volume += volume;
    stats.dailyUsage[day].cycles += 1;
  });

  stats.averageDuration = stats.cyclesCount > 0 ? stats.totalDuration / stats.cyclesCount : 0;

  // Calculate weekly and monthly usage
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  irrigationLogs.forEach(log => {
    const logDate = new Date(log.timestamp);
    const duration = log.duration || 15;
    const volume = duration * flowRate;

    if (logDate >= weekAgo) stats.weeklyUsage += volume;
    if (logDate >= monthAgo) stats.monthlyUsage += volume;
  });

  return stats;
};

/**
 * Validate sensor readings for data quality
 * @param {object} sensorData - Raw sensor data
 * @returns {object} Validation results with cleaned data and flags
 */
export const validateSensorData = (sensorData) => {
  const validation = {
    isValid: true,
    errors: [],
    warnings: [],
    cleanedData: { ...sensorData }
  };

  // Temperature validation (-40 to 85°C for DHT11 extended range)
  if (sensorData.temperature < -40 || sensorData.temperature > 85) {
    validation.errors.push('Temperature reading out of sensor range');
    validation.isValid = false;
  } else if (sensorData.temperature < -10 || sensorData.temperature > 50) {
    validation.warnings.push('Temperature reading unusual for typical conditions');
  }

  // Humidity validation (0-100% for DHT11)
  if (sensorData.humidity < 0 || sensorData.humidity > 100) {
    validation.errors.push('Humidity reading out of valid range (0-100%)');
    validation.cleanedData.humidity = Math.max(0, Math.min(100, sensorData.humidity));
  }

  // Soil moisture validation (0-100%)
  if (sensorData.soilMoisture < 0 || sensorData.soilMoisture > 100) {
    validation.errors.push('Soil moisture reading out of valid range (0-100%)');
    validation.cleanedData.soilMoisture = Math.max(0, Math.min(100, sensorData.soilMoisture));
  }

  // Check for rapid changes (possible sensor errors)
  if (sensorData.previousReading) {
    const tempDiff = Math.abs(sensorData.temperature - sensorData.previousReading.temperature);
    const humidityDiff = Math.abs(sensorData.humidity - sensorData.previousReading.humidity);

    if (tempDiff > 10) { // More than 10°C change
      validation.warnings.push('Rapid temperature change detected');
    }
    if (humidityDiff > 20) { // More than 20% humidity change
      validation.warnings.push('Rapid humidity change detected');
    }
  }

  return validation;
};

/**
 * Convert data for chart visualization
 * @param {array} rawData - Raw sensor data array
 * @param {string} timeFormat - Time format for x-axis
 * @returns {array} Formatted data for charts
 */
export const formatChartData = (rawData, timeFormat = 'HH:mm') => {
  return rawData.map(item => ({
    ...item,
    time: formatDate(item.timestamp, 'time'),
    temperature: parseFloat(item.temperature.toFixed(1)),
    humidity: parseFloat(item.humidity.toFixed(1)),
    soilMoisture: parseFloat(item.soilMoisture.toFixed(1))
  }));
};

/**
 * Local storage utilities for settings persistence
 */
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(`irrigation_${key}`, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
      return false;
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(`irrigation_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(`irrigation_${key}`);
      return true;
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
      return false;
    }
  },

  clear: () => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('irrigation_')) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
      return false;
    }
  }
};

/**
 * Debounce utility for API calls and user input
 * @param {function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle utility for frequent updates
 * @param {function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Generate unique IDs for components and data entries
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique identifier
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Color utilities for dynamic theming
 */
export const colorUtils = {
  // Get status color based on sensor status
  getStatusColor: (status, opacity = 1) => {
    const colors = {
      normal: `rgba(16, 185, 129, ${opacity})`, // green
      warning: `rgba(245, 158, 11, ${opacity})`, // yellow/amber
      critical: `rgba(239, 68, 68, ${opacity})`, // red
      info: `rgba(59, 130, 246, ${opacity})`, // blue
      success: `rgba(34, 197, 94, ${opacity})` // emerald
    };
    return colors[status] || colors.info;
  },

  // Generate gradient based on value range
  getValueGradient: (value, min = 0, max = 100, colorScheme = 'blue-green') => {
    const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
    
    const schemes = {
      'blue-green': {
        low: '#3b82f6',
        high: '#10b981'
      },
      'red-yellow-green': {
        low: '#ef4444',
        mid: '#f59e0b',
        high: '#10b981'
      },
      'cool-warm': {
        low: '#06b6d4',
        high: '#f97316'
      }
    };

    const scheme = schemes[colorScheme] || schemes['blue-green'];
    
    if (scheme.mid) {
      // Three-color gradient
      if (percentage <= 50) {
        return `linear-gradient(90deg, ${scheme.low} 0%, ${scheme.mid} ${percentage * 2}%)`;
      } else {
        return `linear-gradient(90deg, ${scheme.mid} 0%, ${scheme.high} ${(percentage - 50) * 2}%)`;
      }
    } else {
      // Two-color gradient
      return `linear-gradient(90deg, ${scheme.low} 0%, ${scheme.high} ${percentage}%)`;
    }
  }
};

/**
 * API utilities for ThingSpeak and other integrations
 */
export const apiUtils = {
  // Format data for ThingSpeak API
  formatForThingSpeak: (sensorData) => {
    return {
      field1: sensorData.temperature,
      field2: sensorData.humidity,
      field3: sensorData.soilMoisture,
      field4: sensorData.pumpStatus ? 1 : 0,
      created_at: new Date().toISOString()
    };
  },

  // Parse ThingSpeak response
  parseThingSpeakResponse: (response) => {
    if (!response.feeds || response.feeds.length === 0) {
      return [];
    }

    return response.feeds.map(feed => ({
      timestamp: new Date(feed.created_at),
      temperature: parseFloat(feed.field1) || 0,
      humidity: parseFloat(feed.field2) || 0,
      soilMoisture: parseFloat(feed.field3) || 0,
      pumpStatus: parseInt(feed.field4) === 1
    }));
  },

  // Create API request with proper error handling
  createApiRequest: async (url, options = {}) => {
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
    };

    const config = { ...defaultOptions, ...options };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }
};

/**
 * Data export utilities
 */
export const exportUtils = {
  // Export data as CSV
  toCSV: (data, filename = 'irrigation_data') => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${formatDate(new Date(), 'date').replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Export data as JSON
  toJSON: (data, filename = 'irrigation_data') => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${formatDate(new Date(), 'date').replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Generate report data
  generateReport: (sensorData, settings, irrigationLogs) => {
    const waterStats = calculateWaterUsage(irrigationLogs);
    const currentStatus = getSensorStatus(
      sensorData.soilMoisture, 
      { optimal: { min: settings.moistureThreshold, max: settings.moistureThreshold + 20 } },
      'moisture'
    );

    return {
      reportDate: new Date().toISOString(),
      systemSettings: settings,
      currentReadings: sensorData,
      systemStatus: currentStatus,
      waterUsage: waterStats,
      recentLogs: irrigationLogs.slice(-10),
      summary: {
        totalWaterUsed: waterStats.totalVolume,
        averageEfficiency: 94.2, // This would be calculated based on historical data
        systemUptime: 99.6,
        alertsGenerated: irrigationLogs.filter(log => log.type === 'alert').length
      }
    };
  }
};

/**
 * Notification utilities
 */
export const notificationUtils = {
  // Check if browser supports notifications
  isSupported: () => {
    return 'Notification' in window;
  },

  // Request notification permission
  requestPermission: async () => {
    if (!notificationUtils.isSupported()) {
      return 'not-supported';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  },

  // Show notification
  show: (title, options = {}) => {
    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    const defaultOptions = {
      icon: '/favicon.ico',
      badge: '/badge.png',
      requireInteraction: false,
      silent: false
    };

    return new Notification(title, { ...defaultOptions, ...options });
  },

  // Show system alert notification
  showAlert: (alert) => {
    const icons = {
      moisture: '💧',
      temperature: '🌡️',
      connectivity: '📡',
      pump: '⚡'
    };

    return notificationUtils.show(alert.title, {
      body: alert.message,
      icon: icons[alert.type] || '🔔',
      requireInteraction: alert.level === 'critical',
      tag: alert.type // This prevents duplicate notifications
    });
  }
};

/**
 * Performance monitoring utilities
 */
export const performanceUtils = {
  // Measure function execution time
  measure: (fn, label = 'Function') => {
    return (...args) => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      console.log(`${label} executed in ${(end - start).toFixed(2)}ms`);
      return result;
    };
  },

  // Log memory usage (if available)
  logMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = performance.memory;
      console.log({
        usedJSHeapSize: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        totalJSHeapSize: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      });
    }
  }
};

/**
 * Error handling utilities
 */
export const errorUtils = {
  // Create user-friendly error messages
  createErrorMessage: (error, context = 'System') => {
    const errorMessages = {
      NetworkError: 'Unable to connect to the server. Please check your internet connection.',
      TimeoutError: 'Request timed out. The server may be busy.',
      ValidationError: 'Invalid data provided. Please check your inputs.',
      AuthenticationError: 'Authentication failed. Please log in again.',
      PermissionError: 'You do not have permission to perform this action.',
      NotFoundError: 'The requested resource was not found.'
    };

    const message = errorMessages[error.name] || error.message || 'An unexpected error occurred';
    
    return {
      title: `${context} Error`,
      message,
      timestamp: new Date(),
      severity: error.severity || 'error',
      context,
      originalError: error
    };
  },

  // Log errors with context
  logError: (error, context = 'Unknown') => {
    const errorInfo = errorUtils.createErrorMessage(error, context);
    console.error(`[${errorInfo.timestamp.toISOString()}] ${errorInfo.title}:`, errorInfo);
    
    // In a real app, you might send this to an error tracking service
    // Example: sendToErrorTracker(errorInfo);
  }
};

// Export all utilities as default object for easier imports
export default {
  formatDate,
  formatSensorValue,
  getSensorStatus,
  calculateIrrigationDuration,
  generateAlerts,
  calculateWaterUsage,
  validateSensorData,
  formatChartData,
  storage,
  debounce,
  throttle,
  generateId,
  colorUtils,
  apiUtils,
  exportUtils,
  notificationUtils,
  performanceUtils,
  errorUtils
};