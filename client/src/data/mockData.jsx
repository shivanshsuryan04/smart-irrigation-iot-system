export const mockSensorData = [
  { time: '00:00', temperature: 22, humidity: 65, soilMoisture: 45 },
  { time: '04:00', temperature: 20, humidity: 70, soilMoisture: 42 },
  { time: '08:00', temperature: 25, humidity: 60, soilMoisture: 38 },
  { time: '12:00', temperature: 32, humidity: 45, soilMoisture: 30 },
  { time: '16:00', temperature: 35, humidity: 40, soilMoisture: 25 },
  { time: '20:00', temperature: 28, humidity: 55, soilMoisture: 35 },
];

export const mockLogs = [
  { id: 1, time: '2025-09-08 14:30:00', action: 'Pump activated', status: 'success', message: 'Soil moisture below threshold (25%)' },
  { id: 2, time: '2025-09-08 14:25:00', action: 'Data sync', status: 'success', message: 'ThingSpeak data updated' },
  { id: 3, time: '2025-09-08 14:20:00', action: 'Alert', status: 'warning', message: 'High temperature detected (35°C)' },
  { id: 4, time: '2025-09-08 14:15:00', action: 'Pump deactivated', status: 'success', message: 'Irrigation cycle completed' },
];