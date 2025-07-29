from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from ecg_utils import get_ecg_prediction, get_temperature
import os

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# 🔹 전역 변수로 유지
last_ecg_result = None
last_ecg_image = None


@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/ecg", response_class=HTMLResponse)
def predict_ecg(request: Request):
    global last_ecg_result, last_ecg_image
    try:
        ecg_result, img_path = get_ecg_prediction(return_img=True)
        last_ecg_result = ecg_result
        last_ecg_image = f"/static/{os.path.basename(img_path)}"
        return templates.TemplateResponse("index.html", {
            "request": request,
            "ecg_status": "✅ 심전도 측정 완료",
            "ecg_result": ecg_result,
            "ecg_image": last_ecg_image
        })
    except Exception as e:
        return templates.TemplateResponse("index.html", {
            "request": request,
            "ecg_status": f"❌ 오류 발생: {e}",
            "ecg_result": last_ecg_result,
            "ecg_image": last_ecg_image
        })


@app.post("/temperature", response_class=HTMLResponse)
def read_temperature(request: Request):
    global last_ecg_result, last_ecg_image
    try:
        result = get_temperature(correction=10.0)
        return templates.TemplateResponse("index.html", {
            "request": request,
            "temp_status": "✅ 체온 측정 완료",
            "temp_result": result,
            # 🔹 이전 ECG 값도 같이 전달
            "ecg_result": last_ecg_result,
            "ecg_image": last_ecg_image
        })
    except Exception as e:
        return templates.TemplateResponse("index.html", {
            "request": request,
            "temp_status": f"❌ 오류 발생: {e}",
            "ecg_result": last_ecg_result,
            "ecg_image": last_ecg_image
        })
