const express = require('express');
const app = express();
const compression = require('compression');
/*
app.get('/autenticacaoAutorizada',(req,res)=>{

    let token = req.body.token;

    var url = '/#/conteudo';
    
    res.redirect(url);

    console.log("funcionando AQUIIIIIIIII");
})
*/
app.use(compression());
app.use(express.static('./app'));

app.use('/qr', (req, res) => {
    
    var url = '/#/qr';

    res.redirect(url);
});


app.use('/login', (req, res) => {
    
    var url = '/#/login';

    res.redirect(url);

});

module.exports = app;