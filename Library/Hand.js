Leap.Hand = function(handData, parentFrame){
	
	this._fingers = new Leap.FingerList();
	this._tools = new Leap.ToolList();
	this._pointables = new Leap.PointableList();
	
	this._fingerTable = {};
	this._toolTable = {};
	this._pointableTable = {};
	
	if(handData == null){
	
		this._frame = null;
		this._id = null;
		this._valid = false;
		
		this._r = new Leap.Matrix();
		this._s = null;
		this._t = new Leap.Vector();
		
		this._direction = new Leap.Vector();
		this._palmNormal = new Leap.Vector();
		this._palmPosition = new Leap.Vector();
		this._palmVelocity = new Leap.Vector();
		this._sphereCenter = new Leap.Vector();
		this._sphereRadius = null;
	}
	else{
		
		this._frame = parentFrame;
		this._id = handData.id;
		this._valid = true;
		
		this._r = new Leap.Matrix(handData.r);
		this._s = handData.s;
		this._t = new Leap.Vector(handData.t);
		
		this._direction = new Leap.Vector(handData.direction);
		this._palmNormal = new Leap.Vector(handData.palmNormal);
		this._palmPosition = new Leap.Vector(handData.palmPosition);
		this._palmVelocity = new Leap.Vector(handData.palmVelocity);
		this._sphereCenter = new Leap.Vector(handData.sphereCenter);
		this._sphereRadius = handData.sphereRadius;
	}
};

Leap.Hand.prototype = {
	
	frame : function(){
		return this._frame;
	},
	
	id : function(){
		return this._id;
	},
	
	direction : function(){
		return this._direction;
	},
	
	palmNormal : function(){
		return this._palmNormal;
	},
	
	palmPosition : function(){
		return this._palmPosition;
	},
	
	palmVelocity : function(){
		return this._palmVelocity;
	},
	
	sphereCenter : function(){
		return this._sphereCenter;
	},
	
	sphereRadius : function(){
		return this._sphereRadius;
	},
	
	rotationAngle : function(sinceFrame, axis){
		// TODO
	},
	
	rotationAxis : function(sinceFrame){
		// TODO
	},
	
	rotationMatrix : function(sinceFrame){
		// TODO
	},
	
	scaleFactor : function(sinceFrame){
		// TODO
	},
	
	translation : function(sinceFrame){
		// TODO
	},
	
	finger : function(id){
		if(this._fingerTable[id]==null) return Leap.Finger.invalid();
		return this._fingerTable[id];
	},
	
	fingers : function(){
		return this._fingers;
	},
	
	pointable : function(id){
		if(this._pointableTable[id]==null) return Leap.Pointable.invalid();
		return this._pointableTable[id];
	},
	
	pointables : function(){
		return this._pointables;
	},
	
	tool : function(id){
		if(this._toolTable[id]==null) return {isValid:false};
		return this._toolTable[id];
	},
	
	tools : function(){
		return this._tools;
	},
	
	toString : function(){
		var val = "{id:"+obj._id+",sphereCenter:"+(obj._sphereCenter==null?"null":obj._sphereCenter)+",";
		val += "sphereRadius:"+(obj._sphereRadius==null?"null":obj._sphereRadius)+",";
		val += "normal:"+(obj._normal==undefined?"null":obj._normal.toString())+",fingers:[";
		for(var i=0; i < this._fingers.length; i++) val += this._fingers[i].toString();
		val += "],tools:[";
		for(var i=0; i < this._tools.length; i++) val += this._tools[i].toString();
		val += "],palmNormal:"+(obj._palmNormal==undefined?"null":obj._palmNormal.toString())+",";
		val += "palmPosition:"+(obj._palmPosition==undefined?"null":obj._palmPosition.toString())+",";
		val += "palmVelocity:"+(obj._palmVelocity==undefined?"null":obj._palmVelocity.toString())+"}";
		return val;
	},
	
	isValid : function(){
		return this._valid;
	}
};

Leap.Hand.invalid = function(){
	return new Leap.Hand();
};