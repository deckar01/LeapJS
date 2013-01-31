Leap.Calibrate = function(controller){
	
	this._controller = controller;
	this._points = [];
	var me = this;
	
	this._elem = document.createElement("div");
	this._elem.style.cssText = this._pointCSS + this._point1CSS;
	this._elem.innerText = "1";
	this._elem.onclick = function(){ me._calibrate1(); };
	
	document.body.appendChild(this._elem);
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
			this._elem.innerText = "2";
			this._elem.onclick = function(){ me._calibrate2(); };
		}
	},
	
	_calibrate2 : function(){
		var pointables = this._controller.frame().pointables();
		if(pointables.count() == 1){
			var me = this;
			this._points[1] = pointables[0].tipPosition();
			this._elem.style.cssText = this._pointCSS + this._point3CSS;
			this._elem.innerText = "3";
			this._elem.onclick = function(){ me._calibrate3(); };
		}
	},
	
	_calibrate3 : function(){
		var pointables = this._controller.frame().pointables();
		if(pointables.count() == 1){
			var me = this;
			this._points[2] = pointables[0].tipPosition();
			document.body.removeChild(this._elem);
			delete this._elem;
			
			this.onComplete(new Leap.Screen(this._points));
		}
	},
	
	onComplete : function(screen){}
}