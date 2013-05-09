Leap.Gesture = function(gestureData, frame, obj){
	
	if(obj==null) obj = this;
	
	obj._pointables = new Leap.PointableList();
	obj._hands = new Leap.HandList();
	
	if(gestureData==null){
		obj._id = null;
		obj._frame = Leap.Frame.invalid();
		obj._state = Leap.Gesture.State.invalid;
		obj._type = Leap.Gesture.Type.invalid;
		obj._valid = false;
	}
	else{
		obj._id = gestureData.id;
		obj._frame = frame;
		obj._state = gestureData.state;
		obj._type = gestureData.type;
		obj._valid = true;
		
		for(index in gestureData.handIds){
			var hand = frame.hand(gestureData.handIds[index]);
			obj._hands.push(hand);
		}
		
		for(index in gestureData.pointableIds){
			var pointable = frame.pointable(gestureData.pointableIds[index]);
			obj._pointables.push(pointable);
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
	
	isValid : function(){ return this._valid; },
	
	_delete : function(){
		this._frame = null;
	}
};

Leap.Gesture.invalid = function(){
	return new Leap.Gesture();
};

/* CircleGesture */
Leap.CircleGesture = function(gestureData, frame){
	
	Leap.Gesture(gestureData, frame, this);
	
	this._normal = new Leap.Vector(gestureData.normal);
	this._pointable = this._pointables[0];
	this._progress = gestureData.progress;
	this._radius = gestureData.radius;
	this._center = new Leap.Vector(gestureData.center);
	this._clockwise = (this._pointable.direction().angleTo(this._normal) <= Math.PI / 4);
};

Leap.CircleGesture.prototype = Leap.Gesture.prototype;
Leap.CircleGesture.prototype.normal = function(){ return this._normal; };
Leap.CircleGesture.prototype.pointable = function(){ return this._pointable; };
Leap.CircleGesture.prototype.progress = function(){ return this._progress; };
Leap.CircleGesture.prototype.radius = function(){ return this._radius; };
Leap.CircleGesture.prototype.center = function(){ return this._center; };
Leap.CircleGesture.prototype.isClockwise = function(){ return this._clockwise; };

/* KeyTapGesture */
Leap.KeyTapGesture = function(gestureData, frame){
	
	Leap.Gesture(gestureData, frame, this);
	
	this._pointable = this._pointables[0];
	this._position = new Leap.Vector(gestureData.position);
	this._progress = gestureData.progress;
};

Leap.KeyTapGesture.prototype = Leap.Gesture.prototype;
Leap.KeyTapGesture.prototype.pointable = function(){ return this._pointable; };
Leap.KeyTapGesture.prototype.position = function(){ return this._position; };
Leap.KeyTapGesture.prototype.progress = function(){ return this._progress; };

/* ScreenTapGesture */
Leap.ScreenTapGesture = function(gestureData, frame){
	
	Leap.Gesture(gestureData, frame, this);

	this._pointable = this._pointables[0];
	this._position = new Leap.Vector(gestureData.position);
	this._progress = gestureData.progress;
};

Leap.ScreenTapGesture.prototype = Leap.Gesture.prototype;
Leap.ScreenTapGesture.prototype.pointable = function(){ return this._pointable; };
Leap.ScreenTapGesture.prototype.position = function(){ return this._position; };
Leap.ScreenTapGesture.prototype.progress = function(){ return this._progress; };

/* SwipeGesture */
Leap.SwipeGesture = function(gestureData, frame){
	
	Leap.Gesture(gestureData, frame, this);
	
	this._direction = new Leap.Vector(gestureData.direction);
	this._pointable = this._pointables[0];
	this._position = new Leap.Vector(gestureData.position);
	this._speed = gestureData.speed;
	this._startPosition = new Leap.Vector(gestureData.startPosition);
};

Leap.SwipeGesture.prototype = Leap.Gesture.prototype;
Leap.SwipeGesture.prototype.direction = function(){ return this._direction; };
Leap.SwipeGesture.prototype.pointable = function(){ return this._pointable; };
Leap.SwipeGesture.prototype.position = function(){ return this._position; };
Leap.SwipeGesture.prototype.speed = function(){ return this._speed; };
Leap.SwipeGesture.prototype.startPosition = function(){ return this._startPosition; };

Leap.Gesture.State = {
	invalid : "invalid",
	start : "start",
	stop : "stop",
	update : "update"
};

Leap.Gesture.Type = {
	invalid : Leap.Gesture.invalid,
	circle : Leap.CircleGesture,
	keyTap : Leap.KeyTapGesture,
	screenTap : Leap.ScreenTapGesture,
	swipe : Leap.SwipeGesture
};
