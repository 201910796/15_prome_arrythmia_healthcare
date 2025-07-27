from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from ecg_temp_model import predict_ecg_from_array

app = FastAPI()

class ECGRequest(BaseModel):
    ecg_data: List[float]
    temperature: float  # 현재는 사용하지 않지만 추후 확장 가능

@app.post("/ai_diag")
def analyze_ecg(req: ECGRequest):
    try:
        prediction = predict_ecg_from_array(req.ecg_data)
        return { "prediction": prediction }
    except ValueError as e:
        return { "error": str(e) }