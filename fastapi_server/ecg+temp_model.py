import numpy as np
from tensorflow.keras.models import load_model

WINDOW_SIZE = 187
MODEL_PATH = r"C:\Users\user\python_project\AI_healthcare_pr\15_prome_arrythmia_healthcare\models\arrythmia_prediction_model.keras"

model = load_model(MODEL_PATH)

def predict_ecg_from_array(ecg_data: list[float]) -> int:
    """
    ECG 187개 길이의 수치 리스트를 받아서 예측 (0~4)
    """
    if len(ecg_data) != WINDOW_SIZE:
        raise ValueError(f"ECG 데이터 길이는 {WINDOW_SIZE} 이어야 합니다.")
    
    # 정규화 (평균 0, 분산 1)
    ecg = np.array(ecg_data)
    norm = (ecg - np.mean(ecg)) / np.std(ecg)
    inp = norm.reshape(1, WINDOW_SIZE, 1)
    
    prob = model.predict(inp, verbose=0)
    return int(np.argmax(prob))  # 0~4 반환