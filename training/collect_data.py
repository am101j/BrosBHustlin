import requests
import os
from PIL import Image
import io

def download_images():
    """Download sample images for each finance bro category"""
    
    # Create directories
    os.makedirs('dataset/images/train', exist_ok=True)
    os.makedirs('dataset/images/val', exist_ok=True)
    
    # Sample image URLs (replace with actual finance bro images)
    image_sources = {
        'patagonia_vest': [
            # Add URLs to Patagonia vest images
        ],
        'quarter_zip': [
            # Add URLs to quarter-zip sweater images  
        ],
        'luxury_watch': [
            # Add URLs to luxury watch images
        ],
        'airpods': [
            # Add URLs to AirPods images
        ],
        'allbirds': [
            # Add URLs to Allbirds shoe images
        ],
        'business_shirt': [
            # Add URLs to business casual shirt images
        ],
        'macbook_pro': [
            # Add URLs to MacBook Pro images
        ]
    }
    
    print("Manual data collection required:")
    print("1. Take photos of people wearing finance bro items")
    print("2. Download from fashion websites (with permission)")
    print("3. Use public datasets like DeepFashion")
    print("4. Aim for 50-100 images per category")

if __name__ == "__main__":
    download_images()