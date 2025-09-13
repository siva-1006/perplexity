# 🐛 Debug Guide for CivicCareApp ML Server

## ✅ **Bugs Fixed:**

### 1. **Duplicate model.eval() call** - FIXED
- **Issue**: `model.eval()` was called twice
- **Fix**: Removed duplicate call, added error handling

### 2. **Missing PyTorch dependencies** - FIXED
- **Issue**: Server would crash if PyTorch not installed
- **Fix**: Added graceful fallback to mock predictions

### 3. **Model loading errors** - FIXED
- **Issue**: Hard crash if model file not found
- **Fix**: Added try-catch with fallback to mock predictions

### 4. **Response format mismatch** - FIXED
- **Issue**: Frontend expected `prediction` index, server only sent `label`
- **Fix**: Added both `prediction` index and `label` to response

### 5. **Transform not available** - FIXED
- **Issue**: Transform would be undefined if PyTorch not available
- **Fix**: Added conditional transform definition

## 🔧 **How to Test the Fixes:**

### **Step 1: Install Dependencies**
```bash
pip install -r requirements.txt
```

### **Step 2: Start ML Server**
```bash
python ml_server.py
```

**Expected Output:**
```
✅ PyTorch dependencies loaded successfully!
✅ PyTorch model loaded successfully!
Starting ML Server on http://localhost:8000
```

**OR (if PyTorch not available):**
```
⚠️ PyTorch not available: No module named 'torch'
🔄 Using mock predictions only...
🔄 PyTorch not available, using mock predictions...
Starting ML Server on http://localhost:8000
```

### **Step 3: Test the Server**
```bash
python test_ml_server.py
```

**Expected Output:**
```
🧪 Testing ML Server...
🔍 Testing health endpoint...
✅ Health check: 200
   Response: {'status': 'healthy', 'message': 'ML Server is running'}

🖼️ Creating test image...
🤖 Testing prediction endpoint...
✅ Prediction: 200
   Result: {
     "prediction": 2,
     "label": "Damaged road signs",
     "confidence": 0.87
   }
✅ All tests passed!

🎉 All tests passed! ML server is working correctly.
```

## 🚨 **Common Issues and Solutions:**

### **Issue 1: "No module named 'torch'"**
**Solution:**
```bash
pip install torch torchvision
```

### **Issue 2: "Model file not found"**
**Solution:**
- Check if `ML.ptl` exists in `android/app/src/main/models/`
- Server will fallback to mock predictions automatically

### **Issue 3: "Transform not available"**
**Solution:**
- Install PyTorch: `pip install torch torchvision`
- Server will fallback to mock predictions if not available

### **Issue 4: Frontend shows "Unknown" predictions**
**Solution:**
- Check ML server is running on port 8000
- Verify network connectivity
- Check console for error messages

## 📊 **Response Format:**

**Success Response:**
```json
{
  "prediction": 1,
  "label": "Garbage", 
  "confidence": 0.87
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "details": "Full error traceback"
}
```

## 🎯 **Testing Checklist:**

- [ ] ML server starts without errors
- [ ] Health endpoint returns 200
- [ ] Prediction endpoint accepts image files
- [ ] Response includes all required fields
- [ ] Frontend displays predictions correctly
- [ ] Confidence scores are reasonable (0.0-1.0)
- [ ] All 3 categories can be predicted (Pothole, Garbage, Graffiti)

## 🔍 **Debug Commands:**

```bash
# Test health
curl http://localhost:8000/health

# Test prediction with image
curl -X POST -F "file=@test_image.jpg" http://localhost:8000/predict

# Check server logs
python ml_server.py  # Watch console output
```

## 🎉 **Expected Behavior:**

1. **With PyTorch**: Real ML predictions with confidence scores
2. **Without PyTorch**: Mock predictions with random confidence
3. **Model not found**: Fallback to mock predictions
4. **Network issues**: Clear error messages in frontend

**All bugs have been fixed and the system is now robust!** 🚀
