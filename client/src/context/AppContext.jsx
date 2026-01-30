// src/context/AppContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import apiService from "../services/apiService";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentData, setCurrentData] = useState({
    temperature: 0,
    humidity: 0,
    soilMoisture: 0,
    pumpStatus: false,
    timestamp: new Date(),
    wifiConnected: false,
    thingSpeakConnected: false,
  });

  const [settings, setSettings] = useState({
    autoMode: true,
    moistureThreshold: 30,
    irrigationDuration: 15,
    temperatureAlert: 35,
    // Add these new fields to match your SettingsPage state
    notifications: {
      email: true,
      sms: false,
      push: true,
      lowMoisture: true,
      highTemp: true,
      pumpFailure: true,
      dataSync: false,
    },
    schedule: {
      enabled: true,
      times: [
        { time: "06:00", enabled: true, duration: 15 },
        { time: "18:00", enabled: true, duration: 20 },
      ],
    },
  });

  const [systemStatus, setSystemStatus] = useState({
    wifiConnected: false,
    thingSpeakConnected: false,
    lastUpdate: new Date().toLocaleTimeString(),
    uptime: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);

  // Initialize API service and load initial data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);

        // Initialize WebSocket connection
        apiService.initSocket();

        // Load initial data
        const [sensorResponse, settingsResponse, statusResponse] =
          await Promise.all([
            apiService.getCurrentSensorData(),
            apiService.getSettings(),
            apiService.getSystemStatus(),
          ]);

        if (sensorResponse.success) {
          setCurrentData(sensorResponse.data);
        }

        if (settingsResponse.success) {
          setSettings((prevSettings) => ({
            ...prevSettings,
            ...settingsResponse.data,
          }));
        }

        if (statusResponse.success) {
          setSystemStatus({
            ...statusResponse.data,
            lastUpdate: new Date(
              statusResponse.data.lastUpdate
            ).toLocaleTimeString(),
          });
        }

        // Load historical data
        const historyResponse = await apiService.getHistoricalData(1);
        if (historyResponse.success) {
          setHistoricalData(historyResponse.data);
        }

        setError(null);
      } catch (err) {
        console.error("Failed to initialize app:", err);
        setError(err.message);

        // Fallback to mock data if API fails
        setCurrentData({
          temperature: 28.5,
          humidity: 62,
          soilMoisture: 35,
          pumpStatus: false,
          timestamp: new Date(),
          wifiConnected: false,
          thingSpeakConnected: false,
        });
      } finally {
        setLoading(false);
      }
    };

    initializeApp();

    // Cleanup on unmount
    return () => {
      apiService.cleanup();
    };
  }, []);

  // Set up real-time data listeners
  useEffect(() => {
    // Listen for sensor data updates
    apiService.onSensorDataUpdate((data) => {
      const newTimestamp = new Date(data.timestamp);
      
      setCurrentData((prevData) => ({
        ...data,
        timestamp: newTimestamp,
      }));

      setSystemStatus((prev) => ({
        ...prev,
        wifiConnected:
          data.wifiConnected !== undefined
            ? data.wifiConnected
            : prev.wifiConnected,
        thingSpeakConnected:
          data.thingSpeakConnected !== undefined
            ? data.thingSpeakConnected
            : prev.thingSpeakConnected,
        lastUpdate: new Date().toLocaleTimeString(),
      }));

      const newHistoryPoint = {
        time: newTimestamp.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: data.timestamp,
        temperature: parseFloat(data.temperature) || 0,
        humidity: parseFloat(data.humidity) || 0,
        soilMoisture: parseFloat(data.soilMoisture) || 0,
      };

      // 4. Update the historicalData state
      setHistoricalData((prevData) => {
        const newData = [...prevData, newHistoryPoint];
        // Keep only the last 100 data points to prevent memory leaks
        if (newData.length > 100) {
          return newData.slice(newData.length - 100);
        }
        return newData;
      });
    });

    // Listen for settings updates
    apiService.onSettingsUpdate((newSettings) => {
      setSettings((prevSettings) => ({
        ...prevSettings,
        ...newSettings,
      }));
    });

    // Listen for pump status updates
    apiService.onPumpStatusUpdate((update) => {
      setCurrentData((prev) => ({
        ...prev,
        pumpStatus: update.pumpStatus,
        timestamp: new Date(update.timestamp),
      }));
    });
  }, []);

  // Handle pump toggle
  const handlePumpToggle = useCallback(async () => {
    try {
      const response = await apiService.togglePump();
      if (response.success) {
        // The real-time update will come through the WebSocket
        console.log(response.data.message);
      }
      return response;
    } catch (err) {
      console.error("Failed to toggle pump:", err);
      setError(`Pump control failed: ${err.message}`);
      throw err;
    }
  }, []);

  // Handle settings update
  const handleSettingsUpdate = useCallback(
    async (key, value) => {
      try {
        const updatedSettings = { ...settings, [key]: value };

        const response = await apiService.updateSettings(updatedSettings);
        if (response.success) {
          // The real-time update will come through the WebSocket
          console.log("Settings updated successfully");
        }
        return response;
      } catch (err) {
        console.error("Failed to update settings:", err);
        setError(`Settings update failed: ${err.message}`);
        throw err;
      }
    },
    [settings]
  );

  // Bulk settings update
  const handleBulkSettingsUpdate = useCallback(async (newSettings) => {
    try {
      const response = await apiService.updateSettings(newSettings);
      if (response.success) {
        console.log("Bulk settings updated successfully");
      }
      return response;
    } catch (err) {
      console.error("Failed to bulk update settings:", err);
      setError(`Bulk settings update failed: ${err.message}`);
      throw err;
    }
  }, []);

  // Refresh historical data
  const refreshHistoricalData = useCallback(async (days = 1) => {
    try {
      const response = await apiService.getHistoricalData(days);
      if (response.success) {
        setHistoricalData(response.data);
      }
      return response;
    } catch (err) {
      console.error("Failed to refresh historical data:", err);
      setError(`Failed to load historical data: ${err.message}`);
      throw err;
    }
  }, []);

  // Refresh system status
  const refreshSystemStatus = useCallback(async () => {
    try {
      const response = await apiService.getSystemStatus();
      if (response.success) {
        setSystemStatus({
          ...response.data,
          lastUpdate: new Date(response.data.lastUpdate).toLocaleTimeString(),
        });
      }
      return response;
    } catch (err) {
      console.error("Failed to refresh system status:", err);
      setError(`Failed to refresh system status: ${err.message}`);
      throw err;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Connection status indicator
  const connectionStatus = {
    isConnected: systemStatus.wifiConnected && systemStatus.thingSpeakConnected,
    hasWifi: systemStatus.wifiConnected,
    hasThingSpeak: systemStatus.thingSpeakConnected,
    lastUpdate: systemStatus.lastUpdate,
  };

  const contextValue = {
    // State
    currentData,
    settings,
    systemStatus,
    historicalData,
    loading,
    error,
    connectionStatus,

    // Actions
    handlePumpToggle,
    handleSettingsUpdate,
    handleBulkSettingsUpdate,
    refreshHistoricalData,
    refreshSystemStatus,
    clearError,

    // Direct setters (for backward compatibility)
    setCurrentData,
    setSettings,
    setSystemStatus,

    // API service reference
    apiService,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
