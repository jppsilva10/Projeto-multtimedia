"use strict";

(function()
{	
	window.addEventListener("load", main);
}());


function main()
{
	var source;
	var music = document.getElementById("musica");
    var soundEfects = document.getElementById("efeitos sonoros");
    var audio = document.getElementById('hover');

	function messageHandler(ev){
		source = ev.source;
        console.log(ev.data[0]);
        console.log(ev.data[1]);
        if(ev.data[0]*100==0){
            Mbtn.childNodes[0].src = "../resources/mute.png";
            music.style.opacity=0.3;
            music.style.cursor= "initial";
            music.disabled = true;
        }
        else{
		    Mbtn.childNodes[0].src = "../resources/sound.png";
            music.style.opacity= 1;
            music.style.cursor= "pointer";
            music.disabled = false;
        }
        if(ev.data[1]*100==0){
            Sbtn.childNodes[0].src = "../resources/mute.png";
            soundEfects.style.opacity=0.3;
            soundEfects.style.cursor= "initial";
            soundEfects.disabled = true;
            audio.volume =  ev.data[1];
        }
        else{
            Sbtn.childNodes[0].src = "../resources/sound.png";
            soundEfects.style.opacity=1;
            soundEfects.style.cursor= "pointer";
            soundEfects.disabled = false;
		    soundEfects.value = ev.data[1]*100; 
            audio.volume =  ev.data[1];
        }
        
	}

    window.addEventListener("message", messageHandler);
    var Bbtn = document.getElementById("voltar");
    function buttonClickHandler(ev){

    	source.postMessage('../projeto/html/MenuPrincipal.html', '*');
    }
    Bbtn.addEventListener("click", buttonClickHandler);

    function hoverHandler(ev){
        audio.currentTime = 0
        audio.play();
    }
    Bbtn.addEventListener("mouseover", hoverHandler);

    var mouseDown = false;

    function mouseDownHandler(ev){
    	mouseDown = true;
    }
    function mouseMoveHandler(ev){
    	var slider = ev.currentTarget;
    	if(mouseDown==false)
    		return;
    	if(slider == music){
    		var str = "#m" + music.value;
    		source.postMessage(str, '*');
    	}
    	else{
    		var str = "#s" + soundEfects.value;
    		source.postMessage(str, '*');
            audio.volume = soundEfects.value/100;
    	}
    }
    function mouseUpHandler(ev){
    	mouseDown = false;
    }
    music.addEventListener("mousedown", mouseDownHandler);
	music.addEventListener("mousemove", mouseMoveHandler);
	music.addEventListener("mouseup", mouseUpHandler);
    soundEfects.addEventListener("mousedown", mouseDownHandler);
	soundEfects.addEventListener("mousemove", mouseMoveHandler);
	soundEfects.addEventListener("mouseup", mouseUpHandler);

	function sliderHandler(ev){
    	var slider = ev.currentTarget;
    	if(slider == music){
    		var str = "#m" + music.value;
    		source.postMessage(str, '*');
    	}
    	else{
    		var str = "#s" + soundEfects.value;
    		source.postMessage(str, '*');
            audio.volume = soundEfects.value/100;
    	}
    }
	music.addEventListener("change", sliderHandler);
	soundEfects.addEventListener("change", sliderHandler);

	var on = true;

	var Mbtn = document.getElementsByTagName("button")[0];
	var Sbtn = document.getElementsByTagName("button")[1];
	function buttonHandler(ev){
    	var btn = ev.currentTarget;
    	var img = btn.childNodes;
    	if(btn == Mbtn){
    		if(music.disabled==false){
    			img[0].src = "../resources/mute.png";
    			var str = "#m" + 0;
    			source.postMessage(str, '*');
    			music.style.opacity=0.3;
    			music.style.cursor= "initial";
    			music.disabled = true;
    		}
    		else{
    			img[0].src = "../resources/sound.png";
    			var str = "#m" + music.value;
    			source.postMessage(str, '*');
    			music.style.opacity= 1;
    			music.style.cursor= "pointer";
    			music.disabled = false;
    		}
    	}
    	else{
    		if(soundEfects.disabled==false){
    			img[0].src = "../resources/mute.png";
    			var str = "#s" + 0;
    			source.postMessage(str, '*');
    			soundEfects.style.opacity=0.3;
    			soundEfects.style.cursor= "initial";
    			soundEfects.disabled = true;
                audio.volume = 0;
    		}
    		else{
    			img[0].src = "../resources/sound.png";
    			var str = "#s" + soundEfects.value;
    			source.postMessage(str, '*');
    			soundEfects.style.opacity=1;
    			soundEfects.style.cursor= "pointer";
    			soundEfects.disabled = false;
                audio.volume = soundEfects.value/100;
    		}
    	}
    }
    Mbtn.addEventListener("click", buttonHandler);
	Sbtn.addEventListener("click", buttonHandler);

}