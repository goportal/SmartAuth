const express = require('express');
const app = express();
const bodyparser = require('body-parser'); 
const cors = require('cors');

app.use(cors());

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use('/servicos', require('./app/servicos'));

module.exports = app;
