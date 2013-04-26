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
