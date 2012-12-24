/******************************************************************************\
* Copyright (C) 2012 Leap Motion, Inc. All rights reserved.                    *
* NOTICE: This developer release of Leap Motion, Inc. software is confidential *
* and intended for very limited distribution. Parties using this software must *
* accept the SDK Agreement prior to obtaining this software and related tools. *
* This software is subject to copyright.                                       *
\******************************************************************************/

var Leap = {

	Version : "0.7.0a",
	
	Init : function(connection){

		// Support both the WebSocket and MozWebSocket objects
		if ((typeof(WebSocket) == 'undefined') && (typeof(MozWebSocket) != 'undefined')) WebSocket = MozWebSocket;
		
		//Create and open the socket
		Leap.Socket = new WebSocket(connection);
		
		Leap.Socket.onmessage = function(event){
			
			var eventData = JSON.parse(event.data);
			
			if(eventData.state=="frame"){
			
				var newFrame = new Leap.Frame(eventData.frame);
				Leap.Controller.frames.push(newFrame);
				
				for(index in Leap.Controller.listeners)
					Leap.Controller.listeners[index].onFrame(Leap.Controller);
			}
		};
		
		Leap.Socket.onopen = function(event){
			
			for(index in Leap.Controller.listeners)
				Leap.Controller.listeners[index].onConnect(Leap.Controller);
		};
		
		Leap.Socket.onclose = function(event){
			
			for(index in Leap.Controller.listeners)
				Leap.Controller.listeners[index].onDisconnect(Leap.Controller);
		};
		
		Leap.Socket.onerror = function(event){ alert("Connection error"); };
	},
	
	Controller : {
	
		frames : [],
		
		frame : function(index){
			if(index == null) return Leap.Controller.frames[Leap.Controller.frames.length-1];
			if(index < Leap.Controller.frames.length)
				return Leap.Controller.frames[Leap.Controller.frames.length-index-1];
		},
		
		listenerId : 0,
		
		getListenerId : function(){
			var val = Leap.Controller.listenerId;
			Leap.Controller.listenerId++;
			return val;
		},
		
		listeners: {},
		
		addListener: function(listener){
			Leap.Controller.listeners[listener.id] = listener;
		},
		
		removeListener: function(listener){
			Leap.Controller.listeners[listener.id].onExit(Leap.Controller);
			delete Leap.Controller.listeners[listener.id];
		}
	},
	
	Listener : function(){
		
		this.id = Leap.Controller.getListenerId();
		
		this.onConnect = function(controller){};
		this.onDisconnect = function(controller){};
		this.onExit = function(controller){};
		this.onFrame = function(controller){};
		this.onInit = function(controller){};
		
	},

	Frame : function(frameData){
		
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
		
		this.id = frameData.id; // Int32
		this.timestamp = frameData.timestamp; // Int64
		
		this.toString = function(){
			var val = "{timestamp:"+this.timestamp+",id:"+this.id+",hands:[";
			for(index in this.hands) val += this.hands[index].toString();
			val += "]}";
			return val;
		};
		
		this.isValid = true; // Bool
		
		this.finger = function(id){ // Finger finger(Int32 id)
			if(this.fingers[id]==null) return {isValid:false};
			return this.fingers[id];
		}
		this.hand = function(id){ // Hand hand(id)
			if(this.hands[id]==null) return {isValid:false};
			return this.hands[id];
		}
		this.pointable = function(id){ // Pointable pointable(id)
			if(this.pointables[id]==null) return {isValid:false};
			return this.pointables[id];
		}
		this.tool = function(id){ // Tool tool(id)
			if(this.tools[id]==null) return {isValid:false};
			return this.tools[id];
		}
	},

	Hand : function(handData, parentFrame){
		
		this.frame = parentFrame; // Frame
		this.id = handData.id; // Int32
		
		this.fingers = {}; // FingerList
		this.tools = {}; // ToolList
		this.pointables = {}; // PointableList
		
		for(index in handData.fingers){
			if(handData.fingers[index].isTool == false){
				var newFinger = new Leap.Finger(handData.fingers[index],this);
				this.pointables[newFinger.id] = this.fingers[newFinger.id] = newFinger;
			}
			else{
				var newTool = new Leap.Tool(handData.fingers[index],this);
				this.pointables[newTool.id] = this.tools[newTool.id] = newTool;
			}
		}
		
		if(handData.normal != null) this.direction = new Leap.Vector(handData.normal); // Vector
		
		if(handData.palm != null){
			this.palmNormal = new Leap.Vector(handData.palm.direction); // Vector
			this.palmPosition = new Leap.Vector(handData.palm.position); // Vector
		}
		
		if(handData.velocity != null) this.palmVelocity = new Leap.Vector(handData.velocity); // Vector
		
		if(handData.ball != null){
			this.sphereCenter = new Leap.Vector(handData.ball.position); // Vector
			this.sphereRadius = handData.ball.radius; // Float
		}
		
		this.toString = function(){
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
		};
		
		this.isValid = true; // Bool
		
		this.finger = function(id){ // Finger finger(Int32 id)
			if(this.fingers[id]==null) return {isValid:false};
			return this.fingers[id];
		}
		this.pointable = function(id){ // Pointable pointable(id)
			if(this.pointables[id]==null) return {isValid:false};
			return this.pointables[id];
		}
		this.tool = function(id){ // Tool tool(id)
			if(this.tools[id]==null) return {isValid:false};
			return this.tools[id];
		}
	},

	Finger : function(fingerData, parentHand){
	
		var pointable = new Leap.Pointable(fingerData,parentHand);
		for(index in pointable) this[index] = pointable[index];
		
		this.isFinger = true; // Bool
		this.isTool = false; // Bool
		this.isValid = true; // Bool
	},

	Tool : function(toolData, parentHand){
		
		var pointable = new Leap.Pointable(toolData,parentHand);
		for(index in pointable) this[index] = pointable[index];
		
		this.isFinger = false; // Bool
		this.isTool = true; // Bool
		this.isValid = true; // Bool
	},

	Pointable : function(pointableData, parentHand){
		
		this.frame = parentHand.frame; // Frame
		this.hand = parentHand; // Hand
		this.id = pointableData.id; // Int32
		
		this.direction = new Leap.Vector(pointableData.tip.direction); // Vector direction
		this.tipPosition = new Leap.Vector(pointableData.tip.position); // Vector
		this.tipVelocity = new Leap.Vector(pointableData.velocity); // Vector
		
		this.length = pointableData.length; // Float
		this.width = pointableData.width; // Float
		
		this.isValid = true; // Bool
		this.toString = function(){
			var val = "{id:"+this.id+",direction:"+this.direction.toString()+",";
			val += "tipPosition:"+this.tipPosition.toString()+",";
			val += "tipVelocity:"+this.tipVelocity.toString()+",";
			val += "length:"+this.length+",";
			val += "width:"+this.width+"}";
			return val;
		};
	},

	Vector : function(coordinates){
		
		this.x = coordinates.x; // Float
		this.y = coordinates.y; // Float
		this.z = coordinates.z; // Float
		
		this.angleTo = function(other){ // Float
			var cos = this.dot(other)/(this.magnitude()*other.magnitude());
			return Math.acos(cos);
		};
		
		this.cross = function(other){ // Vector cross(Vector other)
			var x = this.y*other.z-other.y-this.z;
			var y = this.x*other.z-other.x-this.z;
			var z = this.x*other.y-other.x-this.y;
			return new Leap.Vector({x:x,y:y,z:z});
		};
		
		this.distanceTo = function(other){ // Float distanceTo(Vector other)
			return this.minus(other).magnitude();
		};
		
		this.dot = function(other){ // Float dot(Vector other)
			return this.x*other.x+this.y*other.y+this.z*other.z;
		};
		
		this.plus = function(other){ // Vector plus(Vector other)
			return new Leap.Vector({x:this.x+other.x,y:this.y+other.y,z:this.z+other.z});
		};
		
		this.minus = function(other){ // Vector minus(Vector other)
			return new Leap.Vector({x:this.x-other.x,y:this.y-other.y,z:this.z-other.z});
		};
		
		this.multiply = function(scalar){ // Vector multiply(Float scalar)
			return new Leap.Vector({x:this.x*scalar,y:this.y*scalar,z:this.z*scalar});
		};
		
		this.dividedBy = function(scalar){ // Vector dividedBy(Float scalar)
			return new Leap.Vector({x:this.x/scalar,y:this.y/scalar,z:this.z/scalar});
		};
		
		this.magnitude = function(){ // Float
			return Math.sqrt(this.magnitudeSquared());
		};
		
		this.magnitudeSquared = function(){ // Float
			return Math.pow(this.x,2)+Math.pow(this.y,2)+Math.pow(this.y,2);
		};
		
		this.normalized = function(){ // Vector
			return this.dividedBy(this.magnitude());
		};
		
		this.pitch = function(){ // Float
			var proj = new Leap.Vector({x:0,y:this.y,z:this.z});
			return Leap.vectors.forward().angleTo(proj);
		};
		
		this.roll = function(){ // Float
			var proj = new Leap.Vector({x:this.x,y:this.y,z:0});
			return Leap.vectors.down().angleTo(proj);
		};
		
		this.yaw = function(){ // Float
			var proj = new Leap.Vector({x:this.x,y:0,z:this.z});
			return Leap.vectors.forward().angleTo(proj);
		};
		
		this.toString = function(){
			return "{x:"+this.x+",y:"+this.y+",z:"+this.z+"}";
		}
		
	},
	
	vectors : {
		backward: function(){ return new Leap.Vector({x:0,y:0,z:1}); },
		down: function(){ return new Leap.Vector({x:0,y:-1,z:0}); },
		forward: function(){ return new Leap.Vector({x:0,y:0,z:-1}); },
		left: function(){ return new Leap.Vector({x:-1,y:0,z:0}); },
		right: function(){ return new Leap.Vector({x:1,y:0,z:0}); },
		up: function(){ return new Leap.Vector({x:0,y:1,z:0}); },
		xAxis: function(){ return new Leap.Vector({x:1,y:0,z:0}); },
		yAxis: function(){ return new Leap.Vector({x:0,y:1,z:0}); },
		zAxis: function(){ return new Leap.Vector({x:0,y:0,z:1}); },
		zero: function(){ return new Leap.Vector({x:0,y:0,z:0}); }
	},
}