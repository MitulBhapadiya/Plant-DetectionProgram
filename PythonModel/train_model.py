import os
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.utils import to_categorical
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.preprocessing.image import img_to_array, load_img, ImageDataGenerator
import pickle

# path apo bhai ne jema thi train karse data ne
dataset_path = "./Train"
IMG_SIZE = 128

# Initialize data and labels lists
data = []
labels = []

# Load images karo 
for category in os.listdir(dataset_path):
    category_path = os.path.join(dataset_path, category)
    
    if os.path.isdir(category_path):
        for file in os.listdir(category_path):
            img_path = os.path.join(category_path, file)
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                try:
                    img = load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))
                    img = img_to_array(img) / 255.0
                    data.append(img)
                    labels.append(category)
                except Exception as e:
                    print(f"Skipping corrupted image: {file} - Error: {e}")

# Encode labels
le = LabelEncoder()
labels = le.fit_transform(labels)
labels = to_categorical(labels)

# ✅ Save Label Encoder
with open('label_encoder.pkl', 'wb') as f:
    pickle.dump(le, f)

# Convert to NumPy arrays
data = np.array(data, dtype="float32")
labels = np.array(labels)

# Split dataset into training & validation sets
X_train, X_val, y_train, y_val = train_test_split(data, labels, test_size=0.2, random_state=42)

# ✅ Data Augmentation
datagen = ImageDataGenerator(
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode="nearest"
)
datagen.fit(X_train)

# ✅ Build CNN Model
model = Sequential([
    Conv2D(32, (3,3), activation='relu', padding='same', input_shape=(IMG_SIZE, IMG_SIZE, 3)),
    MaxPooling2D(pool_size=(2,2)),
    
    Conv2D(64, (3,3), activation='relu', padding='same'),
    MaxPooling2D(pool_size=(2,2)),

    Conv2D(128, (3,3), activation='relu', padding='same'),
    MaxPooling2D(pool_size=(2,2)),

    Flatten(),
    Dense(256, activation='relu'),
    Dropout(0.3),
    Dense(len(le.classes_), activation='softmax')
])

# ✅ Compile model
model.compile(optimizer=Adam(learning_rate=0.0001), loss='categorical_crossentropy', metrics=['accuracy'])

# ✅ Train the model
history = model.fit(
    datagen.flow(X_train, y_train, batch_size=32),
    validation_data=(X_val, y_val),
    epochs=25
)

# ✅ Save the trained model
model.save("plant_disease_model.h5")

# ✅ Plot training history
plt.plot(history.history['accuracy'], label='Train Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.legend()
plt.show()

print("✅ Model training complete! Saved as 'plant_disease_model.h5'")
