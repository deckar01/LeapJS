// Reference: http://mathworld.wolfram.com/Line-PlaneIntersection.html
// A plane is described by 3 position vector that exist on the plane (plane1, plane2, plane3)

// Plane(vector plane1, vector plane2, vector plane3)
var Plane = function(plane1, plane2, plane3){

	this.x21 = plane2.x - plane1.x;
	this.x13 = plane1.x - plane3.x;
	this.x32 = plane3.x - plane2.x;
	
	this.yz23 = plane2.y*plane3.z - plane3.y*plane2.z;
	this.yz13 = plane1.y*plane3.z - plane3.y*plane1.z;
	this.yz12 = plane1.y*plane2.z - plane2.y*plane1.z;
	
	this.plane1 = new Leap.Vector(plane1);
	this.plane2 = new Leap.Vector(plane2);
	this.plane3 = new Leap.Vector(plane3);
}

// vector lineIntersect(vector linePosition, vector lineDirection)
Plane.prototype.lineIntersect = function(linePosition, lineDirection){
	
	var yz36 = this.plane3.y*lineDirection.z - lineDirection.y*this.plane3.z;
	var yz26 = this.plane2.y*lineDirection.z - lineDirection.y*this.plane2.z;
	var x6 = lineDirection.x*(this.yz23 - this.yz13 + this.yz12);
	
	var d = (this.x21*yz36 + this.x13*yz26 + x6);
	
	if(d == 0) return null;
	
	var x41 = linePosition.x - this.plane1.x;
	var x24 = this.plane2.x - linePosition.x;
	var x43 = linePosition.x - this.plane3.x;
	
	var yz34 = this.plane3.y*linePosition.z - linePosition.y*this.plane3.z;
	var yz24 = this.plane2.y*linePosition.z - linePosition.y*this.plane2.z;
	var yz14 = this.plane1.y*linePosition.z - linePosition.y*this.plane1.z;
	
	var n = -(this.x21*yz34 + this.x13*yz24 + x41*this.yz23 + this.x32*yz14 + x24*this.yz13 + x43*this.yz12);
	var t =  n/d;
	
	var x = linePosition.x + lineDirection.x*t;
	var y = linePosition.y + lineDirection.y*t;
	var z = linePosition.z + lineDirection.z*t;
	
	var distance = t*lineDirection.magnitude();
	
	return {position: new Leap.Vector([x, y, z]), distance: distance};
}