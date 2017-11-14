package com.example.portal.smartauth;

import android.content.Intent;
import android.hardware.fingerprint.FingerprintManager;
import android.media.Image;
import android.os.CancellationSignal;
import android.os.Handler;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LeitorDigital extends FingerprintManager.AuthenticationCallback {

    private FingerprintManager mFingerprintManager;
    LeitorDigitalDialog front;
    private FingerprintManager.CryptoObject mCryptoObject;
    private CancellationSignal mCancellationSignal;
    private boolean mSelfCancelled;

    TextView tx_resposta;
    ImageView img_status;
    Button bt_cancelar;
    String hash;
    String dispositivo = "";

    LeitorDigital(String Tdispositivo, String hash, Button bt_can, ImageView img, TextView resposta, LeitorDigitalDialog principal) {
        front = principal;
        tx_resposta = resposta;
        img_status = img;
        bt_cancelar = bt_can;
        this.hash = hash;
        dispositivo = Tdispositivo;
    }

    public void escutaDigital() {
        if (isFingerprintAuthAvailable()) {
            mFingerprintManager = front.getSystemService(FingerprintManager.class);

            mCancellationSignal = new CancellationSignal();

            try {
                mFingerprintManager.authenticate(mCryptoObject, mCancellationSignal, 0, this, null);
            } catch (SecurityException e) {

            }
        } else {
            Toast toast = Toast.makeText(front, "Dispositivo não contém leitor biometrico ou não ha digital cadastrada", Toast.LENGTH_SHORT);
            toast.show();
        }


    }

    public void paraEscutarDigital() {
        if (mCancellationSignal != null) {
            mSelfCancelled = true;
            mCancellationSignal.cancel();
            mCancellationSignal = null;
        }
    }

    public boolean isFingerprintAuthAvailable() {
        try {
            mFingerprintManager = front.getSystemService(FingerprintManager.class);
            if (mFingerprintManager.isHardwareDetected() && mFingerprintManager.hasEnrolledFingerprints()) {
                return true;
            } else return false;
        } catch (SecurityException e) {

        }
        return false;
    }


    @Override
    public void onAuthenticationError(int errMsgId, CharSequence errString) {
        if (!mSelfCancelled) {

            tx_resposta.setText("erro na autenticação: " + errString);

        }
    }

    @Override
    public void onAuthenticationFailed() {
        img_status.setImageResource(R.mipmap.logolock);
        tx_resposta.setText("Digital não reconhecida!");
    }

    @Override
    public void onAuthenticationSucceeded(FingerprintManager.AuthenticationResult result) {
        img_status.setImageResource(R.mipmap.logounlock);
        tx_resposta.setText("");
        bt_cancelar.setVisibility(View.INVISIBLE);

        enviaSucessoServidor(hash, dispositivo, true);

        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                front.finish();
            }
        }, 200);

    }


    public void enviaSucessoServidor(String hash, String dispositivo, boolean autenticacaoValida) {
        RetrofitService service = ServiceGenerator.createService(RetrofitService.class);

        Call<RespostaRegistro> call = service.converterAutentica(hash, dispositivo, autenticacaoValida);

        call.enqueue(new Callback<RespostaRegistro>() {
            @Override
            public void onResponse(Call<RespostaRegistro> call, Response<RespostaRegistro> response) {
                if (response.isSuccessful()) {
                    RespostaRegistro respostaRegistro = response.body();

                    if (respostaRegistro != null) {
                        tx_resposta.setText("Leitura biometrica realizada com sucesso!");
                    }

                } else {
                    tx_resposta.setText("Erro na leitura biometrica!");
                }
            }

            @Override
            public void onFailure(Call<RespostaRegistro> call, Throwable t) {
                tx_resposta.setText("Erro na leitura biometrica!");
            }
        });

    }

    ;

}
