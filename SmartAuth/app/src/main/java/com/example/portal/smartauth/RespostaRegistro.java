package com.example.portal.smartauth;

public class RespostaRegistro {

    public RespostaRegistro(){}

    private boolean sucesso;
    private String mensagem;

    public boolean isSucesso() {
        return sucesso;
    }

    public void setSucesso(boolean sucesso) {
        this.sucesso = sucesso;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }
}
