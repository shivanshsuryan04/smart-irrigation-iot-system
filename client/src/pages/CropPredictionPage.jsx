import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Thermometer, 
  Droplets, 
  Sun, 
  CloudRain,
  Beaker,
  TrendingUp,
  Star,
  Info,
  Loader,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import Layout from '../components/Layout';
import { useAppContext } from '../context/AppContext';

const CropPredictionPage = () => {
  const { currentData } = useAppContext();
  
  // Form state
  const [formData, setFormData] = useState({
    temperature: currentData.temperature || 25,
    humidity: currentData.humidity || 60,
    ph: 6.5,
    rainfall: 100
  });
  
  // Prediction state
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableCrops, setAvailableCrops] = useState([]);

  // Fetch available crops on mount
  useEffect(() => {
    fetchAvailableCrops();
  }, []);

  // Update form with current sensor data
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      temperature: currentData.temperature || prev.temperature,
      humidity: currentData.humidity || prev.humidity
    }));
  }, [currentData]);

  const fetchAvailableCrops = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/ml/available-crops');
      const data = await response.json();
      if (data.success) {
        setAvailableCrops(data.data.crops);
      }
    } catch (err) {
      console.error('Failed to fetch crops:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/ml/predict-crop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Prediction failed');
      }
      
      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const useSensorData = () => {
    setFormData(prev => ({
      ...prev,
      temperature: currentData.temperature,
      humidity: currentData.humidity
    }));
  };

  const resetForm = () => {
    setFormData({
      temperature: 25,
      humidity: 60,
      ph: 6.5,
      rainfall: 100
    });
    setPrediction(null);
    setError(null);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-blue-600';
    if (confidence >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBg = (confidence) => {
    if (confidence >= 80) return 'bg-green-100';
    if (confidence >= 60) return 'bg-blue-100';
    if (confidence >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <Sparkles className="w-8 h-8 mr-3" />
              <h1 className="text-3xl font-bold">AI Crop Prediction</h1>
            </div>
            <p className="text-green-100 text-lg mb-2">
              Get intelligent crop recommendations based on environmental conditions
            </p>
            <p className="text-green-200 text-sm">
              Using Machine Learning trained on {availableCrops.length}+ crop varieties
            </p>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Input Parameters</h2>
              <button
                onClick={useSensorData}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <Thermometer className="w-4 h-4 mr-2" />
                Use Sensor Data
              </button>
            </div>

            <div className="space-y-6">
              {/* Temperature */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Thermometer className="w-4 h-4 mr-2 text-orange-500" />
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  min="-10"
                  max="50"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Min: -10°C</span>
                  <span>Current: {formData.temperature}°C</span>
                  <span>Max: 50°C</span>
                </div>
              </div>

              {/* Humidity */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Droplets className="w-4 h-4 mr-2 text-blue-500" />
                  Humidity (%)
                </label>
                <input
                  type="number"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Min: 0%</span>
                  <span>Current: {formData.humidity}%</span>
                  <span>Max: 100%</span>
                </div>
              </div>

              {/* pH Level */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Beaker className="w-4 h-4 mr-2 text-purple-500" />
                  Soil pH Level
                </label>
                <input
                  type="number"
                  name="ph"
                  value={formData.ph}
                  onChange={handleInputChange}
                  min="0"
                  max="14"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Acidic (0-7)</span>
                  <span>Current: {formData.ph}</span>
                  <span>Alkaline (7-14)</span>
                </div>
              </div>

              {/* Rainfall */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <CloudRain className="w-4 h-4 mr-2 text-cyan-500" />
                  Rainfall (mm)
                </label>
                <input
                  type="number"
                  name="rainfall"
                  value={formData.rainfall}
                  onChange={handleInputChange}
                  min="0"
                  max="500"
                  step="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Dry: 0mm</span>
                  <span>Current: {formData.rainfall}mm</span>
                  <span>Heavy: 500mm</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handlePredict}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Predict Crop
                    </>
                  )}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900">Prediction Failed</h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Prediction Results */}
            {prediction ? (
              <>
                {/* Main Recommendation */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Best Recommendation</h3>
                    <Star className="w-6 h-6" />
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="text-6xl mr-4">{prediction.crop_details?.icon || '🌱'}</div>
                    <div>
                      <h2 className="text-3xl font-bold capitalize">{prediction.recommended_crop}</h2>
                      <div className="flex items-center mt-2">
                        <div className={`px-3 py-1 rounded-full ${getConfidenceBg(prediction.confidence)} ${getConfidenceColor(prediction.confidence)} text-sm font-bold`}>
                          {prediction.confidence}% Confidence
                        </div>
                      </div>
                    </div>
                  </div>

                  {prediction.crop_details && (
                    <div className="space-y-2 bg-white/20 rounded-lg p-4 mt-4">
                      <p className="text-sm text-green-100">{prediction.crop_details.description}</p>
                      <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                        <div>
                          <span className="text-green-200">Season:</span>
                          <span className="ml-2 font-semibold capitalize">{prediction.crop_details.season}</span>
                        </div>
                        <div>
                          <span className="text-green-200">Water:</span>
                          <span className="ml-2 font-semibold capitalize">{prediction.crop_details.water_requirement}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-green-200">Growth Period:</span>
                          <span className="ml-2 font-semibold">{prediction.crop_details.growth_period}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Alternative Recommendations */}
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Top 5 Alternatives
                  </h3>
                  
                  <div className="space-y-3">
                    {prediction.all_recommendations?.slice(0, 5).map((rec, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold mr-3">
                            {index + 1}
                          </div>
                          <span className="font-semibold text-gray-900 capitalize">{rec.crop}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full ${getConfidenceBg(rec.confidence)} ${getConfidenceColor(rec.confidence)} text-xs font-bold`}>
                          {rec.confidence.toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                {prediction.crop_details?.benefits && (
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Key Benefits
                    </h3>
                    <ul className="space-y-2">
                      {prediction.crop_details.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-12 shadow-lg border border-white/20 text-center">
                <Leaf className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Prediction Yet</h3>
                <p className="text-gray-500">
                  Enter your environmental parameters and click "Predict Crop" to get AI-powered recommendations
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">How it works</h4>
              <p className="text-sm text-blue-700 mb-2">
                Our AI model analyzes temperature, humidity, soil pH, and rainfall patterns to recommend the most suitable crops for your conditions.
              </p>
              <p className="text-sm text-blue-700">
                The model has been trained on thousands of crop samples and achieves over 99% accuracy in crop recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CropPredictionPage;