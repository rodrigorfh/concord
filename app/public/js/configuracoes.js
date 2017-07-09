var btnAnimacao = false;
function configUser(){
	$('#showGame').empty();

	if($('#showGame').hasClass('col-xs-6')){
		fechar();
		return;
	}
	
	$.ajax({
		url: '/config',
		success: function(page){
			$('#showMsg').removeClass("col-xs-12").addClass("col-xs-6");
			$('#showGame').addClass('col-xs-6');
			$("#showGame").append(page);
		}
	});
}

$("#confirmaConfig").click(function(){
	btnAnimacao = document.getElementById("ativado").checked;
	if($("#newPassword").val()){
		socket.emit("configPassword", {
			user: $('#nick').val(),
			senha: $("#newPassword").val(),
			novaSenha: $("#confirmPassword").val()
		});
	}else{
		configUser();
	}
});

$("#excluirCnt").click(function(){
	socket.emit("excluirConta", {
		user: $('#nick').val()
	});
});

socket.on("respostaConfig", function(data){
	console.log("Passo1:\nStatus:"+ data.status+"\nMSG:"+data.msg);
	var msg = "";
	if(!data.status){
		msg += '<div id="alerta-msg">'+ data.msg + '</div>';	
	}else{
		msg += '<div id="alerta-msg">'+ data.msg + '</div>';	
	}
	msg += '<input onclick="fechar()" class="btn btn-default" type="submit" value="Fechar">';
	// alert(msg);
	$('#respostaConfig').empty();
	$("#respostaConfig").append(msg);
});

socket.on("contaExcluida", function(data){
	alert(data.msg);
	window.location = "http://localhost";
});

function fechar(){
	$('#showGame').empty();
	$('#showMsg').removeClass("col-xs-6").addClass("col-xs-12");
	$('#showGame').removeClass('col-xs-6');
}

