package dev.bart.capacitor.sunmibarcodescanner;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.os.Bundle;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import android.Manifest;
import android.graphics.Point;
import android.util.DisplayMetrics;
import androidx.activity.result.ActivityResult;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.camera.core.CameraSelector;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Logger;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.util.List;


@CapacitorPlugin(
    name = "SunmiBarcodeScanner",
    permissions = { @Permission(strings = { Manifest.permission.CAMERA }, alias = SunmiBarcodeScannerPlugin.CAMERA) }
)
public class SunmiBarcodeScannerPlugin extends Plugin {

    private boolean isScanning = false;
    private boolean shouldRunScan = false;
    private boolean didRunCameraSetup = false;
    private boolean didRunCameraPrepare = false;
    private boolean isBackgroundHidden = false;
    private boolean isTorchOn = false;
    private boolean scanningPaused = false;
    private String lastScanResult = null;

    @ActivityCallback
    private void pickScanResultResult(PluginCall call, ActivityResult result) {

        if (call == null) {
            return;
        }
        Intent data = result.getData();
        if(data == null) {
            return;
        }
        JSArray scans = new JSArray();
        Bundle bundle = data.getExtras();
        assert bundle != null;
        var scan_results = (ArrayList<HashMap<String, String>>) bundle.getSerializable("data");
        assert scan_results != null;
        for (HashMap<String, String> hashMap : scan_results) {
            JSObject scan = new JSObject();
            scan.put("type", hashMap.get("TYPE"));
            scan.put("value", hashMap.get("VALUE"));
            scans.put(scan);
        }

        JSObject ret = new JSObject();
        ret.put("scans", scans);
        call.resolve(ret);
    }
    
    @PluginMethod
    public void scan(PluginCall call) throws JSONException {
        try {
            //Note: for the older version SunmiScanner v1.x.x
            Intent intent = new Intent("com.summi.scan");

            intent.putExtra("PLAY_SOUND", call.getBoolean("play_sound", true));
            intent.putExtra("PLAY_VIBRATE", call.getBoolean("play_vibrate", false));

            intent.putExtra("IS_SHOW_SETTING", call.getBoolean("show_setting", false));
            intent.putExtra("IS_SHOW_ALBUM", call.getBoolean("show_album_selector", false));
            intent.putExtra("IS_OPEN_LIGHT", call.getBoolean("show_flashlight", false));

            intent.putExtra("IDENTIFY_MORE_CODE", call.getBoolean("recognize_multiple_codes", false));
            intent.putExtra("IDENTIFY_INVERSE", call.getBoolean("recognize_inverse_codes", false));

            intent.putExtra("SCAN_MODE", call.getBoolean("scan_mode", false));

            JSObject symbologies = call.getObject("symbologies", new JSObject());
            assert symbologies != null;

            intent.putExtra("IS_EAN_8_ENABLE", symbologies.getBoolean("ean_8", false));
            intent.putExtra("IS_UPC_E_ENABLE", symbologies.getBoolean("upc_e", false));
            intent.putExtra("IS_ISBN_10_ENABLE", symbologies.getBoolean("isbn_10", false));
            intent.putExtra("IS_CODE_11_ENABLE", symbologies.getBoolean("code_11", false));
            intent.putExtra("IS_UPC_A_ENABLE", symbologies.getBoolean("upc_a", false));
            intent.putExtra("IS_EAN_13_ENABLE", symbologies.getBoolean("ean_13", false));
            intent.putExtra("IS_ISBN_13_ENABLE", symbologies.getBoolean("isbn_13", false));
            intent.putExtra("IS_INTERLEAVED_2_OF_5_ENABLE", symbologies.getBoolean("interleaved_2_of_5", false));
            intent.putExtra("IS_CODE_128_ENABLE", symbologies.getBoolean("code_128", false));
            intent.putExtra("IS_CODABAR_ENABLE", symbologies.getBoolean("codabar", false));
            intent.putExtra("IS_CODE_39_ENABLE", symbologies.getBoolean("code_39", false));
            intent.putExtra("IS_CODE_93_ENABLE", symbologies.getBoolean("code_93", false));
            intent.putExtra("IS_DATABAR_ENABLE", symbologies.getBoolean("databar", false));
            intent.putExtra("IS_DATABAR_EXP_ENABLE", symbologies.getBoolean("databar_exp", false));
            intent.putExtra("IS_Micro_PDF417_ENABLE", symbologies.getBoolean("micro_pdf417", false));
            intent.putExtra("IS_MicroQR_ENABLE", symbologies.getBoolean("microqr", false));
            intent.putExtra("IS_QR_CODE_ENABLE", symbologies.getBoolean("qr_code", false));
            intent.putExtra("IS_PDF417_ENABLE", symbologies.getBoolean("pdf417", false));
            intent.putExtra("IS_DATA_MATRIX_ENABLE", symbologies.getBoolean("data_matrix", false));
            intent.putExtra("IS_AZTEC_ENABLE", symbologies.getBoolean("aztec", false));
            intent.putExtra("IS_Hanxin_ENABLE", symbologies.getBoolean("hanxin", false));

            try {
                startActivityForResult(call, intent, "pickScanResultResult");
            } catch (ActivityNotFoundException e) {
                //Note: if the device has ScannerHead v4.4.4 and above versions
                intent.setAction("com.sunmi.scanner.qrscanner");
                startActivityForResult(call, intent, "pickScanResultResult");
            }
        } catch (RuntimeException e) {
            call.reject(e.getMessage(), e);
        }
    }
    
    @PluginMethod
    public void openSettings(PluginCall call) {
        try {
            implementation.openSettings(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            call.reject(exception.getMessage());
        }
    }
     
    /**
     * Must run on UI thread.
     */
    public void stopScan() {
        showWebViewBackground();
        // Stop the camera
        if (processCameraProvider != null) {
            processCameraProvider.unbindAll();
        }
        processCameraProvider = null;
        camera = null;
        barcodeScannerInstance = null;
        scanSettings = null;
        barcodeRawValueVotes.clear();
    }

    /**
     * Must run on UI thread.
     */
    private void hideWebViewBackground() {
        plugin.getBridge().getWebView().setBackgroundColor(Color.TRANSPARENT);
    }

    /**
     * Must run on UI thread.
     */
    private void showWebViewBackground() {
        plugin.getBridge().getWebView().setBackgroundColor(Color.WHITE);
    }

    private void handleScannedBarcode(Barcode barcode, Point imageSize) {
        plugin.notifyBarcodeScannedListener(barcode, imageSize);
    }

    private void destroy(){
        shoBackground();
        dismantleCamera();
    }

}