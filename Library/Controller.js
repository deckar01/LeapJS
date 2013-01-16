Leap.Controller = function(connection){
	
	this._frames = [];
	this._listeners = {};
	this._listenerId = 0;
	
	if ((typeof(WebSocket) == 'undefined') && (typeof(MozWebSocket) != 'undefined')) WebSocket = MozWebSocket;
	
	if (typeof(WebSocket) != 'undefined'){
		
		this._socket = new WebSocket(connection);
		this._socket._controller = this;
		
		this._socket.onmessage = function(event){
			this._controller._onmessage(event);
		};
		
		this._socket.onopen = function(event){
			for(index in this._controller._listeners)
				this._controller._listeners[index].onConnect(this._controller);
		};
		
		this._socket.onclose = function(event){
			for(index in this._controller._listeners)
				this._controller._listeners[index].onDisconnect(this._controller);
		};
		
		this._socket.onerror = function(event){ 
			this.onclose(event);
		};
	}
};

Leap.Controller.prototype = {
	
	isConnected : function(){
		return this._socket.connected;
	},
	
	frame : function(index){
		if(index == null) return this._frames[this._frames.length-1];
		if(index < this._frames.length)
			return this._frames[this._frames.length-index-1];
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
	
	calibratedScreens : function(){
		// Requires additional data from WebSocket server
	},
	
	_onmessage : function(event){
		
		var eventData = JSON.parse(event.data);
		if(this._discardVersionFrame(eventData)){
			var newFrame = new Leap.Frame(eventData);
			this._frames.push(newFrame);
			for(index in this._listeners)
				this._listeners[index].onFrame(this);
		}
	},
	
	_discardVersionFrame : function(data){
		if(data.version){ this._discardVersionFrame = function(){return true;}; return false;}
		else return true;
	}
};
