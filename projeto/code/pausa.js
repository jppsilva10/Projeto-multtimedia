"use strict";

(function()
{	
	window.addEventListener("load", main);
}());


function main()
{
	function f(ev){
		document.body.style.height=0;
	}
	window.addEventListener("keydown", f);
}