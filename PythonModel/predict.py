import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import pickle
import os

# Load the trained model
model = load_model("plant_disease_model.h5")

# Load Label Encoder
with open("label_encoder.pkl", "rb") as f:
    le = pickle.load(f)

# Define image size
IMG_SIZE = 128

# Function to predict disease
def predict_disease(image_path):
    if not os.path.exists(image_path):
        print(f"Error: File '{image_path}' not found!")
        return
    
    img = load_img(image_path, target_size=(IMG_SIZE, IMG_SIZE))
    img = img_to_array(img) / 255.0
    img = np.expand_dims(img, axis=0)

    prediction = model.predict(img)
    predicted_class = np.argmax(prediction)
    confidence = np.max(prediction) * 100

    print(f"✅ Prediction: {le.classes_[predicted_class]} (Confidence: {confidence:.2f}%)")
