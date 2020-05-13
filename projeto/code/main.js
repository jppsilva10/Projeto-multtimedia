"use strict";

(function()
{
	window.addEventListener("load", main);
}());


function main()
{

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	canvas.addEventListener("initend", initEndHandler);

	var spArray;
	var generator;
	ctx.pause = false;
	var repeat = false;

	var source;
	// retomar o foco dos eventos à janela do jogo
	function messageHandler(ev){
		if(ev.data=="continue"){
			ctx.pause= false;
			pause.style.height = 0;
			startAnim(ctx, spArray);
			repeat= true; 
			window.focus()
		}
		else if (ev.data != null){
			//audio.volume = ev.data[1];
			source = ev.source;
			var weapons = new Array(4);
			for(let i = 2; i<ev.data.length;i++){
				weapons[i-2] = ev.data[i];
			}
			ctx.weapons = weapons;
			console.log(ctx.weapons[0]);
			if(ctx.weapons[0]!=null)
				init(ctx);  //carregar todos os componentes

		}
	}

	// fornecer a sorce da main
	window.addEventListener("message", messageHandler);
	var pause = document.getElementsByTagName("iframe")[0]; 
	pause.contentWindow.postMessage('hello frame', '*');
	pause.style.height = 0;

	

	// cronometro
	var time = 0;
	//setInterval(update, 100);
	function update(){
		time+=1;
		generator.generate(time, ctx);
		for(let i = 0; i<4; i++){
			spArray.sp.weapons[i].shoot(time);
		}
	}



	//controlar a movimentação da nave
	function initEndHandler(ev)
	{
		spArray = ev.spArray;
		generator = ev.generator;
		var sp = spArray.sp;
		function move(ev){
			switch(ev.keyCode){
				case 87:
					sp.up=true;
					break;
				case 65:
					sp.left=true;
					break;
				case 83:
					sp.down=true;
					break;
				case 68:
					sp.right=true;
					break;
				case 37:
					sp.Rleft=true;
					break;
				case 39:
					sp.Rright=true;
					break;
				case 27: // menu de pausa
					if(ctx.pause){
						if(!repeat){
							ctx.pause= false;
							pause.style.height = 0;
							startAnim(ctx, spArray);
							repeat= true; // evitar repetições por tecla precionada
						}
					} 
					else{
						if(!repeat){
							pause.style.height = "100%";
							ctx.pause=true;
							repeat= true; // evitar repetições por tecla precionada
						}
					}
				break;
			}
		}

		function stop(ev){
			switch(ev.keyCode){
				case 87:
					sp.up=false;
					break;
				case 65:
					sp.left=false;
					break;
				case 83:
					sp.down=false;
					break;
				case 68:
					sp.right=false;
					break;
				case 37:
					sp.Rleft=false;
					break;
				case 39:
					sp.Rright=false;
					break;
				case 27:
					repeat = false;
					break;
			}
		}
		window.addEventListener("keydown", move);
		window.addEventListener("keyup", stop);

		setInterval(update, 100);
		//iniciar a animação
		startAnim(ctx, spArray);
	}
}


//init: carregamento de componentes
function init(ctx)
{
	var nLoad = 0;
	var totLoad = 16;
	var spArray = new ArrayList();
	var generator= new Gerador(spArray);
	generator.images = new Array(4);

	//carregar imagens e criar sprites
	var img1 = new Image();

	img1.addEventListener("load", imgLoadedHandler);
	img1.border=0;
	img1.id="nave";
	img1.src = "resources/nave.png";

	ctx.canvas.addEventListener("loadEnimies", loadEnimies);
	ctx.canvas.addEventListener("loadLife", loadLife);

	function loadEnimies(ev){

		var arma1 = new Image();
		arma1.addEventListener("load", imgLoadedHandler);
		arma1.id="arma";
		arma1.index=1;
		arma1.src = ctx.weapons[0];
		var arma2 = new Image();
		arma2.addEventListener("load", imgLoadedHandler);
		arma2.id="arma";
		arma2.index=2;
		arma2.src = ctx.weapons[1];
		var arma3 = new Image();
		arma3.addEventListener("load", imgLoadedHandler);
		arma3.id="arma";
		arma3.index=3;
		arma3.src = ctx.weapons[2];
		var arma4 = new Image();
		arma4.addEventListener("load", imgLoadedHandler);
		arma4.id="arma";
		arma4.index=4;
		arma4.src = ctx.weapons[3];
		ctx.weapons = null;

		var enimigos = new Image();
		enimigos.addEventListener("load", imgLoadedHandler);
		enimigos.id="inimigo";
		enimigos.src = "resources/inimigo.png";

		var explosao = new Image();
		explosao.addEventListener("load", imgLoadedHandler);
		explosao.id="explosao";
		explosao.index=0;
		explosao.src = "resources/explosao0.png";

		var explosao2 = new Image();
		explosao2.addEventListener("load", imgLoadedHandler);
		explosao2.id="explosao";
		explosao2.index=1;
		explosao2.src = "resources/explosao1.png";

		var explosao3 = new Image();
		explosao3.addEventListener("load", imgLoadedHandler);
		explosao3.id="explosao";
		explosao3.index=2;
		explosao3.src = "resources/explosao2.png";

		var explosao4 = new Image();
		explosao4.addEventListener("load", imgLoadedHandler);
		explosao4.id="explosao";
		explosao4.index=3;
		explosao4.src = "resources/explosao3.png";


	}

	function loadLife(ev){

		var life = new Image();
		life.addEventListener("load", imgLoadedHandler);
		life.id="life";
		life.src = "resources/life.png";

		var lifeBar = new Image();
		lifeBar.addEventListener("load", imgLoadedHandler);
		lifeBar.id="lifeBar";
		lifeBar.src = "resources/lifeBar.png";
	}

	function imgLoadedHandler(ev)
	{
		var img = ev.target;
		img.border=0;
		var nw = img.naturalWidth;
		var nh = img.naturalHeight;

		// criar ctx para o getImageData
		var canvas = document.createElement('canvas');
		canvas.width = Math.round(nw/4);
		canvas.height = Math.round(nh/4);
		var context = canvas.getContext("2d");

		switch(img.id){
			case "nave":
				var sp = new Nave(img, Math.round(nw/4), Math.round(nh/4), Math.round(ctx.canvas.width/2), Math.round(ctx.canvas.height/2), 0, context, 100, 3);
				spArray.sp = sp;
				sp.listPointer = spArray;
				var ev = new Event("loadEnimies");
				ctx.canvas.dispatchEvent(ev);
				nLoad++;
				break;

			case "inimigo":

				generator.setImg(img);
				nLoad ++;
				var ev = new Event("loadLife");
				ctx.canvas.dispatchEvent(ev);
				break;

			case "arma":
				var sp
				var direction = img.index * Math.PI/2;
				switch(img.src[img.src.length-5]){
					case "0":
    					sp = new Arma(img, Math.round(nw/4), Math.round(nh/4), spArray.sp.width/2 - Math.round(nw/4)/2, Math.round(nw/4)/2, direction);
            		break;
            		case "1":
    					sp = new Arma1(img, Math.round(nw/4), Math.round(nh/4), spArray.sp.width/2 - Math.round(nw/4)/2, Math.round(nw/4)/2, direction);
            		break;
            		case "2":
    					sp = new Arma2(img, Math.round(nw/4), Math.round(nh/4), spArray.sp.width/2 - Math.round(nw/4)/2, Math.round(nw/4)/2, direction);
            		break;
            		case "3":
    					sp = new Arma3(img, Math.round(nw/4), Math.round(nh/4), spArray.sp.width/2 - Math.round(nw/4)/2, Math.round(nw/4)/2, direction);
            		break;
            		case "4":
    					sp = new Arma4(img, Math.round(nw/4), Math.round(nh/4), spArray.sp.width/2 - Math.round(nw/4)/2, Math.round(nw/4)/2, direction);
            		break;
            		case "5":
    					sp = new Arma5(img, Math.round(nw/4), Math.round(nh/4), spArray.sp.width/2 - Math.round(nw/4)/2, Math.round(nw/4)/2, direction);
            		break;
            		case "6":
    					sp = new Arma6(img, Math.round(nw/4), Math.round(nh/4), spArray.sp.width/2 - Math.round(nw/4)/2, Math.round(nw/4)/2, direction);
            		break;
            		case "7":
    					sp = new Arma7(img, Math.round(nw/4), Math.round(nh/4), spArray.sp.width/2 - Math.round(nw/4)/2, Math.round(nw/4)/2, direction);
            		break;
				}
				spArray.sp.addWeapon(sp);

				var img2 = new Image();
				img2.addEventListener("load", imgLoadedHandler);
				img2.src = "../projeto/resources/tiro" + img.src[img.src.length-5] + ".png"; 
				img2.id = "tiro";
				nLoad ++;
				break;
			case "life":
				var aux = spArray;

				while(aux!=null)
				{
					aux.sp.setLifeImg(img, Math.round(nw/2), Math.round(nh/2));
					aux = aux.next;
				}
				generator.setLifeImg(img, Math.round(nw/2), Math.round(nh/2));
				nLoad++;
				break;
			case "lifeBar":
				var aux = spArray;

				while(aux!=null)
				{
					aux.sp.setLifeBarImg(img);
					aux = aux.next;
				}
				generator.setLifeBarImg(img);
				nLoad++;
				break;
			case "tiro":
				var nave = spArray.sp;
				var i = 0;
				while(nave.weapons[i].img.src[nave.weapons[i].img.src.length-5]!=img.src[img.src.length-5]){
					i++;
				}
				nave.weapons[i].addBullet(img, Math.round(nw/2), Math.round(nh/2));

				nLoad++;
				break;
			case "explosao":
				generator.images[img.index]=img;
				console.log(img);
				nLoad++;
				break;
		}		

		if (nLoad == totLoad)
		{
			spArray.sp.imageData = spArray.sp.getImageData();
			var ev = new Event("initend");
			ev.spArray = spArray;
			ev.generator = generator;
			ctx.canvas.dispatchEvent(ev);
		}
	}	
}


//iniciar animação
function startAnim(ctx, spArray)
{
	draw(ctx, spArray);
	animLoop(ctx, spArray, 0);	
}


//desenhar sprites
function draw(ctx, spArray)
{
	var aux = spArray;

	while(aux!=null)
	{
		aux.sp.draw(ctx);
		aux = aux.next;
	}
}

function animLoop(ctx, spArray, startTime, time)
{	
	var al = function(time)
	{
		if(startTime==0){
			startTime = time;
		}
		animLoop(ctx, spArray, startTime, time);
	}
	var reqID = window.requestAnimationFrame(al);
	render(ctx, spArray, reqID, time - startTime);
}


function render(ctx, spArray, reqID, dt)
{
	var cw = ctx.canvas.width;
	var ch = ctx.canvas.height;

	//apagar canvas
	ctx.clearRect(0, 0, cw, ch);

	var aux = spArray;

	while(aux!=null)
	{
		aux.sp.rotate();
		aux.sp.move(cw, ch);
		var aux2= aux.next;
		while(aux2!=null){

			if(aux.sp.react(aux2.sp))
				aux2.sp.react(aux.sp)
			aux2 = aux2.next;

			if(aux.sp==null)
				break;
		}
		aux = aux.next;
	}

	draw(ctx, spArray);
	if(ctx.pause)
		window.cancelAnimationFrame(reqID);
}
