Leap.Screen = function(data){
	
	if(data){
	
		this._plane = new Leap.Plane(data[0],data[1],data[2]);
		this._center = data[0].plus(data[2]).dividedBy(2);
		this._origin = data[1].plus(data[1].minus(this._center));
		
		var xv = data[2].minus(data[0]);
		var yv = data[0].minus(data[1]);
		var xscale = 2*xv.magnitude()/window.innerWidth;
		var yscale = 4*yv.magnitude()/window.innerHeight;
		this._xspan = xv.normalized().dividedBy(xscale);
		this._yspan = yv.normalized().dividedBy(yscale);
		
		this._valid = true;
	}
	else{
	
		this._plane = null;
		this._valid = false;
	}
};

Leap.Screen.prototype = {
	
	distanceToPoint : function(point){
		return this._plane.pointDistance(point);
	},
	
	intersect : function(pointable, normalize, clampRatio){
		// TODO: Implement clampRatio
		var intersect = this._plane.rayIntersect(pointable.tipPosition(), pointable.direction());
		
		if(normalize){ // Normalizes to 2D pixels
			var direction = intersect.position.minus(this._origin);
			var x = this._xspan.dot(direction);
			var y = this._yspan.dot(direction);
			intersect.position = new Leap.Vector([x, y, 0]);
		}
		
		return intersect;
	},
	
	normal : function(){
		return this._plane.normal();
	},
	
	isValid : function(){
		return this._valid;
	}
};

Leap.Screen.invalid = function(){ return new Leap.Screen(); }