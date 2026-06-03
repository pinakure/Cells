function VOut(domId){
	this.context = false;
	this.buffer = false;
	this.domId = domId;
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.a = 0;
	
	var element = document.getElementById(this.domId);
	this.context = element.getContext('2d');

	this.width = this.context.canvas.width;
	this.height = this.context.canvas.height;	
	this.buffer = this.context.getImageData(0,0,this.width,this.height);
}

VOut.prototype.adquire = function(){
	this.buffer = this.context.getImageData(0,0,this.width,this.height);
}

VOut.prototype.release = function(){
	this.context.putImageData(this.buffer, 0,0);
}

VOut.prototype.putpixel = function(x,y,color){
	var pos = ((parseInt(y)*this.width)+parseInt(x))<<2;
	this.buffer.data[pos++] = color[0]; 
	this.buffer.data[pos++] = color[1]; 
	this.buffer.data[pos++] = color[2]; 
	this.buffer.data[pos++] = color[3]; 	
}

VOut.prototype.getpixel = function(x,y){
	var pos = ((parseInt(y)*this.width)+parseInt(x))<<2;
	if((pos<0)||(pos>this.buffer.data.length-4)) {
		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.a = 0;
		return;
	}
	this.r = this.buffer.data[pos++];
	this.g = this.buffer.data[pos++];
	this.b = this.buffer.data[pos++];
	this.a = this.buffer.data[pos++];
	
}

VOut.prototype.noise = function() {
	var x = 0;
	while(x < this.buffer.data.length){
		this.buffer.data[x++] *= 0.9;
		this.buffer.data[x++] *= 0.9;
		this.buffer.data[x++] *= 0.9;
		this.buffer.data[x++] *= 0.9;
	}
}