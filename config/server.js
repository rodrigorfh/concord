// Importar express
var express = require('express');

// Importar body-parser
var bodyParser = require('body-parser'); // processa corpo de requests

var cookieParser = require('cookie-parser');  // processa cookies

var expressValidator = require('express-validator'); //importa validator


// Inicia o objeto
var app = express();


// Setar view engine
app.set('view engine', 'ejs');
app.set('views', './app/view');

// Configurar json
app.use(bodyParser.json());

// Cofigura o expressvalidator;
app.use(expressValidator());

// Configurar os cookies
app.use(cookieParser());

// Configurar o middleware express.static
app.use(express.static('./app'));

// Configurar o middleware body-parser
app.use(bodyParser.urlencoded({extended: true}));


// Exporta o objeto app
module.exports = app;