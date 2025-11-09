from ultralytics import YOLO

# Load a pretrained YOLOv8 model
model = YOLO('yolov8n.pt')

# Train the model
results = model.train(
    data='dataset/My First Project.v1i.yolov8/data.yaml',
    epochs=100,
    imgsz=640,
    batch=16,
    name='finance_bro_detector'
)

# Validate the model
metrics = model.val()

# Export the model
model.export(format='onnx')