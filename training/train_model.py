from ultralytics import YOLO

# Load a pretrained YOLOv8 model
model = YOLO('yolov8n.pt')

# Train the model (CPU optimized)
results = model.train(
    data='dataset/My First Project.v1i.yolov8/data.yaml',
    epochs=50,      # Reduced from 100
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