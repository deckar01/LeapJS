var Leap = { APIVersion : "0.7.7" };

Leap.List = function(){};

Leap.List.prototype = new Array;

Leap.List.prototype.count = function(){
	return this.length;
};

Leap.List.prototype.isEmpty = function(){
	return this.length === 0;
};

// Depricated
Leap.List.prototype.empty = function(){
	return this.length === 0;
};

Leap.List.prototype.append = function(other){
	for(i = 0; i < other.length; i++) this.push(other[i]);
};

Leap.List.prototype._delete = function(){
	for(var i = 0; i < this.length; i++) this[i]._delete();
};
Leap.Pointable = function(pointableData, parentHand, obj){
	
	if(obj==null) obj = this;
	
	if(pointableData == null){
	
		obj._frame = Leap.Frame.invalid();
		obj._hand = Leap.Hand.invalid();
		obj._id = null;
		obj._valid = false;
		
		obj._direction = new Leap.Vector();
		obj._tipPosition = new Leap.Vector();
		obj._tipVelocity = new Leap.Vector();
		
		obj._length = null;
		obj._width = null;
	}
	else{
		
		obj._frame = (parentHand)?parentHand._frame:Leap.Frame.invalid();
		obj._hand = parentHand;
		obj._id = pointableData.id;
		obj._valid = true;
		
		obj._direction = new Leap.Vector(pointableData.direction);
		obj._tipPosition = new Leap.Vector(pointableData.tipPosition);
		obj._tipVelocity = new Leap.Vector(pointableData.tipVelocity);
		
		obj._length = pointableData.length;
		obj._width = pointableData.width;
	}
};

Leap.Pointable.prototype = {

	frame : function(){
		return this._frame;
	},
	
	hand : function(){
		return this._hand;
	},
	
	id : function(){
		return this._id;
	},
	
	direction : function(){
		return this._direction;
	},
	
	tipPosition : function(){
		return this._tipPosition;
	},
	
	tipVelocity : function(){
		return this._tipVelocity;
	},
	
	isFinger : function(){
		return this._isFinger;
	},
	
	isTool : function(){
		return this._isTool;
	},
	
	length : function(){
		return this._length;
	},
	
	width : function(){
		return this._width;
	},
	
	toString : function(){
		var val = "{id:"+this._id+",direction:"+this._direction.toString()+",";
		val += "tipPosition:"+this._tipPosition.toString()+",";
		val += "tipVelocity:"+this._tipVelocity.toString()+",";
		val += "length:"+this._length+",";
		val += "width:"+this._width+"}";
		return val;
	},
	
	isValid : function(){
		return this._valid;
	},
	
	_delete : function(){
		this._frame = null;
	}
};

Leap.Pointable.invalid = function(){
	return new Leap.Pointable();
};

Leap.PointableList = function(){};

Leap.PointableList.prototype = new Leap.List;

Leap.PointableList.prototype.leftmost = function(){
	var leftmost = Leap.Pointable.invalid();
	
	for(i = 0; i < this.length; i++){
		if((leftmost._valid == false || this[i].tipPosition().x < leftmost.tipPosition().x) && this[i]._valid)
			leftmost = this[i];
	}
	
	return leftmost;
};

Leap.PointableList.prototype.rightmost = function(){
	var rightmost = Leap.Pointable.invalid();
	
	for(i = 0; i < this.length; i++){
		if((rightmost._valid == false || this[i].tipPosition().x > rightmost.tipPosition().x) && this[i]._valid)
			rightmost = this[i];
	}
	
	return rightmost;
};

Leap.PointableList.prototype.frontmost = function(){
	var frontmost = Leap.Pointable.invalid();
	
	for(i = 0; i < this.length; i++){
		if((frontmost._valid == false || this[i].tipPosition().z < frontmost.tipPosition().z) && this[i]._valid)
			frontmost = this[i];
	}
	
	return frontmost;
};
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function( callback ){
        window.setTimeout(callback, 1000 / 60);
    };
})();

Leap.AnimLoop = function(controller, callback){
	
	this._controller = controller;
	this._callback = callback;
	
	var me = this;
	
	this._loop = function(controller){
		window.requestAnimFrame(function(){ me._loop(me._controller); });
		me._callback(controller);
	};
	
	if(controller.isConnected()) window.requestAnimFrame(function(){ me._loop(me._controller); });
	else{
		this._listener = new Leap.Listener();
		this._listener.onConnect = function(controller){
			me._controller.removeListener(me._listener);
			window.requestAnimFrame(function(){ me._loop(me._controller); });
		};
		controller.addListener(this._listener);
	}
};
Leap.Calibrate = function(controller){
	
	this._controller = controller;
	this._points = [];
	var me = this;
	
	this._elem = document.createElement("div");
	this._elem.style.cssText = this._pointCSS + this._point1CSS;
	this._elem.innerHTML = "1";
	
	this._action = this._calibrate1;
	this._elem.onclick = function(){ me._action(); };
	window.onkeyup = function(e){
		if(e.keyCode === 32) me._action();
	};
	
	this._tip = document.createElement("div");
	this._tip.style.cssText = this._tipCSS + this._point1CSS;
	this._tip.innerHTML = "Position one finger on the square until<br>it turns green then click it or press space.";
	this._arrow = document.createElement("div");
	this._arrow.style.cssText = this._arrowCSS + this._point1CSS;
	
	document.body.appendChild(this._elem);
	document.body.appendChild(this._tip);
	document.body.appendChild(this._arrow);
	
	var me = this;
	this._listener = new Leap.Listener();
	this._listener.onFrame = function(controller){ me._fingerCount(controller); };
	this._controller.addListener(this._listener);
	
	this._goodFinger = null;
	this._deviceNormal = new Leap.Vector([0, 0, -1]);
};

Leap.Calibrate.prototype = {
	
	_pointCSS : "width: 20px; height: 20px; padding: 10px; margin: -20px; position: fixed; text-align: center; background-color: #c3cccc; color: #ffffff; cursor: pointer; ",
	_point1CSS : "left: 25%; top: 50%;",
	_point2CSS : "left: 25%; top: 25%;",
	_point3CSS : "left: 75%; top: 50%;",
	
	_tipCSS : "height: 32px; padding-top: 4px; padding-bottom: 4px; padding-left: 8px; padding-right: 8px; margin-top: -20px; margin-left: 26px; border-radius: 5px; position: fixed; background-color: rgba(0,0,0,0.7); color: #FFFFFF; font: 14px Helvetica, Sans-Serif;",
	_arrowCSS : "height: 0; width: 0; border: 6px solid; border-color: transparent rgba(0,0,0,0.7) transparent transparent; margin-top: -6px; margin-left: 14px; position: fixed;",
	
	_calibrate1 : function(){
		var pointables = this._controller.frame().pointables();
		if(this._goodFinger){
			this._points[0] = this._goodFinger.tipPosition();
			this._elem.style.cssText = this._pointCSS + this._point2CSS;
			this._tip.style.cssText = this._tipCSS + this._point2CSS;
			this._arrow.style.cssText = this._arrowCSS + this._point2CSS;
			this._elem.innerHTML = "2";
			this._action = this._calibrate2;
		}
	},
	
	_calibrate2 : function(){
		var pointables = this._controller.frame().pointables();
		if(this._goodFinger){
			this._points[1] = this._goodFinger.tipPosition();
			this._elem.style.cssText = this._pointCSS + this._point3CSS;
			this._tip.style.cssText = this._tipCSS + this._point3CSS;
			this._arrow.style.cssText = this._arrowCSS + this._point3CSS;
			this._elem.innerHTML = "3";
			this._action = this._calibrate3;
		}
	},
	
	_calibrate3 : function(){
		var pointables = this._controller.frame().pointables();
		if(this._goodFinger){
			this._points[2] = this._goodFinger.tipPosition();
			document.body.removeChild(this._elem);
			document.body.removeChild(this._tip);
			document.body.removeChild(this._arrow);
			delete this._elem;
			
			var screen = new Leap.Screen(this._points);
			this._controller._screens.push(screen);
			this._controller._screens.save();
			
			this._controller.removeListener(this._listener);
			this.onComplete(screen);
		}
	},
	
	_fingerCount : function(controller){
		var pointables = controller.frame().pointables();
		var count = pointables.count();
		this._goodFinger = null;
		for(var i=0; i < count; i++){
			var pointable = pointables[i];
			if(pointable.direction().angleTo(this._deviceNormal) < Math.PI/8){
				if(this._goodFinger == null || this._goodFinger.tipPosition().z > pointable.tipPosition().z)
					this._goodFinger = pointable;
			}
		}
		if(this._goodFinger == null) this._elem.style.backgroundColor = "#c3cccc";
		else this._elem.style.backgroundColor = "#BCD63C";
	},
	
	onComplete : function(screen){}
}

if ((typeof(WebSocket) == 'undefined') && (typeof(MozWebSocket) != 'undefined')) WebSocket = MozWebSocket;

Leap.Controller = function(connection){
	
	this._frames = [];
	this._frameTable = {};
	
	this._listeners = {};
	this._listenerId = 0;
	
	this._bufferSize = 64;
	this._bufferBegin = 0;
	
	this._screens = new Leap.ScreenList();
	
	this._gesturesActive = false;
	this._gesturesAllowed = {};
	
	for(var index = 0; index < this._bufferSize; index++) this._frames[index] = Leap.Frame.invalid();
	
	this._connect(connection);
};

Leap.Controller.prototype = {
	
	isConnected : function(){
		return this._socket.connected;
	},
	
	frame : function(index){
		if(index == null || index == 0) return this._frames[this._bufferBegin];
		if(index > this._bufferSize - 1) return Leap.Frame.invalid();
		
		index = this._bufferBegin-index;
		if(index < 0) index += this._bufferSize;
		return this._frames[index];
	},
	
	addListener : function(listener){
		listener._id = this._listenerId++;
		this._listeners[listener._id] = listener;
		listener.onInit(this);
	},
	
	removeListener : function(listener){
		listener.onExit(this);
		this._listeners[listener._id].onExit(this);
		delete this._listeners[listener._id];
	},
	
	config : function(){
		// Requires additional data form WebSocket server
	},
	
	locatedScreens : function(){
		return this._screens;
	},
	
	// Depricated
	calibratedScreens : function(){
		return this._screens;
	},
	
	enableGesture : function(type, enable){
	
		if(enable){
			this._gesturesAllowed[type] = Leap.Gesture.Type[type];
			
			if(!this._gesturesActive){
				this._gesturesActive = true;
				if(this.isConnected()) this._socket.send('{"enableGestures": true}');
			}
		}
		else{
			delete this._gesturesAllowed[type];
			
			if(this._gesturesActive && Object.keys(this._gesturesAllowed).length == 0){
				this._gesturesActive = false;
				if(this.isConnected()) this._socket.send('{"enableGestures": false}');
			}
		}
	},
	
	isGestureEnabled : function(type){
		return this._gesturesAllowed[type]?true:false;
	},
	
	_onmessage : function(event){
		
		var eventData = JSON.parse(event.data);
		var newFrame = new Leap.Frame(eventData, this);
		
		this._bufferBegin++;
		if(this._bufferBegin == this._bufferSize) this._bufferBegin = 0;
		
		var oldFrame = this._frames[this._bufferBegin];
		oldFrame._delete();
		delete this._frameTable[oldFrame._id];
		delete this._frames[this._bufferBegin];
		this._frameTable[newFrame._id] = newFrame;
		this._frames[this._bufferBegin] = newFrame;
		
		for(index in this._listeners)
			this._listeners[index].onFrame(this);
	},
	
	_versionFrame : function(event){
		Leap.serverVersion = JSON.parse(event.data).version;
		this._socket.onmessage = function(event){ this._controller._onmessage(event); };
	},
	
	_connect : function(connection){
		if (typeof(WebSocket) == 'undefined') return;
		
		if(this._socket) delete this._socket;
		this._socket = new WebSocket(connection);
		this._socket._controller = this;
		this._socket.connected = false;
		
		this._socket.onmessage = function(event){
			this._controller._versionFrame(event);
		};
		
		this._socket.onopen = function(event){
			this.connected = true;
			if(this._controller._gesturesActive) this.send('{"enableGestures": true}');
			for(index in this._controller._listeners)
				this._controller._listeners[index].onConnect(this._controller);
		};
		
		this._socket.onclose = function(event){
			this.connected = false;
			for(index in this._controller._listeners)
				this._controller._listeners[index].onDisconnect(this._controller);
			var me = this;
			setTimeout(function(){ me._controller._connect(me.url); }, 1000);
		};
		
		this._socket.onerror = function(event){ 
			this.onclose(event);
		};
	}
};

Leap.Finger = function(fingerData, parentHand){
	
	Leap.Pointable(fingerData, parentHand, this);
	
	this._isFinger = true;
	this._isTool = false;
};

Leap.Finger.prototype = Leap.Pointable.prototype;

Leap.Finger.invalid = function(){
	return new Leap.Finger();
};

Leap.FingerList = function(){};

Leap.FingerList.prototype = new Leap.PointableList;

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

Leap.GestureList = function(){};

Leap.GestureList.prototype = new Leap.List;

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
		if (!this._valid || !sinceFrame._valid) return 0.0;
		var sinceHand = sinceFrame.hand(this._id);
        if(!sinceHand._valid) return 0.0;
		
		var rot = this.rotationMatrix(sinceFrame);
		var cs = (rot.xBasis.x + rot.yBasis.y + rot.zBasis.z - 1.0)*0.5;
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
		var sinceHand = sinceFrame.hand(this._id);
		if(!sinceHand._valid) return Leap.Vector.zero();
		
		var x = this._rotation.zBasis.y - sinceHand._rotation.yBasis.z;
		var y = this._rotation.xBasis.z - sinceHand._rotation.zBasis.x;
		var z = this._rotation.yBasis.x - sinceHand._rotation.xBasis.y;
		var vec = new Leap.Vector([x, y, z]);
		return vec.normalized();
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

Leap.HandList = function(){};

Leap.HandList.prototype = new Leap.List;

Leap.Listener = function(){
	
	this.onConnect = function(controller){};
	this.onDisconnect = function(controller){};
	this.onExit = function(controller){};
	this.onFrame = function(controller){};
	this.onInit = function(controller){};
};

Leap.Matrix = function(data){
	
	if(data instanceof Leap.Matrix){
		this.xBasis = new Leap.Vector(data.xBasis);
		this.yBasis = new Leap.Vector(data.yBasis);
		this.zBasis = new Leap.Vector(data.zBasis);
		this.origin = new Leap.Vector(data.origin);
	}
	else if(data instanceof Array){
		if(data[0] instanceof Leap.Vector && typeof(data[1]) == "number"){
			this.setRotation(data[0],data[1]);
			this.origin = new Leap.Vector(data[2]);
		}
		else{
			this.xBasis = new Leap.Vector(data[0]);
			this.yBasis = new Leap.Vector(data[1]);
			this.zBasis = new Leap.Vector(data[2]);
			this.origin = new Leap.Vector(data[3]);
		}
	}
	else{
		this.xBasis = new Leap.Vector([1,0,0]);
		this.yBasis = new Leap.Vector([0,1,0]);
		this.zBasis = new Leap.Vector([0,0,1]);
		this.origin = new Leap.Vector([0,0,0]);
	}
};

Leap.Matrix.prototype = {
	
	setRotation : function(_axis, angle){
		var axis = _axis.normalized();
		var s = Math.sin(angle);
		var c = Math.cos(angle);
		var C = 1-c;
		
		this.xBasis = new Leap.Vector([axis.x*axis.x*C + c, axis.x*axis.y*C - axis.z*s, axis.x*axis.z*C + axis.y*s]);
		this.yBasis = new Leap.Vector([axis.y*axis.x*C + axis.z*s, axis.y*axis.y*C + c, axis.y*axis.z*C - axis.x*s]);
		this.zBasis = new Leap.Vector([axis.z*axis.x*C - axis.y*s, axis.z*axis.y*C + axis.x*s, axis.z*axis.z*C + c]);
	},
	
	transformPoint : function(data){
		return this.origin.plus(this.transformDirection(data));
	},

	transformDirection : function(data){
		var x = this.xBasis.multiply(data.x);
		var y = this.yBasis.multiply(data.y);
		var z = this.zBasis.multiply(data.z);
		return x.plus(y).plus(z);
	},
	
	times : function(other){
		var x = this.transformDirection(other.xBasis);
		var y = this.transformDirection(other.yBasis);
		var z = this.transformDirection(other.zBasis);
		var o = this.transformPoint(other.origin);
		return new Leap.Matrix([x,y,z,o]);
	},
	
	rigidInverse : function(){
		var x = new Leap.Vector([this.xBasis.x, this.yBasis.x, this.zBasis.x]);
		var y = new Leap.Vector([this.xBasis.y, this.yBasis.y, this.zBasis.y]);
		var z = new Leap.Vector([this.xBasis.z, this.yBasis.z, this.zBasis.z]);
		var rotInverse = new Leap.Matrix([x,y,z]);
		rotInverse.origin = rotInverse.transformDirection(Leap.Vector.zero().minus(this.origin));
		return rotInverse;
	},
	
	toArray3x3 : function(output){
		if(output == null) output = [];
		else output.length = 0;
		output[0] = this.xBasis.x;
		output[1] = this.xBasis.y;
		output[2] = this.xBasis.z;
		output[3] = this.yBasis.x;
		output[4] = this.yBasis.y;
		output[5] = this.yBasis.z;
		output[6] = this.zBasis.x;
		output[7] = this.zBasis.y;
		output[8] = this.zBasis.z;
		return output;
	},
	
	toArray4x4 : function(output){
		if(output == null) output = [];
		else output.length = 0;
		output[0] = this.xBasis.x;
		output[1] = this.xBasis.y;
		output[2] = this.xBasis.z;
		output[3] = 0;
		output[4] = this.yBasis.x;
		output[5] = this.yBasis.y;
		output[6] = this.yBasis.z;
		output[7] = 0;
		output[8] = this.zBasis.x;
		output[9] = this.zBasis.y;
		output[10] = this.zBasis.z;
		output[11] = 0;
		output[12] = this.origin.x;
		output[13] = this.origin.y;
		output[14] = this.origin.z;
		output[15] = 1;
		return output;
	},
	
	toString : function(){
		return "{xBasis:"+this.xBasis+",yBasis:"+this.yBasis+
		",zBasis:"+this.zBasis+",origin:"+this.origin+"}";
	},
	
	compare : function(other){
		return this.xBasis.compare(other.xBasis) && 
		this.yBasis.compare(other.yBasis) && 
		this.zBasis.compare(other.zBasis) && 
		this.origin.compare(other.origin);
	}
};

Leap.Matrix.identity = function(){ return new Leap.Matrix(); };

Leap.Plane = function(point1, point2, point3){
	
	this._point1 = new Leap.Vector(point1);
	this._point2 = new Leap.Vector(point2);
	this._point3 = new Leap.Vector(point3);
};

Leap.Plane.prototype = {
	
	normal : function(){
		
		var x21 = this._point1.x - this._point2.x;
		var y21 = this._point2.y - this._point1.y;
		var z21 = this._point1.z - this._point2.z;
		
		var x31 = this._point1.x - this._point3.x;
		var y31 = this._point3.y - this._point1.y;
		var z31 = this._point1.z - this._point3.z;
		
		var x = y21*z31 - y31*z21;
		var y = x21*z31 - x31*z21;
		var z = x21*y31 - x31*y21;
		
		if(x==0 && y==0 && z==0) this._normal = null;
		else this._normal = new Leap.Vector([x, y, z]);
		
		this.normal = function(){ return this._normal; };
		return this._normal;
	},
	
	unitnormal : function(){
		
		var normal = this.normal();
		if(normal==null) this._unitnormal = null;
		else this._unitnormal = normal.normalized();
		
		this.unitnormal = function(){ return this._unitnormal; };
		return this._unitnormal;
	},
	
	pointIntersect : function(point){
		
		var unitnormal = this.unitnormal();
		var distance = this.pointDistance(point);
		var position = unitnormal.multiply(distance).plus(point);
		
		return {position: position, distance: distance};
	},
	
	pointDistance : function(point){
		
		var unitnormal = this.unitnormal();
		var distance = -unitnormal.dot(this._point1.minus(point));
		
		return distance;
	},
	
	rayIntersect : function(rayPosition, rayDirection){
		
		var d = rayDirection.dot(this.normal());
	
		if(d == 0) return null;
		
		var n = this._point1.minus(rayPosition).dot(this.normal());
		var t =  n/d;
		
		if(t < 0 && this.normal().angleTo(rayDirection) < Math.PI/2) return null;
		
		var intersect = rayPosition.plus(rayDirection.multiply(t));
		var distance = t*rayDirection.magnitude();
		
		return {position: intersect, distance: distance};
	}
};

Leap.Screen = function(data, width, height){

	this._data = data;
	
	if(data){
		
		if(!("3" in data)) this._data[3] = window.innerWidth;
		if(!("4" in data)) this._data[4] = window.innerHeight;
		if(!("5" in data)) this._data[5] = window.screenX;
		if(!("6" in data)) this._data[6] = window.screenY;
		
		this.offset();
		
		this._plane = new Leap.Plane(data[0],data[1],data[2]);
		this._center = data[0].plus(data[2]).dividedBy(2);
		this._origin = data[1].plus(data[1].minus(this._center));
		
		var xv = data[2].minus(data[0]);
		var yv = data[0].minus(data[1]);
		var xscale = 2*xv.magnitude()/this._data[3];
		var yscale = 4*yv.magnitude()/this._data[4];
		this._xspan = xv.normalized().dividedBy(xscale);
		this._yspan = yv.normalized().dividedBy(yscale);
		
		this._valid = true;
	}
	else{
	
		this._plane = new Leap.Plane();
		this._center = new Leap.Vector();
		this._origin = new Leap.Vector();
		this._xspan = new Leap.Vector();
		this._yspan = new Leap.Vector();
		this._data = [new Leap.Vector(), new Leap.Vector(), new Leap.Vector(), 0, 0, 0, 0];
		
		this._valid = false;
	}
};

Leap.Screen.prototype = {
	
	distanceToPoint : function(point){
		return this._plane.pointDistance(point);
	},
	
	intersect : function(){
		// TODO: Implement clampRatio
		var position, direction, normalize, clampRatio;
		
		if(arguments[0] instanceof Leap.Vector){
			position = arguments[0];
			direction = arguments[1];
			normalize = arguments[2];
			clampRatio = arguments[3];
		}
		else{
			position = arguments[0].tipPosition();
			direction = arguments[0].direction();
			normalize = arguments[1];
			clampRatio = arguments[2];
		}
		
		var intersect = this._plane.rayIntersect(position, direction);
		if(intersect == null) return;
		
		if(normalize) intersect = this._toPixels(intersect);
		return intersect;
	},
	
	normal : function(){
		return this._plane.normal();
	},
	
	project : function(position, normalize, clampRatio){
		// TODO: Implement clampRatio
		if(!(arguments[0] instanceof Leap.Vector)) position = position.tipPosition();
		
		var intersect = this._plane.pointIntersect(position);
		if(intersect == null) return;
		
		if(normalize) intersect = this._toPixels(intersect);
		return intersect;
	},
	
	_toPixels : function(intersect){
		var direction = intersect.position.minus(this._origin);
		var x = this._xspan.dot(direction) + this.x;
		var y = this._yspan.dot(direction) + this.y;
		intersect.position = new Leap.Vector([x, y, 0]);
		return intersect;
	},
	
	offset : function(){
		this.x = this._data[5] - window.screenX;
		this.y = this._data[6] - window.screenY;
	},
	
	isValid : function(){
		return this._valid;
	}
};

Leap.Screen.invalid = function(){ return new Leap.Screen(); }
Leap.ScreenList = function(){
	
	if(localStorage.screens){
		var screens = JSON.parse(localStorage.screens);
		for(var id in screens){
			var screen = screens[id];
			if(screen.length == 7){
				var data = [new Leap.Vector(screen[0]), new Leap.Vector(screen[1]), new Leap.Vector(screen[2]), screen[3], screen[4], screen[5], screen[6]];
				this.push(new Leap.Screen(data));
			}
		}
		this.save();
	}
};

Leap.ScreenList.prototype = new Leap.List;

Leap.ScreenList.prototype.closestScreenHit = function(pointable){
	
	if(this.empty()) return Leap.Screen.invalid();
	
	var closest = Leap.Screen.invalid();
	var min;
	
	for(var index = 0; index < this.length; index++){
	
		var hit = this[index].intersect(pointable);
		
		if(hit && (closest._valid == false || hit.distance < min)){
			closest = this[index];
			min = hit.distance;
		}
	}
	
	return closest;
};

Leap.ScreenList.prototype.save = function(){

	var screenData = [];
	for(var i = 0; i < this.length; i++) screenData.push(this[i]._data);
	localStorage.screens = JSON.stringify(screenData);
};

Leap.ScreenList.prototype.clear = function(){

	this.length = 0;
	this.save();
};
Leap.Tool = function(toolData, parentHand){

	Leap.Pointable(toolData, parentHand, this);
	
	this._isTool = true;
	this._isFinger = false;
};

Leap.Tool.prototype = Leap.Pointable.prototype;

Leap.Tool.invalid = function(){
	return new Leap.Tool();
};

Leap.ToolList = function(){};

Leap.ToolList.prototype = new Leap.PointableList;

Leap.Vector = function(data){
	
	if(data == null){
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}
	else if("x" in data){
		this.x = data.x;
		this.y = data.y;
		this.z = data.z;
	}
	else if("0" in data){
		this.x = (typeof(data[0]) == "number")?data[0]:0;
		this.y = (typeof(data[1]) == "number")?data[1]:0;
		this.z = (typeof(data[2]) == "number")?data[2]:0;
	}
};

Leap.Vector.prototype = {
	
	angleTo : function(other){
		var denom = this.magnitude()*other.magnitude();
		if(denom > 0) return Math.acos(this.dot(other)/denom);
		else return 0;
	},
	
	cross : function(other){
		var x = this.y*other.z - other.y*this.z;
		var y = this.x*other.z - other.x*this.z;
		var z = this.x*other.y - other.x*this.y;
		return new Leap.Vector([x,y,z]);
	},
	
	distanceTo : function(other){
		return this.minus(other).magnitude();
	},
	
	dot : function(other){
		return this.x*other.x + this.y*other.y + this.z*other.z;
	},
	
	plus : function(other){
		return new Leap.Vector([this.x + other.x,this.y + other.y,this.z + other.z]);
	},
	
	minus : function(other){
		return new Leap.Vector([this.x - other.x,this.y - other.y,this.z - other.z]);
	},
	
	multiply : function(scalar){
		return new Leap.Vector([this.x*scalar,this.y*scalar,this.z*scalar]);
	},
	
	dividedBy : function(scalar){
		return new Leap.Vector([this.x/scalar,this.y/scalar,this.z/scalar]);
	},
	
	magnitude : function(){
		return Math.sqrt(this.magnitudeSquared());
	},
	
	magnitudeSquared : function(){
		return Math.pow(this.x,2) + Math.pow(this.y,2) + Math.pow(this.z,2);
	},
	
	normalized : function(){
		var magnitude = this.magnitude();
		if(magnitude > 0) return this.dividedBy(magnitude);
		else return new Leap.Vector();
	},
	
	pitch : function(){
		return Math.atan2(this.y, -this.z);
	},
	
	roll : function(){
		return Math.atan2(this.x, -this.y);
	},
	
	yaw : function(){
		return Math.atan2(this.x, -this.z);
	},
	
	toArray : function(){
		return [this.x, this.y, this.z];
	},
	
	toString : function(){
		return "{x:"+this.x+",y:"+this.y+",z:"+this.z+"}";
	},
	
	compare : function(other){
		return this.x==other.x && this.y==other.y && this.z==other.z;
	},
	
	isValid : function(){
		return (this.x != NaN && this.x > -Infinity && this.x < Infinity) &&
			   (this.y != NaN && this.y > -Infinity && this.y < Infinity) &&
			   (this.z != NaN && this.z > -Infinity && this.z < Infinity);
	}
};

Leap.Vector.backward = function(){ return new Leap.Vector([0,0,1]); };
Leap.Vector.down = function(){ return new Leap.Vector([0,-1,0]); };
Leap.Vector.forward = function(){ return new Leap.Vector([0,0,-1]); };
Leap.Vector.left = function(){ return new Leap.Vector([-1,0,0]); };
Leap.Vector.right = function(){ return new Leap.Vector([1,0,0]); };
Leap.Vector.up = function(){ return new Leap.Vector([0,1,0]); };
Leap.Vector.xAxis = function(){ return new Leap.Vector([1,0,0]); };
Leap.Vector.yAxis = function(){ return new Leap.Vector([0,1,0]); };
Leap.Vector.zAxis = function(){ return new Leap.Vector([0,0,1]); };
Leap.Vector.zero = function(){ return new Leap.Vector([0,0,0]); };

