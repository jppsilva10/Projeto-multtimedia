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
	var Cbtn = document.getElementById("campanha");
    var Sbtn = document.getElementById("sobrevivencia");
    var Rbtn = document.getElementById("ranking");
    var Obtn = document.getElementById("opcoes");
    var Abtn = document.getElementById("ajuda");
    var Qbtn = document.getElementById("sair");
    function buttonClickHandler(ev){
    	var btn = ev.currentTarget;
        switch (btn){
    	case Cbtn:
    		source.postMessage('../projeto/html/Campanha.html', '*');
            break;
        case Sbtn:
            source.postMessage('../projeto/html/Sobrevivencia.html', '*');
            break;
        case Rbtn:
            source.postMessage('../projeto/html/Ranking.html', '*');
            break;
        case Obtn:
            source.postMessage('../projeto/html/Opcoes.html', '*');
            break;
        case Abtn:
            source.postMessage('../projeto/html/Ajuta.html', '*');
            break;
        case Qbtn:
            source.postMessage('Sair', '*');
            break;
        }
    }
    Cbtn.addEventListener("click", buttonClickHandler);
    Sbtn.addEventListener("click", buttonClickHandler);
    Rbtn.addEventListener("click", buttonClickHandler);
    Obtn.addEventListener("click", buttonClickHandler);
    Abtn.addEventListener("click", buttonClickHandler);
    Qbtn.addEventListener("click", buttonClickHandler);
}