function configUser(){
	$.ajax({
		url: '/config',
		success: function(){
			alert('nhee');
		}
	});
}