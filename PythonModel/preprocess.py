import os
import numpy as np
from tensorflow.keras.preprocessing.image import img_to_array, load_img
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Define dataset path (UPDATE THIS TO YOUR ACTUAL PATH)
dataset_path = "./Train"

# Image size for resizing
IMG_SIZE = 128  

# Initialize lists for storing images and labels
data = []
labels = []

# Load images from dataset
for category in os.listdir(dataset_path):
    category_path = os.path.join(dataset_path, category)

    if os.path.isdir(category_path):  # Ensure it's a folder
        for file in os.listdir(category_path):
            img_path = os.path.join(category_path, file)
            
            # Skip non-image files
            if not file.lower().endswith(('.png', '.jpg', '.jpeg')):  
                print(f"Skipping non-image file: {file}")
                continue

            try:
                img = load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))  # Resize image
                img = img_to_array(img) / 255.0  # Normalize pixel values
                data.append(img)
                labels.append(category)
            except Exception as e:
                print(f"Skipping corrupted image: {file} - Error: {e}")  # Skip unreadable images

# Convert labels to numeric values
le = LabelEncoder()
labels = le.fit_transform(labels)

# Convert to NumPy arrays
data = np.array(data, dtype="float32")
labels = np.array(labels)

# Split dataset into training & validation sets
X_train, X_val, y_train, y_val = train_test_split(data, labels, test_size=0.2, random_state=42)

print("✅ Dataset successfully loaded and preprocessed!")
print(f"Training Samples: {len(X_train)}, Validation Samples: {len(X_val)}")
