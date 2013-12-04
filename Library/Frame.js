Leap.Frame = function(frameData, controller){
	
	this._controller = controller;
	
	this._fingers = new Leap.FingerList();
	this._tools = new Leap.ToolList();
	this._pointables = new Leap.PointableList();
	this._hands = new Leap.HandList();
	this._gestures = new Leap.GestureList();
	
	this._fingerTable = {};
	this._toolTable = {};
	this._pointableTable = {};
	this._handTable = {};
	this._gestureTable = {};

	if(frameData == null){
		this._id = null;
		this._timestamp = null;
		this._valid = false;
		
		this._rotation = new Leap.Matrix();
		this._scale = null;
		this._translation = new Leap.Vector();
	}
	else{
		this._id = frameData.id;
		this._timestamp = frameData.timestamp;
		this._valid = true;
		
		this._rotation = new Leap.Matrix(frameData.r);
		this._scale = frameData.s;
		this._translation = new Leap.Vector(frameData.t);
		
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
				if(hand){
					hand._pointableTable[pointable._id] = hand._toolTable[pointable._id] = pointable;
					hand._pointables.push(pointable);
					hand._tools.push(pointable);
				}
			}
			else{
				var pointable = new Leap.Finger(frameData.pointables[index],hand);
				this._pointableTable[pointable._id] = this._fingerTable[pointable._id] = pointable;
				this._pointables.push(pointable);
				this._fingers.push(pointable);
				if(hand){
					hand._pointableTable[pointable._id] = hand._fingerTable[pointable._id] = pointable;
					hand._pointables.push(pointable);
					hand._fingers.push(pointable);
				}
			}
		}
		
		for(index in frameData.gestures){
			
			var gestureType = this._controller._gesturesAllowed[frameData.gestures[index].type];
			if(gestureType){
				var newGesture = new gestureType(frameData.gestures[index],this);
				this._gestureTable[newGesture._id] = newGesture;
				this._gestures.push(newGesture);
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
        if (!this._valid || !sinceFrame._valid) return 0.0;
        
		var cs = (this._rotation.xBasis.x + this._rotation.yBasis.y + this._rotation.zBasis.z - 1.0)*0.5;
		var angle = Math.acos(cs);
		angle = isNaN(angle) ? 0.0 : angle;
		
        if(axis){
            var rotAxis = this.rotationAxis(sinceFrame);
            angle *= rotAxis.dot(axis.normalized());
        }
		
		return angle;
	},
	
	rotationAxis : function(sinceFrame){
		if (!this._valid || !sinceFrame._valid) return Leap.Vector.zero();
		var x = this._rotation.zBasis.y - sinceFrame._rotation.yBasis.z;
		var y = this._rotation.xBasis.z - sinceFrame._rotation.zBasis.x;
		var z = this._rotation.yBasis.x - sinceFrame._rotation.xBasis.y;
		var vec = new Leap.Vector([x, y, z]);
		return vec.normalized();
	},
	
	rotationMatrix : function(sinceFrame){
		if (!this._valid || !sinceFrame._valid) return Leap.Matrix.identity();
		var xBasis = new Leap.Vector([this._rotation.xBasis.x, this._rotation.yBasis.x, this._rotation.zBasis.x]);
		var yBasis = new Leap.Vector([this._rotation.xBasis.y, this._rotation.yBasis.y, this._rotation.zBasis.y]);
		var zBasis = new Leap.Vector([this._rotation.xBasis.z, this._rotation.yBasis.z, this._rotation.zBasis.z]);
		var transpose = new Leap.Matrix([xBasis, yBasis, zBasis]);
		return sinceFrame._rotation.times(transpose);
	},
	
	scaleFactor : function(sinceFrame){
		if (!this._valid || !sinceFrame._valid) return 1.0;
		return Math.exp(this._scale - sinceFrame._scale);
	},
	
	translation : function(sinceFrame){
		if (!this._valid || !sinceFrame._valid) return Leap.Vector.zero();
		var x = this._translation.x - sinceFrame._translation.x;
		var y = this._translation.y - sinceFrame._translation.y;
		var z = this._translation.z - sinceFrame._translation.z;
		return new Leap.Vector([x, y, z]);
	},
	
	finger : function(id){
		if(this._fingerTable[id]==null) return Leap.Finger.invalid();
		return this._fingers[id];
	},
	
	fingers : function(){
		return this._fingers;
	},
	
	gesture : function(id){
		if(this._gestureTable[id]==null) return Leap.Gesture.invalid();
		return this._gestureTable[id];
	},
	
	gestures : function(sinceFrame){
		if(sinceFrame == null) return this._gestures;
		
		var gestures = new Leap.GestureList();
		
		for(var id = sinceFrame.id(); id <= this._id; id++){
			var frame = this._controller._frameTable[id];
			if(frame != null) gestures.push(frame._gestures);
		}
		
		return gestures;
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
	
	tools : function(){
		return this._tools;
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
	
	isValid : function(){ return this._valid; },
	
	_delete : function(){
		this._gestures._delete();
		this._hands._delete();
		this._pointables._delete();
	}
};

Leap.Frame.invalid = function(){
	return new Leap.Frame();
};
