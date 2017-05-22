var socket = io('http://localhost');


socket.on('conexao', function(data){
	var msg="";
	msg += "<h3 style='color: white;'>"+ data.user +" <small> ["+ data.hora+"]</h3>";
	msg += "<p class='showMsg' style='color: white;'>" + data.mensagem +'</p>';

	$('#showMsg').append(msg);
});


socket.on('mensagemParaCliente', function(data){
	var msg = "";
	msg += "<h3 style='color: white;'>"+ data.user +" <small> ["+ data.hora+"]</h3>";
	msg += "<p class='showMsg' style='color: white;'>" + data.mensagem +'</p>';
	$('#showMsg').append(msg);
	$("#showMsg").scrollTop($("#showMsg")[0].scrollHeight);
});





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
		user: 'login.user',
		mensagem: $("#formInput").val()
	});
	$('#formInput').val('');
	

		// alert('debug');
}

// Fim envia mensagem para o servidor