Leap.Gesture = function(gestureData, frame, obj){
	
	if(obj==null) obj = this;
	
	obj._pointables = new Leap.PointableList();
	obj._hands = new Leap.HandList();
	
	if(gestureData==null){
		obj._id = null;
		obj._valid = false;
	}
	else{
		obj._id = gestureData.id;
		obj._frame = frame;
		obj._state = gestureData.state;
		obj._type = gestureData.type;
		obj._valid = true;
		
		for(index in frameData.hands){
			var hand = frame.hand(frameData.hands[index]);
			obj._hands.push(hand);
		}
		
		for(index in frameData.pointables){
			var pointable = frame.pointable(frameData.pointables[index]);
			obj._hands.push(pointable);
		}
	}
};

Leap.Gesture.prototype = {
	
	id : function(){
		return this._id;
	},
	
	frame : function(){
		return this._frame;
	},
	
	state : function(){
		return this._state;
	},
	
	type : function(){
		return this._type;
	},
	
	toString : function(){
		return "{timestamp:"+this._frame._timestamp+",id:"+this._id+",type:"+this._type+",state:"+this._state+"}";
	},
	
	isValid : function(){ return this._valid; }
};

Gesture.State = {
	INVALID : 0,
	START : 1,
	STOP : 2,
	UPDATE : 3
};

Gesture.Type = {
	INVALID : 0,
	CIRCE : 1,
	KEYTAP : 2,
	SCREENTAP : 3,
	SWIPE : 4
};

Leap.Gesture.invalid = function(){
	return new Leap.Gesture();
};

/* CircleGesture */
Leap.CircleGesture = function(gestureData, frame){
	
	Leap.Gesture(gestureData, frame, this);
	
	this._normal = new Leap.Vector(gestureData.normal);
	this._pointable = frame.pointable(gestureData.pointable);
	this._progress = gestureData.progress;
	this._radius = gestureData.radius;
};

Leap.CircleGesture.prototype.normal = function(){ return this._normal; };
Leap.CircleGesture.prototype.pointable = function(){ return this._pointable; };
Leap.CircleGesture.prototype.progress = function(){ return this._progress; };
Leap.CircleGesture.prototype.radius = function(){ return this._radius; };

/* KeyTapGesture */
Leap.KeyTapGesture = function(gestureData, frame){
	
	Leap.Gesture(gestureData, frame, this);
	
	this._pointable = frame.pointable(gestureData.pointable);
	this._position = new Leap.Vector(gestureData.position);
	this._progress = gestureData.progress;
};

Leap.KeyTapGesture.prototype.pointable = function(){ return this._pointable; };
Leap.KeyTapGesture.prototype.position = function(){ return this._position; };
Leap.KeyTapGesture.prototype.progress = function(){ return this._progress; };

/* ScreenTapGesture */
Leap.ScreenTapGesture = function(gestureData, frame){
	
	Leap.Gesture(gestureData, frame, this);

	this._pointable = frame.pointable(gestureData.pointable);
	this._position = new Leap.Vector(gestureData.position);
	this._progress = gestureData.progress;
};

Leap.ScreenTapGesture.prototype.pointable = function(){ return this._pointable; };
Leap.ScreenTapGesture.prototype.position = function(){ return this._position; };
Leap.ScreenTapGesture.prototype.progress = function(){ return this._progress; };

/* SwipeGesture */
Leap.SwipeGesture = function(gestureData, frame){
	
	Leap.Gesture(gestureData, frame, this);
	
	this._direction = new Leap.Vector(gestureData.direction);
	this._pointable = frame.pointable(gestureData.pointable);
	this._position = new Leap.Vector(gestureData.position);
	this._speed = gestureData.speed;
	this._startPosition = new Leap.Vector(gestureData.startPosition);
};

Leap.ScreenTapGesture.prototype.direction = function(){ return this._direction; };
Leap.ScreenTapGesture.prototype.pointable = function(){ return this._pointable; };
Leap.ScreenTapGesture.prototype.position = function(){ return this._position; };
Leap.ScreenTapGesture.prototype.speed = function(){ return this._speed; };
Leap.ScreenTapGesture.prototype.startPosition = function(){ return this._startPosition; };