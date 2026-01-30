import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Thermometer,
  Wind,
  Droplets,
  Zap,
  ArrowRight,
  Activity,
  TrendingUp,
} from "lucide-react";
import Layout from "./Layout";
import StatCard from "./StatCard";
import SensorChart from "./SensorChart";
import { useAppContext } from "../context/AppContext";

const SmartIrrigationApp = () => {
  const navigate = useNavigate();
  const { currentData, settings, systemStatus, historicalData } = useAppContext();

  // Auto redirect to dashboard after 3 seconds (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Uncomment the line below if you want auto-redirect
      // navigate('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Quick stats for the overview
  const quickStats = [
    {
      label: "Active Sensors",
      value: "4",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Uptime",
      value: "99.8%",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Data Points",
      value: "1.2K+",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome to Smart Irrigation
                </h1>
                <p className="text-blue-100 mb-4">
                  Monitor and control your irrigation system with real-time IoT
                  data
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  {quickStats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2"
                    >
                      <p className="text-white/80 text-sm">{stat.label}</p>
                      <p className="text-white font-bold text-lg">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-black transition-colors flex items-center"
                  >
                    View Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                  <button
                    onClick={() => navigate("/settings")}
                    className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
                  >
                    System Settings
                  </button>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="hidden md:block">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      systemStatus.wifiConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-white/80">System Status</p>
                  <p className="font-bold">
                    {systemStatus.wifiConnected &&
                    systemStatus.thingSpeakConnected
                      ? "Online"
                      : "Offline"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-emerald-900"></div>

          {/* Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-400/10 rounded-full blur-3xl translate-y-24 -translate-x-24"></div>
        </div>

        {/* Current Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Thermometer}
            title="Current Temperature"
            value={currentData.temperature}
            unit="°C"
            color="bg-gradient-to-r from-orange-500 to-red-500"
            status={
              currentData.temperature > settings.temperatureAlert
                ? "high"
                : "normal"
            }
            trend={2.1}
          />
          <StatCard
            icon={Wind}
            title="Current Humidity"
            value={currentData.humidity}
            unit="%"
            color="bg-gradient-to-r from-blue-500 to-cyan-500"
            status="normal"
            trend={-0.5}
          />
          <StatCard
            icon={Droplets}
            title="Soil Moisture Level"
            value={currentData.soilMoisture}
            unit="%"
            color="bg-gradient-to-r from-green-500 to-emerald-500"
            status={
              currentData.soilMoisture < settings.moistureThreshold
                ? "low"
                : "normal"
            }
            trend={-2.3}
          />
          <StatCard
            icon={Zap}
            title="Irrigation System"
            value={currentData.pumpStatus ? "RUNNING" : "STANDBY"}
            color={
              currentData.pumpStatus
                ? "bg-gradient-to-r from-green-600 to-green-700"
                : "bg-gradient-to-r from-gray-500 to-gray-600"
            }
          />
        </div>

        {/* Quick Chart Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SensorChart
              data={historicalData.slice(-6)} // Show last 6 data points
              title="Recent Sensor Data (6 Hours)"
              chartType="line"
            />
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Quick Actions
            </h3>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group"
              >
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="font-medium text-blue-900">
                    View Full Dashboard
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/analytics")}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl hover:from-amber-100 hover:to-amber-200 transition-all duration-300 group"
              >
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-amber-600 mr-3" />
                  <span className="font-medium text-amber-900">
                    Analytics & Reports
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 group"
              >
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-green-600 mr-3" />
                  <span className="font-medium text-green-900">
                    System Controls
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* System Status Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-3">
                System Status
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">WiFi Connection</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      systemStatus.wifiConnected
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {systemStatus.wifiConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">ThingSpeak Sync</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      systemStatus.thingSpeakConnected
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {systemStatus.thingSpeakConnected ? "Active" : "Error"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Auto Mode</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      settings.autoMode
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {settings.autoMode ? "Enabled" : "Manual"}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Last update: {systemStatus.lastUpdate}
              </p>
            </div>
          </div>
        </div>

        {/* System Health Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-700">Sensors Active</p>
            <p className="text-xs text-gray-500">All systems operational</p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-700">Data Sync</p>
            <p className="text-xs text-gray-500">Real-time updates</p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="w-8 h-8 bg-amber-900 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-700">Automation</p>
            <p className="text-xs text-gray-500">Smart irrigation active</p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-700">Alerts</p>
            <p className="text-xs text-gray-500">No active warnings</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SmartIrrigationApp;
