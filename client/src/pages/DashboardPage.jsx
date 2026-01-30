import React from "react";
import { Thermometer, Wind, Droplets, Zap } from "lucide-react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import SensorChart from "../components/SensorChart";
import { useAppContext } from "../context/AppContext";

const DashboardPage = () => {
  const { currentData, settings, historicalData } = useAppContext();

  return (
    <Layout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Thermometer}
            title="Temperature"
            value={currentData.temperature}
            unit="°C"
            color="bg-gradient-to-r from-orange-500 to-red-500"
            status={
              currentData.temperature > settings.temperatureAlert
                ? "high"
                : "normal"
            }
            trend={2.5}
          />
          <StatCard
            icon={Wind}
            title="Humidity"
            value={currentData.humidity}
            unit="%"
            color="bg-gradient-to-r from-blue-500 to-cyan-500"
            status="normal"
            trend={-1.2}
          />
          <StatCard
            icon={Droplets}
            title="Soil Moisture"
            value={currentData.soilMoisture}
            unit="%"
            color="bg-gradient-to-r from-green-500 to-emerald-500"
            status={
              currentData.soilMoisture < settings.moistureThreshold
                ? "low"
                : "normal"
            }
            trend={-3.1}
          />
          <StatCard
            icon={Zap}
            title="Pump Status"
            value={currentData.pumpStatus ? "ACTIVE" : "INACTIVE"}
            color={
              currentData.pumpStatus
                ? "bg-gradient-to-r from-green-600 to-green-700"
                : "bg-gradient-to-r from-gray-500 to-gray-600"
            }
          />
        </div>

        {/* Charts Grid */}
        <div className="space-y-6">
          <SensorChart
            data={historicalData}
            title="Temperature"
            metric="temperature"
          />
          <SensorChart
            data={historicalData}
            title="Humidity"
            metric="humidity"
          />
          <SensorChart
            data={historicalData}
            title="Soil Moisture"
            metric="soilMoisture"
          />
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
