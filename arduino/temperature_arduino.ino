#define TMP36_PIN A0  // TMP36 센서를 A0 핀에 연결

void setup() {
    Serial.begin(9600);  // 시리얼 통신 시작
}

void loop() {
    if (Serial.available()) {  // Python에서 데이터 요청이 왔을 때
        char command = Serial.read();  // 한 글자 읽기

        if (command == 'R') {  // 'R'을 받으면 온도 전송
            float voltage = analogRead(TMP36_PIN) * (5.0 / 1023.0);  // 센서 전압 변환 (5V 기준)
            float temperature = (voltage - 0.5) * 100.0;  // TMP36 온도 변환 공식

            Serial.println(temperature);  // 변환된 온도값 전송
        }
    }
}