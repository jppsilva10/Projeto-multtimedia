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
	var Nbtn = document.getElementById("newGame");
    var Lbtn = document.getElementById("loadGame");
    function buttonClickHandler(ev){
    	var btn = ev.currentTarget;
    	if(btn==Nbtn)
    		source.postMessage('../projeto/html/MenuPrincipal.html', '*');
    	else
    		source.postMessage('../projeto/html/MenuPrincipal.html', '*');
    }
    Nbtn.addEventListener("click", buttonClickHandler);
    Lbtn.addEventListener("click", buttonClickHandler);

    function hoverHandler(ev){
        audio.currentTime = 0;
        audio.play();
    }

    Nbtn.addEventListener("mouseover", hoverHandler);
    Lbtn.addEventListener("mouseover", hoverHandler);
}