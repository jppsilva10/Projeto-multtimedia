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

	function f(ev){
		if(ev.keyCode==27)
		source.postMessage('continue', '*');
	}
	window.addEventListener("keydown", f);
}