var dbConnection = require('../../config/dbConnection');

module.exports = function(app){

	var connection = dbConnection();

	app.get("/index", function(req, res){

			connection.query('select * from usuarios', function(err, result){
				res.render("view/index", {index:result});
			});

	});


}