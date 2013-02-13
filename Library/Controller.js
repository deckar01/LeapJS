if ((typeof(WebSocket) == 'undefined') && (typeof(MozWebSocket) != 'undefined')) WebSocket = MozWebSocket;

Leap.Controller = function(connection){
	
	this._frames = [];
	this._listeners = {};
	this._listenerId = 0;
	
	this._bufferSize = 1024;
	this._bufferBegin = 0;
	
	this._screens = new Leap.ScreenList();
	
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
	
	calibratedScreens : function(){
		return this._screens;
	},
	
	_onmessage : function(event){
		
		var eventData = JSON.parse(event.data);
		var newFrame = new Leap.Frame(eventData);
		
		this._bufferBegin++;
		if(this._bufferBegin == this._bufferSize) this._bufferBegin = 0;
		
		delete this._frames[this._bufferBegin];
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
		
		this._socket.onmessage = function(event){
			this._controller._versionFrame(event);
		};
		
		this._socket.onopen = function(event){
			for(index in this._controller._listeners)
				this._controller._listeners[index].onConnect(this._controller);
		};
		
		this._socket.onclose = function(event){
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
