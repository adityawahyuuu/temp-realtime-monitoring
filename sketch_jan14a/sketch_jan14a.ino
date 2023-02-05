#include <ESP8266WiFi.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

#define DHTPIN 5                                                    // D1 ESP8266 PIN FOR DHT
#define DHTTYPE DHT22
// #define DHTTYPE DHT11

const char* ssid = "your wifi ssid";
const char* password = "your wifi pass";
const char* api = "your port forwarding ngrok api";
const char* poolServerName = "pool.ntp.org";
const int id = 3;
unsigned long dateTime;
float temperature, humidity;
int sensorData[2];
int* sensorArray;

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, poolServerName);
DHT dht(DHTPIN, DHTTYPE);

unsigned long getTime() {
  delay(60000);
  timeClient.update();
  unsigned long dateTime = timeClient.getEpochTime();
  return dateTime;
}

int* saveSensorData(void){
  static int MyArray[2]={temperature,humidity};
  return MyArray;
}

void getData(){
  sensorArray = saveSensorData();
  for (int i=0;i<2;i++){
    sensorData[i] = *(sensorArray+i);
  }
}

void postRequest(){
  if ((WiFi.status() == WL_CONNECTED)) {
    HTTPClient http;
    WiFiClient client;

    if (http.begin(client, api)) {
      getData();
      http.addHeader("Content-Type", "application/json");
      const int capacity = JSON_ARRAY_SIZE(10) + 2*JSON_OBJECT_SIZE(4);
      DynamicJsonDocument doc(capacity);
      JsonObject obj1 = doc.createNestedObject();
      obj1["id"] = id;
      obj1["dateTime"] = getTime();
      obj1["temperature"] = sensorData[0];
      obj1["humidity"] = sensorData[1];
  
      String json;
      serializeJson(doc, json);
      // String newJson = '['+json+']';
      
      // Serial.println(json);
      int httpCode = http.POST(json);
      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTP] POST... code: %d\n", httpCode);
  
        // file found at server
        if (httpCode == HTTP_CODE_OK) {
          const String& payload = http.getString();
          Serial.println("received payload:\n<<");
          Serial.println(payload);
          Serial.println(">>");
        }
      } else {
        Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
      }
      http.end();
      Serial.println("HTTP End");
    } else {
      Serial.printf("[HTTP} Unable to connect\n");
    }
  }
}

void setup(){
  Serial.begin(115200);
  WiFi.mode(WIFI_OFF);
  delay(1000);
  WiFi.mode(WIFI_STA);

  WiFi.begin(ssid, password);
  Serial.println("");

  Serial.print("Connecting");
  while(WiFi.status() != WL_CONNECTED){
    delay(100);
    Serial.print(".");
  };

  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());  //IP address assigned to your ESP

  dht.begin();
  timeClient.begin();
}

void loop(){
  Serial.println("Read Data");
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }
  Serial.println(temperature);
  Serial.println(humidity);

  postRequest();
}
