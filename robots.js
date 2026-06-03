"use strict";

var vout;
var theBots = [];
var frameskip = 0;

function tick(){
	update();
	
	if(config.frameskip){
		if(frameskip == 0){
			redraw();
		}

		frameskip++;
		frameskip %= 4;
	} else redraw();
	
	setTimeout(tick, 15);
}

function update(){
	var x;
	for(x=0; x<theBots.length; x++){
		if(!theBots[x].position) continue;
		theBots[x].update();		
	}
}

function redraw(){	
	var x=0;
	
	if(config.blur){
		vout.adquire();
		vout.noise();
	} else {
		vout.context.clearRect(0,0,vout.width, vout.height);
		vout.adquire();
	}
	
	for(x=0; x<theBots.length; x++){
		if(!theBots[x].position) continue;
		theBots[x].redraw();
	}
	
	vout.release();
}

function slideVar(varname){
	var value = $('#slider_'+varname).val();
	var i;
	for(i=0; i<theBots.length; i++){
		switch(varname){
			case 'iathreads':	config.determineIterations = value; break;
			case 'iadepth':		config.determineDepth = value; break;
			case 'foresight':	config.foresight = theBots[i].foresight = value; break;
			case 'particles':  	config.particlePairs = value; initTheBots(); return;
			case 'longevity':  	config.longevity = value; return;
		}
	}
}

function toggleVar(varname){
	
	var value = $('#toggle_'+varname).attr('checked');
	
	var i;
	for(i=0; i<theBots.length; i++){
		switch(varname){
			case 'mind':		config.drawMind = value; break;
			case 'age':			config.canAge = theBots[i].canAge = value; break;
			case 'spawn':		config.canSpawn = theBots[i].canSpawn = value; break;
			case 'clamp':		config.clampSpace = theBots[i].clampSpace = value; break;
			case 'ascend':		config.canAscend = theBots[i].canAscend = value; break;
			case 'stick':		config.canStick = theBots[i].canStick = value; break;
			case 'blur':		config.blur = value; break;
			case 'frameskip':	config.frameskip = value; break;			
		}		
	}
}

function Config(){
	this.particlePairs = 16;
	
	this.canAge = true;
	this.canSpawn = true;
	this.clampSpace = true;
	this.canAscend = false;
	this.canStick = true;
	this.foresight = 10;
	this.longevity = 10;
	
	this.determineIterations = 12;
	this.determineDepth = 32;
	
	this.drawMind = true;
	this.blur = true;
	this.frameskip = false;
} var config;

function generateSlider(varname, initialValue, caption){
	return '<input type="number" id="slider_'+varname+'" onchange="slideVar(\''+varname+'\')" value="'+initialValue+'"><span style="line-height: 18px">'+caption+'</span></input><br/>';
}
function generateOption(varname, initialValue, caption){
	return '<input type="checkbox" id="toggle_'+varname+'" onclick="toggleVar(\''+varname+'\')" '+(initialValue?'checked="true"':'')+'">'+caption+'</input><br/>';
}

function initTheBots(){
	theBots = [];
	var times;
	for(times=0; times < config.particlePairs; times++){
		theBots[theBots.length] = new Robot((320/3), 120, 0);
		theBots[theBots.length] = new Robot(((320/3)*2), 128, 0);
	}
}

$(function(){
	config = new Config();
	
	vout = new VOut('vout');
	
	$('nav').append("<h2>Settings</h2>");
	$('nav').append('<hr>');
	$('nav').append(generateOption('age', 		config.canAge, 				"Age"));
	$('nav').append(generateOption('spawn', 	config.canSpawn, 			"Spawn after death"));
	$('nav').append(generateOption('clamp', 	config.clampSpace, 			"Boundary Collisions"));
	$('nav').append(generateOption('ascend',	config.canAscend, 			"Ascendant currents"));
	$('nav').append(generateOption('stick', 	config.canStick, 			"Stick to shadow"));
	$('nav').append('<hr>');
	$('nav').append(generateOption('mind', 		config.drawMind, 			"Draw cell mind"));
	$('nav').append(generateOption('blur', 		config.blur, 				"Movement Trail"));
	$('nav').append(generateOption('frameskip',	config.frameskip, 			"Frame Skip"));
	$('nav').append('<hr>');
	$('nav').append(generateSlider('foresight',	config.foresight, 			"Foresight"));
	$('nav').append(generateSlider('particles',	config.particlePairs,		"Particles"));
	$('nav').append(generateSlider('longevity',	config.longevity,			"Longevity"));
	$('nav').append(generateSlider('iadepth',	config.determineDepth,		"IA Depth"));
	$('nav').append(generateSlider('iathreads',	config.determineIterations,	"IA Threads"));
	
	initTheBots();
	
	setTimeout(tick, 15);
});