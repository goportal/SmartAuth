module.exports = function validaRegistro(data,callback){
    if(data.senha.length < 6){
        callback(true,"Senha deve conter ao menos 6 caracteres");
    }else
    if(!data.dispositivo){
        callback(true,"Não foi encontrado um dispositivo com o numero indicado");
    }else
    if(data.email.indexOf(".com") == -1 || data.email.indexOf("@") == -1){
        callback(true,"O email informado é invalido");
    }
    else{
        callback(false,"Registro valido");
    }
}