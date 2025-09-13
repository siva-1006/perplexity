package com.anonymous.CivicCareApp;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import org.pytorch.IValue;
import org.pytorch.Module;
import org.pytorch.Tensor;
import org.pytorch.torchvision.TensorImageUtils;
import java.io.File;
import java.io.InputStream;

public class PyTorchModule extends ReactContextBaseJavaModule {
    private Module model;

    public PyTorchModule(ReactApplicationContext reactContext) {
        super(reactContext);
        try {
            model = Module.load(assetFilePath(reactContext, "models/ML.ptl"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public String getName() {
        return "PyTorchModule";
    }

    @ReactMethod
    public void runModel(String base64Image, Promise promise) {
        try {
            // Convert base64 to bitmap
            byte[] decodedBytes = android.util.Base64.decode(base64Image, android.util.Base64.DEFAULT);
            Bitmap bitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
            Tensor inputTensor = TensorImageUtils.bitmapToFloat32Tensor(
                bitmap,
                TensorImageUtils.TORCHVISION_NORM_MEAN_RGB,
                TensorImageUtils.TORCHVISION_NORM_STD_RGB
            );
            Tensor outputTensor = model.forward(IValue.from(inputTensor)).toTensor();
            float[] scores = outputTensor.getDataAsFloatArray();

            int maxIndex = 0;
            float maxScore = -Float.MAX_VALUE;
            for (int i = 0; i < scores.length; i++) {
                if (scores[i] > maxScore) {
                    maxScore = scores[i];
                    maxIndex = i;
                }
            }

            promise.resolve(maxIndex);
        } catch (Exception e) {
            promise.reject("PREDICTION_ERROR", e);
        }
    }

    private static String assetFilePath(ReactApplicationContext context, String assetName) throws Exception {
        File file = new File(context.getFilesDir(), assetName);
        if (file.exists() && file.length() > 0) {
            return file.getAbsolutePath();
        }
        try (InputStream is = context.getAssets().open(assetName)) {
            java.io.FileOutputStream os = new java.io.FileOutputStream(file);
            byte[] buffer = new byte[4 * 1024];
            int read;
            while ((read = is.read(buffer)) != -1) {
                os.write(buffer, 0, read);
            }
            os.flush();
            return file.getAbsolutePath();
        }
    }
}
