var socket = io('http://localhost');


socket.on('conexao', function(data){
	var msg="";
	msg += "<h3 style='color: white;'>"+ data.user +" <small> ["+ data.hora+"]</h3>";
	msg += "<p class='showMsg' style='color: white;'>" + data.mensagem +'</p>';

	$('#showMsg').append(msg);
});


socket.on('mensagemParaCliente', function(data){
	// console.log("All data:\nData.amigo: "+data.amigo+"\nData.mensagem:"+data.mensagem+"\nData.privmsg:"+data.privmsg+"\nData.user:"+data.user);

	if(data.privmsg){
		console.log("provei ser verdade");
		if($("#nick").val()== data.amigo || $("#nick").val()== data.user){
			createtxt(data.user+"[PRIVADO]", data.mensagem, data.hora);
		}
		return;
	}
	createtxt(data.user, data.mensagem,data.hora);
});

function createtxt(user, mensagem, hora){
	var msg = "";
	msg += "<h3 style='color: white;'>"+ user +" <small> ["+hora+"]</h3>";
	msg += "<p class='showMsg' style='color: white;'>" + mensagem +'</p>';
	$('#showMsg').append(msg);
	$("#showMsg").scrollTop($("#showMsg")[0].scrollHeight);
}


// Envia mensagem para o servidor
$('#formInput').on('keydown', function (event) { 
    if (event.keyCode === 13) {
        enviarMsg();
    }
});
$('#btnformInput').click(function(){
	enviarMsg();
});

function enviarMsg(){
	if(!$("#formInput").val()) return;
	socket.emit('enviarMsg', {
		user: $('#nick').val(),
		mensagem: $("#formInput").val()
	});
	$('#formInput').val('');
	

		// alert('debug');
}
socket.on('seusAmiguinhos', function(data){
	var amigosList="";
	for(var i = 0 ; i< data.contato.length; i++){
		// alerta+= data.contato[i].nome_amigo+ " "+ data.contato[i].status_pessoa +"\n";
		amigosList +="<a href=javascript:amigo('"+data.contato[i].nome_amigo+"')>";
		amigosList += '<div class="contato">';
			amigosList += '<div class="col-xs-3 foto"></div>';
			amigosList += '<div class="col-xs-9 dadosContato">'
				amigosList += '<div class="nomeContato">'+ data.contato[i].nome_amigo + '</div>';
				amigosList += '<div class="statusNome">'+data.contato[i].status_pessoa + '</div>';
			amigosList+= '</div> </div> </a>';

	}
	$('#listaAmigos').append(amigosList);
});

$(document).ready(function(){
	socket.emit('chegay',{
		user: $('#nick').val()
	});
});



function amigo(amigo){
	$("#formInput").val('/pm '+amigo+" ").focus();
}
// Fim envia mensagem para o servidor