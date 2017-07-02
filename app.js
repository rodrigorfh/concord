var app = require('./config/server');
var server = app.listen(80, function(){
	console.log("Servidor Online");
});
var io = require('socket.io').listen(server);

app.set('io', io);
io.on('connection', function(socket){
	console.log("Cliente conectado");

	socket.on('enviarMsg', function(data){
		console.log('recebi: '+data.user );
		socket.emit('mensagemParaCliente', {
			user: data.user,
			mensagem: data.mensagem,
			hora: hora()
		});	
		socket.broadcast.emit('mensagemParaCliente', {
			user: data.user,
			mensagem: data.mensagem,
			hora: hora()
		});
	});

	socket.on('pontuacao', function(data){
		socket.emit('mensagemParaCliente', {
			user: '<strong>Servidor </strong>',
			mensagem: 'Usuario: '+ data.user+ " Marcou: "+data.pontos +" pontos. Na cobrinha",
			hora: hora()
		});	
		socket.broadcast.emit('mensagemParaCliente', {
			user: '<strong>Servidor </strong>',
			mensagem: 'Usuario: '+ data.user+ " Marcou: "+data.pontos +" pontos. Na cobrinha",
			hora: hora()
		});
	});
	socket.on('disconnect', function(){
		console.log('Usuário desconectou');
	});	
});

app.get('/', function(req , res){
	res.render('index', {validacao:{}});
});
app.post('/chat', function(req, res){
	var login = req.body;

	req.assert('user', 'Nome não pode ser vazio').notEmpty();
	req.assert('user', 'Seu nome tem que ter de 3 a 15 caracteres').len(3, 15);

	var erros = req.validationErrors(); 

	if(erros){
		res.render("index", {validacao : erros});
		return;
	}

	io.emit('conexao', {user: login.user, mensagem: 'Entrou no chat', hora: hora()});
	res.render('chat', {user: login.user});
});


app.get("/cadastro", function(req, res){
	res.render("cadastro.ejs");
});

app.get("/config", function(req, res){
	res.render('config');
});
function hora(){
	var d = new Date();
  	var h = d.getHours();
  	var m = d.getMinutes();
  	var s = d.getSeconds();
  	var hora = h+":"+m+":"+s;
	return hora
}