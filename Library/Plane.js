Leap.Plane = function(point1, point2, point3){
	
	this._point1 = new Leap.Vector(point1);
	this._point2 = new Leap.Vector(point2);
	this._point3 = new Leap.Vector(point3);
};

Leap.Plane.prototype = {
	
	normal : function(){
		
		var x21 = this._point2.x - this._point1.x;
		var y21 = this._point2.y - this._point1.y;
		var z21 = this._point2.z - this._point1.z;
		
		var x31 = this._point3.x - this._point1.x;
		var y31 = this._point3.y - this._point1.y;
		var z31 = this._point3.z - this._point1.z;
		
		var x = y21*z31 - y31*z21;
		var y = x21*z31 - x31*z21;
		var z = x21*y31 - x31*y21;
		
		if(x==0 && y==0 && z==0) this._normal = null;
		else this._normal = new Leap.Vector([x, y, z]);
		
		this.normal = function(){ return this._normal; };
		return this._normal;
	},
	
	unitnormal : function(){
		
		var normal = this.normal();
		if(n==null) return null;
		
		this._unitnormal = n.normalized();
		
		this.unitnormal = function(){ return this._unitnormal; };
		return this._unitnormal;
	},
	
	pointIntersect : function(point){
		
		var unitnormal = this.unitnormal();
		var distance = unitnormal.dot(this._point1.minus(point));
		var position = unitnormal.multiply(distance).plus(point);
		
		return {position: position, distance: distance};
	},
	
	pointDistance : function(point){
		
		var unitnormal = this.unitnormal();
		var distance = unitnormal.dot(this._point1.minus(point));
		
		return distance;
	},
	
	rayIntersect : function(rayPosition, rayDirection){
		
		var d = rayDirection.dot(this.normal());
	
		if(d == 0) return null;
		
		var n = this._point1.minus(rayPosition).dot(this.normal());
		var t =  n/d;
		
		//if(t < 0) return null;
		
		var intersect = rayPosition.plus(rayDirection.multiply(t));
		var distance = t*rayDirection.magnitude();
		
		return {position: intersect, distance: distance};
	}
};
