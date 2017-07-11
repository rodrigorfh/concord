
function usuario(){
	$('#showGame').empty();
	if($('#showGame').hasClass('col-xs-6')){
		fechar();
		return;
	}
	
	$.ajax({
		url: '/usuario',
		success: function(page){
			$('#showMsg').removeClass("col-xs-12").addClass("col-xs-6");
			$('#showGame').addClass('col-xs-6');
			$("#showGame").append(page);
		}
	});	
}

function add(){
	$('#showGame').empty();
	if($('#showGame').hasClass('col-xs-6')){
		fechar();
		return;
	}
	
	$.ajax({
		url: '/adicionar',
		success: function(page){
			$('#showMsg').removeClass("col-xs-12").addClass("col-xs-6");
			$('#showGame').addClass('col-xs-6');
			$("#showGame").append(page);
		}
	});	
}



function status(st){
	var status = st;
	socket.emit("alterarStatus",{
		user: $("#nick").val(),
		stats: status
	});
	$("#statusUser2").empty();
	$("#statusUser2").append(status);
}
$("#confereExist").click(function(){	
	socket.emit("conferirAmigo", {
		amigo: $("#addAmigo").val()
	});
});

$("#submitAtualizacao").click(function(){
	socket.emit("enviarSubmissao", {
		status:$("#statusUser2").text(),
		user: $("#nick").val(),
		amigo:$("#addAmigo").val()
	});

});


socket.on("alterarStatus", function(data){

});


socket.on("amigoAdd", function(data){
	if(data.check && $("#respostaUser").text().length > 0){
		$('#listaAmigos').empty();
		socket.emit('chegay',{
			user: $('#nick').val()
		});
	}
	$('#respostaUser').empty();
	$("#respostaUser").append('<div id="alerta">'+data.msg+'</div>');

});

socket.on("checkAmigo", function(data){
	console.log(data.ok);
});


$(document).ready(function(){
	$("#statusUser2").append('-');
});