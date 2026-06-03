function Robot(x,y,z){
	/* Cell physic properties */
	this.position = new Vector(x,y,z);
	this.force = new Vector(0,0,0); //force effective each frame
	this.impulse = new Vector(0,0,0); //force being applicated to this.force!!!
	
	/* Prediction registers */
	this.virtualPosition = new Vector(x, y, z); 
	this.virtualForce = new Vector(0, 0, 0); 
	this.virtualImpulse = new Vector(0, 0, 0); 
	this.virtualJoining = false; 
	
	this.polygon = new Polygon();
	this.origin = new Vector(x,y,z);
	
	/* Cell status */
	this.genotype = 100;
	this.life = 255;
	this.angle = 0;
	this.agefactor = 1;
	this.foresight = 1;
	this.joining = false;	
	
	this.clampSpace = false;
	this.canStick = false;
	this.canAscend = false;
	this.canAge = false;
	this.canSpawn = false;
	
	this.spawn();
	
	this.pathIndex = 1;
	this.path = [];
	this.paths = [];
}

function botAt(x,y){
	var i;
	var threshold = 10;
	for(i=0; i<theBots.length; i++)
		if((parseInt(theBots[i].position.x) > parseInt(x)-threshold)&&(parseInt(theBots[i].position.y) > parseInt(y)-threshold))
			if((parseInt(theBots[i].position.x) < parseInt(x)+threshold)&&(parseInt(theBots[i].position.y) < parseInt(y)+threshold))
				return theBots[i];
	
	return false;
}

Robot.prototype.spawn = function(){
	this.position.setFast(this.origin.x,this.origin.y,this.origin.z); 
	this.force.setFast(0,0,0);
	this.impulse.setFast(0,0,0);
	this.genotype = 25 + (Math.random()*185);
	this.life = 255 - (Math.random()*128);
	this.angle = 0;
	this.agefactor = 1+((Math.random()*10)/10);
	this.joining = false;
	
	this.pathIndex = 1;
	this.path = [];
	this.paths = [];
	
	this.foresight = config.foresight;
	this.clampSpace = config.clampSpace;
	this.canStick = config.canStick;
	this.canAscend = config.canAscend;
	this.canAge = config.canAge;
	this.canSpawn = config.canSpawn;
}



Robot.prototype.tracePath = function(depth){
	var path = [];
	
	this.virtualPosition.set(this.position);
	this.virtualForce.set(this.force);
	this.virtualImpulse.set(this.impulse);
	
	var i;
	for(i=0; i<depth; i++){
		
		this.virtualForce.clamp(1, 1, 1);
		
		/*apply force*/
		this.virtualForce.sum(this.virtualImpulse);
		/*brake applying force*/
		this.virtualImpulse.divFast(3, 3, 3); 				
		/*apply force to body*/
		this.virtualPosition.sum(this.virtualForce);
		
		this.virtualImpulse.randomize(this.genotype);
		if(this.canAscend){
			this.virtualImpulse.subFast(0, 0.05, 0);
		} 
		
		/*Foresight obstacles*/
		if(this.canStick){
			var fx = parseInt(this.virtualPosition.x+(this.virtualForce.x)*this.foresight);
			var fy = parseInt(this.virtualPosition.y+(this.virtualForce.y)*this.foresight);
			vout.getpixel(fx, fy);
			if(vout.a > 1){
				this.virtualImpulse.divFast(1.1,1.1,1.1);
				this.virtualForce.divFast(1.1,1.1,1.1);
				this.virtualImpulse.randomize(this.genotype);
				this.virtualJoining = true;
			} else this.virtualJoining = false;
		} else this.virtualJoining = false;
		
		/* Clamp virtual position */
		if(this.virtualPosition.x >= vout.width){
			if(this.clampSpace){
				this.virtualPosition.x=vout.width-1;
				this.virtualForce.x = 0;
			} else this.virtualPosition.x = 1;
		} else if(this.virtualPosition.x < 0){
			if(this.clampSpace){
				this.virtualPosition.x=0;
				this.virtualForce.x = 0;
			} else this.virtualPosition.x = vout.width-2;
		}
		if(this.virtualPosition.y >= vout.height){
			if(this.clampSpace){
				this.virtualPosition.y=vout.height-1;
				this.virtualForce.y = 0 ;
			}else this.virtualPosition = -1;
		} else if(this.virtualPosition.y < 0){
			if(this.clampSpace){
				this.virtualPosition.y=0;
				this.virtualForce.y = 0;	
			} else this.virtualPosition.y = vout.height-2;
		}
		path[path.length] = [this.virtualPosition.x, this.virtualPosition.y, this.virtualForce.x, this.virtualForce.y];
	}
	return path;
}


Robot.prototype.consider = function(){
	var i, o;
	for(i=0;i<this.paths.length; i++){
		for(o=0;o < this.paths[i].length; o++){
			var bot = botAt(this.paths[i][o][0], this.paths[i][o][1])
			if(bot){
				if(bot != this){
					return this.paths[i];
				}
			}
		}
	}
	return this.paths[parseInt(Math.random()*this.paths.length)];
}


Robot.prototype.determine = function(){
	var i;
	
	/* Forget about current path*/
	this.path = [];	//if current is not valid...?
	
	/* Generate N random paths */
	this.paths = [];	//if current is not valid...?
	for(i=0; i < config.determineIterations; i++){
		this.paths[i] = this.tracePath(config.determineDepth);
	}
	
	/* Select best path (less energy requiring to achieve best results) */
	this.path = this.consider();
}


	
Robot.prototype.update = function(){
	
	/* Degrade cell */
	if(this.canAge){
		if(this.life <=0){
			if(this.canSpawn) this.spawn();
		} else this.life -= this.agefactor/config.longevity;
	}
	if(this.path[this.pathIndex]){		
		this.position.x = this.path[this.pathIndex][0];
		this.position.y = this.path[this.pathIndex][1];
		this.force.x = this.path[this.pathIndex][2];
		this.force.y = this.path[this.pathIndex][3];
	}
	this.pathIndex++;
	if((this.pathIndex >= this.path.length)||(parseInt(Math.random()*this.path.length)==0)){
		this.pathIndex = 0;
		this.determine();
	}
	return;
	/**-------------------------------------------------------------------------------*/
	this.force.clamp(1, 1, 1);
	this.force.sum(this.impulse);			//apply force	
	
	
	this.impulse.divFast(3, 3, 3); 			//brake applying force
	this.position.sum(this.force);			//apply force to body
	
	
	this.impulse.randomize(this.genotype);
	if(this.canAscend){
		this.impulse.subFast(0, 0.05, 0);
	} 
	
	if(this.canStick){
		var fx = parseInt(this.position.x+(this.force.x)*this.foresight);
		var fy = parseInt(this.position.y+(this.force.y)*this.foresight);
		vout.getpixel(fx, fy);
		if(vout.a > 1){
			this.impulse.divFast(1.1,1.1,1.1);
			this.force.divFast(1.1,1.1,1.1);
			// this.impulse.setFast(0,0,0);
			// this.force.setFast(0,0,0);
			this.impulse.randomize(this.genotype);
	
			this.joining = true;
		} else this.joining = false;
	} else this.joining = false;
	
	
	
	/* Clamp position */
	if(this.position.x >= vout.width){
		if(this.clampSpace){
			this.position.x=vout.width-1;
			this.force.x = 0;
		} else this.position.x = 0;
	} else if(this.position.x < 0){
		if(this.clampSpace){
			this.position.x=0;
			this.force.x = 0;
		} else this.position.x = vout.width-1;
	}
	
	if(this.position.y >= vout.height){
		if(this.clampSpace){
			this.position.y=vout.height-1;
			this.force.y = 0;
		}else this.position = 0;
	} else if(this.position.y < 0){
		if(this.clampSpace){
			this.position.y=0;
			this.force.y = 0;	
		} else this.position.y = vout.height-1;
	}
	this.pathIndex++;
}

Robot.prototype.redraw = function(){
	var r,g,b,a;
	
	if(config.drawMind){
		for(r=0; r<this.paths.length; r++){
			for(g=0; g<this.paths[r].length; g++){
				a = this.paths[r][g][0];
				b = this.paths[r][g][1];
				vout.putpixel(a, b, [128,128,0,this.life/4]);
			}			
		}
		for(r=0; r<this.path.length; r++){
			g = this.path[r][0];
			b = this.path[r][1];
			vout.putpixel(g, b, [255,0,0,this.life/2]);
		}
	}
	
	/* Draw cell placeholder */
	r = this.joining?this.life>>1:0;
	g = this.joining?32:this.life;
	b = 0;
	a = this.joining?200:this.life;
	
	vout.putpixel(this.position.x, this.position.y, [r,g,b,a]);	
	if(this.life > 128){
		vout.putpixel(this.position.x-1, this.position.y, [r,g,b,a]);	
		vout.putpixel(this.position.x+1, this.position.y, [r,g,b,a]);	
		vout.putpixel(this.position.x, this.position.y-1, [r,g,b,a]);	
		vout.putpixel(this.position.x, this.position.y+1, [r,g,b,a]);	
	}
	
}