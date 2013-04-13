Leap.GestureList = function(){};

Leap.GestureList.prototype = Leap._List.prototype;

Leap.GestureList.prototype.append = function(other){

	for(i = 0; i < other.length; i++) this.push(new Leap.Gesture(other[i]));
};
