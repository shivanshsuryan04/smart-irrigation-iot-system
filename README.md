# Smart Irrigation IoT System

A full-stack IoT-based Smart Irrigation System that automates irrigation and provides machine-learning–based crop recommendations using real-time sensor data and a web-based dashboard.

---

## Project Overview

The Smart Irrigation IoT System is designed to reduce water wastage and improve agricultural decision-making by integrating IoT hardware, cloud-based data platforms, backend services, machine learning, and a modern frontend interface.

The system collects real-time environmental data using physical sensors connected to an Arduino-based irrigation module. Sensor data is transmitted through an ESP8266 Wi-Fi module to the ThingSpeak cloud platform for real-time storage and visualization. The backend server retrieves this data via APIs, processes it using a machine learning model for crop recommendation and irrigation insights, and presents the results on a responsive web-based dashboard.

---

## System Architecture

The project is divided into three major layers:

### IoT Layer
- Arduino controls irrigation hardware and sensor interfacing  
- ESP8266 manages Wi-Fi connectivity and data transmission  

### Backend and Machine Learning Layer
- Node.js and Express.js handle API requests and data flow  
- Python-based machine learning model predicts crop suitability based on input parameters  

### Frontend Layer
- React.js dashboard for real-time monitoring and analytics  
- Responsive user interface built with Tailwind CSS  

---

## Key Features

- Real-time sensor data monitoring  
- Automated smart irrigation control  
- Machine-learning–based crop recommendation  
- Interactive analytics dashboard  
- Modular and scalable architecture  
- REST API–based backend communication  

---

## Technology Stack

### Frontend
- React.js  
- Tailwind CSS  
- Context API  

### Backend
- Node.js  
- Express.js  

### Machine Learning
- Python  
- Flask  
- Scikit-learn  

### IoT Hardware
- Arduino  
- ESP8266  

---

## Project Structure

```text 
Smart_Irrigation_System/
│
├── arduino/          Arduino irrigation control code
├── esp8266/          ESP8266 Wi-Fi communication code
├── backend_ml/       Machine learning model and prediction server
├── client/           React frontend dashboard
├── server/           Node.js backend server
├── .gitignore
└── README.md
```

---

## Setup Instructions

### Clone the Repository

```bash
git clone https://github.com/shivanshsuryan04/smart-irrigation-iot-system.git
cd smart-irrigation-iot-system
```

---

### Frontend Setup

```bash
cd client
npm install
npm start
```

---

### Backend Setup

```bash
cd server
npm install
node server.js
```

---

### Machine Learning Server Setup

```bash
cd backend_ml
python server.py
```

---

## Additional Notes

* Dependency folders, environment files, and cache files are intentionally excluded from version control
* Sensor data can be simulated if physical hardware is not connected
* The system is designed to be extensible and adaptable to cloud deployment

---

## Future Enhancements

* Cloud deployment for frontend and backend services
* Mobile application integration
* Real-time database integration
* Advanced machine learning models for yield prediction

---

## Author

Shivansh Suryan
* GitHub: [https://github.com/shivanshsuryan04](https://github.com/shivanshsuryan04)
* LinkedIn: [https://www.linkedin.com/in/shivanshsuryan04](https://www.linkedin.com/in/shivanshsuryan04)
