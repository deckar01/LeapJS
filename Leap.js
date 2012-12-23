/******************************************************************************\
* Copyright (C) 2012 Leap Motion, Inc. All rights reserved.                    *
* NOTICE: This developer release of Leap Motion, Inc. software is confidential *
* and intended for very limited distribution. Parties using this software must *
* accept the SDK Agreement prior to obtaining this software and related tools. *
* This software is subject to copyright.                                       *
\******************************************************************************/

var Leap = {

	Version : "0.6.6",
	
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
				for(listener in Leap.Controller.listeners) listener(newFrame);
			}
		};
		
		Leap.Socket.onopen = function(event){ alert("Connection open"); };
		Leap.Socket.onclose = function(event){ alert("Connection closed"); };
		Leap.Socket.onerror = function(event){ alert("Connection error"); };
	},
	
	Controller : {
	
		frames : [],
		
		frame : function(index){
			if(index<Leap.Controller.frames.length)
				return Leap.Controller.frames[Leap.Controller.frames.length-index-1];
		},
		
		listeners: [],
		
		addListener: function(listener){
			Leap.Controller.listeners.push(listener);
		},
		
		//removeListener: function(listener){ }
	},

	Frame : function(frameData){
		
		this.hands = []; // HandList
		for(handData in frameData.hands) this.hands.push(new Leap.Hand(handData,this));
		
		this.id = frameData.id; // Int32
		this.timestamp = frameData.timestamp; // Int64
		
		this.toString = function(){
			var val = "{id:"+this.id+",timestamp:"+this.timestamp+"}";
			return val;
		};
		
		//var finger; // Finger finger(Int32 id)
		//var fingers; // FingerList
		//var hand; // Hand hand(id)
		//var isValid; // Bool
		//var pointable; // Pointable pointable(Int32 id)
		//var pointables; // PointableList
		//var tool; // Tool tool(id)
		//var tools; // ToolList
	},

	Hand : function(handData, parentFrame){
	
		this.direction = new Leap.Vector(handData.normal); // Vector
		
		this.fingers = []; // FingerList
		for(fingerData in handData.fingers) this.fingers.push(new Leap.Finger(fingerData,this));
		
		this.frame = parentFrame; // Frame
		this.id = handData.id; // Int32
		
		this.palmNormal = new Leap.Vector(handData.palm.direction); // Vector
		this.palmPosition = new Leap.Vector(handData.palm.position); // Vector
		
		this.sphereCenter = new Leap.Vector(handData.Ball.position); // Vector
		this.sphereRadius = handData.Ball.radius; // Float
		
		//var finger; // Finger finger(Int32 id)
		//var isValid; // Bool
		//var palmVelocity; // Vector
		//var pointable; // Pointable pointable(Int32 id)
		//var pointables; // PointableList
		//var tool; // Tool tool(Int32 id)
		//var tools; // ToolList
		//var toString;
	},

	Finger : function(fingerData, parentHand){
	
		this = new Leap.Pointable(fingerData,parentHand);
		this.isFinger = true; // Bool
		this.isTool = false; // Bool
		
		//var toString;
	},

	Tool : function(toolData, parentHand){
		
		this = new Leap.Pointable(toolData,parentHand);
		this.isFinger = false; // Bool
		this.isTool = true; // Bool
		
		//var toString;
	},

	Pointable : function(pointableData, parentHand){
		
		this.direction = new Leap.Vector(pointableData.direction); // Vector direction
		this.frame = parentHand.frame; // Frame
		this.hand = parentHand; // Hand
		this.id = pointableData.id; // Int32
		this.length = pointableData.length; // Float
		this.width = pointableData.width; // Float
		this.tipPosition = new Leap.Vector(pointableData.tip.position); // Vector
		this.tipVelocity = new Leap.Vector(pointableData.tip.velocity); // Vector
		
		//var isValid; // Bool
		//var toString;
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
			return "{"+this.x+","+this.y+","+this.z+"}";
		}
		
		//var get; // Float get(unsigned int index)
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