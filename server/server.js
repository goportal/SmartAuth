const http = require('http');
const app = require('./config');
const portaHttp = 7008;

http.createServer(app).listen(portaHttp, ()=>{
    console.log("Servidor rest rodando na porta 7008");
});