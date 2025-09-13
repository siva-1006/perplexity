#!/usr/bin/env python3
"""
Test script for ML server
"""

import requests
import json
from PIL import Image
import io

def test_ml_server():
    """Test the ML server endpoints"""
    
    # Test health endpoint
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"✅ Health check: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False
    
    # Create a test image
    print("\n🖼️ Creating test image...")
    test_image = Image.new('RGB', (224, 224), color='red')
    img_buffer = io.BytesIO()
    test_image.save(img_buffer, format='JPEG')
    img_buffer.seek(0)
    
    # Test prediction endpoint
    print("🤖 Testing prediction endpoint...")
    try:
        files = {'file': ('test.jpg', img_buffer, 'image/jpeg')}
        response = requests.post("http://localhost:8000/predict", files=files)
        
        print(f"✅ Prediction: {response.status_code}")
        result = response.json()
        print(f"   Result: {json.dumps(result, indent=2)}")
        
        # Verify response format
        required_fields = ['label', 'confidence']
        for field in required_fields:
            if field not in result:
                print(f"❌ Missing field: {field}")
                return False
        
        # Verify label is one of the 3 trained categories
        valid_labels = ['Pothole', 'Garbage', 'Graffiti']
        if result['label'] not in valid_labels:
            print(f"❌ Invalid label: {result['label']}. Expected one of: {valid_labels}")
            return False
        
        print("✅ All tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Prediction test failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing ML Server...")
    success = test_ml_server()
    if success:
        print("\n🎉 All tests passed! ML server is working correctly.")
    else:
        print("\n💥 Some tests failed. Check the ML server.")
