/******************************************************************************\
* Copyright (C) 2012 Leap Motion, Inc. All rights reserved.                    *
* NOTICE: This developer release of Leap Motion, Inc. software is confidential *
* and intended for very limited distribution. Parties using this software must *
* accept the SDK Agreement prior to obtaining this software and related tools. *
* This software is subject to copyright.                                       *
\******************************************************************************/

var Leap = {

	Version : "0.7.0",
	
	Controller : function(connection){
	
		this.frames = [];
		
		this.listenerId = 0;
		
		this.listeners = {};
		
		this.onmessage = function(event){
			
			var eventData = JSON.parse(event.data);
			var newFrame = new Leap.Frame(eventData);
			this.frames.push(newFrame);
			for(index in this.listeners)
				this.listeners[index].onFrame(this);
		};
		
		this.connected = false;
		
		if ((typeof(WebSocket) == 'undefined') && (typeof(MozWebSocket) != 'undefined')) WebSocket = MozWebSocket;
		
		if (typeof(WebSocket) != 'undefined'){
			
			this.Socket = new WebSocket(connection);
			this.Socket.controller = this;
			
			this.Socket.onmessage = function(event){
				this.controller.onmessage(event);
			};
			
			this.Socket.onopen = function(event){
				this.connected = true;
				for(index in this.controller.listeners)
					this.controller.listeners[index].onConnect(this.controller);
			};
			
			this.Socket.onclose = function(event){
				this.connected = false;
				for(index in this.controller.listeners)
					this.controller.listeners[index].onDisconnect(this.controller);
			};
			
			this.Socket.onerror = function(event){ 
				this.onclose(event);
			};
		}
	},
	
	Listener : function(){
	
		this.onConnect = function(controller){};
		this.onDisconnect = function(controller){};
		this.onExit = function(controller){};
		this.onFrame = function(controller){};
		this.onInit = function(controller){};
		
	},

	Frame : function(frameData){
		
		this.id = frameData.id; // Int32
		this.timestamp = frameData.timestamp; // Int64
		
		this.fingers = {}; // FingerList
		this.tools = {}; // ToolList
		this.pointables = {}; // PointableList
		this.hands = {}; // HandList
		
		for(index in frameData.hands){
			var newHand = new Leap.Hand(frameData.hands[index],this)
			this.hands[newHand.id] = newHand;
			for(f in newHand.fingers)
				this.pointables[newHand.fingers[f].id] = this.fingers[newHand.fingers[f].id] = newHand.fingers[f];
			for(t in newHand.tools)
				this.pointables[newHand.tools[t].id] = this.tools[newHand.tools[t].id] = newHand.tools[t];
		}
	},

	Hand : function(handData, parentFrame){
		
		this.frame = parentFrame; // Frame
		this.id = handData.id; // Int32
		
		this.fingers = {}; // FingerList
		this.tools = {}; // ToolList
		this.pointables = {}; // PointableList
		
		for(index in handData.fingers){
			if(handData.fingers[index].tool == false){
				var newFinger = new Leap.Finger(handData.fingers[index],this);
				this.pointables[newFinger.id] = this.fingers[newFinger.id] = newFinger;
			}
			else{
				var newTool = new Leap.Tool(handData.fingers[index],this);
				this.pointables[newTool.id] = this.tools[newTool.id] = newTool;
			}
		}
		
		if(handData.palm != null){
			this.direction = new Leap.Vector(handData.palm.direction); // Vector
			this.palmNormal = new Leap.Vector(handData.palm.normal); // Vector
			this.palmPosition = new Leap.Vector(handData.palm.position); // Vector
			this.palmVelocity = new Leap.Vector(handData.palm.velocity); // Vector
			if(handData.palm.ball != null){
				this.sphereCenter = new Leap.Vector(handData.palm.ball.center); // Vector
				this.sphereRadius = handData.palm.ball.radius; // Float
			}
		}
	},

	Finger : function(fingerData, parentHand){
	
		Leap.Pointable(this,fingerData,parentHand);
		
		this.isFinger = true; // Bool
		this.isTool = false; // Bool
	},

	Tool : function(toolData, parentHand){
		
		Leap.Pointable(this,toolData,parentHand);
		
		this.isFinger = false; // Bool
		this.isTool = true; // Bool
	},

	Pointable : function(obj, pointableData, parentHand){
		
		obj.frame = parentHand.frame; // Frame
		obj.hand = parentHand; // Hand
		obj.id = pointableData.id; // Int32
		
		obj.direction = new Leap.Vector(pointableData.tip.direction); // Vector direction
		obj.tipPosition = new Leap.Vector(pointableData.tip.position); // Vector
		obj.tipVelocity = new Leap.Vector(pointableData.tip.velocity); // Vector
		
		obj.length = pointableData.length; // Float
		obj.width = pointableData.width; // Float
	},

	Vector : function(data){
		
		if(data instanceof Leap.Vector){
			this.x = data.x;
			this.y = data.y;
			this.z = data.z;
		}
		else{
			this.x = (typeof(data[0]) == "number")?data[0]:0; // Float
			this.y = (typeof(data[1]) == "number")?data[1]:0; // Float
			this.z = (typeof(data[2]) == "number")?data[2]:0; // Float
		}
	},
	
	Matrix : function(data){
	
		if(data instanceof Leap.Matrix){
			this.xBasis = data.xBasis ;
			this.yBasis = data.yBasis;
			this.zBasis = data.zBasis;
			this.origin = data.origin;
		}
		else if(data[0] instanceof Leap.Vector && typeof(data[1]) == "number"){
			this.setRotation(data[0],data[1]);
			this.origin = (data[2] instanceof Leap.Vector)?data[2]:new Leap.Vector([0,0,0]);
		}
		else{
			this.xBasis = (data[0] instanceof Leap.Vector)?data[0]:new Leap.Vector([1,0,0]);
			this.yBasis = (data[1] instanceof Leap.Vector)?data[1]:new Leap.Vector([0,1,0]);
			this.zBasis = (data[2] instanceof Leap.Vector)?data[2]:new Leap.Vector([0,0,1]);
			this.origin = (data[3] instanceof Leap.Vector)?data[3]:new Leap.Vector([0,0,0]);
		}
	}
}

Leap.Controller.prototype = {
	
	frame : function(index){
		if(index == null) return this.frames[this.frames.length-1];
		if(index < this.frames.length)
			return this.frames[this.frames.length-index-1];
	},
	
	getListenerId : function(){
		var val = this.listenerId;
		this.listenerId++;
		return val;
	},
	
	addListener : function(listener){
		listener.id = this.getListenerId();
		this.listeners[listener.id] = listener;
		listener.onInit(this);
	},
	
	removeListener : function(listener){
		listener.onExit(this);
		this.listeners[listener.id].onExit(this);
		delete this.listeners[listener.id];
	}
}

Leap.Frame.prototype = {
	
	toString : function(){
		var val = "{timestamp:"+this.timestamp+",id:"+this.id+",hands:[";
		for(index in this.hands) val += this.hands[index].toString();
		val += "]}";
		return val;
	},
	
	isValid : true, // Bool
	
	finger : function(id){ // Finger finger(Int32 id)
		if(this.fingers[id]==null) return {isValid:false};
		return this.fingers[id];
	},
	
	hand : function(id){ // Hand hand(id)
		if(this.hands[id]==null) return {isValid:false};
		return this.hands[id];
	},
	
	pointable : function(id){ // Pointable pointable(id)
		if(this.pointables[id]==null) return {isValid:false};
		return this.pointables[id];
	},
	
	tool : function(id){ // Tool tool(id)
		if(this.tools[id]==null) return {isValid:false};
		return this.tools[id];
	}
}

Leap.Hand.prototype = {
	
	toString : function(){
		var val = "{id:"+this.id+",sphereCenter:"+(this.sphereCenter==null?"null":this.sphereCenter)+",";
		val += "sphereRadius:"+(this.sphereRadius==null?"null":this.sphereRadius)+",";
		val += "normal:"+(this.normal==undefined?"null":this.normal.toString())+",fingers:[";
		for(index in this.fingers) val += this.fingers[index].toString();
		val += "],tools:[";
		for(index in this.tools) val += this.tools[index].toString();
		val += "],palmNormal:"+(this.palmNormal==undefined?"null":this.palmNormal.toString())+",";
		val += "palmPosition:"+(this.palmPosition==undefined?"null":this.palmPosition.toString())+",";
		val += "palmVelocity:"+(this.palmVelocity==undefined?"null":this.palmVelocity.toString())+"}";
		return val;
	},
	
	isValid : true, // Bool
	
	finger : function(id){ // Finger finger(Int32 id)
		if(this.fingers[id]==null) return {isValid:false};
		return this.fingers[id];
	},
	
	pointable : function(id){ // Pointable pointable(id)
		if(this.pointables[id]==null) return {isValid:false};
		return this.pointables[id];
	},
	
	tool : function(id){ // Tool tool(id)
		if(this.tools[id]==null) return {isValid:false};
		return this.tools[id];
	}
}

Leap.Finger.prototype = {
	
	isValid : true, // Bool
	
	toString : function(){
		var val = "{id:"+this.id+",direction:"+this.direction.toString()+",";
		val += "tipPosition:"+this.tipPosition.toString()+",";
		val += "tipVelocity:"+this.tipVelocity.toString()+",";
		val += "length:"+this.length+",";
		val += "width:"+this.width+"}";
		return val;
	}
}

Leap.Tool.prototype = {
	
	isValid : true, // Bool
	
	toString : function(){
		var val = "{id:"+this.id+",direction:"+this.direction.toString()+",";
		val += "tipPosition:"+this.tipPosition.toString()+",";
		val += "tipVelocity:"+this.tipVelocity.toString()+",";
		val += "length:"+this.length+",";
		val += "width:"+this.width+"}";
		return val;
	}
}

Leap.Vector.prototype = {
	
	angleTo : function(other){ // Float
		var denom = this.magnitude()*other.magnitude();
		if(denom > 0) return Math.acos(this.dot(other)/denom);
		else return 0;
	},
	
	cross : function(other){ // Vector cross(Vector other)
		var x = this.y*other.z-other.y*this.z;
		var y = this.x*other.z-other.x*this.z;
		var z = this.x*other.y-other.x*this.y;
		return new Leap.Vector([x,y,z]);
	},
	
	distanceTo : function(other){ // Float distanceTo(Vector other)
		return this.minus(other).magnitude();
	},
	
	dot : function(other){ // Float dot(Vector other)
		return this.x*other.x+this.y*other.y+this.z*other.z;
	},
	
	plus : function(other){ // Vector plus(Vector other)
		return new Leap.Vector([this.x+other.x,this.y+other.y,this.z+other.z]);
	},
	
	minus : function(other){ // Vector minus(Vector other)
		return new Leap.Vector([this.x-other.x,this.y-other.y,this.z-other.z]);
	},
	
	multiply : function(scalar){ // Vector multiply(Float scalar)
		return new Leap.Vector([this.x*scalar,this.y*scalar,this.z*scalar]);
	},
	
	dividedBy : function(scalar){ // Vector dividedBy(Float scalar)
		return new Leap.Vector([this.x/scalar,this.y/scalar,this.z/scalar]);
	},
	
	magnitude : function(){ // Float
		return Math.sqrt(this.magnitudeSquared());
	},
	
	magnitudeSquared : function(){ // Float
		return Math.pow(this.x,2)+Math.pow(this.y,2)+Math.pow(this.y,2);
	},
	
	normalized : function(){ // Vector
		var magnitude = this.magnitude();
		if(magnitude > 0) return this.dividedBy(magnitude);
		else return new Leap.Vector();
	},
	
	pitch : function(){ // Float
		//var proj = new Leap.Vector([0,this.y,this.z]);
		//return Leap.vectors.forward().angleTo(proj);
		return Math.atan2(this.y, -this.z);
	},
	
	roll : function(){ // Float
		//var proj = new Leap.Vector([this.x,this.y,0]);
		//return Leap.vectors.down().angleTo(proj);
		return Math.atan2(this.x, -this.y);
	},
	
	yaw : function(){ // Float
		//var proj = new Leap.Vector([this.x,0,this.z]);
		//return Leap.vectors.forward().angleTo(proj);
		return Math.atan2(this.x, -this.z);
	},
	
	toString : function(){
		return "{x:"+this.x+",y:"+this.y+",z:"+this.z+"}";
	},
	
	compare : function(other){
		return this.x==other.x && this.y==other.y && this.z==other.z;
	}
}

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
}

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

Leap.Matrix.identity = function(){ return new Leap.Matrix(); };