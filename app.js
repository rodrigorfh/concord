var app = require('./config/server');
var dbConnection = require ('./config/dbConnection');

var connection = dbConnection();

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
	socket.on('chegay',function(data){
		console.log('Cade vc: '+ data.user);
		connection.query('select * from contatos', function(error, results, fields){
			if(error) throw error;
				//Método de acesso a múltiplos usuários
				for(var i=0; i<results.length; i++){
				console.log(results[i].nome_amigo);
		 		}
		 		socket.emit('seusAmiguinhos', {
					contato: results
				});		
		});
	});

	socket.on("excluirConta", function(data){
		//data.user = conta a ser excluida
			connection.query('delete from usuarios where id_user=?',[data.user], function(error, results, fields){
				if (error) throw error;
		  			console.log('Conta deletada com sucesso!');
			});

		socket.emit("contaExcluida",{
			msg: "Sua conta foi excluida"
		});
	});

	socket.on("configPassword", function(data){
		
		if(data.senha != data.novaSenha){
			socket.emit("respostaConfig",{
				status: false,
				msg: 'Senhas diferentes'
			});
		}
		//data.user = conta a ser alterada a senha
		//data.senha = nova senha
			connection.query('UPDATE usuarios SET senha = ? WHERE id_user = ?', [data.senha, data.user], function (error, results, fields) {
				if (error) throw error;
					console.log('Senha alterada com sucesso!');
			});

	});

	socket.on("enviarSubmissao", function(data){
		//data.amigo = amigo que deseja add e data.status
	});

	socket.on("conferirAmigo", function(data){
		//data.amigo = amigo

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
	// console.log(erros);
	if(erros){
		res.render("index", {validacao : erros});
		return;
	}

		// var post  = {id_user: req.body.user, nome: req.body.nome, senha: req.body.senha};
		var query = connection.query({
			sql: 'SELECT * from usuarios WHERE id_user = ? and senha = ?', 
			values: [req.body.user, req.body.senha]

		}, function (error, results, fields) {

		if(error) throw error;
		//Método de acesso a múltiplos usuários
		// for(var i=0; i<results.length; i++){
		// console.log(results[i].id_user);
		// }			
		if(results.length > 0) {
			  if (results)
			    console.log("Test:" + results);
				io.emit('conexao', {user: login.user, mensagem: 'Entrou no chat', hora: hora()});
				res.render('chat', {user: login.user});
			}

		});	
});


app.get("/cadastro", function(req, res){
	res.render("cadastro.ejs");
});

app.get('/usuario', function(req, res){
	res.render('user');
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

app.post('/registro', function(req, res){

	console.log(req.body.nome);

		var post  = {id_user: req.body.user, senha: req.body.senha};
		var query = connection.query('INSERT INTO usuarios SET ?', post, function (error, results, fields) {
		  if (error) throw error;
		  // Neat!
		});
		console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'

	// connection.query('insert into usuarios set 'id_user' = 1, 'nome'= matheus, 'senha'=1234', function(req, res){
	// 		
	// res.render('cadastro');

	// });
});

