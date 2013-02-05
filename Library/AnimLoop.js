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