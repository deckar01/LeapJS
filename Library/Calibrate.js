Leap.Calibrate = function(controller){
	
	this._controller = controller;
	this._points = [];
	var me = this;
	
	this._elem = document.createElement("div");
	this._elem.style.cssText = this._pointCSS + this._point1CSS;
	this._elem.innerHTML = "1";
	this._elem.title = "Place finger here, then click.\nMake sure only one finger is visible."
	
	this._elem.onclick = function(){ me._calibrate1(); };
	
	document.body.appendChild(this._elem);
	
	var me = this;
	this._listener = new Leap.Listener();
	this._listener.onFrame = function(controller){ me._fingerCount(controller); };
	this._controller.addListener(this._listener);
};

Leap.Calibrate.prototype = {
	
	_pointCSS : "width: 20px; height: 20px; padding: 10px; margin: -20px; position: fixed; text-align: center; background-color: #c3cccc; color: #ffffff; cursor: pointer; ",
	_point1CSS : "left: 25%; top: 50%;",
	_point2CSS : "left: 25%; top: 25%;",
	_point3CSS : "left: 75%; top: 50%;",
	
	_calibrate1 : function(){
		var pointables = this._controller.frame().pointables();
		if(pointables.count() == 1){
			var me = this;
			this._points[0] = pointables[0].tipPosition();
			this._elem.style.cssText = this._pointCSS + this._point2CSS;
			this._elem.innerHTML = "2";
			this._elem.onclick = function(){ me._calibrate2(); };
		}
	},
	
	_calibrate2 : function(){
		var pointables = this._controller.frame().pointables();
		if(pointables.count() == 1){
			var me = this;
			this._points[1] = pointables[0].tipPosition();
			this._elem.style.cssText = this._pointCSS + this._point3CSS;
			this._elem.innerHTML = "3";
			this._elem.onclick = function(){ me._calibrate3(); };
		}
	},
	
	_calibrate3 : function(){
		var pointables = this._controller.frame().pointables();
		if(pointables.count() == 1){
			this._points[2] = pointables[0].tipPosition();
			document.body.removeChild(this._elem);
			delete this._elem;
			
			var screen = new Leap.Screen(this._points);
			this._controller._screens.push(screen);
			this._controller.removeListener(this._listener);
			this.onComplete(screen);
		}
	},
	
	_fingerCount : function(controller){
		var count = controller.frame().pointables().count();
		if(count == 0) this._elem.style.backgroundColor = "#c3cccc";
		else if(count == 1) this._elem.style.backgroundColor = "#BCD63C";
		else this._elem.style.backgroundColor = "#FF0000";
	},
	
	onComplete : function(screen){}
}