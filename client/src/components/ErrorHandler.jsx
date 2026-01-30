// src/components/ErrorHandler.jsx
import React from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ErrorHandler = () => {
  const { error, loading, connectionStatus, clearError, refreshSystemStatus } = useAppContext();

  if (!error && connectionStatus.isConnected) {
    return null; // No error to display
  }

  const handleRetry = async () => {
    clearError();
    try {
      await refreshSystemStatus();
    } catch (err) {
      console.error('Retry failed:', err);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      {/* Connection Status Banner */}
      {!connectionStatus.isConnected && (
        <div className="bg-amber-500 text-white p-4 rounded-lg shadow-lg mb-4 animate-pulse">
          <div className="flex items-center">
            <WifiOff className="w-5 h-5 mr-3" />
            <div>
              <h4 className="font-semibold">Connection Issues</h4>
              <p className="text-sm text-amber-100">
                {!connectionStatus.hasWifi && "WiFi disconnected. "}
                {!connectionStatus.hasThingSpeak && "ThingSpeak sync failed."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold mb-1">System Error</h4>
              <p className="text-sm text-red-100 mb-3">{error}</p>
              <div className="flex space-x-2">
                <button
                  onClick={handleRetry}
                  disabled={loading}
                  className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  Retry
                </button>
                <button
                  onClick={clearError}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offline Mode Banner */}
      {!error && !connectionStatus.isConnected && (
        <div className="bg-gray-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Wifi className="w-5 h-5 mr-3" />
            <div>
              <h4 className="font-semibold">Offline Mode</h4>
              <p className="text-sm text-gray-300">
                Displaying cached data. Last update: {connectionStatus.lastUpdate}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorHandler;