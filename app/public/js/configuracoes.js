function configUser(){
	$.ajax({
		url: '/config',
		success: function(page){
			$("#showMsg").append(page);
		}
	});
}