# main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import Response
from scanner import scanner
import numpy as np
import cv2

app = FastAPI()
@app.get("/")
def root():
    return {"message": "Welcome to the document scanner"}

@app.post("/process-image")
async def process_image(file: UploadFile = File(...)):

    content = await file.read()

    npimg = np.frombuffer(content,np.uint8)
    image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    if image is None:
        return {"error" : "could not decode image"}
    
    processed = scanner(image)

    _, buffer = cv2.imencode('.jpg', processed)
    return Response(content=buffer.tobytes(), media_type="image/jpeg")
