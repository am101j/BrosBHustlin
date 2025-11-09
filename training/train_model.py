from ultralytics import YOLO

# Load existing model if available, otherwise use pretrained YOLOv8
import os
if os.path.exists('../backend/best.pt'):
    print("Loading existing model for transfer learning...")
    model = YOLO('../backend/best.pt')
else:
    print("No existing model found, starting from pretrained YOLOv8...")
    model = YOLO('yolov8n.pt')

# Train the model (CPU optimized)
results = model.train(
    data='dataset/My First Project.v2i.yolov8/data.yaml',
    epochs=25,      # Transfer learning needs fewer epochs
    imgsz=416,      # Reduced from 640  
    batch=4,        # Reduced from 16
    workers=2,      # CPU workers
    device='cpu',   # Force CPU
    name='finance_bro_detector'
)

# Validate the model
metrics = model.val()

# Model saved as PyTorch format (best.pt) - ready to use
print(f"Model training complete! Best weights saved to: {model.trainer.best}")
print(f"mAP50: {metrics.box.map50:.3f}")
print(f"mAP50-95: {metrics.box.map:.3f}")