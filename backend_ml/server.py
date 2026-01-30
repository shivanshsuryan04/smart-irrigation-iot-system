from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import uvicorn
from ml_model import crop_model
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Smart Irrigation API", version="2.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class CropPredictionRequest(BaseModel):
    temperature: float = Field(..., ge=-10, le=50, description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Humidity percentage")
    ph: float = Field(..., ge=0, le=14, description="Soil pH level")
    rainfall: float = Field(..., ge=0, le=500, description="Rainfall in mm")

class CropPredictionResponse(BaseModel):
    recommended_crop: str
    confidence: float
    all_recommendations: List[Dict[str, Any]]
    crop_details: Dict[str, Any]
    input_parameters: Dict[str, float]

class SensorDataRequest(BaseModel):
    temperature: float
    humidity: float
    soilMoisture: float

class SettingsRequest(BaseModel):
    autoMode: Optional[bool] = None
    moistureThreshold: Optional[int] = None
    irrigationDuration: Optional[int] = None
    temperatureAlert: Optional[int] = None

# In-memory storage (in production, use a database)
latest_sensor_data = {
    'temperature': 28.5,
    'humidity': 62,
    'soilMoisture': 35,
    'pumpStatus': False,
    'timestamp': None,
    'wifiConnected': True,
    'thingSpeakConnected': True
}

system_settings = {
    'autoMode': True,
    'moistureThreshold': 30,
    'irrigationDuration': 15,
    'temperatureAlert': 35
}

# ML Model endpoints
@app.post("/api/ml/predict-crop", response_model=CropPredictionResponse)
async def predict_crop(request: CropPredictionRequest):
    """
    Predict the best crop based on environmental conditions
    """
    try:
        # Make prediction
        prediction = crop_model.predict(
            temperature=request.temperature,
            humidity=request.humidity,
            ph=request.ph,
            rainfall=request.rainfall
        )
        
        # Get crop details
        crop_details = crop_model.get_crop_details(prediction['recommended_crop'])
        
        return {
            'recommended_crop': prediction['recommended_crop'],
            'confidence': prediction['confidence'],
            'all_recommendations': prediction['all_recommendations'],
            'crop_details': crop_details,
            'input_parameters': {
                'temperature': request.temperature,
                'humidity': request.humidity,
                'ph': request.ph,
                'rainfall': request.rainfall
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/api/ml/predict-with-sensors")
async def predict_with_current_sensors(ph: float = 6.5, rainfall: float = 100):
    """
    Predict crop using current sensor data from IoT system
    Requires pH and rainfall as query parameters
    """
    try:
        # Use current sensor data
        prediction = crop_model.predict(
            temperature=latest_sensor_data['temperature'],
            humidity=latest_sensor_data['humidity'],
            ph=ph,
            rainfall=rainfall
        )
        
        crop_details = crop_model.get_crop_details(prediction['recommended_crop'])
        
        return {
            'success': True,
            'data': {
                'recommended_crop': prediction['recommended_crop'],
                'confidence': prediction['confidence'],
                'all_recommendations': prediction['all_recommendations'],
                'crop_details': crop_details,
                'sensor_data_used': {
                    'temperature': latest_sensor_data['temperature'],
                    'humidity': latest_sensor_data['humidity'],
                    'ph': ph,
                    'rainfall': rainfall
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ml/crop-info/{crop_name}")
async def get_crop_info(crop_name: str):
    """
    Get detailed information about a specific crop
    """
    try:
        crop_details = crop_model.get_crop_details(crop_name)
        if not crop_details:
            raise HTTPException(status_code=404, detail="Crop not found")
        
        return {
            'success': True,
            'data': {
                'crop_name': crop_name,
                'details': crop_details
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ml/available-crops")
async def get_available_crops():
    """
    Get list of all crops the model can predict
    """
    try:
        if crop_model.label_encoder is None:
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        crops = crop_model.label_encoder.classes_.tolist()
        crop_list = []
        
        for crop in crops:
            details = crop_model.get_crop_details(crop)
            crop_list.append({
                'name': crop,
                'icon': details.get('icon', '🌱'),
                'season': details.get('season', 'varies'),
                'water_requirement': details.get('water_requirement', 'medium')
            })
        
        return {
            'success': True,
            'data': {
                'total_crops': len(crops),
                'crops': crop_list
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Original sensor endpoints
@app.get("/api/sensors/current")
async def get_current_sensors():
    """Get current sensor data"""
    return {
        'success': True,
        'data': latest_sensor_data
    }

@app.post("/api/sensors/data")
async def update_sensor_data(data: SensorDataRequest):
    """Update sensor data from ESP8266"""
    global latest_sensor_data
    
    latest_sensor_data.update({
        'temperature': data.temperature,
        'humidity': data.humidity,
        'soilMoisture': data.soilMoisture,
        'timestamp': None  # Will be set by timestamp library
    })
    
    # Auto irrigation logic
    auto_irrigation = False
    if system_settings['autoMode'] and data.soilMoisture < system_settings['moistureThreshold']:
        if not latest_sensor_data['pumpStatus']:
            latest_sensor_data['pumpStatus'] = True
            auto_irrigation = True
    
    return {
        'success': True,
        'message': 'Sensor data received',
        'autoIrrigationTriggered': auto_irrigation
    }

@app.get("/api/settings")
async def get_settings():
    """Get system settings"""
    return {
        'success': True,
        'data': system_settings
    }

@app.post("/api/settings")
async def update_settings(settings: SettingsRequest):
    """Update system settings"""
    global system_settings
    
    update_dict = settings.dict(exclude_unset=True)
    system_settings.update(update_dict)
    
    return {
        'success': True,
        'data': system_settings,
        'message': 'Settings updated successfully'
    }

@app.post("/api/pump/toggle")
async def toggle_pump():
    """Manual pump control"""
    if system_settings['autoMode']:
        raise HTTPException(
            status_code=400,
            detail='Cannot control pump manually while auto mode is enabled'
        )
    
    latest_sensor_data['pumpStatus'] = not latest_sensor_data['pumpStatus']
    
    return {
        'success': True,
        'data': {
            'pumpStatus': latest_sensor_data['pumpStatus'],
            'message': f"Pump {'started' if latest_sensor_data['pumpStatus'] else 'stopped'}"
        }
    }

@app.get("/api/system/status")
async def get_system_status():
    """Get system status"""
    return {
        'success': True,
        'data': {
            'wifiConnected': latest_sensor_data['wifiConnected'],
            'thingSpeakConnected': latest_sensor_data['thingSpeakConnected'],
            'lastUpdate': latest_sensor_data.get('timestamp'),
            'uptime': 0  # Calculate actual uptime
        }
    }

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "Smart Irrigation System API with ML",
        "version": "2.0",
        "endpoints": {
            "ml": "/api/ml/predict-crop",
            "sensors": "/api/sensors/current",
            "settings": "/api/settings",
            "pump": "/api/pump/toggle"
        }
    }

if __name__ == "__main__":
    # Make sure the model is trained before starting
    if not os.path.exists('crop_recommendation_model.pkl'):
        print("Training ML model for the first time...")
        crop_model.train_model('Crop_recommendation.csv')
    
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

# python -m uvicorn server:app --reload --port 8000
# The above command can be used to run the server during development.