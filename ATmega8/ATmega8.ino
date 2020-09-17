#include <Arduino.h>
//#include <IRremote.h>

#include "config.h"
#include "controls.h"

// TODO: add IR

void setup() {
    pinMode(BTN_LEFT, INPUT_PULLUP);
    pinMode(BTN_OK, INPUT_PULLUP);
    pinMode(BTN_CANCEL, INPUT_PULLUP);
    pinMode(BTN_RIGHT, INPUT_PULLUP);

    pinMode(LED, OUTPUT);
    pinMode(SOUND, OUTPUT);
    
    pinMode(FOCUS, OUTPUT);
    pinMode(SHOOT, OUTPUT);
}

void loop() {
    check_IR();
    check_buttons();
}
