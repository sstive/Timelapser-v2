#include <Arduino.h>
#include <ESP8266WiFi.h>

#include "esp8266.h"

// Creating server
WiFiServer server(80);

void setup() {
    Serial.begin(115200);
    
    /* Initialising pins */
    // Photo
    pinMode(FOCUS, OUTPUT);
    pinMode(SHOOT, OUTPUT);
    // Button
    pinMode(BTN, INPUT_PULLUP);
    // LED
    pinMode(LED, OUTPUT);
    /* ----------------- */

    /* Connecting to wifi */
    // TODO: Get ssid and password from eeprom and connect to wifi or create hotspot
    /* ------------------ */

    // Starting server
    server.begin();
}

void loop() {

}