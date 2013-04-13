Leap.HandList = function(){};

Leap.HandList.prototype = Leap._List.prototype;

Leap.HandList.prototype.append = function(other){

	for(i = 0; i < other.length; i++) this.push(new Leap.Hand(other[i]));
};
