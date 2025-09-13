# CivicCare App Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- MongoDB (local or cloud)
- Android Studio (for Android development)
- Expo CLI

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd civiccare-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the `civiccare-backend` directory with:
   ```
   MONGO_URI=mongodb://localhost:27017/civiccare
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=4000
   ```

4. **Start MongoDB:**
   - Local: Start MongoDB service
   - Cloud: Use MongoDB Atlas connection string

5. **Start backend server:**
   ```bash
   npm start
   ```
   Server will run on http://localhost:4000

## ML Server Setup (Optional)

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start ML server:**
   ```bash
   python ml_server.py
   ```
   Server will run on http://localhost:8000

## Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Expo development server:**
   ```bash
   npm start
   ```

3. **Run on device/emulator:**
   ```bash
   npm run android  # For Android
   npm run ios      # For iOS
   ```

## Configuration

### API Configuration
- Update `api.js` with your backend server IP address
- Default: `http://10.152.163.127:4000` (change to your machine's IP)

### ML Server Configuration
- Update ML server URL in `ReportIssueScreen.js` if needed
- Default: `http://10.152.163.127:8000/predict`

## Testing

1. **Backend Health Check:**
   ```bash
   curl http://localhost:4000
   ```

2. **ML Server Health Check:**
   ```bash
   curl http://localhost:8000/health
   ```

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **ML Model Not Working:**
   - Ensure ML server is running
   - Check network connectivity between app and server
   - For Android emulator, use `10.0.2.2` instead of `localhost`

3. **Authentication Issues:**
   - Check JWT_SECRET in `.env`
   - Ensure backend is running on correct port

4. **Camera/Permissions Issues:**
   - Check app.json permissions
   - Test on physical device for camera functionality

## Development Notes

- The app currently uses mock ML predictions
- Replace `ml_server.py` with your actual ML model
- Add proper error handling and validation
- Implement proper token storage for authentication
- Add database models for reports storage

## Production Deployment

1. **Backend:**
   - Use environment variables for production
   - Set up proper MongoDB cluster
   - Use HTTPS
   - Add rate limiting and security headers

2. **Frontend:**
   - Build production APK/IPA
   - Configure proper API endpoints
   - Add error tracking (Sentry, etc.)

3. **ML Server:**
   - Deploy on cloud platform
   - Use proper model serving framework
   - Add monitoring and logging



