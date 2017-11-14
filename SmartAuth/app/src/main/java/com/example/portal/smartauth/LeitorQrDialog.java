package com.example.portal.smartauth;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.SparseArray;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.google.android.gms.vision.CameraSource;
import com.google.android.gms.vision.Detector;
import com.google.android.gms.vision.barcode.Barcode;
import com.google.android.gms.vision.barcode.BarcodeDetector;

import java.io.IOException;

public class LeitorQrDialog extends AppCompatActivity {
    SurfaceView cameraView;
    BarcodeDetector barcode;
    CameraSource cameraSource;
    SurfaceHolder holder;
    Button bt_cancelar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_leitor_qr_dialog);

        cameraView = (SurfaceView) findViewById(R.id.cameraView);
        cameraView.setZOrderMediaOverlay(true);
        holder = cameraView.getHolder();
        barcode = new BarcodeDetector.Builder(this).setBarcodeFormats(Barcode.QR_CODE).build();

        bt_cancelar = (Button) findViewById(R.id.bt_cancelarQr);

        bt_cancelar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        if(!barcode.isOperational()){
            Toast.makeText(getApplicationContext(),"erro ao configurar o detector",Toast.LENGTH_LONG).show();
            this.finish();
        }

        cameraSource = new CameraSource.Builder(this, barcode).setFacing(CameraSource.CAMERA_FACING_BACK).setRequestedFps(24).setAutoFocusEnabled(true).setRequestedPreviewSize(800,1200).build();

        cameraView.getHolder().addCallback(new SurfaceHolder.Callback() {
            @Override
            public void surfaceCreated(SurfaceHolder surfaceHolder) {
                try{
                    if(ContextCompat.checkSelfPermission(LeitorQrDialog.this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED){
                        cameraSource.start(cameraView.getHolder());
                    }
                }catch(IOException e){
                    e.printStackTrace();
                }


            }

            @Override
            public void surfaceChanged(SurfaceHolder surfaceHolder, int i, int i1, int i2) {

            }

            @Override
            public void surfaceDestroyed(SurfaceHolder surfaceHolder) {

            }
        });

        barcode.setProcessor(new Detector.Processor<Barcode>(){
            @Override
            public void release(){

            }

            @Override
            public void receiveDetections(Detector.Detections<Barcode> detections){
                final SparseArray<Barcode> barcodes = detections.getDetectedItems();
                if(barcodes.size() > 0){
                    Intent intent = new Intent();
                    intent.putExtra("barcode", barcodes.valueAt(0));
                    setResult(RESULT_OK,intent);
                    finish();
                }
            }
        });

    }
}
