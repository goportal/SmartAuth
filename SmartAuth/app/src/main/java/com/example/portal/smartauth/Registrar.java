package com.example.portal.smartauth;

import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.provider.Settings;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Registrar extends AppCompatActivity {

    EditText cp_email;
    EditText cp_senha;
    EditText cp_confirmaSenha;
    Button bt_registrar2;
    Button bt_voltar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registrar);

        bt_voltar = (Button) findViewById(R.id.bt_voltar);
        cp_email = (EditText) findViewById(R.id.cp_email);
        cp_senha = (EditText) findViewById(R.id.cp_senha);
        cp_confirmaSenha = (EditText) findViewById(R.id.cp_confirmaSenha);
        bt_registrar2 = (Button) findViewById(R.id.bt_registrar2);

        bt_registrar2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                String email = cp_email.getText().toString();
                String senha = cp_senha.getText().toString();
                String confirmaSenha = cp_confirmaSenha.getText().toString();

                String valida = validaRegistro(email,senha,confirmaSenha);

                if(valida.equals("Registro realizado com sucesso")){
                    retrofitConverter(email,senha);
                    Toast toast = Toast.makeText(Registrar.this,valida,Toast.LENGTH_SHORT);
                    toast.show();
                    Intent tela = new Intent(Registrar.this,Home.class);
                    startActivity(tela);
                    finish();
                }else{
                    Toast toast = Toast.makeText(Registrar.this,valida,Toast.LENGTH_SHORT);
                    toast.show();
                }
            }
        });

        bt_voltar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

    }


    public void retrofitConverter(String email, String senha) {
        RetrofitService service = ServiceGenerator.createService(RetrofitService.class);

        String dispositivo = (Settings.Secure.getString(getBaseContext().getContentResolver(), Settings.Secure.ANDROID_ID));

        String[] sensores = getSensorList();

        Call<RespostaRegistro> call = service.converterUnidade(email, senha, dispositivo, sensores);

        call.enqueue(new Callback<RespostaRegistro>() {
            @Override
            public void onResponse(Call<RespostaRegistro> call, Response<RespostaRegistro> response) {
                if(response.isSuccessful()){
                    RespostaRegistro respostaRegistro = response.body();

                    if(respostaRegistro != null){

//                        Toast toast = Toast.makeText(Registrar.this,"aqui: "+respostaRegistro,Toast.LENGTH_SHORT);
//                        toast.show();
                    }

                }else{
//                    Toast toast = Toast.makeText(Registrar.this,"nao sucessfull",Toast.LENGTH_SHORT);
//                    toast.show();
                }
            }

            @Override
            public void onFailure(Call<RespostaRegistro> call, Throwable t) {

            }
        });

    }

    public String[] getSensorList() {
        SensorManager mSensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);

        List<Sensor> lista = mSensorManager.getSensorList(Sensor.TYPE_ALL);
        Iterator<Sensor> iterator = lista.iterator();
        List<String> sensores = new ArrayList<String>();
        while (iterator.hasNext()) {
            Sensor sensor = iterator.next();
            sensores.add(sensor.getName());
        }

        String[] sensoresArray = new String[sensores.size()];

        for (int I = 0; I < sensores.size(); I++) {
            sensoresArray[I] = sensores.get(I);
        }

        return sensoresArray;

        //Toast.makeText(getApplicationContext(), sensores, Toast.LENGTH_LONG).show();

    }

    public String validaRegistro(String email, String senha, String confirmaSenha){

        if(email.indexOf("@") == -1 || email.indexOf(".com") == -1){
            return "Email invalido";
        }else if(!confirmaSenha.equals(senha)){
            return "As senhas nao coincidem";
        }else if(senha.length() < 6){
            return "A senha deve conter ao menos 6 caracteres";
        }else
            return "Registro realizado com sucesso";
    }

}
