function configUser(){
	$('#showGame').empty();
	$.ajax({
		url: '/config',
		success: function(page){
			$('#showMsg').removeClass("col-xs-12").addClass("col-xs-6");
			$('#showGame').addClass('col-xs-6');
			$("#showGame").append(page);
		}
	});
}

var btnAnimacao = false;
$("#confirmaConfig").click(function(){
	btnAnimacao = document.getElementById("ativado").checked;
	if($("#newPassword").val()){
		socket.emit("configPassword", {
			user: $('#nick').val(),
			senha: $("#newPassword").val(),
			novaSenha: $("#confirmPassword").val()
		});
	}
});

$("#excluirCnt").click(function(){
	socket.emit("excluirConta", {
		user: $('#nick').val()
	});
});

socket.on("respostaConfig", function(data){

});

socket.on("contaExcluida", function(data){
	alert(data.msg);
	window.location = "http://localhost";
});