"use strict";

(function()
{	
	window.addEventListener("load", main);
}());


function main()
{
	var source;
	function messageHandler(ev){
		if(ev.data=="hello frame"){
			source = ev.source;
    	}
	}
    window.addEventListener("message", messageHandler);
	var Nbtn = document.getElementById("newGame");
    var Lbtn = document.getElementById("loadGame");
    function buttonClickHandler(ev){
    	var btn = ev.currentTarget;
    	if(btn==Nbtn)
    		source.postMessage('../projeto/html/MenuPrincipal.html', '*');
    	else
    		source.postMessage('../projeto/html/LoadGame.html', '*');
    }
    Nbtn.addEventListener("click", buttonClickHandler);
    Lbtn.addEventListener("click", buttonClickHandler);
}