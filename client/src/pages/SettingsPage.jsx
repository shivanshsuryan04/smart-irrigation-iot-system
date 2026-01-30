import React, { useState } from "react";
import {
  Settings,
  Power,
  Wifi,
  Database,
  Bell,
  CheckCircle,
  AlertTriangle,
  Save,
  RotateCcw,
  Smartphone,
  Clock,
  Thermometer,
  Droplets,
  Zap,
  Shield,
  Download,
  Upload,
} from "lucide-react";
import Layout from "../components/Layout";
import { useAppContext } from "../context/AppContext";
import { mockLogs } from "../data/mockData";

const SettingsPage = () => {
  const {
    currentData,
    settings,
    systemStatus,
    handlePumpToggle,
    handleBulkSettingsUpdate,
    handleSettingsUpdate,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState("system");

  // Tabs configuration
  const tabs = [
    { id: "system", label: "System Control", icon: Settings },
    { id: "schedule", label: "Schedule", icon: Clock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "advanced", label: "Advanced", icon: Shield },
  ];

  const handleNotificationChange = (key, value) => {
    handleSettingsUpdate("notifications", {
      ...settings.notifications,
      [key]: value,
    });
  };

  const handleScheduleChange = (index, field, value) => {
    const newTimes = settings.schedule.times.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    handleSettingsUpdate("schedule", {
      ...settings.schedule,
      times: newTimes,
    });
  };

  const handleScheduleEnabledChange = (value) => {
    handleSettingsUpdate("schedule", {
      ...settings.schedule,
      enabled: value,
    });
  };

  const addScheduleTime = () => {
    const newTimes = [
      ...settings.schedule.times,
      { time: "09:00", enabled: true, duration: 15 },
    ];
    handleSettingsUpdate("schedule", {
      ...settings.schedule,
      times: newTimes,
    });
  };

  const removeScheduleTime = (index) => {
    const newTimes = settings.schedule.times.filter((_, i) => i !== index);
    handleSettingsUpdate("schedule", {
      ...settings.schedule,
      times: newTimes,
    });
  };

  // Toggle Switch Component
  const ToggleSwitch = ({ enabled, onChange, size = "md" }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex items-center rounded-full transition-all duration-300 shadow-lg ${
        enabled ? "bg-[#22C55E]" : "bg-gray-300"
      } ${size === "sm" ? "h-6 w-11" : "h-8 w-14"}`}
    >
      <span
        className={`inline-block transform rounded-full bg-white transition-transform shadow-lg ${
          enabled
            ? size === "sm"
              ? "translate-x-6"
              : "translate-x-7"
            : "translate-x-1"
        } ${size === "sm" ? "h-4 w-4" : "h-6 w-6"}`}
      />
    </button>
  );

  // System Control Tab
  const SystemControlTab = () => (
    <div className="space-y-8">
      {/* Main Controls */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
        <h3 className="text-2xl font-bold mb-8 text-gray-900">
          System Controls
        </h3>

        <div className="space-y-8">
          {/* Auto Mode Toggle */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">
                  Automatic Mode
                </h4>
                <p className="text-gray-600">
                  Smart irrigation based on soil moisture and weather
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.autoMode}
              onChange={(value) => handleSettingsUpdate("autoMode", value)}
            />
          </div>

          {/* Manual Pump Control */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg">
                <Power className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Water Pump</h4>
                <p className="text-gray-600">
                  Manual pump control (Auto mode must be off)
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  currentData.pumpStatus
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {currentData.pumpStatus ? "RUNNING" : "STOPPED"}
              </span>
              <button
                onClick={handlePumpToggle}
                disabled={settings.autoMode}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg ${
                  currentData.pumpStatus
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-xl"
                    : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-xl"
                } ${settings.autoMode ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {currentData.pumpStatus ? "Stop Pump" : "Start Pump"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Threshold Settings */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
        <h3 className="text-xl font-bold mb-6 text-gray-900">
          Threshold Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Moisture Threshold */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <div className="flex items-center mb-4">
              <Droplets className="w-6 h-6 text-blue-600 mr-3" />
              <h4 className="font-bold text-gray-900 text-lg">
                Soil Moisture Threshold
              </h4>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">
                  Current: {settings.moistureThreshold}%
                </span>
                <span className="text-sm text-gray-500">Range: 10-60%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={settings.moistureThreshold}
                onChange={(e) =>
                  handleSettingsUpdate(
                    "moistureThreshold",
                    parseInt(e.target.value)
                  )
                }
                className="w-full h-3 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Dry (10%)</span>
                <span>Optimal (30%)</span>
                <span>Wet (60%)</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Irrigation starts when soil moisture drops below this level
            </p>
          </div>

          {/* Temperature Alert */}
          <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
            <div className="flex items-center mb-4">
              <Thermometer className="w-6 h-6 text-orange-600 mr-3" />
              <h4 className="font-bold text-gray-900 text-lg">
                Temperature Alert
              </h4>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">
                  Alert at: {settings.temperatureAlert}°C
                </span>
                <span className="text-sm text-gray-500">Range: 25-45°C</span>
              </div>
              <input
                type="range"
                min="25"
                max="45"
                value={settings.temperatureAlert}
                onChange={(e) =>
                  handleSettingsUpdate(
                    "temperatureAlert",
                    parseInt(e.target.value)
                  )
                }
                className="w-full h-3 bg-gradient-to-r from-orange-200 to-red-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Cool (25°C)</span>
                <span>Warm (35°C)</span>
                <span>Hot (45°C)</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Get alerts when temperature exceeds this threshold
            </p>
          </div>
        </div>

        {/* Irrigation Duration */}
        <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <div className="flex items-center mb-4">
            <Clock className="w-6 h-6 text-green-600 mr-3" />
            <h4 className="font-bold text-gray-900 text-lg">
              Irrigation Duration
            </h4>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">
                Duration: {settings.irrigationDuration} minutes
              </span>
              <span className="text-sm text-gray-500">Range: 5-60 min</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              value={settings.irrigationDuration}
              onChange={(e) =>
                handleSettingsUpdate(
                  "irrigationDuration",
                  parseInt(e.target.value)
                )
              }
              className="w-full h-3 bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Quick (5min)</span>
              <span>Normal (30min)</span>
              <span>Extended (60min)</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            How long the pump runs during each irrigation cycle
          </p>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
        <h3 className="text-xl font-bold mb-6 text-gray-900">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
            <div className="flex items-center">
              <Wifi className="w-5 h-5 mr-3 text-blue-600" />
              <span className="font-medium text-gray-700">WiFi Connection</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold shadow-md ${
                systemStatus.wifiConnected
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {systemStatus.wifiConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
            <div className="flex items-center">
              <Database className="w-5 h-5 mr-3 text-purple-600" />
              <span className="font-medium text-gray-700">ThingSpeak Sync</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold shadow-md ${
                systemStatus.thingSpeakConnected
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {systemStatus.thingSpeakConnected ? "Synced" : "Error"}
            </span>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          Last update: {systemStatus.lastUpdate}
        </div>
      </div>
    </div>
  );

  // Schedule Tab
  const ScheduleTab = () => (
    <div className="space-y-8">
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900">
            Irrigation Schedule
          </h3>
          <ToggleSwitch
            enabled={settings.schedule.enabled} // Read from context
            onChange={handleScheduleEnabledChange} // Use new handler
          />
        </div>

        <div className="space-y-6">
          {settings.schedule.times.map((timeSlot, index) => (
            <div
              key={index}
              className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <ToggleSwitch
                    enabled={timeSlot.enabled}
                    onChange={(value) =>
                      handleScheduleChange(index, "enabled", value)
                    }
                    size="sm"
                  />
                  <div className="flex items-center space-x-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        value={timeSlot.time}
                        onChange={(e) =>
                          handleScheduleChange(index, "time", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (min)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="60"
                        value={timeSlot.duration}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "duration",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeScheduleTime(index)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addScheduleTime}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-600 hover:text-blue-600"
          >
            + Add Schedule Time
          </button>
        </div>
      </div>
    </div>
  );

  // Notifications Tab
  const NotificationsTab = () => (
    <div className="space-y-8">
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
        <h3 className="text-2xl font-bold mb-8 text-gray-900">
          Notification Settings
        </h3>

        {/* Notification Channels */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Notification Channels
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <h5 className="font-medium text-gray-900">
                    Push Notifications
                  </h5>
                  <p className="text-sm text-gray-600">
                    Receive alerts on your device
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.notifications.push} // FIXED: Read from settings.notifications
                onChange={(value) => handleNotificationChange("push", value)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div className="flex items-center">
                <Smartphone className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <h5 className="font-medium text-gray-900">SMS Alerts</h5>
                  <p className="text-sm text-gray-600">
                    Get text messages for critical alerts
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.notifications.sms} // FIXED: Read from settings.notifications
                onChange={(value) => handleNotificationChange("sms", value)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <div className="flex items-center">
                <Database className="w-5 h-5 text-purple-600 mr-3" />
                <div>
                  <h5 className="font-medium text-gray-900">
                    Email Notifications
                  </h5>
                  <p className="text-sm text-gray-600">
                    Receive detailed reports via email
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.notifications.email} // FIXED: Read from settings.notifications
                onChange={(value) => handleNotificationChange("email", value)}
              />
            </div>
          </div>
        </div>

        {/* Alert Types */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Alert Types
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <h5 className="font-medium text-gray-900">
                    Low Soil Moisture
                  </h5>
                  <p className="text-sm text-gray-600">
                    Alert when moisture drops below threshold
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.notifications.lowMoisture} // FIXED: Read from settings.notifications
                onChange={(value) =>
                  handleNotificationChange("lowMoisture", value)
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
              <div className="flex items-center">
                <Thermometer className="w-5 h-5 text-orange-600 mr-3" />
                <div>
                  <h5 className="font-medium text-gray-900">
                    High Temperature
                  </h5>
                  <p className="text-sm text-gray-600">
                    Alert when temperature exceeds limit
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.notifications.highTemp} // FIXED: Read from settings.notifications
                onChange={(value) =>
                  handleNotificationChange("highTemp", value)
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
              <div className="flex items-center">
                <Power className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <h5 className="font-medium text-gray-900">Pump Failure</h5>
                  <p className="text-sm text-gray-600">
                    Immediate alert for pump malfunctions
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.notifications.pumpFailure} // FIXED: Read from settings.notifications
                onChange={(value) =>
                  handleNotificationChange("pumpFailure", value)
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="flex items-center">
                <Database className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <h5 className="font-medium text-gray-900">
                    Data Sync Issues
                  </h5>
                  <p className="text-sm text-gray-600">
                    Alert when data synchronization fails
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.notifications.dataSync} // FIXED: Read from settings.notifications
                onChange={(value) =>
                  handleNotificationChange("dataSync", value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Advanced Tab
  const AdvancedTab = () => (
    <div className="space-y-8">
      {/* System Configuration */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
        <h3 className="text-2xl font-bold mb-8 text-gray-900">
          Advanced Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Data & Backup
            </h4>

            <button className="w-full flex items-center justify-center p-4 bg-[#22C55E] text-white rounded-xl hover:shadow-lg hover:bg-green-600 transition-colors transition-all duration-300">
              <Download className="w-5 h-5 mr-2" />
              Export Data
            </button>

            <button className="w-full flex items-center justify-center p-4 border-2 border-[#22C55E] text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-colors">
              <Upload className="w-5 h-5 mr-2" />
              Import Settings
            </button>

            <button className="w-full flex items-center justify-center p-4 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-300 transition-colors">
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset to Defaults
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">System Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Firmware Version:</span>
                <span className="font-medium">v2.1.4</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Hardware Model:</span>
                <span className="font-medium">NodeMCU ESP8266</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Uptime:</span>
                <span className="font-medium">12d 5h 32m</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Memory Usage:</span>
                <span className="font-medium">34%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calibration */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
        <h3 className="text-xl font-bold mb-6 text-gray-900">
          Sensor Calibration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <h4 className="font-semibold text-blue-900 mb-2">Soil Moisture</h4>
            <p className="text-sm text-blue-700 mb-3">
              Last calibrated: 2 weeks ago
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Calibrate Now
            </button>
          </div>

          <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
            <h4 className="font-semibold text-orange-900 mb-2">Temperature</h4>
            <p className="text-sm text-orange-700 mb-3">
              Last calibrated: 1 month ago
            </p>
            <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Calibrate Now
            </button>
          </div>

          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <h4 className="font-semibold text-green-900 mb-2">Humidity</h4>
            <p className="text-sm text-green-700 mb-3">
              Last calibrated: 3 weeks ago
            </p>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Calibrate Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Activity Log Component
  const ActivityLog = () => (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
      <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
        <Bell className="w-6 h-6 mr-3 text-yellow-600" />
        Recent Activity
      </h3>

      <div className="space-y-4 max-h-80 overflow-y-auto">
        {mockLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-sm"
          >
            <div
              className={`p-2 rounded-full shadow-md ${
                log.status === "success" ? "bg-green-100" : "bg-yellow-100"
              }`}
            >
              {log.status === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900">{log.action}</p>
              <p className="text-gray-600">{log.message}</p>
              <p className="text-xs text-gray-400 mt-1">{log.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "system":
        return <SystemControlTab />;
      case "schedule":
        return <ScheduleTab />;
      case "notifications":
        return <NotificationsTab />;
      case "advanced":
        return <AdvancedTab />;
      default:
        return <SystemControlTab />;
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Tab Navigation */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#22C55E] text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:bg-white/50 hover:text-green-600 hover:shadow-md"
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Activity Log (shown on all tabs) */}
        <ActivityLog />

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <Save className="w-5 h-5 mr-2" />
            Save All Settings
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
