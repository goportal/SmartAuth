package com.example.portal.smartauth;

import android.*;
import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.hardware.fingerprint.FingerprintManager;
import android.os.CancellationSignal;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.vision.barcode.Barcode;

public class Home extends AppCompatActivity {

    public static final int PERMISSION_REQUEST = 200;
    public static final int REQUEST_CODE = 100;
    Button bt_registrar;
    Button bt_leQr;

    private String usuarioHash;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        bt_registrar = (Button) findViewById(R.id.bt_registrar);
        bt_leQr = (Button) findViewById(R.id.bt_leQr);

        bt_registrar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent tela = new Intent(Home.this,Registrar.class);
                startActivity(tela);
            }
        });

        if(ContextCompat.checkSelfPermission(this, android.Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED){
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA}, PERMISSION_REQUEST);
        }

        bt_leQr.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(Home.this, LeitorQrDialog.class);

                startActivityForResult(intent, REQUEST_CODE );

            }
        });

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data){
        if(requestCode == REQUEST_CODE && resultCode == RESULT_OK){
            if(data != null ){
                final Barcode barcode = data.getParcelableExtra("barcode");

                usuarioHash = barcode.displayValue;

                Intent tela = new Intent(Home.this,LeitorDigitalDialog.class);
                tela.putExtra("hash",usuarioHash);
                startActivity(tela);

            }
        }
    }
}