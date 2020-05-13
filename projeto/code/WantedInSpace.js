"use strict";

const totPages = 3;

(function()
{	
	window.addEventListener("load", main);
}());


function main()
{
	var audio = document.getElementsByTagName("audio")[0];
	var equip = document.getElementsByTagName("audio")[1];
	var remove = document.getElementsByTagName("audio")[2];
	var volume = 0.5;
	audio.volume = 0.5;
	equip.volume = 0.5;
	remove.volume = 0.5;

	var direction = 0;
	function messageHandler(ev){
		var str = ev.data;
		if(str[0]=="#"){
			var value = 0;
			var dim = str.length;
			for(let i = 2; i<dim;i++){
				value += str[i]; 
			}
			if(str[1]=="m"){
				audio.volume = value/100; 
			}
			else{
				volume = value/100;
				equip.volume = volume;
				remove.volume = volume;
			}
		}
		else if(str[0]=="$"){
			equip.currentTime = 0;
			equip.play();
			direction = addWeapon(nave, direction, str);
		}
		else if(str[0]=="&"){
			remove.currentTime = 0;
			remove.play();
			direction = removeWeapon(str[1], nave, direction);
		}
		else
			showPage(ev.data, audio.volume, volume, nave, ctx);
	}
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
		nave = new Nave(img, Math.round(nw/2), Math.round(nh/2), Math.round(ctx.canvas.width/2), Math.round(ctx.canvas.height/2), 0, null, 100, 1.5);
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
	showPage(startPage, audio.volume, volume, nave, ctx);
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

function showPage(page, volume1, volume2, nave, ctx)
{	
	var frm = document.getElementsByTagName("iframe")[0]; //---------
	function flh(ev){
		var volumes;
		if (page == '../projeto/main.html'){
			var volumes = new Array(6);
			for(let i =2 ; i<volumes.length; i++){
				console.log(nave.weapons[i-2].img.src);
				volumes[i]=nave.weapons[i-2].img.src;
			}
		}
		else{
			var volumes = new Array(2);
		}
		volumes[0]= volume1
		volumes[1]= volume2
		frm.contentWindow.postMessage(volumes, '*');
	}
	frm.addEventListener("load", flh);
	frm.src = page;
	if (page == '../projeto/html/MenuCustomizacao.html'){
		nave.up=false;
		nave.left=false;
		nave.down=false;
		nave.right=false;
		nave.Rleft=false;
		nave.Rright=false;
		nave.direction=0;
		nave.x = ctx.canvas.width/2-nave.width/2;
		nave.y = ctx.canvas.height/2-nave.height/2;
	}
	else if(page != '../projeto/main.html' && nave.up==false && nave.left==false && nave.down==false && nave.right==false && nave.Rleft==false && nave.Rright==false){
		nave.left = true;
		nave.down = true;
		nave.Rleft = true;
		nave.weapons = new Array(0);
	}
	var audio = document.getElementsByTagName("audio")[0]; //-----------------------------------
	audio.play();
}

function hidePage()
{
	var frm = document.getElementsByTagName("iframe")[0];
	frm.src = "";
}



function addWeapon(nave, direction, str){
	var img1 = new Image();
	img1.addEventListener("load", ilh);
	img1.src = "../projeto/resources/arma" + str[1] + ".png"; 
	img1.id = "arma";

	function ilh(ev){
		var img = ev.target;
		var nw = img.naturalWidth;
		var nh = img.naturalHeight;
		if(img.id == "arma"){
			var aux = new Array(nave.weapons.length+1);
			for(let i=0; i<nave.weapons.length; i++){
				aux[i] = nave.weapons[i];
			}
			nave.weapons = aux;
			var sp
			switch(str[1]){
				case "0":
    				sp = new Arma(img, Math.round(nw/2), Math.round(nh/2), nave.width/2 - Math.round(nw/2)/2, Math.round(nw/2)/2, direction);
            	break;
            	case "1":
    				sp = new Arma1(img, Math.round(nw/2), Math.round(nh/2), nave.width/2 - Math.round(nw/2)/2, Math.round(nw/2)/2, direction);
            	break;
            	case "2":
    				sp = new Arma2(img, Math.round(nw/2), Math.round(nh/2), nave.width/2 - Math.round(nw/2)/2, Math.round(nw/2)/2, direction);
            	break;
            	case "3":
    				sp = new Arma3(img, Math.round(nw/2), Math.round(nh/2), nave.width/2 - Math.round(nw/2)/2, Math.round(nw/2)/2, direction);
            	break;
            	case "4":
    				sp = new Arma4(img, Math.round(nw/2), Math.round(nh/2), nave.width/2 - Math.round(nw/2)/2, Math.round(nw/2)/2, direction);
            	break;
            	case "5":
    				sp = new Arma5(img, Math.round(nw/2), Math.round(nh/2), nave.width/2 - Math.round(nw/2)/2, Math.round(nw/2)/2, direction);
            	break;
            	case "6":
    				sp = new Arma6(img, Math.round(nw/2), Math.round(nh/2), nave.width/2 - Math.round(nw/2)/2, Math.round(nw/2)/2, direction);
            	break;
            	case "7":
    				sp = new Arma7(img, Math.round(nw/2), Math.round(nh/2), nave.width/2 - Math.round(nw/2)/2, Math.round(nw/2)/2, direction);
            	break;
			}
			direction += Math.PI/2;
			nave.addWeapon(sp);
			var img2 = new Image();
			img2.addEventListener("load", ilh);
			img2.src = "../projeto/resources/tiro" + img.src[img.src.length-5] + ".png"; 
			img2.id = "tiro";
		}
		else{
			var i = 0;
			while(nave.weapons[i].img.src[nave.weapons[i].img.src.length-5]!=img.src[img.src.length-5]){
				i++;
			}
			nave.weapons[i].addBullet(img, Math.round(nw/2), Math.round(nh/2));
		}
	}
	return direction;
}

function removeWeapon(n, nave, direction){
	var src = "../projeto/resources/arma" + n + ".png"; 
	direction = 0;
	var aux = new Array(nave.weapons.length-1);
	var j = 0;
	for(let i=0; i<nave.weapons.length; i++){
		if(nave.weapons[i].img.src[nave.weapons[i].img.src.length-5]!=n){
			nave.weapons[i].direction = direction;
			aux[j] = nave.weapons[i];
			direction += Math.PI/2;
			j++;
		} 
	}
	nave.weapons = aux;
	return direction;
}

