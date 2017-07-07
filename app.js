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

		//data.amigo e data.status
		console.log("Status: "+data.status+"\nUser:"+data.user+"\nAmigo:"+data.amigo);
	
		connection.query('select * from contatos where nome_amigo=?',[data.amigo], function(error, results, fields){	
			if(!results[0]){
				console.log("Disgraca");
				connection.query('select * from usuarios where id_user=?',[data.amigo], function(error,results,fields){
					if(!results[0]){
						console.log("Esse usuario nao exite");
					}else{
						console.log("Parabens achamaos alguem");
						inserirAmigo(data.user, data.amigo, 'status');
					}
				});
			}else{
				inserirAmigo(data.user, data.amigo, results[0].status_pessoa);
			}
		});
	
		connection.query('UPDATE contatos SET status_pessoa = ? WHERE nome_amigo = ?',[data.status, data.user], function(error, results, fields){
			// if (error) throw error;
			console.log('teste 2');
		});
	});

	function inserirAmigo(user, amigo, status) {
		connection.query('INSERT INTO contatos SET id_user = ?, nome_amigo = ?, status_pessoa =?',[user, amigo,status], function(error, results, fields){
			if (error) throw error;
			console.log('teste 1');
		});
		console.log('dados adicionados!')
	}

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
	console.log("Erros: "+ JSON.stringify(erros));
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
	res.render("cadastro.ejs", {regCadastro: {}});
});

app.get('/usuario', function(req, res){
	res.render('user');
});

app.get("/config", function(req, res){
	res.render('config');
});

app.get("/principal", function(req, res){
	res.render("principal.ejs", {regPrincipal: {}});
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
		connection.query('select id_user from usuarios where id_user=?', [req.body.user], function(error, results,fields){
			if(results[0]){
				res.render("cadastro",  {regCadastro : [{msg: 'Nao vai ter bolo'}]});
			}else{				
				var post  = {id_user: req.body.user, senha: req.body.senha};
				var query = connection.query('INSERT INTO usuarios SET ?', post, function (error, results, fields) {
			  if (error) throw error;
			});
				console.log(query.sql); // INSERT INTO usuarios SET `id_user` = ?, `exemplo` = 'Hello MySQL'
				res.render("cadastro",  {regCadastro : [{msg: 'OLAAA MARILENE'}]});
			}
		});

	// connection.query('insert into usuarios set 'id_user' = 1, 'nome'= matheus, 'senha'=1234', function(req, res){
	// 		
	// res.render('cadastro');
	// });

	
});

