"use strict";

const totPages = 3;

(function()
{	
	window.addEventListener("load", main);
}());


function main()
{
	window.addEventListener("message", messageHandler);
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.canvas.addEventListener("start", anim);
	var nave;
	var img = new Image();

	img.addEventListener("load", imgLoadedHandler);
	img.src = "../projeto/resources/nave.png"; 
	
	function imgLoadedHandler(ev)
	{
		var nw = img.naturalWidth;
		var nh = img.naturalHeight;
		var canvas = document.createElement('canvas');
		canvas.width = Math.round(nw/3);
		canvas.height = Math.round(nh/3);
		var context = canvas.getContext("2d");
		nave = new Nave(img, Math.round(nw/3), Math.round(nh/3), Math.round(ctx.canvas.width/2), Math.round(ctx.canvas.height/2), 0, context, 100, 2);
		nave.getImageData = function f(){
			return null;
		}
		nave.setLifeImg(img, 0, 0);
		nave.setLifeBarImg(img);
		nave.left = true;
		nave.down = true;
		nave.Rleft = true;
		nave.weapons = new Array(0);
		var ev4 = new Event("start");
		ctx.canvas.dispatchEvent(ev4);
	}

	function anim(ev){
		nave.draw(ctx);
		animLoop(ctx, nave, 0);
	}
	
	var startPage = "../projeto/html/MenuInicial.html";
	hidePage();
	showPage(startPage);
}
function animLoop(ctx, nave, startTime, time)
{	
	var al = function(time)
	{
		if(startTime==0){
			startTime = time;
		}
		animLoop(ctx, nave, startTime, time);
	}
	var reqID = window.requestAnimationFrame(al);
	render(ctx, nave, reqID, time - startTime);
}

function render(ctx, nave, reqID, dt)
{
	var cw = ctx.canvas.width;
	var ch = ctx.canvas.height;

	ctx.clearRect(0, 0, cw, ch);
	if (nave.x + nave.width >= cw){
		nave.right=false;
		nave.left= true;
		if(nave.up){
			nave.Rleft=false;
			nave.Rright=true;
		}
		else{
			nave.Rleft=true;
			nave.Rright=false;
		}
	}
	if (nave.x <= 0){
		nave.right=true;
		nave.left= false;
		if(nave.up){
			nave.Rleft=true;
			nave.Rright=false;
		}
		else{
			nave.Rleft=false;
			nave.Rright=true;
		}
	}
	if (nave.y + nave.height >= ch){
		nave.down=false;
		nave.up= true;
		if(nave.left){
			nave.Rleft=true;
			nave.Rright=false;
		}
		else{
			nave.Rleft=false;
			nave.Rright=true;
		}
	}
	if (nave.y <= 0){
		nave.down=true;
		nave.up= false;
		if(nave.right){
			nave.Rleft=true;
			nave.Rright=false;
		}
		else{
			nave.Rleft=false;
			nave.Rright=true;
		}
	}
	nave.rotate();
	nave.move(cw, ch);
	nave.draw(ctx);
}

function showPage(page)
{	
	var frm = document.getElementsByTagName("iframe")[0];
	function flh(ev){
		frm.contentWindow.postMessage('hello frame', '*');
	}
	frm.addEventListener("load", flh);
	frm.src = page;
}

function hidePage()
{
	var frm = document.getElementsByTagName("iframe")[0];
	frm.src = "";
}

function messageHandler(ev){
	showPage(ev.data);
}