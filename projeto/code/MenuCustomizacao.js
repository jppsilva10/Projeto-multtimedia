"use strict";

(function()
{	
	window.addEventListener("load", main);
}());


function main()
{
    var audio = document.getElementById('hover');
    var text = document.getElementById("text");
	var source;
	function messageHandler(ev){
		source = ev.source;
        audio.volume = ev.data[1];  
	}
    window.addEventListener("message", messageHandler);

	var btns = document.getElementsByTagName("button");
    var Bbtn = document.getElementById("voltar");
    var Pbtn = document.getElementById("jogar");
    function buttonClickHandler(ev){
    	var btn = ev.currentTarget;
        switch (btn){
    	    case btns[0]:
                if (btn.childNodes[1].style.opacity == 1){
    		    source.postMessage('$0', '*');
                btn.childNodes[1].style.opacity = 0.3;
                }
                else{
                    source.postMessage('&0', '*');
                    btn.childNodes[1].style.opacity = 1;
                }
                break;
            case btns[1]:
                if (btn.childNodes[1].style.opacity == 1){
                source.postMessage('$1', '*');
                btn.childNodes[1].style.opacity = 0.3;
                }
                else{
                    source.postMessage('&1', '*');
                    btn.childNodes[1].style.opacity = 1;
                }
                break;
            case btns[2]:
                if (btn.childNodes[1].style.opacity == 1){
                source.postMessage('$2', '*');
                btn.childNodes[1].style.opacity = 0.3;
                }
                else{
                    source.postMessage('&2', '*');
                    btn.childNodes[1].style.opacity = 1;
                }
                break;
            case btns[3]:
                if (btn.childNodes[1].style.opacity == 1){
                    source.postMessage('$3', '*');
                    btn.childNodes[1].style.opacity = 0.3;
                }
                else{
                    source.postMessage('&3', '*');
                    btn.childNodes[1].style.opacity = 1;
                }
                break;
            case btns[4]:
                if (btn.childNodes[1].style.opacity == 1){
                    source.postMessage('$4', '*');
                    btn.childNodes[1].style.opacity = 0.3;
                }
                else{
                    source.postMessage('&4', '*');
                    btn.childNodes[1].style.opacity = 1;
                }
                break;
            case btns[5]:
                if (btn.childNodes[1].style.opacity == 1){
                    source.postMessage('$5', '*');
                    btn.childNodes[1].style.opacity = 0.3;
                }
                else{
                    source.postMessage('&5', '*');
                    btn.childNodes[1].style.opacity = 1;
                }
                break;
            case btns[6]:
                if (btn.childNodes[1].style.opacity == 1){
                    source.postMessage('$6', '*');
                    btn.childNodes[1].style.opacity = 0.3;
                }
                else{
                    source.postMessage('&6', '*');
                    btn.childNodes[1].style.opacity = 1;
                }
                break;
            case btns[7]:
                if (btn.childNodes[1].style.opacity == 1){
                    source.postMessage('$7', '*');
                    btn.childNodes[1].style.opacity = 0.3;
                }
                else{
                    source.postMessage('&7', '*');
                    btn.childNodes[1].style.opacity = 1;
                }
                break;
            case Bbtn:
                source.postMessage('../projeto/html/MenuPrincipal.html', '*');
                break;
            case Pbtn:
                source.postMessage('../projeto/main.html', '*');
                break;
        }
    }
    for(let i = 0; i<8; i++){
        btns[i].addEventListener("click", buttonClickHandler);
        btns[i].childNodes[1].style.opacity=1;
    }


    function hoverHandler(ev){
        audio.currentTime = 0
        audio.play();
        text.src = "../resources/info" + ev.currentTarget.childNodes[1].src[ev.currentTarget.childNodes[1].src.length-5]+ ".txt";
    }

    for(let i = 0; i<8; i++){
        btns[i].addEventListener("mouseover", hoverHandler);
    }

    Bbtn.addEventListener("click", buttonClickHandler);
    Bbtn.addEventListener("mouseover", hoverHandler);
    Pbtn.addEventListener("click", buttonClickHandler);
    Pbtn.addEventListener("mouseover", hoverHandler);
}