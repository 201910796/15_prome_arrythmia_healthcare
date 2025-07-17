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
ECG_SERIAL_PORT   = 'COM17' # 새로 산거
ECG_BAUD_RATE     = 9600
TEMP_SERIAL_PORT  = 'COM3' # 기존
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

# ===== Bandpass 필터 추가 =====
def bandpass_filter(signal, fs=FS, lowcut=0.5, highcut=40):
    nyq = fs / 2
    b, a = butter(2, [lowcut / nyq, highcut / nyq], btype='band')
    return filtfilt(b, a, signal)

# ===== ECG 필터링 함수 =====
def filter_ecg(signal, fs=250):
    # 강한 Bandpass (0.5~40Hz)
    nyq = fs / 2
    b, a = butter(2, [0.5 / nyq, 40 / nyq], btype='band')
    filtered = filtfilt(b, a, signal)

    # Notch 필터 (60Hz 제거)
    w0 = 60 / nyq
    b_notch, a_notch = iirnotch(w0, Q=50)
    filtered = filtfilt(b_notch, a_notch, filtered)

    return filtered

# ===== ECG 예측 및 저장 함수 =====
def get_ecg_prediction(serial_port=ECG_SERIAL_PORT, baud_rate=ECG_BAUD_RATE):
    model = load_model(MODEL_PATH)
    buffer = deque(maxlen=BUFFER_SIZE)

    # 1) ECG 데이터 수집
    try:
        with serial.Serial(serial_port, baud_rate, timeout=1) as ser:
            while len(buffer) < BUFFER_SIZE:
                line = ser.readline().decode('utf-8', errors='replace').strip()
                print(f"📡 수신 데이터: {repr(line)}")

                try:
                    # "DATA,TIME,190" → 마지막 숫자만 가져옴
                    val = int(line.split(',')[-1])
                    buffer.append(val)
                    print(f"⏳ 수집 중... ({len(buffer)}/{BUFFER_SIZE})")
                except ValueError:
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
    peaks, props = find_peaks(norm, height=0.3, distance=int(0.25 * FS), prominence=0.4)
    print(f"✅ 전체 R파 개수: {len(peaks)}")
    if len(peaks) == 0:
        raise RuntimeError("ECG: R파를 찾을 수 없습니다.")

    # 4) 유효한 R파만 필터링 (슬라이싱 범위 벗어나지 않는 것만)
    valid_peaks = []
    valid_proms = []
    half_win = WINDOW_SIZE // 2

    for p, prom in zip(peaks, props["prominences"]):
        if p - half_win >= 0 and p + half_win + 1 <= len(norm):
            valid_peaks.append(p)
            valid_proms.append(prom)

    if not valid_peaks:
        raise RuntimeError("ECG: 윈도우 범위 내에 포함되는 R파가 없습니다.")

    # 5) 가장 높은 prominence를 가진 R파 하나 선택
    main_peak_idx = np.argmax(valid_proms)
    main_peak = valid_peaks[main_peak_idx]
    print(f"⭐ 선택된 중심 R파 인덱스: {main_peak} (prominence={valid_proms[main_peak_idx]:.2f})")

    # 6) 윈도우 생성 (무조건 길이 187로)
    start = main_peak - half_win
    end   = main_peak + half_win + 1
    win = norm[start:end]

    if len(win) != WINDOW_SIZE:
        raise RuntimeError(f"슬라이싱된 윈도우 길이 오류: {len(win)}")

    # 7) 저장 및 예측
    ts = datetime.datetime.now().strftime('%Y%m%d_%H%M%S_%f')
    csv_name = f"ecg_window_{ts}.csv"
    csv_path = os.path.join(SAVE_PATH_ECG, csv_name)
    pd.DataFrame(win).T.to_csv(csv_path, index=False, header=False)

    inp   = win.reshape(1, WINDOW_SIZE, 1)
    prob  = model.predict(inp, verbose=0)
    lab   = int(np.argmax(prob))
    print(f"🪟 예측 → {label_dict[lab]} | 저장: {csv_path}")

    # 8) 시각화 저장
    fig, ax = plt.subplots(figsize=(8, 3))
    ax.plot(win)
    ax.axvline(WINDOW_SIZE//2, color='red', linestyle='--', label='R peak center')
    ax.set_title("ECG Window with PQRS Complex")
    ax.set_xlabel("Sample")
    ax.set_ylabel("Normalized Amplitude")
    ax.legend()
    img_name = f"ecg_window_{ts}.png"
    img_path = os.path.join(SAVE_PATH_ECG, img_name)
    fig.savefig(img_path)
    plt.close(fig)
    print(f"🖼️ 그래프 저장: {img_path}")

    # 9) 최종 라벨 반환
    return label_dict[lab]

# ===== 체온 측정 함수 (보정값 적용 기능 포함) =====
def get_temperature(serial_port=TEMP_SERIAL_PORT, baud_rate=TEMP_BAUD_RATE, correction=0.0):
    """
    체온 측정 함수
    - serial_port: 아두이노 포트
    - baud_rate: 통신 속도
    - correction: 오차 보정값 (예: -0.5를 넣으면 측정값에서 0.5도 낮춰서 반환)
    """
    try:
        with serial.Serial(serial_port, baud_rate, timeout=1) as arduino:
            time.sleep(2)  # 포트 초기화 대기

            print("[체온 측정 중]")

            last_temp = None

            for _ in range(5):
                arduino.write(b'R')             # 측정 요청
                time.sleep(0.1)
                data = arduino.readline().decode().strip()

                try:
                    temp = float(data)
                    last_temp = temp
                except ValueError:
                    pass  # 실패한 값은 무시

                time.sleep(1)  # 1초 대기

            if last_temp is not None:
                corrected_temp = round(last_temp + correction, 1)
                print("[체온 측정 완료]")
                print(f"측정된 체온 (보정 적용): {corrected_temp}°C")
                return corrected_temp
            else:
                raise RuntimeError("정상적인 체온을 가져오지 못했습니다.")

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
        temp = get_temperature(correction = 5)
        print("▶ 현재 체온:", temp, "°C")
    except RuntimeError as e:
        print("❌", e)
    
    # 개발 과정용 더미 입출력
    dev_temp, dev_label_idx = dev_get_data()
    print("▶ 개발용 반환값:", dev_temp, "°C,", "ECG 라벨 인덱스 =", dev_label_idx)
    