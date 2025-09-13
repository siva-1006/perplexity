# # #!/usr/bin/env python3
# # """
# # Simple ML server for CivicCare App
# # This is a basic Flask server that can be used for testing ML predictions.
# # Replace this with your actual ML model implementation.
# # """

# # from flask import Flask, request, jsonify
# # from flask_cors import CORS
# # import base64
# # import io
# # from PIL import Image
# # import numpy as np



# # app = Flask(__name__)
# # CORS(app)

# # # Mock prediction function - replace with your actual model
# # def predict_image(image_data):
# #     """
# #     Mock prediction function.
# #     Replace this with your actual ML model prediction logic.
# #     """
# #     # For now, return a random prediction
# #     import random
# #     labels = [
# #         "Pothole",
# #         "Damaged electric poles",
# #         "Damaged road signs",
# #         "Garbage",
# #         "Graffiti",
# #         "Fallen trees"
# #     ]
    
# #     # Simulate some processing time
# #     import time
# #     time.sleep(0.5)
    
# #     # Return random prediction
# #     prediction_index = random.randint(0, len(labels) - 1)
# #     return {
# #         "prediction": prediction_index,
# #         "label": labels[prediction_index],
# #         "confidence": random.uniform(0.5, 0.95)
# #     }

# # @app.route('/predict', methods=['POST'])
# # def predict():
# #     try:
# #         print(f"\n📥 RECEIVED PREDICTION REQUEST")
# #         print(f"   📋 Request files: {list(request.files.keys())}")
        
# #         if 'file' not in request.files:
# #             error_msg = "No file provided"
# #             print(f"❌ ERROR: {error_msg}")
# #             return jsonify({"error": error_msg}), 400
        
# #         file = request.files['file']
# #         if file.filename == '':
# #             error_msg = "No file selected"
# #             print(f"❌ ERROR: {error_msg}")
# #             return jsonify({"error": error_msg}), 400
        
# #         print(f"   📁 Processing file: {file.filename}")
# #         print(f"   📏 File size: {len(file.read())} bytes")
        
# #         # Reset file pointer
# #         file.seek(0)
# #         image_data = file.read()
        
# #         # Make prediction
# #         print(f"   🤖 Running ML prediction...")
# #         result = predict_image(image_data)
        
# #         # Print detailed output to console for verification
# #         print(f"\n🔍 ML PREDICTION RESULT:")
# #         print(f"   📁 File: {file.filename}")
# #         print(f"   📊 Prediction Index: {result['prediction']}")
# #         print(f"   🏷️  Label: {result['label']}")
# #         print(f"   📈 Confidence: {result['confidence']:.2f}")
# #         print(f"   📤 Response: {result}")
# #         print("-" * 50)
        
# #         return jsonify(result)
        
# #     except Exception as e:
# #         import traceback
# #         error_details = traceback.format_exc()
# #         print(f"❌ ML SERVER ERROR: {str(e)}")
# #         print(f"📋 Error details: {error_details}")
# #         return jsonify({"error": str(e), "details": error_details}), 500

# # @app.route('/health', methods=['GET'])
# # def health():
# #     return jsonify({"status": "healthy", "message": "ML Server is running"})

# # if __name__ == '__main__':
# #     print("Starting ML Server on http://localhost:8000")
# #     print("Health check: http://localhost:8000/health")
# #     print("Prediction endpoint: http://localhost:8000/predict")
# #     app.run(host='0.0.0.0', port=8000, debug=True)




# from flask import Flask, request, jsonify
# from PIL import Image
# import io
# import torch
# import torchvision.transforms as transforms
# from collections import Counter

# app = Flask(__name__)

# # Load your trained PyTorch model once when the server starts
# model = torch.load("ML.ptl", map_location=torch.device("cpu"))
# model.eval()  # Set to evaluation mode

# # Define image transforms identical to your training
# transform = transforms.Compose([
#     transforms.Resize((224, 224)),  # Adjust size to your model input
#     transforms.ToTensor(),
#     transforms.Normalize(mean=[0.485, 0.456, 0.406],
#                          std=[0.229, 0.224, 0.225])
# ])

# # Define your labels in the same order your model outputs
# LABELS = [
#     "Pothole",
#     "Damaged electric poles",
#     "Damaged road signs",
#     "Garbage",
#     "Graffiti",
#     "Fallen trees"
# ]

# def predict_image_multiple(image_bytes, runs=3):
#     image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
#     img_t = transform(image)
#     batch_t = torch.unsqueeze(img_t, 0)

#     predictions = []
#     confidences = []

#     with torch.no_grad():
#         for _ in range(runs):
#             out = model(batch_t)
#             probabilities = torch.nn.functional.softmax(out[0], dim=0)

#             confidence, idx = torch.max(probabilities, 0)
#             label = LABELS[idx.item()]

#             predictions.append(label)
#             confidences.append(confidence.item())

#     # Majority vote for label
#     label_count = Counter(predictions)
#     most_common_label, _ = label_count.most_common(1)[0]

#     # Take max confidence among runs of the majority label
#     max_confidence = max([conf for lbl, conf in zip(predictions, confidences) if lbl == most_common_label])

#     return most_common_label, max_confidence

# @app.route('/predict', methods=['POST'])
# def predict():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file part"}), 400
#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({"error": "No selected file"}), 400
#     try:
#         image_bytes = file.read()
#         label, confidence = predict_image_multiple(image_bytes, runs=3)
#         return jsonify({
#             "label": label,
#             "confidence": confidence
#         })
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=8000, debug=True)




#!/usr/bin/env python3

"""

Simple ML server for CivicCare App

This is a basic Flask server that can be used for testing ML predictions.

Replace this with your actual ML model implementation.

"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import io
from PIL import Image
from collections import Counter
import numpy as np

# Try to import YOLO dependencies
try:
    import torch
    import cv2
    from ultralytics import YOLO
    YOLO_AVAILABLE = True
    print("✅ YOLO dependencies loaded successfully!")
except ImportError as e:
    print(f"⚠️ YOLO not available: {e}")
    print("🔄 Using mock predictions only...")
    YOLO_AVAILABLE = False

app = Flask(__name__)
CORS(app)

# Load your trained YOLO model once when the server starts
model = None
if YOLO_AVAILABLE:
    try:
        # Update this path to your actual YOLO model file (.pt)
        model_path = r"C:\react\CivicCareApp\android\app\src\main\models\ML.pt"  # Changed from .ptl to .pt
        model = YOLO(model_path)
        print("✅ YOLO model loaded successfully!")
        print(f"   Model classes: {model.names}")
    except Exception as e:
        print(f"❌ Error loading YOLO model: {e}")
        print("🔄 Falling back to mock predictions...")
        model = None
else:
    print("🔄 YOLO not available, using mock predictions...")

# YOLO doesn't need manual transforms - it handles preprocessing internally

# Class labels must match your model's outputs (only 3 categories trained)
LABELS = [
    "Pothole",
    "Garbage", 
    "Grafitti"
]

def predict_image_yolo(image_data):
    """
    Predict image using YOLO model
    """
    # Check if model is loaded
    if model is None:
        # Fallback to mock prediction
        import random
        import time
        time.sleep(0.5)  # Simulate processing time
        prediction_index = random.randint(0, len(LABELS) - 1)
        return LABELS[prediction_index], random.uniform(0.5, 0.95)
    
    try:
        # Debug: Print image info
        print(f"   📏 Image data size: {len(image_data)} bytes")
        
        # Convert bytes to numpy array for OpenCV
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise Exception("Failed to decode image")
            
        print(f"   🖼️ Image shape: {image.shape}")
        
        # Run YOLO inference
        print(f"   🤖 Running YOLO inference...")
        results = model(image)
        
        # Process results
        detections = []
        for r in results:
            boxes = r.boxes
            if boxes is not None:
                for box in boxes:
                    # Get detection info
                    conf = float(box.conf[0])  # confidence
                    cls = int(box.cls[0])      # class id
                    class_name = model.names[cls]  # class label
                    
                    print(f"   🎯 Detection: {class_name} (confidence: {conf:.3f}, class_id: {cls})")
                    detections.append({
                        'class_name': class_name,
                        'confidence': conf,
                        'class_id': cls
                    })
        
        if not detections:
            print(f"   ⚠️ No detections found, using fallback")
            # No detections - return random prediction
            import random
            prediction_index = random.randint(0, len(LABELS) - 1)
            return LABELS[prediction_index], random.uniform(0.3, 0.6)
        
        # Find the detection with highest confidence
        best_detection = max(detections, key=lambda x: x['confidence'])
        
        print(f"   🏆 Best detection: {best_detection['class_name']} (confidence: {best_detection['confidence']:.3f})")
        #print(f"   📊 All detections: {[(d['class_name'], f'{d[\"confidence\"]:.3f}') for d in detections]}")


        # Format confidences separately
        detections_str = [(d['class_name'], f"{d['confidence']:.3f}") for d in detections]
        print(f"   📊 All detections: {detections_str}")

        
        return best_detection['class_name'], best_detection['confidence']
    
    except Exception as e:
        print(f"⚠️ YOLO prediction failed: {e}")
        import traceback
        traceback.print_exc()
        # Fallback to mock prediction
        import random
        prediction_index = random.randint(0, len(LABELS) - 1)
        return LABELS[prediction_index], random.uniform(0.5, 0.95)


@app.route('/predict', methods=['POST'])
def predict():
    try:
        print(f"\n📥 RECEIVED PREDICTION REQUEST")
        if 'file' not in request.files:
            error_msg = "No file provided"
            print(f"❌ ERROR: {error_msg}")
            return jsonify({"error": error_msg}), 400

        file = request.files['file']
        if file.filename == '':
            error_msg = "No file selected"
            print(f"❌ ERROR: {error_msg}")
            return jsonify({"error": error_msg}), 400

        image_data = file.read()
        print(f" 📁 Processing file: {file.filename}")
        print(f" 📏 File size: {len(image_data)} bytes")

        print(f" 🤖 Running YOLO prediction...")
        
        label, confidence = predict_image_yolo(image_data)

        print(f"\n🔍 ML PREDICTION RESULT:")
        print(f" 🏷️ Label: {label}")
        print(f" 📈 Confidence: {confidence:.2f}")
        print("-" * 50)

        return jsonify({
            "prediction": LABELS.index(label),  # Add prediction index for compatibility
            "label": label,
            "confidence": confidence
        })

    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"❌ ML SERVER ERROR: {str(e)}")
        print(f"📋 Error details: {error_details}")
        return jsonify({"error": str(e), "details": error_details}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "message": "ML Server is running"})

@app.route('/debug', methods=['GET'])
def debug():
    """Debug endpoint to show model and preprocessing info"""
    model_classes = model.names if model is not None else None
    return jsonify({
        "model_loaded": model is not None,
        "yolo_available": YOLO_AVAILABLE,
        "model_classes": model_classes,
        "expected_labels": LABELS,
        "model_path": r"C:\react\CivicCareApp\android\app\src\main\models\ML.pt"
    })

if __name__ == '__main__':
    print("Starting ML Server on http://localhost:8000")
    print("Health check: http://localhost:8000/health")
    print("Debug info: http://localhost:8000/debug")
    print("Prediction endpoint: http://localhost:8000/predict")
    app.run(host='0.0.0.0', port=8000, debug=True)
