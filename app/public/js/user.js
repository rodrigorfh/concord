function usuario(){
	$('#showGame').empty();
	$.ajax({
		url: '/usuario',
		success: function(page){
			$('#showMsg').removeClass("col-xs-12").addClass("col-xs-6");
			$('#showGame').addClass('col-xs-6');
			$("#showGame").append(page);
		}
	});
}


function status(st){
	return st = this.st;
}
$("#confereExist").click(function(){	
	socket.emit("conferirAmigo", {
		amigo: $("#addAmigo").val()
	});
});

$("#submitAtualizacao").click(function(){
	socket.emit("enviarSubmissao", {
		status: 'oi',
		user: $("#nick").val(),
		amigo:$("#addAmigo").val()
	});

});


socket.on("alterarStatus", function(data){

});


socket.on("amigoAdd", function(data){

});
