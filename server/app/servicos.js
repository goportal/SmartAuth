const express = require('express');
const servico = express.Router(); 
var crypto = require('crypto');
const NodeMailer = require('../nodemailer/NodeMailer');
const mongodb = require('mongodb').MongoClient;
const validacao = require('./validacoes');
const ObjectId = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
const jwt_key = "H4v31Y0u2Ev3r353en47he5R41n";
const authMiddleware = require('./jwtMiddleware');

function mongo(callback){
    mongodb.connect('mongodb://localhost:27017/smartauth',(err,db)=>{
        callback(err,db);
    })
}

servico.post('/login', (req, res) => {
    
    const body = req.fields || req.body;
    
    mongo((err,db)=>{
        if(err){
            console.log("Erro ao buscar usuario Error: "+err);
            res.status(500).send("erro no banco de dados");
        }else{
            
            let query = {
                email:body.login
            }
            
            db.collection('usuarios').findOne(query,(err,result)=>{
                if(err){
                    console.log("Usuario não encontrado");
                    res.status(500).send("erro ao buscar usuario no banco de dados");
                }else{
                    
                    if(result){
                        
                        let dadosUsuario = {
                            usuario:result.email,
                            dispositivo:result.dispositivo,
                            timestamp: Date.now()
                        }
                        
                        var hash = crypto.createHash('sha256').update(JSON.stringify(dadosUsuario)).digest('hex');
                        
                        db.collection('usuarios').update(
                            {_id: new ObjectId(result._id)}, 
                            {
                                $set: {
                                    acesso: hash
                                }
                            },
                            (err, resultado)=>{
                                
                                if(err){
                                    console.log("Erro ao buscar usuario Error: "+err);
                                    res.status(404).send("erro ao buscar usuario");
                                }else{
                                    console.log("sucesso ao buscar usuario");
                                    res.status(200).send(hash);
                                }
                            }    
                        );       
                    }else{
                        res.status(404).send("Usuario invalido!");
                    }
                }    
            });
        };        
    });
});

servico.get('/ativarSmartphone',(req,res)=>{
    let dispositivo = req.query.dispositivo;

    mongo((err,db)=>{

        let query = {
            dispositivo:dispositivo
        };
        let update = {
            $set: {"ativo": true}
        };

        db.collection('usuarios').findOneAndUpdate(query,update,(err,result)=>{
            if(err){
                console.log('Não foi possivel validar o aparelho informado');
                res.status(500).send('Não foi possivel validar o aparelho informado');
            }else{
                console.log('Smartphone ativado com sucesso!');
                res.status(200).send('Smartphone ativado com sucesso!');
            }
        })
    })
})

servico.post('/registrar',(req,res) => {
    
    console.log("tentativa de registrar realizada!");
    const data = req.body;
    
    validacao(data,(err,msg)=>{
        if(!err){
            const usuario = {
                email:data.email,
                dispositivo: data.dispositivo,
                leitores: data.sensores,
                ativo:false
            }
        
            mongo((err,db)=>{
                db.collection('usuarios').insertOne(usuario,(err)=>{
                    if(!err){
                        res.status(200).send({sucesso:true,mensagem:"Smartphone cadastrado com sucesso"});
                        console.log("Smartphone cadastrado com sucesso");
                        enviaEmailConfirmacao(usuario.email, usuario.dispositivo);
                    }else{
                        res.status(500).send({sucesso:false,mensagem:"Erro ao cadastrar smartphone"});
                        console.log("Erro ao cadastrar smartphone");
                    }
                })
                db.close();
            })
        }else{
            console.log(msg);
            res.status(400).send({sucesso:false,mensagem:"Dados informados sao invalidos"});
        }
    });
    
});

servico.post("/isAutorizado",(req,res)=>{


    console.log("isAutorizado");
    let hash = req.body.hash;
    let login = req.body.login;
    
    mongo((err,db)=>{

        const query = {
            email:login
        }

        db.collection("usuarios").findOne(query,(err,result)=>{
            if(!err){
                if(result.acesso != hash){
                    console.log("token enviado com sucesso");
                    res.status(200).send(result.acesso);
                }else{
                    res.status(403).send("Token ainda nao validado");
                }
            }else{
                res.status(500).send("erro na consulta");
            }
        })

    })
    
})

servico.post('/autentica',(req,res)=>{
    console.log('Tentativa de autenticação!');
    let data = req.body;
    /*
    data = 
    dispositivo
    hash
    autenticacaoValida    
    */ 
    let query = {
        acesso:data.hash
    }
    
    mongo((err,db)=>{
        db.collection('usuarios').findOne(query,(err,result)=>{
            if(!err){
                if(data.dispositivo === result.dispositivo && data.autenticacaoValida && result.ativo){
                    autentica(data,(token)=>{

                        db.collection('usuarios').update(
                            {_id: new ObjectId(result._id)}, 
                            {
                                $set: {
                                    acesso: token
                                }
                            },
                            (err, resultado)=>{
                                
                                if(err){
                                    console.log("Erro ao setar token de acesso no banco"+err);
                                    res.status(404).send({sucesso:false,mensagem:"Erro ao setar token de acesso no banco"});
                                }else{
                                    console.log("Sucesso ao setar token de acesso no banco");
                                    res.status(200).send({sucesso:true,mensagem:"Sucesso ao setar token de acesso no banco"});
                                }
                            }    
                        ); 
                    });
                }else{
                    if(!result.ativo){
                        res.status(401).send({sucesso:false,mensagem:"Smartphone não esta ativo, acesse o email para validar"});
                        console.log("smartphone nao ativo   ");
                    }else{
                        res.status(401).send({sucesso:false,mensagem:"Usuario invalido"});
                    }
                }
            }else{
                res.status(401).send({sucesso:false,mensagem:"Usuario invalido"});
            }
        });
    });
});

servico.post('/conteudo',authMiddleware,(req,res)=>{
    console.log("realizada busca de conteudo");
    
    let coletania = {
        banda:"Pink Floyd",
        albuns: [
            "1967 - The Piper At The Gates Of Dawn",
            "1968 - A Saucerful Of Secrets",
            "1969 - More",
            "1969 - Ummagumma",
            "1970 - Atom Heart Mother",
            "1971 - Meddle",
            "1972 - Obscured By Clouds",
            "1973 - The Dark Side of the Moon",
            "1975 - Wish You Were Here",
            "1977 - Animals",
            "1979 - The Wall",
            "1983 - The Final Cut",
            "1987 - A Momentary Lapse Of Reason",
            "1994 - The Division Bell"]
        }
        
        res.status(200).send(coletania)
    })
    
    module.exports = servico;
    
    
    function autentica(usuario, callback) {
        
        const dados = {
            dispositivo:usuario.dispositivo,
            valido:usuario.valido,
            hash:usuario.hash
        };
        
        const token = jwt.sign(dados, jwt_key, {
            expiresIn: 86400
        });
        
        callback(token);
    }

    function enviaEmailConfirmacao(email, dispositivo){
        const mailer = new NodeMailer();
        mailer.setTo(email);
        mailer.setTemplate('../nodemailer/validaLogin.ejs');
        mailer.setSubject('SmartAuth - Validação de aparelho');
        mailer.setMensagens({
            email: email,
            dispositivo: dispositivo
        });
        mailer.enviarEmail();
    }
    
    
    
    
    