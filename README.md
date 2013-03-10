![LeapJS](http://deckar01.github.com/images/LeapJS.png)

LeapJS
======

LeapJS is a Javascript library that provides the functionality and object structure of the Leap API to assist developers who are working with the Leap Motion in a browser environment.

## Tutorial

```javascript
// Create a controller to connect to the Leap Motion
myController = new Leap.Controller("ws://localhost:6437/");

// Create a listener
myListener = new Leap.Listener();

// Listener.onFrame is called each time a frame is received
myListener.onFrame = function(controller){

    var frame = controller.frame();
    var hands = frame.hands();
    var pointables = frame.pointables();
    
    var gestures = frame.gestures();
    
    // Awesome code goes here
}

// Add the listener to the controller
myController.addListener(myListener);

// Enable the screenTap gesture
myController.enableGesture("screenTap", true);

// Listener.onConnect is called when the connection is open
myListener.onConnect = function(controller){
 
    // Calibrate the screen
    calibrate = new Leap.Calibrate(controller);
    calibrate.onComplete = function(screen){
        // Save the screen
        // Or access it later with myController.calibratedScreens()[0]
    }
}
```

## Whats new? Gestures!
* **Gesture.Type**
  * "circle"
  * "keyTap"
  * "screenTap"
  * "swipe"
* **CircleGesture** : _Gesture_
* **KeyTapGesture** : _Gesture_
* **ScreenTapGesture** : _Gesture_
* **SwipeGesture** : _Gesture_
* **Controller**
  * _void_ **enableGesture**( _string_ **type**, _Bool_ **enable** )
  * _Bool_ **isGestureEnabled**( _string_ **type** )
* **Frame**
  * _GestureList_ **gestures**()

## Whats new? Calibration!
* **Calibrate**
  * **Calibrate**( _Controller_ **controller** )
  * _virtual void_ **onComplete**( _Screen_ **screen** )
* **Screen**
  * **Screen**()
  * _float_ **distanceToPoint**( _Vector_ point )
  * { **position** : _Vector_, **distance** : _float_ } **intersect**( _Pointable_ **pointable**, _Bool_ **normalize** )
  * _Vector_ **normal**()
  * _Bool_ **isValid**()
  * _static Screen_ **invalid**()

## Where is the API?
[The API has been moved to the wiki page](https://github.com/deckar01/LeapJS/wiki)
