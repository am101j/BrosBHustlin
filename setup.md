# BrosBHustlin Setup Guide

## Quick Start

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
**Runs on:** http://localhost:5000

### 2. Frontend Setup  
```bash
cd frontend
npm install
npm run dev
```
**Runs on:** http://localhost:3000

### 3. Custom Training (Optional)
```bash
cd training
python train_model.py
```

## Project Structure
```
broski/
├── backend/           # Flask API + AI models
├── frontend/          # React app
├── training/          # Custom YOLO training
├── bro_env/          # Python virtual environment
└── README.md         # Main documentation
```

## Dependencies
- **Python 3.11+** with virtual environment
- **Node.js 16+** for React
- **FFmpeg** for audio processing

## Models Used
- **YOLO**: Fashion detection (keremberke/yolov8m-fashion)
- **BLIP**: Image captioning  
- **CLIP**: Zero-shot classification
- **Whisper**: Speech transcription