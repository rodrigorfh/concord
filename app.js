var app = require('./config/server');
var dbConnection = require ('./config/dbConnection');
var fs = require('fs');
formidable = require('formidable');

var connection = dbConnection();

var server = app.listen(80, function(){
	console.log("Servidor Online");
});
var io = require('socket.io').listen(server);

app.set('io', io);
io.on('connection', function(socket){
	console.log("Cliente conectado");

	socket.on('enviarMsg', function(data){
		var cmd = data.mensagem;
		var amigoSelect = cmd.split(" ");
		var privmsg = false;

		if(amigoSelect[0] == "/pm") privmsg = true; 
		// console.log('recebi: '+data.user );
		socket.emit('mensagemParaCliente', {
			user: data.user,
			mensagem: data.mensagem,
			hora: hora(),
			privmsg: privmsg,
			amigo: amigoSelect[1]
		});	

		// if(data.mensagem.charAt(0) == '/'){
		// 	var args = data.mensagem.split(" ");
		// 	switch(args[0]){
		// 		case '/pm':
		// 			connection.query('select * from usuarios where id_user=?',[args[1]], function(error,results,fields){
		// 				console.log(results);
		// 			});
		// 		break;
		// 		default:
		// 		break;
		// 	}
		// }
	
		// console.log("All data:\nData.amigo: "+amigoSelect[1]+"\nData.mensagem:"+data.mensagem+"\nData.privmsg:"+privmsg+"\nData.user:"+data.user);
		socket.broadcast.emit('mensagemParaCliente', {
			user: data.user,
			mensagem: data.mensagem,
			hora: hora(),
			privmsg: privmsg,
			amigo: amigoSelect[1]
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
		// console.log('Cade vc: '+ data.user);
		connection.query('select * from contatos where id_user=?',[data.user], function(error, results, fields){
			if(error) throw error;
				//Método de acesso a múltiplos usuários
				// for(var i=0; i<results.length; i++){
				// console.log(results[i].nome_amigo);
		 	// 	}
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
		console.log("Passo1:\nSenha:"+ data.senha+"\nConfirma:"+data.novaSenha);
		if(data.senha != data.novaSenha){
			socket.emit("respostaConfig",{
				status: false,
				msg: 'Senhas diferentes'
			});
		}else{
			console.log("Passo2:\nSenha:"+ data.senha+"\nConfirma:"+data.novaSenha);
			//data.user = conta a ser alterada a senha
			//data.senha = nova senha
			connection.query('UPDATE usuarios SET senha = ? WHERE id_user = ?', [data.senha, data.user], function (error, results, fields) {
				if (error) throw error;
				socket.emit("respostaConfig", {
					status: true,
					msg: 'Senha alterada com sucesso'
				});
			});
		}
		console.log("Passo3:\nSenha:"+ data.senha+"\nConfirma:"+data.novaSenha);

	});
	socket.on("enviarSubmissao", function(data){

		//data.amigo e data.status
		console.log("Status: "+data.status+"\nUser:"+data.user+"\nAmigo:"+data.amigo);
	
		connection.query('select * from contatos where nome_amigo=?',[data.amigo], function(error, results, fields){	
			if(!results[0]){
				connection.query('select * from usuarios where id_user=?',[data.amigo], function(error,results,fields){
					if(!results[0]){
						socket.emit('amigoAdd', {
							check: false,
							msg: 'Esse usuario não existe'
						});
					}else{
						console.log("Parabens achamaos alguem");
						inserirAmigo(data.user, data.amigo, 'status');
						
					}
				});
			}else{
				inserirAmigo(data.user, data.amigo, results[0].status_pessoa);
			}
		});
	
		
	});

	function inserirAmigo(user, amigo, status) {
		connection.query('INSERT INTO contatos SET id_user = ?, nome_amigo = ?, status_pessoa =?',[user, amigo,status], function(error, results, fields){
			if (error) throw error;
			console.log('teste 1');
		});
		socket.emit('amigoAdd', {
			check:true,
			msg: 'Agora vocês são amigos'
		});
		console.log('dados adicionados!')
	}
	socket.on("alterarStatus",function(data){
		connection.query('UPDATE contatos SET status_pessoa = ? WHERE nome_amigo = ?',[data.stats, data.user], function(error, results, fields){
			// if (error) throw error;
			console.log('teste 2');
		});
	});
	socket.on("conferirAmigo", function(data){
		//data.amigo = amigo
		connection.query('select * from contatos where nome_amigo=?',[data.amigo], function(error, results, fields){
			if(results[0]){
				socket.emit("checkAmigo", {
					ok:true
				});
			}else{
				socket.emit("checkAmigo", {
					ok:false
				});
			}
		});

	});
});

app.get('/login', function(req , res){
	res.render('index', {validacao:{}});
});
app.post('/chat', function(req, res){
	var login = req.body;

	req.assert('user', 'Nome não pode ser vazio').notEmpty();
	req.assert('user', 'Seu nome tem que ter de 3 a 15 caracteres').len(3, 15);

	var erros = req.validationErrors(); 

	// console.log("Erros: "+ JSON.stringify(erros));
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
		console.log("Querry: "+query.sql);
		if(results.length > 0) {
			  if (results)
			    // console.log("Test:" + results);
				io.emit('conexao', {user: login.user, mensagem: 'Entrou no chat', hora: hora()});
				res.render('chat', {user: login.user});
			}else{
				res.render('index', {validacao:[{msg:'Usuario ou senha incorreto'}]});
			}

		});	
});


app.get("/cadastro", function(req, res){
	res.render("cadastro.ejs", {regCadastro: {}});
});

app.get('/usuario', function(req, res){
	res.render('user');
});

app.get('/adicionar', function(req, res){
	res.render('addamigo');
});

app.get("/config", function(req, res){
	res.render('config');
});

app.get("/jogo", function(req, res){
	res.render('jogos');	
});

app.get("/", function(req, res){
	res.render("principal.ejs", {regPrincipal: {}});
});

app.post("/upload", function(req,res){
	// './public/images/a.jpg'
	// console.log(JSON.stringify(req.body.displayImage));
});	


app.get("/loja", function(req, res){
	res.render("loja.ejs", {regLoja: {}});
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
				res.render("cadastro",  {regCadastro : [{msg: 'Usuario ja utilizado'}]});
			}else{				
				var post  = {id_user: req.body.user, senha: req.body.senha};
				var query = connection.query('INSERT INTO usuarios SET ?', post, function (error, results, fields) {
			  if (error) throw error;
			});
				console.log(query.sql); // INSERT INTO usuarios SET `id_user` = ?, `exemplo` = 'Hello MySQL'
				res.render("cadastro",  {regCadastro : [{msg: 'Usuario cadastrado com sucesso'}]});
			}
		});

	// connection.query('insert into usuarios set 'id_user' = 1, 'nome'= matheus, 'senha'=1234', function(req, res){
	// 		
	// res.render('cadastro');
	// });

	
});

