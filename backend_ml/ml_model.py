import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pickle
import os

class CropRecommendationModel:
    def __init__(self):
        self.model = None
        self.label_encoder = None
        self.feature_names = ['temperature', 'humidity', 'ph', 'rainfall']
        self.model_path = 'crop_recommendation_model.pkl'
        self.encoder_path = 'label_encoder.pkl'
        
    def train_model(self, csv_path='Crop_recommendation.csv'):
        """Train the crop recommendation model"""
        # Load dataset
        df = pd.read_csv(csv_path)
        
        # Prepare features and target
        X = df[self.feature_names]
        y = df['label']
        
        # Encode labels
        self.label_encoder = LabelEncoder()
        y_encoded = self.label_encoder.fit_transform(y)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y_encoded, test_size=0.2, random_state=42
        )
        
        # Train Random Forest model
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=20,
            random_state=42,
            n_jobs=-1
        )
        self.model.fit(X_train, y_train)
        
        # Calculate accuracy
        accuracy = self.model.score(X_test, y_test)
        print(f"Model trained with accuracy: {accuracy * 100:.2f}%")
        
        # Save model and encoder
        self.save_model()
        
        return accuracy
    
    def save_model(self):
        """Save the trained model and label encoder"""
        with open(self.model_path, 'wb') as f:
            pickle.dump(self.model, f)
        with open(self.encoder_path, 'wb') as f:
            pickle.dump(self.label_encoder, f)
        print("Model and encoder saved successfully!")
    
    def load_model(self):
        """Load the trained model and label encoder"""
        if os.path.exists(self.model_path) and os.path.exists(self.encoder_path):
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
            with open(self.encoder_path, 'rb') as f:
                self.label_encoder = pickle.load(f)
            print("Model and encoder loaded successfully!")
            return True
        else:
            print("Model files not found. Please train the model first.")
            return False
    
    def predict(self, temperature, humidity, ph, rainfall):
        """Predict crop recommendation"""
        if self.model is None or self.label_encoder is None:
            raise ValueError("Model not loaded. Please load or train the model first.")
        
        # Prepare input data
        input_data = pd.DataFrame({
            'temperature': [temperature],
            'humidity': [humidity],
            'ph': [ph],
            'rainfall': [rainfall]
        })
        
        # Make prediction
        prediction = self.model.predict(input_data)
        predicted_crop = self.label_encoder.inverse_transform(prediction)[0]
        
        # Get prediction probabilities
        probabilities = self.model.predict_proba(input_data)[0]
        
        # Get top 5 recommendations
        top_indices = np.argsort(probabilities)[::-1][:5]
        recommendations = []
        
        for idx in top_indices:
            crop_name = self.label_encoder.inverse_transform([idx])[0]
            confidence = float(probabilities[idx] * 100)
            recommendations.append({
                'crop': crop_name,
                'confidence': round(confidence, 2)
            })
        
        return {
            'recommended_crop': predicted_crop,
            'confidence': round(float(probabilities[prediction[0]] * 100), 2),
            'all_recommendations': recommendations
        }
    
    def get_crop_details(self, crop_name):
        """Get detailed information about a specific crop"""
        crop_info = {
            'rice': {
                'icon': '🌾',
                'season': 'monsoon',
                'water_requirement': 'very_high',
                'growth_period': '90-120 days',
                'optimal_temp': {'min': 20, 'max': 35},
                'optimal_humidity': {'min': 80, 'max': 95},
                'benefits': ['Staple food crop', 'High yield', 'MSP guarantee'],
                'description': 'Traditional paddy crop requiring flood irrigation.'
            },
            'maize': {
                'icon': '🌽',
                'season': 'summer',
                'water_requirement': 'medium',
                'growth_period': '60-90 days',
                'optimal_temp': {'min': 18, 'max': 27},
                'optimal_humidity': {'min': 55, 'max': 75},
                'benefits': ['Versatile crop', 'Good market demand', 'Drought resistant'],
                'description': 'Versatile cereal crop suitable for various climates.'
            },
            'chickpea': {
                'icon': '🫘',
                'season': 'winter',
                'water_requirement': 'low',
                'growth_period': '100-120 days',
                'optimal_temp': {'min': 17, 'max': 21},
                'optimal_humidity': {'min': 14, 'max': 20},
                'benefits': ['High protein', 'Nitrogen fixing', 'Premium prices'],
                'description': 'Protein-rich legume with excellent market value.'
            },
            'kidneybeans': {
                'icon': '🫘',
                'season': 'winter',
                'water_requirement': 'medium',
                'growth_period': '90-110 days',
                'optimal_temp': {'min': 15, 'max': 25},
                'optimal_humidity': {'min': 18, 'max': 25},
                'benefits': ['High nutrition', 'Good yield', 'Export potential'],
                'description': 'Nutritious legume with good export opportunities.'
            },
            'pigeonpeas': {
                'icon': '🫛',
                'season': 'monsoon',
                'water_requirement': 'medium',
                'growth_period': '120-180 days',
                'optimal_temp': {'min': 18, 'max': 37},
                'optimal_humidity': {'min': 30, 'max': 70},
                'benefits': ['Drought tolerant', 'Soil enriching', 'Multiple uses'],
                'description': 'Versatile pulse crop suitable for dry regions.'
            },
            'mothbeans': {
                'icon': '🫘',
                'season': 'summer',
                'water_requirement': 'low',
                'growth_period': '70-90 days',
                'optimal_temp': {'min': 24, 'max': 32},
                'optimal_humidity': {'min': 40, 'max': 65},
                'benefits': ['Drought resistant', 'Short duration', 'Nutritious'],
                'description': 'Drought-resistant legume ideal for arid regions.'
            },
            'mungbean': {
                'icon': '🫛',
                'season': 'summer',
                'water_requirement': 'medium',
                'growth_period': '60-75 days',
                'optimal_temp': {'min': 27, 'max': 30},
                'optimal_humidity': {'min': 80, 'max': 90},
                'benefits': ['Short duration', 'High protein', 'Easy to digest'],
                'description': 'Fast-growing pulse with excellent nutritional value.'
            },
            'blackgram': {
                'icon': '⚫',
                'season': 'summer/winter',
                'water_requirement': 'medium',
                'growth_period': '75-90 days',
                'optimal_temp': {'min': 25, 'max': 35},
                'optimal_humidity': {'min': 60, 'max': 70},
                'benefits': ['High protein', 'Multiple cropping', 'Good prices'],
                'description': 'Protein-rich pulse suitable for multiple seasons.'
            },
            'lentil': {
                'icon': '🫘',
                'season': 'winter',
                'water_requirement': 'low',
                'growth_period': '110-130 days',
                'optimal_temp': {'min': 18, 'max': 30},
                'optimal_humidity': {'min': 60, 'max': 70},
                'benefits': ['High protein', 'Good prices', 'Export quality'],
                'description': 'Premium pulse crop with excellent export potential.'
            },
            'pomegranate': {
                'icon': '🍎',
                'season': 'all season',
                'water_requirement': 'medium',
                'growth_period': '180-240 days',
                'optimal_temp': {'min': 18, 'max': 25},
                'optimal_humidity': {'min': 85, 'max': 95},
                'benefits': ['High value', 'Export demand', 'Medicinal properties'],
                'description': 'Premium fruit with excellent health benefits.'
            },
            'banana': {
                'icon': '🍌',
                'season': 'all season',
                'water_requirement': 'high',
                'growth_period': '300-365 days',
                'optimal_temp': {'min': 25, 'max': 30},
                'optimal_humidity': {'min': 75, 'max': 85},
                'benefits': ['Year-round production', 'High demand', 'Good returns'],
                'description': 'Tropical fruit crop with consistent market demand.'
            },
            'mango': {
                'icon': '🥭',
                'season': 'summer',
                'water_requirement': 'medium',
                'growth_period': '100-150 days',
                'optimal_temp': {'min': 27, 'max': 36},
                'optimal_humidity': {'min': 45, 'max': 55},
                'benefits': ['King of fruits', 'Export quality', 'Premium prices'],
                'description': 'Premium tropical fruit with excellent market value.'
            },
            'grapes': {
                'icon': '🍇',
                'season': 'summer/winter',
                'water_requirement': 'medium',
                'growth_period': '150-180 days',
                'optimal_temp': {'min': 9, 'max': 42},
                'optimal_humidity': {'min': 80, 'max': 84},
                'benefits': ['High value', 'Wine production', 'Export potential'],
                'description': 'Premium fruit with multiple commercial uses.'
            },
            'watermelon': {
                'icon': '🍉',
                'season': 'summer',
                'water_requirement': 'high',
                'growth_period': '70-100 days',
                'optimal_temp': {'min': 24, 'max': 27},
                'optimal_humidity': {'min': 80, 'max': 90},
                'benefits': ['High yield', 'Short duration', 'Good market'],
                'description': 'Refreshing summer fruit with quick returns.'
            },
            'muskmelon': {
                'icon': '🍈',
                'season': 'summer',
                'water_requirement': 'medium',
                'growth_period': '80-100 days',
                'optimal_temp': {'min': 27, 'max': 30},
                'optimal_humidity': {'min': 90, 'max': 95},
                'benefits': ['Premium prices', 'Aromatic', 'Export quality'],
                'description': 'Sweet aromatic fruit with good market value.'
            },
            'apple': {
                'icon': '🍎',
                'season': 'winter',
                'water_requirement': 'medium',
                'growth_period': '150-180 days',
                'optimal_temp': {'min': 21, 'max': 24},
                'optimal_humidity': {'min': 90, 'max': 95},
                'benefits': ['High value', 'Health benefits', 'Premium market'],
                'description': 'Premium temperate fruit with excellent health benefits.'
            },
            'orange': {
                'icon': '🍊',
                'season': 'winter',
                'water_requirement': 'medium',
                'growth_period': '240-300 days',
                'optimal_temp': {'min': 10, 'max': 35},
                'optimal_humidity': {'min': 90, 'max': 95},
                'benefits': ['Vitamin C rich', 'Long shelf life', 'Good prices'],
                'description': 'Citrus fruit with excellent nutritional value.'
            },
            'papaya': {
                'icon': '🍈',
                'season': 'all season',
                'water_requirement': 'medium',
                'growth_period': '270-365 days',
                'optimal_temp': {'min': 23, 'max': 44},
                'optimal_humidity': {'min': 90, 'max': 95},
                'benefits': ['Fast growing', 'Medicinal value', 'Good yield'],
                'description': 'Tropical fruit with medicinal properties.'
            },
            'coconut': {
                'icon': '🥥',
                'season': 'all season',
                'water_requirement': 'medium',
                'growth_period': '365+ days',
                'optimal_temp': {'min': 25, 'max': 30},
                'optimal_humidity': {'min': 90, 'max': 100},
                'benefits': ['Multiple products', 'Sustainable income', 'Long-term crop'],
                'description': 'Multi-purpose crop with diverse commercial applications.'
            },
            'cotton': {
                'icon': '☁️',
                'season': 'summer',
                'water_requirement': 'medium',
                'growth_period': '150-180 days',
                'optimal_temp': {'min': 22, 'max': 26},
                'optimal_humidity': {'min': 75, 'max': 85},
                'benefits': ['Cash crop', 'Textile industry', 'MSP support'],
                'description': 'Major cash crop with government support.'
            },
            'jute': {
                'icon': '🌿',
                'season': 'monsoon',
                'water_requirement': 'high',
                'growth_period': '120-150 days',
                'optimal_temp': {'min': 23, 'max': 27},
                'optimal_humidity': {'min': 70, 'max': 90},
                'benefits': ['Fiber crop', 'Eco-friendly', 'Good market'],
                'description': 'Natural fiber crop with sustainable applications.'
            },
            'coffee': {
                'icon': '☕',
                'season': 'monsoon',
                'water_requirement': 'medium',
                'growth_period': '180-240 days',
                'optimal_temp': {'min': 23, 'max': 28},
                'optimal_humidity': {'min': 50, 'max': 70},
                'benefits': ['Export crop', 'Premium prices', 'Aromatic'],
                'description': 'Premium plantation crop with excellent export value.'
            }
        }
        
        return crop_info.get(crop_name.lower(), {
            'icon': '🌱',
            'season': 'varies',
            'water_requirement': 'medium',
            'growth_period': 'varies',
            'optimal_temp': {'min': 20, 'max': 30},
            'optimal_humidity': {'min': 60, 'max': 80},
            'benefits': ['Agricultural crop', 'Market available'],
            'description': 'Agricultural crop suitable for farming.'
        })

# Initialize model instance
crop_model = CropRecommendationModel()

# Try to load existing model, if not found, train new one
if not crop_model.load_model():
    print("Training new model...")
    # Make sure to place Crop_recommendation.csv in the same directory
    crop_model.train_model()