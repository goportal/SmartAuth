package com.example.portal.smartauth;


import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.Headers;
import retrofit2.http.POST;

public interface RetrofitService {

    //@Headers("")

    @FormUrlEncoded
    @POST("registrar")
    Call<RespostaRegistro> converterUnidade(@Field("email") String email,
                                            @Field("dispositivo") String dispositivo,
                                            @Field("sensores") String[] sensores
    );

    @FormUrlEncoded
    @POST("autentica")
    Call<RespostaRegistro> converterAutentica(@Field("hash") String hash,
                                              @Field("dispositivo") String dispositivo,
                                              @Field("autenticacaoValida") boolean autenticacaoValida
    );


}
