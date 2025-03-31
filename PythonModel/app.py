import os
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS  # Enable CORS for API access
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import pickle

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Load Model and Labels
model = load_model("plant_disease_model.h5")
with open("label_encoder.pkl", "rb") as f:
    le = pickle.load(f)

IMG_SIZE = 128
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def predict_disease(image_path):
    img = load_img(image_path, target_size=(IMG_SIZE, IMG_SIZE))
    img = img_to_array(img) / 255.0
    img = np.expand_dims(img, axis=0)

    prediction = model.predict(img)
    predicted_class = np.argmax(prediction)
    confidence = np.max(prediction) * 100

    return le.classes_[predicted_class], confidence

@app.route('/predict', methods=['POST'])
def predict():
    print("🔹 Received a request to /predict")
    
    if 'file' not in request.files:
        print("🚨 No file found in request!")
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    
    if file.filename == '':
        print("🚨 Empty filename!")
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        disease, confidence = predict_disease(file_path)
        
        # Send JSON response
        return jsonify({
            "disease": disease,
            "confidence": round(float(confidence), 2),
            "organicSolution": "Use neem oil to prevent further spread.",
            "chemicalSolution": "Apply a copper-based fungicide."
        })
    
    print("🚨 Invalid file type!")
    return jsonify({"error": "Invalid file type"}), 400

if __name__ == '__main__':
    app.run(debug=True)
