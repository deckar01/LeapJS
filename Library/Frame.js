Leap.Frame = function(frameData){

	this._fingers = new Leap.FingerList();
	this._tools = new Leap.ToolList();
	this._pointables = new Leap.PointableList();
	this._hands = new Leap.HandList();
	
	this._fingerTable = {};
	this._toolTable = {};
	this._pointableTable = {};
	this._handTable = {};

	if(frameData == null){
		this._id = null;
		this._timestamp = null;
		this._valid = false;
		
		this._r = new Leap.Matrix();
		this._s = null;
		this._t = new Leap.Vector();
	}
	else{
		this._id = frameData.id;
		this._timestamp = frameData.timestamp;
		this._valid = true;
		
		this._r = new Leap.Matrix(frameData.r);
		this._s = frameData.s;
		this._t = new Leap.Vector(frameData.t);
		
		for(index in frameData.hands){
		
			var newHand = new Leap.Hand(frameData.hands[index],this)
			this._handTable[newHand._id] = newHand;
			this._hands.push(newHand);
		}
		
		for(index in frameData.pointables){
			var hand = this._handTable[frameData.pointables[index].handId];
			if(frameData.pointables[index].tool){
				var pointable = new Leap.Tool(frameData.pointables[index],hand);
				this._pointableTable[pointable._id] = this._toolTable[pointable._id] = pointable;
				this._pointables.push(pointable);
				this._tools.push(pointable);
				hand._pointableTable[pointable._id] = hand._toolTable[pointable._id] = pointable;
				hand._pointables.push(pointable);
				hand._tools.push(pointable);
			}
			else{
				var pointable = new Leap.Finger(frameData.pointables[index],hand);
				this._pointableTable[pointable._id] = this._fingerTable[pointable._id] = pointable;
				this._pointables.push(pointable);
				this._fingers.push(pointable);
				hand._pointableTable[pointable._id] = hand._fingerTable[pointable._id] = pointable;
				hand._pointables.push(pointable);
				hand._fingers.push(pointable);
			}
		}
	}
};

Leap.Frame.prototype = {
	
	id : function(){
		return this._id;
	},
	
	timestamp : function(){
		return this._timestamp;
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
		return this._fingers[id];
	},
	
	fingers : function(){
		return this._fingers;
	},
	
	hand : function(id){
		if(this._handTable[id]==null) return Leap.Hand.invalid();
		return this._handTable[id];
	},
	
	hands : function(){
		return this._hands;
	},
	
	pointable : function(id){
		if(this._pointableTable[id]==null) return Leap.Pointable.invalid();
		return this._pointableTable[id];
	},
	
	pointables : function(){
		return this._pointables;
	},
	
	tool : function(id){
		if(this._toolTable[id]==null) return Leap.Tool.invalid();
		return this._toolTable[id];
	},
	
	pointables : function(){
		return this._pointables;
	},
	
	compare : function(other){
		return this._id==other.id;
	},
	
	toString : function(){
		var val = "{timestamp:"+this._timestamp+",id:"+this._id+",hands:[";
		for(var i=0; i < this._hands.length; i++) val += this._hands[i].toString();
		val += "]}";
		return val;
	},
	
	isValid : function(){ return this._valid; }
};

Leap.Frame.invalid = function(){
	return new Leap.Frame();
};