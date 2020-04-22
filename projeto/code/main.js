"use strict";

(function()
{
	window.addEventListener("load", main);
}());


function main()
{
	// retomar o foco dos eventos à janela do jogo
	function messageHandler(ev){
		if(ev.data=="continue"){
			ctx.pause= false;
			pause.style.height = 0;
			startAnim(ctx, spArray);
			repeat= true; 
			window.focus()
		}
	}

	// fornecer a sorce da main
	window.addEventListener("message", messageHandler);
	var pause = document.getElementsByTagName("iframe")[0]; 
	pause.contentWindow.postMessage('hello frame', '*');
	pause.style.height = 0;

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	canvas.addEventListener("initend", initEndHandler);

	var spArray;
	var imgArray;
	ctx.pause = false;
	var repeat = false;
	
	init(ctx);  //carregar todos os componentes

	//controlar a movimentação da nave
	function initEndHandler(ev)
	{
		spArray = ev.spArray;
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

		//iniciar a animação
		startAnim(ctx, spArray);
	}
}


//init: carregamento de componentes
function init(ctx)
{
	var nLoad = 0;
	var totLoad = 3;
	var spArray = new ArrayList();

	//carregar imagens e criar sprites
	var img1 = new Image();

	img1.addEventListener("load", imgLoadedHandler);
	img1.border=0;
	img1.id="nave";
	img1.src = "resources/nave.png";

	ctx.canvas.addEventListener("loadEnimies", loadEnimies);
	ctx.canvas.addEventListener("loadLife", loadLife);

	function loadEnimies(ev){

		var arma = new Image();
		arma.addEventListener("load", imgLoadedHandler);
		arma.id="arma";
		arma.src = "resources/arma1.png";

		var enimigos = new Image();
		enimigos.addEventListener("load", imgLoadedHandler);
		enimigos.id="inimigo";
		enimigos.src = "resources/inimigo.png";
	}

	function loadLife(ev){

		var bullet = new Image();
		bullet.addEventListener("load", imgLoadedHandler);
		bullet.id="bullet";
		bullet.src = "resources/tiro1.png";

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
				var ev = new Event("loadEnimies");
				ctx.canvas.dispatchEvent(ev);
				nLoad++;
				break;
			case "inimigo":
				for(; nLoad<totLoad; nLoad++){
					var sp = new Inimigo(img, Math.round(nw/4), Math.round(nh/4), 0, 0, context, 100, nLoad, spArray.sp, 10);
					sp.imageData=sp.getImageData();
					spArray.add(sp);
				}
				nLoad-=3;
				var ev = new Event("loadLife");
				ctx.canvas.dispatchEvent(ev);
				break;
			case "arma":
				var sp = new Arma(img, Math.round(nw/2), Math.round(nh/2),spArray.sp.width/2 - Math.round(nw/2)/2, Math.round(nw/2)/2, 0);
				spArray.sp.addWeapon(sp);
				spArray.sp.imageData = spArray.sp.getImageData();
				break;
			case "life":
				var aux = spArray;

				while(aux!=null)
				{
					aux.sp.setLifeImg(img, Math.round(nw/2), Math.round(nh/2));
					aux = aux.next;
				}
				nLoad++;
				break;
			case "lifeBar":
				var aux = spArray;

				while(aux!=null)
				{
					aux.sp.setLifeBarImg(img);
					aux = aux.next;
				}
				nLoad++;
				break;
			case "bullet":
				sp = new Bullet(img, Math.round(nw/2), Math.round(nh/2), spArray.sp.weapons[0]);
				spArray.add(sp);
				nLoad++;
				break; 
		}		

		if (nLoad == totLoad)
		{
			var ev = new Event("initend");
			ev.spArray = spArray;
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


//apagar sprites
function clear(ctx, spArray)
{
	var aux = spArray;

	while(aux!=null)
	{
		aux.sp.clear(ctx);
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

	//animar sprites
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
