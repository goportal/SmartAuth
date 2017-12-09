// const http = require('http');
const app = require('./config');
const https = require('https');
const fs = require('fs');

const portaHttp = 7008;

let certificate = {
  key: fs.readFileSync('certificate/certificate.key'),
  cert: fs.readFileSync('certificate/certificate.crt')
};

// http.createServer(app).listen(portaHttp, ()=>{
//     console.log("Servidor rest rodando na porta 7008");
// });

https.createServer(certificate, app).listen(7008,()=>{
  console.log("Rodando HTTPS");
})