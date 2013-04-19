Leap.Hand = function(handData, parentFrame){
	
	this._fingers = new Leap.FingerList();
	this._tools = new Leap.ToolList();
	this._pointables = new Leap.PointableList();
	
	this._fingerTable = {};
	this._toolTable = {};
	this._pointableTable = {};
	
	if(handData == null){
	
		this._frame = Leap.Frame.invalid();
		this._id = null;
		this._valid = false;
		
		this._rotation = new Leap.Matrix();
		this._scale = null;
		this._translation = new Leap.Vector();
		
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
		
		this._rotation = new Leap.Matrix(handData.r);
		this._scale = handData.s;
		this._translation = new Leap.Vector(handData.t);
		
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
		// TODO: implement axis parameter
		if (!this._valid || !sinceFrame._valid) return 0.0;
		var sinceHand = sinceFrame.hand(this._id);
		if(!sinceHand._valid) return 0.0;
		
		var rot = this.rotationMatrix(sinceFrame);
		var cs = (rot.xBasis.x + rot.yBasis.y + rot.zBasis.z - 1.0)*0.5
		var angle = Math.acos(cs);
		return isNaN(angle) ? 0.0 : angle;
	},
	
	rotationAxis : function(sinceFrame){
		if (!this._valid || !sinceFrame._valid) return Leap.Vector.zero();
		var sinceHand = sinceFrame.hand(this._id);
		if(!sinceHand._valid) return Leap.Vector.zero();
		
		var x = this._rotation.zBasis.y - sinceHand._rotation.yBasis.z;
		var y = this._rotation.xBasis.z - sinceHand._rotation.zBasis.x;
		var z = this._rotation.yBasis.x - sinceHand._rotation.xBasis.y;
		var vec = new Leap.Vector([x, y, z]);
		return vec.normalize();
	},
	
	rotationMatrix : function(sinceFrame){
		if (!this._valid || !sinceFrame._valid) return Leap.Matrix.identity();
		var sinceHand = sinceFrame.hand(this._id);
		if(!sinceHand._valid) return Leap.Matrix.identity();
		
		var xBasis = new Leap.Vector([this._rotation.xBasis.x, this._rotation.yBasis.x, this._rotation.zBasis.x]);
		var yBasis = new Leap.Vector([this._rotation.xBasis.y, this._rotation.yBasis.y, this._rotation.zBasis.y]);
		var zBasis = new Leap.Vector([this._rotation.xBasis.z, this._rotation.yBasis.z, this._rotation.zBasis.z]);
		var transpose = new Leap.Matrix([xBasis, yBasis, zBasis]);
		return sinceHand._rotation.times(transpose);
	},
	
	scaleFactor : function(sinceFrame){
		if (!this._valid || !sinceFrame._valid) return 1.0;
		var sinceHand = sinceFrame.hand(this._id);
		if(!sinceHand._valid) return 1.0;
		
		return Math.exp(this._scale - sinceHand._scale);
	},
	
	translation : function(sinceFrame){
		if (!this.valid || !sinceFrame.valid) return Leap.Vector.zero();
		var sinceHand = sinceFrame.hand(this._id);
		if(!sinceHand._valid) return Leap.Vector.zero();
		
		var x = this._translation.x - sinceHand._translation.x;
		var y = this._translation.y - sinceHand._translation.y;
		var z = this._translation.z - sinceHand._translation.z;
		return new Leap.Vector([x, y, z]);
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
	},
	
	_delete : function(){
		this._frame = null;
	}
};

Leap.Hand.invalid = function(){
	return new Leap.Hand();
};
