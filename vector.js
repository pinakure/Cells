function Vector(x,y,z){
	this.x = x;
	this.y = y;
	this.z = z;	
}

Vector.prototype.mult = function(vector){
	this.x *= vector.x;
	this.y *= vector.y;
	this.z *= vector.z;
}
Vector.prototype.multFast = function(x, y, z){
	this.x *= x;
	this.y *= y;
	this.z *= z;
}

Vector.prototype.div = function(vector){
	this.x /= vector.x;
	this.y /= vector.y;
	this.z /= vector.z;
}
Vector.prototype.divFast = function(x, y, z){
	this.x /= x;
	this.y /= y;
	this.z /= z;
}

Vector.prototype.sub = function(vector){
	this.x -= vector.x;
	this.y -= vector.y;
	this.z -= vector.z;
}
Vector.prototype.subFast = function(x, y, z){
	this.x -= x;
	this.y -= y;
	this.z -= z;
}

Vector.prototype.sum = function(vector){
	this.x += vector.x;
	this.y += vector.y;
	this.z += vector.z;
}
Vector.prototype.sumFast = function(x, y, z){
	this.x += x;
	this.y += y;
	this.z += z;
}

Vector.prototype.setFast = function(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;
}
Vector.prototype.set = function(vector){
	this.x = vector.x;
	this.y = vector.y;
	this.z = vector.z;
}

Vector.prototype.clamp = function(x, y, z){
	if(this.x < parseInt(-x)) this.x = parseInt(-x);
	if(this.y < parseInt(-y)) this.y = parseInt(-y);
	if(this.z < parseInt(-z)) this.z = parseInt(-z);
	if(this.x > parseInt(x)) this.x = parseInt(x);
	if(this.y > parseInt(y)) this.y = parseInt(y);
	if(this.z > parseInt(z)) this.z = parseInt(z);
}

Vector.prototype.randomize = function(grain){
	this.x = (-2+(Math.random()*4))/grain;
	this.y = (-2+(Math.random()*4))/grain;
	this.z = (-2+(Math.random()*4))/grain;
}

