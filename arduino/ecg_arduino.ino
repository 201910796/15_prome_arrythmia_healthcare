const int ECG_PIN = A0;    // 센서 출력
const int LO_PLUS = 10;    // 전극 분리 감지
const int LO_MINUS = 11;

void setup() {
  Serial.begin(9600);
  pinMode(LO_PLUS, INPUT);
  pinMode(LO_MINUS, INPUT);
  Serial.println("LABEL,Time,ECG");
}

void loop() {
  if (digitalRead(LO_PLUS) == 1 || digitalRead(LO_MINUS) == 1) {
    Serial.println("DATA,TIME,0"); // 전극 분리 시 0 출력
  } else {
    int ecg = analogRead(ECG_PIN);
    Serial.print("DATA,TIME,");
    Serial.println(ecg);
  }

  delay(4);  // 약 250Hz 샘플링 (MIT-BIH와 유사)
}
