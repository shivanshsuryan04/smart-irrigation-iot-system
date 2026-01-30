/*
 * Smart Irrigation System - Arduino Code
 * 
 * Hardware Connections:
 * - DHT11: Pin 2
 * - Soil Moisture: A0
 * - LCD: Pins 12,11,10,9,8,7
 * - Pump Relay: Pin 6
 * - Fan Relay: A1
 * - Buzzer: Pin 5
 * - Green LED: Pin 4
 * 
 * Serial Communication: 115200 baud
 * Format: <A[temp]> <B[humidity]> <C[moisture]> <X> (upload trigger)
 */

#include <SoftwareSerial.h>
#include <LiquidCrystal.h>
#include <dht.h>

// Initialize LCD (RS, EN, D4, D5, D6, D7)
LiquidCrystal lcd(12, 11, 10, 9, 8, 7);

// DHT11 Setup
#define DHT11_PIN 2
#define DHTTYPE DHT11
dht DHT;

// Pin Definitions
const int GREEN_LED = 4;
const int BUZZER = 5;
const int PUMP_RELAY = 6;
const int FAN_RELAY = A1;
const int SOIL_SENSOR = A0;

// Settings
int moistureThreshold = 50;  // Soil moisture threshold (%)
const unsigned long UPLOAD_INTERVAL = 15000;  // Upload every 15 seconds
unsigned long previousTime = 0;

// Sensor Variables
int soilMoisture = 0;
float temperature = 0;
float humidity = 0;

void setup() {
  // Serial Communication
  Serial.begin(115200);
  
  // Pin Modes
  pinMode(SOIL_SENSOR, INPUT);
  pinMode(PUMP_RELAY, OUTPUT);
  pinMode(FAN_RELAY, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  
  // Initial States
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(BUZZER, LOW);
  digitalWrite(PUMP_RELAY, LOW);
  digitalWrite(FAN_RELAY, LOW);
  
  // LCD Initialization
  lcd.begin(16, 2);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("IoT Agriculture");
  lcd.setCursor(0, 1);
  lcd.print("***  System ***");
  delay(2000);
  
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Initializing...");
  delay(1000);
}

void loop() {
  readSensorsAndDisplay();
  controlSystems();
  
  // Check if it's time to upload data
  unsigned long currentTime = millis();
  if (currentTime - previousTime >= UPLOAD_INTERVAL) {
    uploadData();
    previousTime = currentTime;
  }
  
  delay(500);  // Short delay between readings
}

void readSensorsAndDisplay() {
  // Read DHT11 sensor
  int chk = DHT.read11(DHT11_PIN);
  
  if (chk == DHTLIB_OK) {
    temperature = DHT.temperature;
    humidity = DHT.humidity;
  }
  
  // Read soil moisture sensor
  int soilRaw = analogRead(SOIL_SENSOR);
  soilMoisture = map(soilRaw, 0, 1023, 100, 0);  // Convert to percentage
  
  // Constrain values
  soilMoisture = constrain(soilMoisture, 0, 100);
  temperature = constrain(temperature, -40, 80);
  humidity = constrain(humidity, 0, 100);
  
  // Display on LCD
  lcd.clear();
  
  // Line 1: Soil Moisture
  lcd.setCursor(0, 0);
  lcd.print("Moisture: ");
  lcd.print(soilMoisture);
  lcd.print("%");
  
  // Line 2: Temperature and Humidity
  lcd.setCursor(0, 1);
  lcd.print("T:");
  lcd.print(temperature, 1);
  lcd.print((char)223);  // Degree symbol
  lcd.print("C ");
  
  lcd.setCursor(8, 1);
  lcd.print("H:");
  lcd.print(humidity, 0);
  lcd.print("%");
}

void controlSystems() {
  // Soil Moisture Control (Pump)
  if (soilMoisture < moistureThreshold) {
    // Soil is dry - start pump
    digitalWrite(PUMP_RELAY, HIGH);
    digitalWrite(BUZZER, HIGH);
    digitalWrite(GREEN_LED, LOW);
    delay(100);
    digitalWrite(BUZZER, LOW);
  } else {
    // Soil moisture is adequate - stop pump
    digitalWrite(PUMP_RELAY, LOW);
    digitalWrite(GREEN_LED, HIGH);
  }
  
  // Temperature Control (Fan - optional)
  if (temperature > 40) {
    // High temperature - activate fan/alert
    digitalWrite(FAN_RELAY, HIGH);
    digitalWrite(BUZZER, HIGH);
    delay(100);
    digitalWrite(BUZZER, LOW);
  } else {
    digitalWrite(FAN_RELAY, LOW);
  }
}

void uploadData() {
  // Blink LED to indicate upload
  digitalWrite(13, LOW);
  
  // Send temperature
  Serial.print("<A");
  Serial.print(temperature, 1);
  Serial.print(">");
  Serial.println();
  delay(50);
  
  // Send humidity
  Serial.print("<B");
  Serial.print(humidity, 1);
  Serial.print(">");
  Serial.println();
  delay(50);
  
  // Send soil moisture
  Serial.print("<C");
  Serial.print(soilMoisture);
  Serial.print(">");
  Serial.println();
  delay(50);
  
  // Trigger ESP8266 upload
  Serial.print("<X>");
  Serial.println();
  
  digitalWrite(13, HIGH);
}

// Function to update moisture threshold (can be called via serial)
void updateThreshold(int newThreshold) {
  if (newThreshold >= 0 && newThreshold <= 100) {
    moistureThreshold = newThreshold;
    
    // Show confirmation on LCD
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Threshold Set:");
    lcd.setCursor(0, 1);
    lcd.print(moistureThreshold);
    lcd.print("%");
    delay(2000);
  }
}