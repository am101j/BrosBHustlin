from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
import os
import json
# Add ffmpeg to PATH if needed
import shutil
if not shutil.which('ffmpeg'):
    # Try common ffmpeg locations
    ffmpeg_paths = [
        'C:\\ffmpeg\\bin',
        os.path.expanduser('~/Miniconda3/Library/bin'),
        os.path.expanduser('~/miniconda3/Library/bin')
    ]
    for path in ffmpeg_paths:
        if os.path.exists(os.path.join(path, 'ffmpeg.exe')):
            os.environ['PATH'] += f';{path}'
            break
from PIL import Image
import torch
from transformers import pipeline
from ultralytics import YOLO
import sqlite3
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'], 
     methods=['GET', 'POST', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'])

# Load models
# Try custom trained model first, then fashion model, then general
try:
    # Custom finance bro trained model (best accuracy)
    yolo = YOLO('best.pt')
    print("Using custom finance bro YOLO model")
except:
    try:
        # Fashion-trained YOLO model for clothing detection
        yolo = YOLO('keremberke/yolov8m-fashion')
        print("Using fashion YOLO model")
    except:
        # Fallback to general model if others unavailable
        yolo = YOLO('yolov8n.pt')
        print("Using general YOLO model")
whisper = pipeline("automatic-speech-recognition", model="openai/whisper-tiny")

# Initialize database
def init_db():
    conn = sqlite3.connect('broski.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS leaderboard
                 (id TEXT PRIMARY KEY, username TEXT, total_score INTEGER, 
                  camera_score INTEGER, voice_score INTEGER, tier TEXT,
                  detected_items TEXT, buzzwords TEXT, created_at TEXT)''')
    conn.commit()
    conn.close()

init_db()

def get_bro_tier(score):
    if score <= 79: return "Peasant"
    elif score <= 159: return "Analyst"
    elif score <= 239: return "Associate"
    elif score <= 319: return "VP of Cringe"
    else: return "CEO of Insufferable"

@app.route('/api/analyze-image', methods=['POST'])
def analyze_image():
    try:
        data = request.json
        image_data = data['image'].split(',')[1]
        
        # Decode image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Save temp image
        temp_path = 'temp_image.jpg'
        image.save(temp_path)
        
        detected = []
        score = 0
        
        # YOLO detection with confidence threshold
        results = yolo(temp_path, conf=0.3)[0]  # 25% confidence threshold - optimal for trained model
        
        if len(results.boxes) > 0:
            classes = [results.names[int(cls)] for cls in results.boxes.cls]
            confidences = results.boxes.conf.tolist()
            
            # Print detected classes with confidence for debugging
            for cls, conf in zip(classes, confidences):
                print(f"YOLO detected: {cls} (confidence: {conf:.2f})")
        else:
            classes = []
            confidences = []
            print("YOLO: No detections above confidence threshold")
        
        # Custom trained model scoring - YOLO only
        # Total max camera: 200 pts (so 200 camera + 200 voice = 400 total)
        bro_items = {
            'patagonia_vest': 40,
            'quarter_zip_sweater': 30,
            'luxury_watch': 60,
            'airpods': 35,
            'allbirds_shoes': 20,
            'business_shirt': 15,
            'macbook_pro': 10
        }
        
        for class_name in classes:
            if class_name in bro_items:
                points = bro_items[class_name]
                detected.append({"name": class_name.replace('_', ' ').title(), "points": points})
                score += points
        
        # Cap camera score at 200
        score = min(score, 200)
        
        os.remove(temp_path)
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'items': detected,
                'tier': get_bro_tier(score)
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/analyze-voice', methods=['POST'])
def analyze_voice():
    try:
        data = request.json
        audio_data = data['audio'].split(',')[1]
        
        # Decode audio
        audio_bytes = base64.b64decode(audio_data)
        temp_path = 'temp_audio.wav'
        with open(temp_path, 'wb') as f:
            f.write(audio_bytes)
        
        # Transcribe
        result = whisper(temp_path)
        transcription = result['text'].lower()
        
        # Buzzwords
        buzzwords = [
            "circle back", "synergize", "synergy", "hop on a call", "jump on a call",
            "take this offline", "touch base", "ping you", "ping me", "bandwidth",
            "move the needle", "low-hanging fruit", "deep dive", "leverage",
            "actionable", "moving forward", "at the end of the day", "per my last email"
        ]
        
        detected_buzzwords = []
        score = 0
        
        for buzzword in buzzwords:
            count = transcription.count(buzzword)
            if count > 0:
                points = count * 25
                detected_buzzwords.append({"phrase": buzzword, "count": count, "points": points})
                score += points
        
        os.remove(temp_path)
        
        return jsonify({
            'success': True,
            'data': {
                'score': min(score, 200),  # Max 200 points (200 camera + 200 voice = 400 total)
                'buzzwords': detected_buzzwords,
                'transcription': transcription
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/save-score', methods=['POST'])
def save_score():
    try:
        data = request.json
        
        conn = sqlite3.connect('broski.db')
        c = conn.cursor()
        
        entry_id = str(uuid.uuid4())
        c.execute('''INSERT INTO leaderboard VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                 (entry_id, data['username'], data['total_score'], data['camera_score'],
                  data['voice_score'], data['tier'], json.dumps(data['detected_items']),
                  json.dumps(data['buzzwords']), datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'data': {'id': entry_id}})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        conn = sqlite3.connect('broski.db')
        c = conn.cursor()
        
        c.execute('''SELECT id, username, total_score, tier, created_at 
                     FROM leaderboard ORDER BY total_score DESC LIMIT 10''')
        
        results = []
        for i, row in enumerate(c.fetchall()):
            results.append({
                'id': row[0],
                'rank': i + 1,
                'username': row[1],
                'total_score': row[2],
                'tier': row[3],
                'created_at': row[4]
            })
        
        conn.close()
        
        return jsonify({'success': True, 'data': results})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')