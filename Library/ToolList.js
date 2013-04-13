Leap.ToolList = function(){};

Leap.ToolList.prototype = Leap._List.prototype;

Leap.ToolList.prototype.append = function(other){
	for(i=0; i<other.length; i++) this.push(new Leap.Tool(other[i]));
};
