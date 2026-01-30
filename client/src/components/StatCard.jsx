import React from 'react';

const StatCard = ({ icon: Icon, title, value, unit, color, status, trend }) => (
  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-4 rounded-2xl ${color} shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {status && (
        <div className="flex flex-col items-end space-y-1">
          <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-md ${
            status === 'normal' ? 'bg-green-100 text-green-800' : 
            status === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {status}
          </span>
          {trend && (
            <span className={`text-xs font-medium ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </span>
          )}
        </div>
      )}
    </div>
    <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
    <p className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
      {typeof value === 'number' ? value.toFixed(1) : value}
      {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
    </p>
  </div>
);

export default StatCard;