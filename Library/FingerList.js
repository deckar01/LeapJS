Leap.FingerList = function(){};

Leap.FingerList.prototype = Leap._List.prototype;

Leap.FingerList.prototype.append = function(other){
	for(i = 0; i < other.length; i++) this.push(new Leap.Finger(other[i]));
};
