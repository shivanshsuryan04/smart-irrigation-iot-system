#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// WiFi Configuration
const char* ssid = "ESP-01";
const char* password = "wifi12345";

// Backend Configuration
const char* backend_host = "192.168.1.100"; // Replace with your backend server IP
const int backend_port = 5000;
String backend_url = "http://192.168.1.100:5000"; // Replace with your backend URL

// ThingSpeak Configuration (backup)
const char* thingspeak_host = "api.thingspeak.com";
String thingspeak_api_key = "FZUPPMQIG9XCMWAD";
String thingspeak_path1 = "/update?key=" + thingspeak_api_key + "&field1=";
String thingspeak_path2 = "&field2=";
String thingspeak_path3 = "&field3=";

// Data variables
int temperature = 0;
int humidity = 0;
int moisture = 0;
bool use_backend = true; // Set to false to use ThingSpeak only

// Command parsing
char cmd_arr1[100];
int cmd_count1;
int i;

// Status LED
int status_led = 1;

// Function declarations
void serial_get_command();
void send_data_to_backend();
void send_data_to_thingspeak();
void blink_status(int count, int delay_ms = 200);
bool check_backend_connection();

void setup() {
  Serial.begin(115200);
  Serial.println("");
  
  pinMode(status_led, OUTPUT);
  digitalWrite(status_led, LOW);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    digitalWrite(status_led, !digitalRead(status_led)); // Blink while connecting
  }
  
  digitalWrite(status_led, HIGH);
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  // Test backend connection
  if (check_backend_connection()) {
    Serial.println("Backend server is reachable");
    blink_status(3, 100); // 3 fast blinks = backend OK
  } else {
    Serial.println("Backend server not reachable, using ThingSpeak only");
    use_backend = false;
    blink_status(2, 500); // 2 slow blinks = ThingSpeak only
  }
  
  Serial.println("System ready!");
}

void loop() {
  serial_get_command();
  
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected, attempting reconnect...");
    WiFi.begin(ssid, password);
    digitalWrite(status_led, LOW);
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
      delay(500);
      attempts++;
      digitalWrite(status_led, !digitalRead(status_led));
    }
    
    if (WiFi.status() == WL_CONNECTED) {
      digitalWrite(status_led, HIGH);
      Serial.println("WiFi reconnected!");
    }
  }
}

void serial_get_command() {
  char inchar = 0;
  if (Serial.available() > 0) {
    inchar = Serial.read();
    if (inchar == '<') {
      cmd_count1 = 0;
      while (inchar != '>' && cmd_count1 < 15) {
        if (Serial.available() > 0) {
          inchar = Serial.read();
          cmd_arr1[cmd_count1++] = inchar;
        }
      }
      if (inchar == '>') {
        if (cmd_arr1[0] == 'A') {
          cmd_arr1[0] = '0';
          temperature = atoi(cmd_arr1);
          Serial.print("Temperature: ");
          Serial.println(temperature);
        }
        else if (cmd_arr1[0] == 'B') {
          cmd_arr1[0] = '0';
          humidity = atoi(cmd_arr1);
          Serial.print("Humidity: ");
          Serial.println(humidity);
        }
        else if (cmd_arr1[0] == 'C') {
          cmd_arr1[0] = '0';
          moisture = atoi(cmd_arr1);
          Serial.print("Moisture: ");
          Serial.println(moisture);
        }
        else if (cmd_arr1[0] == 'X') {
          cmd_arr1[0] = '0';
          Serial.println("Uploading data...");
          
          // Try backend first, fallback to ThingSpeak
          if (use_backend) {
            if (!send_data_to_backend()) {
              Serial.println("Backend failed, trying ThingSpeak...");
              send_data_to_thingspeak();
            }
          } else {
            send_data_to_thingspeak();
          }
        }
      }
    }
  }
}

bool check_backend_connection() {
  WiFiClient client;
  HTTPClient http;
  
  String test_url = backend_url + "/api/system/status";
  http.begin(client, test_url);
  http.setTimeout(5000); // 5 second timeout
  
  int httpCode = http.GET();
  http.end();
  
  return (httpCode == 200);
}

bool send_data_to_backend() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected!");
    return false;
  }
  
  WiFiClient client;
  HTTPClient http;
  
  String url = backend_url + "/api/sensors/data";
  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(10000); // 10 second timeout
  
  // Create JSON payload
  String json_payload = "{";
  json_payload += "\"temperature\":" + String(temperature) + ",";
  json_payload += "\"humidity\":" + String(humidity) + ",";
  json_payload += "\"soilMoisture\":" + String(moisture);
  json_payload += "}";
  
  Serial.print("Sending to backend: ");
  Serial.println(json_payload);
  
  int httpCode = http.POST(json_payload);
  
  if (httpCode > 0) {
    String response = http.getString();
    Serial.print("Backend response (");
    Serial.print(httpCode);
    Serial.print("): ");
    Serial.println(response);
    
    // Parse response to check for auto irrigation trigger
    if (response.indexOf("autoIrrigationTriggered") > 0) {
      Serial.println("Auto irrigation may have been triggered!");
    }
    
    blink_status(2, 100); // 2 fast blinks = success
    http.end();
    return true;
  } else {
    Serial.print("Backend HTTP error: ");
    Serial.println(httpCode);
    blink_status(5, 50); // 5 very fast blinks = error
    http.end();
    return false;
  }
}

void send_data_to_thingspeak() {
  WiFiClient client;
  const int httpPort = 80;
  
  if (!client.connect(thingspeak_host, httpPort)) {
    Serial.println("ThingSpeak connection failed");
    blink_status(3, 200);
    return;
  }
  
  String url = thingspeak_path1 + temperature + thingspeak_path2 + humidity + thingspeak_path3 + moisture;
  
  client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + thingspeak_host + "\r\n" +
               "Connection: close\r\n\r\n");
  
  delay(1000);
  
  // Read response
  while(client.available()) {
    String line = client.readStringUntil('\r');
    if (line.indexOf("200 OK") > 0) {
      Serial.println("ThingSpeak upload successful");
      blink_status(1, 500); // 1 slow blink = ThingSpeak success
    }
  }
  
  client.stop();
}

void blink_status(int count, int delay_ms) {
  for (int i = 0; i < count; i++) {
    digitalWrite(status_led, LOW);
    delay(delay_ms);
    digitalWrite(status_led, HIGH);
    delay(delay_ms);
  }
}