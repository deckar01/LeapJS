Leap.Screen = function(data, width, height){

	this._data = data;
	
	if(data){
		
		if(!("3" in data)) this._data[3] = window.innerWidth;
		if(!("4" in data)) this._data[4] = window.innerHeight;
		if(!("5" in data)) this._data[5] = window.screenX;
		if(!("6" in data)) this._data[6] = window.screenY;
		
		this.offset();
		
		this._plane = new Leap.Plane(data[0],data[1],data[2]);
		this._center = data[0].plus(data[2]).dividedBy(2);
		this._origin = data[1].plus(data[1].minus(this._center));
		
		var xv = data[2].minus(data[0]);
		var yv = data[0].minus(data[1]);
		var xscale = 2*xv.magnitude()/this._data[3];
		var yscale = 4*yv.magnitude()/this._data[4];
		this._xspan = xv.normalized().dividedBy(xscale);
		this._yspan = yv.normalized().dividedBy(yscale);
		
		this._valid = true;
	}
	else{
	
		this._plane = new Leap.Plane();
		this._center = new Leap.Vector();
		this._origin = new Leap.Vector();
		this._xspan = new Leap.Vector();
		this._yspan = new Leap.Vector();
		this._data = [new Leap.Vector(), new Leap.Vector(), new Leap.Vector(), 0, 0, 0, 0];
		
		this._valid = false;
	}
};

Leap.Screen.prototype = {
	
	distanceToPoint : function(point){
		return this._plane.pointDistance(point);
	},
	
	intersect : function(){
		// TODO: Implement clampRatio
		var position, direction, normalize, clampRatio;
		
		if(arguments[0] instanceof Leap.Vector){
			position = arguments[0];
			direction = arguments[1];
			normalize = arguments[2];
			clampRatio = arguments[3];
		}
		else{
			position = arguments[0].tipPosition();
			direction = arguments[0].direction();
			normalize = arguments[1];
			clampRatio = arguments[2];
		}
		
		var intersect = this._plane.rayIntersect(position, direction);
		if(intersect == null) return;
		
		if(normalize) intersect = this._toPixels(intersect);
		return intersect;
	},
	
	normal : function(){
		return this._plane.normal();
	},
	
	project : function(position, normalize, clampRatio){
		// TODO: Implement clampRatio
		if(!(arguments[0] instanceof Leap.Vector)) position = position.tipPosition();
		
		var intersect = this._plane.pointIntersect(position);
		if(intersect == null) return;
		
		if(normalize) intersect = this._toPixels(intersect);
		return intersect;
	},
	
	_toPixels : function(intersect){
		var direction = intersect.position.minus(this._origin);
		var x = this._xspan.dot(direction) + this.x;
		var y = this._yspan.dot(direction) + this.y;
		intersect.position = new Leap.Vector([x, y, 0]);
		return intersect;
	},
	
	offset : function(){
		this.x = this._data[5] - window.screenX;
		this.y = this._data[6] - window.screenY;
	},
	
	isValid : function(){
		return this._valid;
	}
};

Leap.Screen.invalid = function(){ return new Leap.Screen(); }