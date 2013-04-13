Leap.PointableList = function(){};

Leap.PointableList.prototype = Leap._List.prototype;

Leap.PointableList.prototype.append = function(other){
	for(i=0; i<other.length; i++) this.push(new Leap.Pointable(other[i]));
};
