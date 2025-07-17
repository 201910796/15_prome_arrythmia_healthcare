#include <Wire.h>
#include <Adafruit_MLX90614.h>

Adafruit_MLX90614 mlx = Adafruit_MLX90614();

void setup() {
  Serial.begin(9600);        // 시리얼 통신 시작
  mlx.begin();               // MLX90614 초기화
}

void loop() {
  if (Serial.available()) {            // 파이썬에서 명령이 올 때까지 대기
    char command = Serial.read();      // 한 글자 읽기

    if (command == 'R') {              // 'R' 명령이 오면
      float temp = mlx.readObjectTempC();   // 체온 읽기
      Serial.println(temp);                // 파이썬으로 전송
    }
}
}