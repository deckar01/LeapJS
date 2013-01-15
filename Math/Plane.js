// Reference: http://mathworld.wolfram.com/Line-PlaneIntersection.html
// A plane is described by 3 points on the plane (point1, point2, point3)

// Plane(vector point1, vector point2, vector point3)
var Plane = function(point1, point2, point3){
	
	this.point1 = new Leap.Vector(point1);
	this.point2 = new Leap.Vector(point2);
	this.point3 = new Leap.Vector(point3);
}

// vector normal()
Plane.prototype.normal = function(){
	
	var x21 = this.point2.x - this.point1.x;
	var y21 = this.point2.y - this.point1.y;
	var z21 = this.point2.z - this.point1.z;
	
	var x31 = this.point3.x - this.point1.x;
	var y31 = this.point3.y - this.point1.y;
	var z31 = this.point3.z - this.point1.z;
	
	var x = y21*z31 - y31*z21;
	var y = x21*z31 - x31*z21;
	var z = x21*y31 - x31*y21;
    
    if(x==0 && y==0 && z==0) this._normal = null;
	else this._normal = new Leap.Vector([x, y, z]);
	
	this.normal = function(){ return this._normal; };
	return this._normal;
}

// vector unitnormal()
Plane.prototype.unitnormal = function(){
    
    var n = this.normal();
    if(n==null) return null;
    
	this._unitnormal = n.normalized();
	
	this.unitnormal = function(){ return this._unitnormal; };
	return this._unitnormal;
}

// { vector, float } pointIntersect( vector point )
Plane.prototype.pointIntersect = function(point){
	
    var u = this.unitnormal();
    var d = u.dot(this.point1.minus(point));
    var p = u.multiply(d).plus(point);
    
    return {position: p, distance: d};
	
}

// rayIntersection memo
Plane.prototype._rayIntersectCommon = function(){
	
	this.x21 = this.point2.x - this.point1.x;
	this.x13 = this.point1.x - this.point3.x;
	this.x32 = this.point3.x - this.point2.x;
	
	this.yz23 = this.point2.y*point3.z - this.point3.y*point2.z;
	this.yz13 = this.point1.y*point3.z - this.point3.y*point1.z;
	this.yz12 = this.point1.y*point2.z - this.point2.y*point1.z;
	
	this._rayIntersectCommon = function(){};
}

// { vector, float } rayIntersect( vector rayPosition, vector rayDirection )
Plane.prototype.rayIntersect = function(rayPosition, rayDirection){
	
	this._rayIntersectCommon();
	
	var yz36 = this.point3.y*rayDirection.z - rayDirection.y*this.point3.z;
	var yz26 = this.point2.y*rayDirection.z - rayDirection.y*this.point2.z;
	var x6 = rayDirection.x*(this.yz23 - this.yz13 + this.yz12);
	
	var d = (this.x21*yz36 + this.x13*yz26 + x6);
	
	if(d == 0) return null;
	
	var x41 = rayPosition.x - this.point1.x;
	var x24 = this.point2.x - rayPosition.x;
	var x43 = rayPosition.x - this.point3.x;
	
	var yz34 = this.point3.y*rayPosition.z - rayPosition.y*this.point3.z;
	var yz24 = this.point2.y*rayPosition.z - rayPosition.y*this.point2.z;
	var yz14 = this.point1.y*rayPosition.z - rayPosition.y*this.point1.z;
	
	var n = (this.x21*yz34 + this.x13*yz24 + x41*this.yz23 + this.x32*yz14 + x24*this.yz13 + x43*this.yz12);
	var t =  -n/d;
	
	if(t < 0) return null;
	
	var x = rayPosition.x + rayDirection.x*t;
	var y = rayPosition.y + rayDirection.y*t;
	var z = rayPosition.z + rayDirection.z*t;
	
	var distance = t*rayDirection.magnitude();
	
	return {position: new Leap.Vector([x, y, z]), distance: distance};
}
