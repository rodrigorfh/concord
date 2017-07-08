var pontosMarcados = 0;


function gameOn(){

		if($('#showGame').hasClass('col-xs-6')) {
			$('#showGame').empty();
			
			pontosMarcados = 0;
		}
		$('#showMsg').removeClass("col-xs-12").addClass("col-xs-6");
		$('#showGame').addClass('col-xs-6');
	
		// $('#showGame').css('margin-left', '10px');
		var botoes = '<button class="btn btn-default" id="reset" onclick="gameOn()" >Resete</button>';
			botoes += '<button class="btn btn-default"style="margin-left: 10px" id="fechar" onclick="fechar()">Fechar</button>';
		$('#showGame').append(botoes);
			var gg= false;

		var sketch = function(p){
		
		//variaveis cobrinha
		var s; 
		var escala = 20; 
		var ponto;
		var button;
	
		//fim do citado

		p.setup = function(){
			var canvas = p.createCanvas(400,400);
			s = new cobrinha();
			p.background(0,255,0); 
			p.frameRate(20);
			// var d = document.getElementById('teste2');
			canvas.parent("showGame");
			
			novoPonto();
			// d.canvas;
			p.fill(255,0,0);
			var x = p.ellipse(p.random(p.width), p.random(p.height),20,20);
		};

		p.mousePressed = function(){
			console.log('Click');
			p.background(p.random(255), p.random(255), p.random(255));

			// console.log(s);
			// console.log(sketch);
			// console.log(myp5);
			
		};
		p.draw = function(){
			//COBRINHA
			p.background(51);

			if(s.confereMarcar(ponto)){
	  			novoPonto();
	  			pontosMarcados++;
	  		}
			s.gameOver();
			s.update();
			s.show();
			//COBRINHA
			p.noStroke();
			p.fill(85,139,87);
	  		p.rect(ponto.x, ponto.y, escala, escala);
		
		};

		// Key press funcionando
		p.keyPressed = function(){
			if(p.keyCode === p.UP_ARROW){
				console.log('KeyPress: UP');
				s.setDirecao(0, -1);
			}else if(p.keyCode === p.DOWN_ARROW){
				console.log('KeyPress: Down');
				s.setDirecao(0,1);
			}else if(p.keyCode === p.RIGHT_ARROW){
				console.log('KeyPress: Right');
				s.setDirecao(1,0);
			}else if(p.keyCode === p.LEFT_ARROW){
				console.log('KeyPress: LEFT');
				s.setDirecao(-1,0);
			}
		};
		// Fim do key press

		// Cobrinha nao removeu game
		function cobrinha(){
		this.x = 0;
		this.y = 0;


		this.direcaoX = 1;
		this.direcaoY = 0;

		this.total = 0;
		this.comprimento = [];

		this.setDirecao = function(x, y){
			console.log("tudo bem aqui: \nX: "+x+"\nY: "+y);
			this.direcaoX = x;
			this.direcaoY = y;
		}
		this.gameOver = function(){
			
			for(var i = 0; i <this.comprimento.length; i++){
				var pos = this.comprimento[i];
				var d =p.dist(this.x, this.y, pos.x, pos.y);
				if(d < 1){
					this.total = 0;
					this.comprimento =[];
					gg= true;

				}
			}
		
			if(gg) {
				gameOverMesmo(p,pontosMarcados);
				
			}
		}
		
		this.update = function(){
			if(this.total === this.comprimento.length){
				for(var i =0; i<this.comprimento.length - 1; i++){
					this.comprimento[i] = this.comprimento[i +1];
				}
			}
			this.comprimento[this.total-1] = p.createVector(this.x, this.y);
			this.x = this.x + this.direcaoX * escala;
			this.y = this.y + this.direcaoY * escala;

			this.x = p.constrain(this.x, 0, p.width - escala);
			this.y = p.constrain(this.y, 0, p.height- escala);
		}

		this.show = function(){
			p.fill(255);
			for(var i = 0; i < this.comprimento.length; i++){
				p.rect(this.comprimento[i].x, this.comprimento[i].y, escala,escala);
			}
			p.rect(this.x, this.y, 20, 20);
		}

		this.confereMarcar = function(pos){
			var d = p.dist(this.x, this.y, pos.x, pos.y);
			if(d< 1){
				this.total++;
				return true;
			}else{
				return false;
			}
		}
	}
	// end cod cobrinha

	function novoPonto(){ 
		var colunas = p.floor(p.width/escala);  
		var linhas = p.floor(p.height/escala); 

		ponto = p.createVector(p.floor(p.random(colunas)), p.floor(p.random(linhas))); 
		ponto.mult(escala); 
		
	}


	};

	var myp5 = new p5(sketch);

}


function gameOverMesmo(p, pontosMarcados){
	console.log('gameOver');
	console.log("Pontos: " + pontosMarcados);
	p.remove();
}


function fechar(){
	$('#showGame').empty();
	$('#showMsg').removeClass("col-xs-6").addClass("col-xs-12");
	$('#showGame').removeClass('col-xs-6');
	
	socket.emit('pontuacao',{
		user:'Dolinho do Satanas',
		pontos:pontosMarcados,
	});
	pontosMarcados = 0;
}
