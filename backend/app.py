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
from transformers import BlipProcessor, BlipForConditionalGeneration, CLIPProcessor, CLIPModel, pipeline
from ultralytics import YOLO
import sqlite3
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

# Load models
yolo = YOLO('yolov8n.pt')
blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
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
    if score <= 199: return "Peasant"
    elif score <= 399: return "Analyst"
    elif score <= 599: return "Associate"
    elif score <= 799: return "VP of Cringe"
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
        
        # YOLO detection
        results = yolo(temp_path)[0]
        classes = [results.names[int(cls)] for cls in results.boxes.cls]
        
        # BLIP captioning
        inputs = blip_processor(image, return_tensors="pt")
        out = blip_model.generate(**inputs, max_length=50)
        caption = blip_processor.decode(out[0], skip_special_tokens=True).lower()
        
        # CLIP detection
        clip_texts = [
            "person wearing patagonia vest",
            "person wearing quarter-zip pullover",
            "person wearing formal dress shirt with tie", 
            "person wearing allbirds shoes"
        ]
        clip_inputs = clip_processor(text=clip_texts, images=image, return_tensors="pt", padding=True)
        clip_outputs = clip_model(**clip_inputs)
        similarities = clip_outputs.logits_per_image.softmax(dim=1)[0]
        
        # Scoring
        if similarities[0] > 0.35:
            detected.append({"name": "Patagonia vest/fleece", "points": 50})
            score += 50
        if similarities[1] > 0.1:
            detected.append({"name": "Quarter-zip sweater", "points": 40})
            score += 40
        if "watch" in classes:
            detected.append({"name": "Luxury watch", "points": 100})
            score += 100
        if any(word in caption for word in ["airpods", "earbuds"]):
            detected.append({"name": "AirPods", "points": 45})
            score += 45
        if similarities[3] > 0.4:
            detected.append({"name": "Allbirds shoes", "points": 30})
            score += 30
        if similarities[2] > 0.5:
            detected.append({"name": "Business casual attire", "points": 25})
            score += 25
        if "laptop" in classes:
            detected.append({"name": "MacBook Pro", "points": 20})
            score += 20
            
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
                'score': min(score, 500),  # Max 500 points
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
        
        c.execute('''SELECT username, total_score, tier, created_at 
                     FROM leaderboard ORDER BY total_score DESC LIMIT 10''')
        
        results = []
        for i, row in enumerate(c.fetchall()):
            results.append({
                'rank': i + 1,
                'username': row[0],
                'total_score': row[1],
                'tier': row[2],
                'created_at': row[3]
            })
        
        conn.close()
        
        return jsonify({'success': True, 'data': results})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)