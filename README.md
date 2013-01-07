LeapJS
======

LeapJS is a Javascript library that provides the functionality and object structure of the Leap API to assist developers who are working with the Leap Motion in a browser environment.

**Leap**
* _string_ **Version**
* **Controller**
  * **Controller**( _string_ **connection** )
  * _Frame_ **frame**( _Int_ **index** )
  * _void_ **addListener**( _Listener_ **listener** )
  * _void_ **removeListener**( _Listener_ **listener** )
  * _void_ **startEmptyFrames**()
  * _void_ **stopEmptyFrames**()
* **Listener**
  * **Listener**()
  * _void_ **onConnect**( _Controller_ **controller** )
  * _void_ **onDisconnect**( _Controller_ **controller** )
  * _void_ **onExit**( _Controller_ **controller** )
  * _void_ **onFrame**( _Controller_ **controller** )
  * _void_ **onInit**( _Controller_ **controller** )
* **Frame**
  * _string_ **id**
  * _string_ **timestamp**
  * _FingerList_ **fingers**
  * _ToolList_ **tools**
  * _PointableList_ **pointables**
  * _HandList_ **hands**
  * _string_ **tostring**()
  * _Bool_ **isValid**
  * _Finger_ **finger**( _string_ **id** )
  * _Hand_ **hand**( _string_ **id** )
  * _Pointable_ **pointable**( _string_ **id** )
  * _Tool_ **tool**( _string_ **id** )
* **Hand**
  * **Hand**()
  * **Hand**( _Hand_ **other** )
  * _Frame_ **frame**
  * _string_ **id**
  * _FingerList_ **fingers**
  * _ToolList_ **tools**
  * _PointableList_ **pointables**
  * _Vector_ **direction**
  * _Vector_ **palmNormal**
  * _Vector_ **palmPosition**
  * _Vector_ **palmVelocity**
  * _Vector_ **sphereCenter**
  * _float_ **sphereRadius**
  * _string_ **tostring**()
  * _Bool_ **isValid**
  * _Finger_ **finger**( _string_ **id** )
  * _Pointable_ **pointable**( _string_ **id** )
  * _Tool_ **tool**( _string_ **id** )
* **HandList**
  * **HandList**()
  * **HandList**( _HandList_ **other** )
  * _Hand_ **operator[]**
  * _void_ **append**( _HandList_ **other** )
  * _int_ **count**()
  * _Bool_ **empty**()
* **Finger** : _Pointable_
  * **Finger**()
  * **Finger**( _Pointable_ **other** )
* **FingerList**
  * **FingerList**()
  * **FingerList**( _FingerList_ **other** )
  * _Finger_ **operator[]**
  * _void_ **append**( _FingerList_ **other** )
  * _int_ **count**()
  * _Bool_ **empty**()
* **Tool** : _Pointable_
  * **Tool**()
  * **Tool**( _Pointable_ **other** )
* **ToolList**
  * **ToolList**()
  * **ToolList**( _ToolList_ **other** )
  * _Tool_ **operator[]**
  * _void_ **append**( _ToolList_ **other** )
  * _int_ **count**()
* **Pointable**
  * **Pointable**()
  * **Pointable**( _Pointable_ **other** ) 
  * _Frame_ **frame**
  * _Hand_ **hand**
  * _string_ **id**
  * _Vector_ **direction**
  * _Vector_ **tipPosition**
  * _Vector_ **tipVelocity**
  * _float_ **length**
  * _float_ **width**
  * _Bool_ **isFinger**
  * _Bool_ **isTool**
  * _Bool_ **isValid**
  * _string_ **tostring**()
* **PointableList**
  * **PointableList**()
  * **PointableList**( _PointableList_ **other** )
  * _Pointable_ **operator[]**
  * _void_ **append**( _PointableList_ **other** )
  * _void_ **append**( _FingerList_ **other** )
  * _void_ **append**( _ToolList_ **other** )
  * _int_ **count**()
* **Vector**
  * **Vector**()
  * **Vector**( _Vector_ **other** )
  * **Vector**( [ _float_ **x**, _float_ **y**, _float_ **z** ] )
  * _float_ **x**
  * _float_ **y**
  * _float_ **z**
  * _float_ **angleTo**( _Vector_ **other** )
  * _Vector_ **cross**( _Vector_ **other** )
  * _float_ **distanceTo**( _Vector_ **other** )
  * _float_ **dot**( _Vector_ **other** )
  * _Vector_ **plus**( _Vector_ **other** )
  * _Vector_ **minus**( _Vector_ **other** )
  * _Vector_ **multiply**( _float_ **scalar** )
  * _Vector_ **dividedBy**( _float_ **scalar** )
  * _float_ **magnitude**()
  * _float_ **magnitudeSquared**()
  * _Vector_ **normalized**()
  * _float_ **pitch**()
  * _float_ **roll**()
  * _float_ **yaw**()
  * _string_ **tostring**()
  * _static Vector_ **backward**()
  * _static Vector_ **down**()
  * _static Vector_ **forward**()
  * _static Vector_ **left**()
  * _static Vector_ **right**()
  * _static Vector_ **up**()
  * _static Vector_ **xAxis**()
  * _static Vector_ **yAxis**()
  * _static Vector_ **zAxis**()
  * _static Vector_ **zero**()
* **Matrix**
  * **Matrix**()
  * **Matrix**( _Matrix_ **other** )
  * **Matrix**( [ _Vector_ **xBasis**, _Vector_ **yBasis**, _Vector_ **zBasis** ] )
  * **Matrix**( [ _Vector_ **xBasis**, _Vector_ **yBasis**, _Vector_ **zBasis**, _Vector_ **origin** ] )
  * _Vector_ **xBasis**
  * _Vector_ **yBasis**
  * _Vector_ **zBasis**
  * _Vector_ **origin**
  * _void_ **setRotation**( _Vector_ **axis**, _float_ **angle** )
  * _void_ **transformPoint**( _Vector_ **data** )
  * _void_ **transformDirection**( _Vector_ **data** )
  * _Matrix_ **times**( _Matrix_ **other** )
  * _float[]_ **toArray3x3**()
  * _void_ **toArray3x3**( _float[]_ **output** )
  * _float[]_ **toArray4x4**()
  * _void_ **toArray4x4**( _float[]_ **output** )
  * _string_ **tostring**()
  * _Bool_ **compare**( _Matrix_ **other** )
  * _static Matrix_ **identity**()
