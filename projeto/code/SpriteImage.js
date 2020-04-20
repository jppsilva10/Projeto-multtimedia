"use strict";

class SpriteImage
{
	constructor(img, w, h, x, y, direction, ctx){
		this.img = img;
		this.width = w;
		this.height = h;
		this.x = x;
		this.xc = this.x + Math.round(this.width / 2);
		this.y = y;
		this.yc = y + Math.round(this.height / 2);
		this.direction = direction;
		this.ctx = ctx;
		//this.imageData = this.getImageData();
		this.impact = -1;
		this.impactDirection=0;
	}
	setLifeImg(img, Lw, Lh){
	}
	setLifeBarImg(img){
	}
	move(cw, ch){
	}
	rotate(){
	}
	react(){
	}
	draw(ctx){
		
		ctx.save();
		if(this.impact>0){
			ctx.globalAlpha = (121-3*this.impact/4)/121;
		}
		ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.direction);
        ctx.translate(-this.width / 2, -this.height / 2);
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        ctx.restore();
	}
	drawLife(ctx){
	}
	getImageData(){
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.save();
		this.ctx.translate(this.width / 2, this.height / 2);
        this.ctx.rotate(this.direction);
        this.ctx.translate(-this.width / 2, -this.height / 2);
        this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
        this.ctx.restore();
		return this.ctx.getImageData(0, 0, this.width, this.height);
	}

	static intersectsBoundingBox(sp1, sp2){
		if(sp1.x > sp2.x+ sp2.cw || sp2.x > sp1.x+ sp1.cw)
			return false;
		if(sp1.y > sp2.y+ sp2.ch || sp2.y > sp1.y+ sp1.ch)
			return false;
		return true;
	}

	intersectsPixelCheck(sp2){
		if(SpriteImage.intersectsBoundingBox(this, sp2)){
			var xMin = Math.max(this.x, sp2.x);
			var xMax = Math.min(this.x + this.width, sp2.x + sp2.width);
			var yMin = Math.max(this.y, sp2.y);
			var yMax = Math.min(this.y + this.height, sp2.y + sp2.height);

			for(let x = xMin; x <= xMax; x++){
				for(let y = yMin; y <= yMax; y++){
					// sprite 1
					var xLocal = Math.round(x - this.x);
					var yLocal = Math.round(y - this.y);
					var pixelIndex1 = yLocal * this.width + xLocal;
					pixelIndex1 = pixelIndex1 * 4 + 3;
					// sprite 2
					xLocal = Math.round(x - sp2.x);
					yLocal = Math.round(y - sp2.y);
					var pixelIndex2 = yLocal * sp2.width + xLocal;
					pixelIndex2 = pixelIndex2 * 4 + 3;

					if(this.imageData.data[pixelIndex1] && sp2.imageData.data[pixelIndex2]){
						return true;
					}
				}
			}
			return false;
		}
		else{
			return false;
		}
	}
}

class Entidade extends SpriteImage
{
	constructor(img, w, h, x, y, direction, ctx, life, speed){
		super(img, w, h, x, y, direction, ctx)
		this.life = life;
		this.InitLife = life;
		this.speed = speed;
		this.lifeImg = null;
		this.lifeBarImg = null;
		this.Lw = 0;
		this.Lh = 0;
	}
	setLifeImg(img, Lw, Lh){
		this.lifeImg = img;
		this.Lw = Lw;
		this.Lh = Lh;
	}
	setLifeBarImg(img){
		this.lifeBarImg = img;
	}
	drawlife(ctx){
		var x = this.x + (this.width-this.Lw)/2;
		var y = this.y + this.height;
		ctx.drawImage(this.lifeBarImg, x, y, this.Lw, this.Lh);
		ctx.drawImage(this.lifeImg, x, y, this.Lw * this.life / this.InitLife, this.Lh);
	}
}

class Nave extends Entidade
{
	constructor(img, w, h, x, y, direction, ctx, life, speed){
		super(img, w, h, x, y, direction, ctx, life, speed);
		this.up= false;
		this.down= false;
		this.left= false;
		this.right= false;
		this.Rleft= false;
		this.Rright= false;
		this.weapons =new Array(1);
	}

	move(cw, ch){

		if(this.right && !this.left){
			if (this.x + this.width < cw)
			{
				if (this.x + this.width + this.speed > cw)
					this.x = cw - this.width;
				else
					this.x += this.speed;		
			}
		}
		if(this.left && !this.right){
			if (this.x > 0)
			{
				if (this.x - this.speed < 0)
					this.x = 0;
				else
					this.x -= this.speed;		
			}
		}
		if(this.up && !this.down){
			if (this.y > 0)
			{
				if (this.y - this.speed < 0)
					this.y = 0;
				else
					this.y -= this.speed;		
			}
		}
		if(this.down && !this.up){
			if (this.y + this.height < ch)
			{
				if (this.y + this.height + this.speed > ch)
					this.y = ch - this.height;
				else	
					this.y += this.speed;		
			}
		}
		if(this.impact>0){
			var change1 = false;
			var change2 = false
			this.impact-= 5;
			this.x += (Math.cos(this.impactDirection) * (this.impact/10));
			if (cw < this.x + this.width){
				this.x = cw - this.width;
				change1 = true;
			}
			if (0 > this.x){
				this.x = 0;
				 change1 = true;
			}
			this.y += (Math.sin(this.impactDirection) * (this.impact/10));
			if (ch < this.y + this.height){
				this.y = ch - this.height;
				change2 = true;
			}
			if (0 > this.y){
				this.y = 0;
				change2 = true;
			}
			if(change1 && change2)
				this.impact =0;
		}
		this.xc=this.x + Math.round(this.width / 2);
		this.yc=this.y + Math.round(this.height / 2);
	}

	rotate(){
		var change = false;
		if(this.Rright && !this.Rleft){
			this.direction += this.speed*Math.PI/180;
			change = true;
		}
		if(this.Rleft && !this.Rright){
			this.direction -= this.speed*Math.PI/180;
			change = true;
		}
		if(change){
			this.imageData = this.getImageData();
		}
	}

	react(objeto){

	}

	addWeapon(weapon){
		for(let i=0; i<this.weapons.length; i++){
			if(this.weapons[i]==null){
				this.weapons[i]= weapon;
				break;
			}
		}
		weapon.nave=this;
	}
	draw(ctx){	
		ctx.save();
		if(this.impact>0){
			ctx.globalAlpha = (121-3*this.impact/4)/121;
		}
		ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.direction);
        ctx.translate(-this.width / 2, -this.height / 2);
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        for(let i=0; i<this.weapons.length; i++){
        	ctx.translate(this.width / 2, this.height / 2);
        	ctx.rotate(this.weapons[i].direction);
        	ctx.translate(-this.width / 2, -this.height / 2);
        	ctx.drawImage(this.weapons[i].img, this.width/2 - this.weapons[i].width/2, 0, this.weapons[i].width, this.weapons[i].height);
        }
        ctx.restore();
        this.drawlife(ctx);
	}
	getImageData(){
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.save();
		this.ctx.translate(this.width / 2, this.height / 2);
        this.ctx.rotate(this.direction);
        this.ctx.translate(-this.width / 2, -this.height / 2);
        this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
        for(let i=0; i<this.weapons.length; i++){
        	this.ctx.translate(this.width / 2,this.height / 2);
        	this.ctx.rotate(this.weapons[i].direction-this.direction);
        	this.ctx.translate(-this.width / 2, -this.height / 2);
        	this.ctx.drawImage(this.weapons[i].img, this.width/2-this.weapons[i].width/2, 0, this.weapons[i].width, this.weapons[i].height);
        }
        this.ctx.restore();
		return this.ctx.getImageData(0, 0, this.width, this.height);
	}
}

class Arma extends SpriteImage
{
	constructor(img, w, h, x, y, direction){
		super(img, w, h, x, y, direction, null);
		this.damage = 10;
		this.speed = 7;
		this.distance = 500;
		this.nave=null;
	}
	draw(ctx){
	}
	getImageData(){
		return null;
	}
}

class Bullet extends SpriteImage
{
	constructor(img, w, h, weapon){
		console.log(img);
		var x = weapon.nave.xc-w/2 + (weapon.nave.height-50)*Math.cos(weapon.nave.direction+weapon.direction - Math.PI / 2);
		var y = weapon.nave.yc + (weapon.nave.height-50)*Math.sin(weapon.nave.direction+weapon.direction - Math.PI / 2);
		super(img, w, h, x, y, weapon.nave.direction+weapon.direction / 2, null)
		this.weapon = weapon;
		this.damage = weapon.damage;
		this.speed = weapon.speed;
		this.distance = weapon.distance;
		//this.imageData = this.getImageData();
	}
	move(cw, ch){
		this.x = this.x + (Math.cos(this.direction- Math.PI / 2) * this.speed);
		this.y = this.y + (Math.sin(this.direction-  Math.PI / 2) * this.speed);
		this.distance-=this.speed;
		if(this.distance<0){
			this.distance = this.weapon.distance;
			this.x = this.weapon.nave.xc-this.width/2 + (this.weapon.nave.height-50)*Math.cos(this.weapon.nave.direction+this.weapon.direction - Math.PI / 2);
			this.y = this.weapon.nave.yc + (this.weapon.nave.height-50)*Math.sin(this.weapon.nave.direction+this.weapon.direction - Math.PI / 2);
			this.direction = this.weapon.nave.direction+this.weapon.direction;
			//this.imageData = this.getImageData();
		}
	}
	draw(ctx){
		ctx.save();
		//if(this.impact>0){
			//ctx.globalAlpha = (121-3*this.impact/4)/121;
		//}
		ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.direction);
        ctx.translate(-this.width / 2, -this.height / 2);
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        ctx.restore();
	}
	getImageData(){
		var canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		var ctx = canvas.getContext("2d");

		ctx.clearRect(0, 0, this.width, this.height);
		ctx.translate(this.width / 2, this.height / 2);
        ctx.rotate(this.direction);
        ctx.translate(-this.width / 2, -this.height / 2);
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
		return ctx.getImageData(0, 0, this.width, this.height);
	}
}

class Inimigo extends Entidade
{
	constructor(img, w, h, x, y, direction, ctx, life, speed, alvo, damage){
		direction = Math.atan2(alvo.yc - (y + h/2), alvo.xc - (x + w/2));
		super(img, w, h, x, y, direction, ctx, life, speed);
		this.alvo = alvo;
		this.damage = damage;
	}
	move(cw, ch){
		this.x = this.x + (Math.cos(this.direction) * this.speed);
		this.y = this.y + (Math.sin(this.direction) * this.speed);
		this.xc=this.x + this.width / 2;
		this.yc=this.y + this.height / 2;
	}
	rotate(){
		var alvo =  this.alvo;
		if( (alvo.up && !alvo.down) || (alvo.down && !alvo.up) || (alvo.left && !alvo.right) || (alvo.right && !alvo.left) || alvo.impact>=0){
			this.direction = Math.atan2(this.alvo.yc - this.yc, this.alvo.xc - this.xc);
			this.imageData = this.getImageData();
		}
	}
	react(objeto){
		if(objeto = this.alvo){

			return true
		}
	}
	draw(ctx){
		ctx.save();
		ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.direction + Math.PI / 2);
        ctx.translate(-this.width / 2, -this.height / 2);
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        ctx.restore();
        this.drawlife(ctx);
	}
	getImageData(){
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.save();
		this.ctx.translate(this.width / 2, this.height / 2);
        this.ctx.rotate(this.direction + Math.PI / 2);
        this.ctx.translate(-this.width / 2, -this.height / 2);
        this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
        this.ctx.restore();
		return this.ctx.getImageData(0, 0, this.width, this.height);
	}

}
