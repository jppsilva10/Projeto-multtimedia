"use strict";

(function()
{	
	window.addEventListener("load", main);
}());


function main()
{
	var audio = document.getElementById('hover');

	var source;
	function messageHandler(ev){
		source = ev.source;
        audio.volume = ev.data[1];  
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
}