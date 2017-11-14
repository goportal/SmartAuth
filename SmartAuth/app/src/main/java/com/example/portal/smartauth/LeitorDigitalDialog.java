package com.example.portal.smartauth;

import android.content.Intent;
import android.provider.Settings;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

public class LeitorDigitalDialog extends AppCompatActivity {

    LeitorDigital leitor;
    Button bt_cancelar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_leitor_digital_dialog);

        bt_cancelar = (Button) findViewById(R.id.bt_cancelar);

        String dispositivo = (Settings.Secure.getString(getBaseContext().getContentResolver(), Settings.Secure.ANDROID_ID));

        Intent it = getIntent();

        String hash = it.getStringExtra("hash");

        leitor = new LeitorDigital(dispositivo,hash,(Button) findViewById(R.id.bt_cancelar),(ImageView) findViewById(R.id.img_lock),(TextView) findViewById(R.id.tx_resposta),this);
        leitor.escutaDigital();

        bt_cancelar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                leitor.paraEscutarDigital();
                finish();
            }
        });
    }
}
