import serial
import time
from flask import Flask, jsonify, render_template

app = Flask(__name__)

# 아두이노에서 온도 데이터 읽기
def get_temperature():
    try:
        with serial.Serial('COM14', 9600, timeout=1) as arduino:  # 요청할 때만 포트 열기
            time.sleep(2)  # 안정적인 연결을 위해 대기
            arduino.write(b'R')  # 아두이노에 데이터 요청
            time.sleep(0.1)  # 응답 대기
            data = arduino.readline().decode().strip()  # 데이터 읽기
            return float(data)  # 숫자로 변환
    except (ValueError, serial.SerialException) as e:
        print("데이터 변환 오류:", e)
        return None  # 오류 발생 시 None 반환

# 웹페이지 표시
@app.route('/')
def index():
    return render_template('index.html')

# 온도 데이터 API (AJAX 요청 처리)
@app.route('/temperature')
def temperature():
    temp = get_temperature()
    return jsonify({'temperature': temp})

if __name__ == '__main__':
    app.run(debug=True, port=5000)