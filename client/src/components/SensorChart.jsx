import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BarChart3, Thermometer, Wind, Droplets } from 'lucide-react';

// Configuration for each metric
const metricConfig = {
  temperature: {
    name: 'Temperature',
    unit: '°C',
    color: '#f97316', // orange
    gradient: 'tempGradient',
    Icon: Thermometer,
  },
  humidity: {
    name: 'Humidity',
    unit: '%',
    color: '#3b82f6', // blue
    gradient: 'humidityGradient',
    Icon: Wind,
  },
  soilMoisture: {
    name: 'Soil Moisture',
    unit: '%',
    color: '#10b981', // green
    gradient: 'moistureGradient',
    Icon: Droplets,
  }
};

const SensorChart = ({ data, title, metric = 'temperature', chartType = 'line' }) => {
  const config = metricConfig[metric];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20">
          <p className="font-semibold text-gray-800 mb-2">{`Time: ${label}`}</p>
          <p className="text-sm" style={{ color: config.color }}>
            <span className="font-medium">{config.name}:</span> {payload[0].value}{config.unit}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate average
  const getAverage = () => {
    if (data.length === 0) return 0;
    const sum = data.reduce((sum, item) => sum + item[metric], 0);
    return (sum / data.length).toFixed(1);
  };
  const average = getAverage();

  // Render Line Chart
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id={config.gradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={config.color} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={config.color} stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" opacity={0.5} />
        <XAxis 
          dataKey="time" 
          stroke="#6b7280" 
          fontSize={12}
          tickLine={{ stroke: '#6b7280' }}
        />
        <YAxis 
          stroke="#6b7280" 
          fontSize={12}
          tickLine={{ stroke: '#6b7280' }}
          domain={['dataMin - 5', 'dataMax + 5']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey={metric} 
          stroke={config.color} 
          strokeWidth={3}
          name={config.name}
          dot={{ fill: config.color, strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7, strokeWidth: 2, stroke: config.color }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // Render Area Chart
  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id={config.gradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={config.color} stopOpacity={0.6}/>
            <stop offset="95%" stopColor={config.color} stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" opacity={0.5} />
        <XAxis 
          dataKey="time" 
          stroke="#6b7280" 
          fontSize={12}
          tickLine={{ stroke: '#6b7280' }}
        />
        <YAxis 
          stroke="#6b7280" 
          fontSize={12}
          tickLine={{ stroke: '#6b7280' }}
          domain={['dataMin - 5', 'dataMax + 5']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey={metric}
          stroke={config.color}
          fill={`url(#${config.gradient})`}
          strokeWidth={2}
          name={config.name}
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center text-gray-900">
          <config.Icon className="w-6 h-6 mr-3" style={{ color: config.color }} />
          {title}
        </h2>
        
        {/* Chart Type Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => {}} // You can add chart type switching logic here
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              chartType === 'line' 
                ? 'bg-white text-green-600 shadow-sm' 
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => {}} // You can add chart type switching logic here
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              chartType === 'area' 
                ? 'bg-white text-green-600 shadow-sm' 
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Area
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: config.color }}></div>
          <span className="text-gray-600">{config.name} ({config.unit})</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full">
        {chartType === 'area' ? renderAreaChart() : renderLineChart()}
      </div>

      {/* Chart Footer with Summary Stats */}
      <div className="grid grid-cols-1 gap-4 mt-6 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">Average {config.name}</p>
          <p className="font-bold text-lg" style={{ color: config.color }}>
            {average}{config.unit}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SensorChart;