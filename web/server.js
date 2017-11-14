const http = require('http');
const app = require('./config');

http.createServer(app).listen(7009, ()=>{
    console.log("Servidor na porta 7009");
});
