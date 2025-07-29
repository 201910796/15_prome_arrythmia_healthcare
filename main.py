from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os
from ecg_utils import get_ecg_prediction, get_temperature

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# 전역 변수
last_ecg_result = None
last_ecg_image = None
last_temperature = None

# 루트 페이지 → index.html
@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


# 심전도 측정 → index.html 렌더링
@app.post("/ecg", response_class=HTMLResponse)
def ecg_measure(request: Request):
    global last_ecg_result, last_ecg_image
    try:
        ecg_result, img_path = get_ecg_prediction(return_img=True)
        last_ecg_result = ecg_result
        last_ecg_image = f"/static/{os.path.basename(img_path)}"
        return templates.TemplateResponse("index.html", {
            "request": request,
            "ecg_status": "✅ 심전도 측정 완료",
            "ecg_result": last_ecg_result,
            "ecg_image": last_ecg_image,
            "temp_result": last_temperature
        })
    except Exception as e:
        return templates.TemplateResponse("index.html", {
            "request": request,
            "ecg_status": f"❌ 오류 발생: {e}",
            "ecg_result": last_ecg_result,
            "ecg_image": last_ecg_image,
            "temp_result": last_temperature
        })


# 체온 측정 → index.html 렌더링
@app.post("/temperature", response_class=HTMLResponse)
def temperature_measure(request: Request):
    global last_temperature
    try:
        temp = get_temperature(correction=10.0)
        last_temperature = temp
        return templates.TemplateResponse("index.html", {
            "request": request,
            "temp_status": "✅ 체온 측정 완료",
            "temp_result": last_temperature,
            "ecg_result": last_ecg_result,
            "ecg_image": last_ecg_image
        })
    except Exception as e:
        return templates.TemplateResponse("index.html", {
            "request": request,
            "temp_status": f"❌ 오류 발생: {e}",
            "temp_result": last_temperature,
            "ecg_result": last_ecg_result,
            "ecg_image": last_ecg_image
        })


# 검사 완료 → JSON 응답 (BE 서버용)
@app.post("/ai_diag")
def ai_diag(request: Request):
    global last_ecg_result, last_ecg_image, last_temperature
    if last_ecg_result is None or last_temperature is None:
        return JSONResponse(
            content={"error": "심전도와 체온 모두 측정 후 호출하세요."},
            status_code=400
        )

    # ✅ ngrok 주소 + static 경로 붙이기
    base_url = str(request.base_url).rstrip("/")
    image_url = f"{base_url}{last_ecg_image}" if last_ecg_image else None

    return JSONResponse(content={
        "ecg_result": last_ecg_result,
        "temperature": last_temperature,
        "ecg_image": image_url,   # ✅ ngrok 절대경로
        "status": "✅ 전체 검사 결과"
    })
