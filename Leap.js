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
		
		// Support both the WebSocket and MozWebSocket objects
		if ((typeof(WebSocket) == 'undefined') && (typeof(MozWebSocket) != 'undefined')) WebSocket = MozWebSocket;
		
		//Create and open the socket
		this.Socket = new WebSocket(connection);
		this.Socket.controller = this;
		
		this.Socket.onmessage = function(event){
			
			var eventData = JSON.parse(event.data);
			var newFrame = new Leap.Frame(eventData);
			this.controller.frames.push(newFrame);
			for(index in this.controller.listeners)
				this.controller.listeners[index].onFrame(this.controller);
		};
		
		this.Socket.onopen = function(event){
			for(index in this.controller.listeners)
				this.controller.listeners[index].onConnect(this.controller);
		};
		
		this.Socket.onclose = function(event){
			for(index in this.controller.listeners)
				this.controller.listeners[index].onDisconnect(this.controller);
		};
		
		this.Socket.onerror = function(event){ alert("Connection error"); };
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

	Vector : function(coordinates){
		
		this.x = coordinates[0]; // Float
		this.y = coordinates[1]; // Float
		this.z = coordinates[2]; // Float
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
	},
	
	removeListener : function(listener){
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
		var cos = this.dot(other)/(this.magnitude()*other.magnitude());
		return Math.acos(cos);
	},
	
	cross : function(other){ // Vector cross(Vector other)
		var x = this.y*other.z-other.y-this.z;
		var y = this.x*other.z-other.x-this.z;
		var z = this.x*other.y-other.x-this.y;
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
		return this.dividedBy(this.magnitude());
	},
	
	pitch : function(){ // Float
		var proj = new Leap.Vector([0,this.y,this.z]);
		return Leap.vectors.forward().angleTo(proj);
	},
	
	roll : function(){ // Float
		var proj = new Leap.Vector([this.x,this.y,0]);
		return Leap.vectors.down().angleTo(proj);
	},
	
	yaw : function(){ // Float
		var proj = new Leap.Vector([this.x,0,this.z]);
		return Leap.vectors.forward().angleTo(proj);
	},
	
	toString : function(){
		return "{x:"+this.x+",y:"+this.y+",z:"+this.z+"}";
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