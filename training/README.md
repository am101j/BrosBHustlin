# Custom Finance Bro YOLO Training

## Why Custom Training?

- **Higher Accuracy**: Detects specific finance bro items vs generic categories
- **Brand Recognition**: Identifies Patagonia, Allbirds, etc. specifically  
- **Better Performance**: Trained on your exact use case

## Steps to Train

### 1. Collect Images (50-100 per class)
```bash
python collect_data.py
```

**Sources:**
- Take photos yourself
- Fashion websites (with permission)
- Public datasets (DeepFashion, Fashionpedia)
- Social media (finance bro photos)

### 2. Label Images
Use **Roboflow** (easiest) or **LabelImg**:

1. Upload images to [roboflow.com](https://roboflow.com)
2. Draw bounding boxes around items
3. Label with class names:
   - `patagonia_vest`
   - `quarter_zip_sweater` 
   - `luxury_watch`
   - `airpods`
   - `allbirds_shoes`
   - `business_shirt`
   - `macbook_pro`
4. Export in YOLO format

### 3. Organize Dataset
```
dataset/
├── images/
│   ├── train/     # 70% of images
│   └── val/       # 30% of images  
└── labels/
    ├── train/     # corresponding .txt files
    └── val/       # corresponding .txt files
```

### 4. Train Model
```bash
cd training
python train_model.py
```

Training takes 1-3 hours depending on GPU.

### 5. Use Trained Model
Replace in `backend/app.py`:
```python
yolo = YOLO('training/runs/detect/finance_bro_detector/weights/best.pt')
```

## Label Format (YOLO)
Each image needs a `.txt` file with:
```
class_id x_center y_center width height
```
All values normalized 0-1.

Example `image1.txt`:
```
0 0.5 0.3 0.2 0.4  # patagonia_vest at center-left
2 0.8 0.2 0.1 0.1  # luxury_watch on wrist
```

## Expected Results
- **Before**: Generic "person", "clothing" detection
- **After**: Specific "patagonia_vest", "allbirds_shoes" detection
- **Accuracy**: 80-95% with good training data