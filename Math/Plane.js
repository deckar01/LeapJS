// Reference: http://mathworld.wolfram.com/Line-PlaneIntersection.html
// A plane is described by 3 points on the plane (point1, point2, point3)

// Plane(vector point1, vector point2, vector point3)
var Plane = function(point1, point2, point3){

	this.x21 = point2.x - point1.x;
	this.x13 = point1.x - point3.x;
	this.x32 = point3.x - point2.x;
	
	this.yz23 = point2.y*point3.z - point3.y*point2.z;
	this.yz13 = point1.y*point3.z - point3.y*point1.z;
	this.yz12 = point1.y*point2.z - point2.y*point1.z;
	
	this.point1 = new Leap.Vector(point1);
	this.point2 = new Leap.Vector(point2);
	this.point3 = new Leap.Vector(point3);
}

// {vector, float} rayIntersect(vector rayPosition, vector rayDirection)
Plane.prototype.rayIntersect = function(rayPosition, rayDirection){
	
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