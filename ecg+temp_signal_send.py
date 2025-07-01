'''
- get_ecg_prediction : 아두이노에서 심전도 신호를 받아와 가장 형태가 좋은 심전도 파형의 신호값과 파형 5개를 시각화하여 경로(SAVE_PATH_ECG)에 저장 
                    이후 5개의 파형을 모델에 각각 입력해 다수결로 부정맥 판별
⇒반환값:  부정맥 판별 결과
    
- get_temperature : 아두이노에서 체온 값을 받아옴
    
⇒반환값: 소수점 한자리 체온
    
- dev_get_data : 사용자로부터  체온과 ECG 라벨 인덱스를 입력받아 그대로 반환 |
    - 데모데이에 다양한 부정맥 시연과 개발과정에서 아두이노 기기를 사용하지 못하는 상황에서 개발용으로 사용
=>반환값: 체온과 부정맥 판별 결과

'''



import numpy as np
import pandas as pd
import serial
import time
from collections import deque
from scipy.signal import butter, filtfilt, iirnotch, find_peaks
from tensorflow.keras.models import load_model
import matplotlib.pyplot as plt
import os
import datetime

# ===== 공통 설정 =====
ECG_SERIAL_PORT   = 'COM3'
ECG_BAUD_RATE     = 9600
TEMP_SERIAL_PORT  = 'COM14'
TEMP_BAUD_RATE    = 9600
MODEL_PATH        = r"C:\Users\user\python_project\AI_healthcare_pr\15_prome_arrythmia_healthcare\models\arrythmia_prediction_model.keras"
BUFFER_SIZE       = 1000
WINDOW_SIZE       = 187
TOP_K             = 5
FS                = 250  # 샘플링 주파수(Hz)
SAVE_PATH_ECG     = r'C:\Users\user\python_project\AI_healthcare_pr\saved_ecg_windows'
os.makedirs(SAVE_PATH_ECG, exist_ok=True)

# 예측 라벨 한글로
label_dict = {
    0: '정상',
    1: '심방성 부정맥',
    2: '심실성 부정맥',
    3: '융합 박동',
    4: '알 수 없음'
}

# ===== ECG 필터링 함수 =====
def filter_ecg(signal, fs=FS):
    b1, a1 = butter(N=4, Wn=1/(fs/2), btype='high')
    hp = filtfilt(b1, a1, signal)
    b2, a2 = iirnotch(w0=60/(fs/2), Q=30)
    return filtfilt(b2, a2, hp)

# ===== ECG 예측 및 저장 함수 =====
def get_ecg_prediction(serial_port=ECG_SERIAL_PORT, baud_rate=ECG_BAUD_RATE):
    model = load_model(MODEL_PATH)
    buffer = deque(maxlen=BUFFER_SIZE)

    # 1) ECG 데이터 수집
    try:
        with serial.Serial(serial_port, baud_rate, timeout=1) as ser:
            while len(buffer) < BUFFER_SIZE:
                line = ser.readline().decode('utf-8', errors='replace').strip()
                if not line or 'DATA' not in line:
                    continue
                try:
                    val = int(line.split(',')[-1])
                except ValueError:
                    continue
                buffer.append(val)
                print(f"⏳ 수집 중... ({len(buffer)}/{BUFFER_SIZE})")
    except serial.SerialException as e:
        raise RuntimeError(f"ECG 시리얼 연결 오류: {e}")

    # 2) 전처리
    signal   = np.array(buffer)
    filtered = filter_ecg(signal)
    norm     = (filtered - filtered.mean()) / filtered.std()

    # 3) R-peak 검출
    peaks, props = find_peaks(norm, height=0.3, distance=int(0.25*FS), prominence=0.4)
    print(f"✅ 전체 R파 개수: {len(peaks)}")
    if len(peaks) == 0:
        raise RuntimeError("ECG: R파를 찾을 수 없습니다.")

    # 4) 상위 TOP_K개 선택
    top_idx   = np.argsort(props["prominences"])[-TOP_K:]
    top_peaks = peaks[top_idx]

    # 5) 윈도우별 저장 & 예측 & 시각화 저장
    preds = []
    for i, p in enumerate(top_peaks, start=1):
        start = p - WINDOW_SIZE//2
        end   = p + WINDOW_SIZE//2 + 1
        if start < 0 or end > len(norm):
            print(f"❗ 윈도우 {i} 슬라이싱 불가: start={start}, end={end}")
            continue
        win = norm[start:end]
        if len(win) != WINDOW_SIZE:
            print(f"⚠️ 윈도우 {i} 길이 {len(win)} → 건너뜀")
            continue

        # CSV 저장
        ts = datetime.datetime.now().strftime('%Y%m%d_%H%M%S_%f')
        csv_name = f"ecg_window_{i}_{ts}.csv"
        csv_path = os.path.join(SAVE_PATH_ECG, csv_name)
        pd.DataFrame(win).T.to_csv(csv_path, index=False, header=False)

        # 예측
        inp   = win.reshape(1, WINDOW_SIZE, 1)
        prob  = model.predict(inp, verbose=0)
        lab   = int(np.argmax(prob))
        preds.append(lab)
        print(f"🪟 윈도우 {i}: 예측 → {label_dict[lab]} | 저장: {csv_path}")

        # 시각화 저장 (영어 제목)
        fig, ax = plt.subplots(figsize=(8, 3))
        ax.plot(win)
        ax.set_title(f"Window {i} ECG Waveform")
        ax.set_xlabel("Sample")
        ax.set_ylabel("Normalized Amplitude")
        img_name = f"ecg_window_{i}_{ts}.png"
        img_path = os.path.join(SAVE_PATH_ECG, img_name)
        fig.savefig(img_path)
        plt.close(fig)
        print(f"🖼️ 윈도우 {i} 그래프 저장: {img_path}")

    if not preds:
        raise RuntimeError("ECG: 예측 가능한 윈도우가 없습니다.")

    # 6) 다수결 최종 결과
    final_label = max(set(preds), key=preds.count)
    return label_dict[final_label]

# ===== 체온 측정 함수 =====
def get_temperature(serial_port=TEMP_SERIAL_PORT, baud_rate=TEMP_BAUD_RATE):
    try:
        with serial.Serial(serial_port, baud_rate, timeout=1) as arduino:
            time.sleep(2)
            arduino.write(b'R')
            time.sleep(0.1)
            data = arduino.readline().decode().strip()
            temp = float(data)
            return round(temp, 1)
    except (serial.SerialException, ValueError) as e:
        raise RuntimeError(f"체온 읽기 오류: {e}")

# ===== 개발 과정용 더미 입력 함수 =====
def dev_get_data():
    """
    개발 과정 및 데모용 더미 함수.
    사용자로부터 체온과 ECG 라벨 인덱스(0~4)를 입력받아,
    체온은 소수점 한자리까지, ECG 라벨은 한글로 출력 후 반환합니다.
    """
    # 1) 사용자 입력 받기
    temp_str = input("개발용 체온을 입력하세요 (예: 36.5): ")
    label_str = input(
        "개발용 ECG 라벨 인덱스를 입력하세요 "
        "(0=정상, 1=심방성 부정맥, 2=심실성 부정맥, 3=융합 박동, 4=알 수 없음): "
    )

    # 2) 형 변환 및 유효성 검사
    try:
        temperature = round(float(temp_str), 1)
    except ValueError:
        raise ValueError(f"잘못된 체온 입력: '{temp_str}'")

    try:
        ecg_label_idx = int(label_str)
        if ecg_label_idx not in range(5):
            raise ValueError
    except ValueError:
        raise ValueError(f"ECG 라벨 인덱스는 0~4 사이의 정수여야 합니다. 입력값: '{label_str}'")

    # 라벨 사전
    label_dict = {
        0: '정상',
        1: '심방성 부정맥',
        2: '심실성 부정맥',
        3: '융합 박동',
        4: '알 수 없음'
    }
    ecg_label = label_dict[ecg_label_idx]

    # 3) 결과 출력
    print(f"[개발용] 입력된 체온: {temperature:.1f}°C, 입력된 ECG 라벨: {ecg_label}")

    # 4) 반환
    return temperature, ecg_label

# ===== 메인 예시 =====
if __name__ == "__main__":
        
    # ECG 예측
    try:
        ecg_result = get_ecg_prediction()
        print("▶ 최종 ECG 예측 결과:", ecg_result)
    except RuntimeError as e:
        print("❌", e)

    # 체온 측정
    try:
        temp = get_temperature()
        print("▶ 현재 체온:", temp, "°C")
    except RuntimeError as e:
        print("❌", e)
    
    # 개발 과정용 더미 입출력
    dev_temp, dev_label_idx = dev_get_data()
    print("▶ 개발용 반환값:", dev_temp, "°C,", "ECG 라벨 인덱스 =", dev_label_idx)
    