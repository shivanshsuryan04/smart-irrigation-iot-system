import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Droplets, 
  Zap, 
  Calendar,
  Download,
  Filter,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Layout from '../components/Layout';
import { useAppContext } from '../context/AppContext';

const AnalyticsPage = () => {
  const { currentData } = useAppContext();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Mock analytics data
  const weeklyData = [
    { day: 'Mon', waterUsed: 45, efficiency: 92, pumpRuns: 6, avgTemp: 28 },
    { day: 'Tue', waterUsed: 52, efficiency: 89, pumpRuns: 8, avgTemp: 31 },
    { day: 'Wed', waterUsed: 38, efficiency: 95, pumpRuns: 5, avgTemp: 26 },
    { day: 'Thu', waterUsed: 48, efficiency: 91, pumpRuns: 7, avgTemp: 29 },
    { day: 'Fri', waterUsed: 55, efficiency: 87, pumpRuns: 9, avgTemp: 33 },
    { day: 'Sat', waterUsed: 42, efficiency: 94, pumpRuns: 6, avgTemp: 27 },
    { day: 'Sun', waterUsed: 39, efficiency: 96, pumpRuns: 5, avgTemp: 25 },
  ];

  const monthlyData = [
    { month: 'Jan', waterUsed: 1250, cost: 875, efficiency: 91 },
    { month: 'Feb', waterUsed: 1180, cost: 826, efficiency: 93 },
    { month: 'Mar', waterUsed: 1340, cost: 938, efficiency: 89 },
    { month: 'Apr', waterUsed: 1420, cost: 994, efficiency: 87 },
    { month: 'May', waterUsed: 1580, cost: 1106, efficiency: 85 },
    { month: 'Jun', waterUsed: 1650, cost: 1155, efficiency: 88 },
  ];

  const efficiencyData = [
    { name: 'Optimal', value: 65, color: '#10b981' },
    { name: 'Good', value: 25, color: '#3b82f6' },
    { name: 'Needs Attention', value: 10, color: '#f59e0b' },
  ];

  const pumpAnalytics = [
    { time: '6AM', runs: 2, duration: 15 },
    { time: '9AM', runs: 1, duration: 8 },
    { time: '12PM', runs: 3, duration: 25 },
    { time: '3PM', runs: 2, duration: 18 },
    { time: '6PM', runs: 1, duration: 12 },
    { time: '9PM', runs: 2, duration: 20 },
  ];

  // Analytics summary cards
  const analyticsCards = [
    {
      title: 'Total Water Saved',
      value: '2,450L',
      change: '+12.5%',
      trend: 'up',
      icon: Droplets,
      color: 'blue',
      description: 'Compared to manual irrigation'
    },
    {
      title: 'Energy Efficiency',
      value: '94.2%',
      change: '+5.8%',
      trend: 'up',
      icon: Zap,
      color: 'green',
      description: 'Average system efficiency'
    },
    {
      title: 'Cost Savings',
      value: '₹1,840',
      change: '+18.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'purple',
      description: 'Monthly savings achieved'
    },
    {
      title: 'System Uptime',
      value: '99.6%',
      change: '-0.2%',
      trend: 'down',
      icon: CheckCircle,
      color: 'emerald',
      description: 'Operational reliability'
    }
  ];

  const AnalyticsCard = ({ title, value, change, trend, icon: Icon, color, description }) => (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${
          color === 'blue' ? 'from-blue-500 to-blue-600' :
          color === 'green' ? 'from-green-500 to-green-600' :
          color === 'purple' ? 'from-purple-500 to-purple-600' :
          'from-emerald-500 to-emerald-600'
        }`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {change}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {entry.value}
              {entry.dataKey === 'waterUsed' && 'L'}
              {entry.dataKey === 'efficiency' && '%'}
              {entry.dataKey === 'cost' && '₹'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">Advanced insights and performance metrics</p>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
            {/* Period Selector */}
            <div className="flex bg-white/50 rounded-xl p-1">
              {['week', 'month', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedPeriod === period
                      ? 'bg-white text-green-600 shadow-md'
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
            
            {/* Export Button */}
            <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsCards.map((card, index) => (
            <AnalyticsCard key={index} {...card} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Water Usage Chart */}
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Water Usage & Efficiency</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Last 7 days</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" opacity={0.5} />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="waterUsed" fill="#3b82f6" name="Water Used" radius={[4, 4, 0, 0]} />
                <Bar dataKey="efficiency" fill="#10b981" name="Efficiency" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Efficiency Breakdown */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-bold text-gray-900 mb-6">System Efficiency</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={efficiencyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {efficiencyData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Trends */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" opacity={0.5} />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="waterUsed" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Water Used"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cost" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  name="Cost"
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pump Performance */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Pump Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pumpAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" opacity={0.5} />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="runs" fill="#10b981" name="Pump Runs" radius={[4, 4, 0, 0]} />
                <Bar dataKey="duration" fill="#8b5cf6" name="Duration (min)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
            Key Insights & Recommendations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Optimal Performance</h4>
                  <p className="text-sm text-green-700">
                    Your system is running 15% more efficiently than average smart irrigation systems.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start space-x-3">
                <Droplets className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Water Conservation</h4>
                  <p className="text-sm text-blue-700">
                    You've saved 2,450L of water this month compared to traditional irrigation.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">Optimization Tip</h4>
                  <p className="text-sm text-yellow-700">
                    Consider adjusting irrigation timing to early morning for better efficiency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics Table */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Metric</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Current</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Target</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-600">Water Efficiency</td>
                  <td className="py-3 px-4 font-medium">94.2%</td>
                  <td className="py-3 px-4 text-gray-600">90%</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Above Target
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-600">System Uptime</td>
                  <td className="py-3 px-4 font-medium">99.6%</td>
                  <td className="py-3 px-4 text-gray-600">99%</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Above Target
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-600">Average Response Time</td>
                  <td className="py-3 px-4 font-medium">2.3s</td>
                  <td className="py-3 px-4 text-gray-600">5s</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Above Target
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-600">Energy Consumption</td>
                  <td className="py-3 px-4 font-medium">24.5 kWh</td>
                  <td className="py-3 px-4 text-gray-600">30 kWh</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Below Target
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;