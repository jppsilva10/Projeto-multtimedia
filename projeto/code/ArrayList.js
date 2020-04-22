"use strict";

class ArrayList{
        
    constructor(){
        this.sp=null;
        this.next=null;
        this.ant=null;
    }
    add(sp){
        var aux = new ArrayList();
        aux.next = this.next;
        if(this.next!=null)
        	this.next.ant=aux;
        this.next = aux;
        aux.ant = this; 
        aux.sp = sp;
        sp.listPointer = aux;
    }
}