"use strict";

(function()
{
	window.addEventListener("load", main);
}());


function main()
{
	var pause = document.getElementsByTagName("iframe")[0]; 
	pause.style.height = 0;
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var spArray;
	ctx.pause = false;
	var repeat = false;

	canvas.addEventListener("initend", initEndHandler);
	init(ctx);  //carregar todos os componentes

	//controlar a movimentação da nave
	function initEndHandler(ev)
	{
		spArray = ev.spArray;
		function move(ev){
			switch(ev.keyCode){
				case 87:
					spArray[0].up=true;
					break;
				case 65:
					spArray[0].left=true;
					break;
				case 83:
					spArray[0].down=true;
					break;
				case 68:
					spArray[0].right=true;
					break;
				case 37:
					spArray[0].Rleft=true;
					break;
				case 39:
					spArray[0].Rright=true;
					break;
				case 80: // menu de pausa
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
					spArray[0].up=false;
					break;
				case 65:
					spArray[0].left=false;
					break;
				case 83:
					spArray[0].down=false;
					break;
				case 68:
					spArray[0].right=false;
					break;
				case 37:
					spArray[0].Rleft=false;
					break;
				case 39:
					spArray[0].Rright=false;
					break;
				case 80:
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
	var spArray = new Array(totLoad+1);

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
				spArray[0] = sp;
				var ev2 = new Event("loadEnimies");
				ev2.spArray = spArray;
				ctx.canvas.dispatchEvent(ev2);
				nLoad++;
				break;
			case "inimigo":
				for(; nLoad<totLoad; nLoad++){
					var sp = new Inimigo(img, Math.round(nw/4), Math.round(nh/4), 0, 0, 0, context, 100, nLoad, spArray[0], 10);
					sp.imageData=sp.getImageData();
					spArray[nLoad] = sp;
				}
				nLoad-=3;
				var ev4 = new Event("loadLife");
				ctx.canvas.dispatchEvent(ev4);
				break;
			case "arma":
				var sp = new Arma(img, Math.round(nw/2), Math.round(nh/2),spArray[0].width/2 - Math.round(nw/2)/2, Math.round(nw/2)/2, 0);
				spArray[0].addWeapon(sp);
				spArray[0].imageData = spArray[0].getImageData();
				break;
			case "life":
				var dim = spArray.length;

				for (let i = 0; i < dim-1; i++)
				{
					spArray[i].setLifeImg(img, Math.round(nw/2), Math.round(nh/2));
				}
				nLoad++;
				break;
			case "lifeBar":
				var dim = spArray.length;

				for (let i = 0; i < dim-1; i++)
				{
					spArray[i].setLifeBarImg(img);
				}
				nLoad++;
				break;
			case "bullet":
				spArray[totLoad] = new Bullet(img, Math.round(nw/2), Math.round(nh/2), spArray[0].weapons[0]);
				nLoad++;
				break; 
		}		

		if (nLoad == totLoad)
		{
			var ev3 = new Event("initend");
			ev3.spArray = spArray;
			ctx.canvas.dispatchEvent(ev3);
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
	var dim = spArray.length;

	for (let i = 0; i < dim; i++)
	{
		spArray[i].draw(ctx);
	}
}


//apagar sprites
function clear(ctx, spArray)
{
	var dim = spArray.length;

	for (let i = 0; i < dim; i++)
	{
		spArray[i].clear(ctx);
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
	var sp = spArray[0];
	if(sp.intersectsPixelCheck(spArray[2])){
		sp.impact = 121;
		sp.impactDirection = spArray[2].direction;
		sp.life-=10;
		if(sp.life<=0){
			sp.life=0;
			window.cancelAnimationFrame(reqID);
		}
	}

	var dim = spArray.length;

	for (let i = 0; i < dim; i++)
	{
		spArray[i].rotate();
		spArray[i].move(cw, ch);
	}
	draw(ctx, spArray);
	if(ctx.pause)
		window.cancelAnimationFrame(reqID);
}
