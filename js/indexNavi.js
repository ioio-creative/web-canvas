var util = AFRAME.utils;

var CLAMP_VELOCITY = 0.00001;
var MAX_DELTA = 0.2;
var forward = false;

AFRAME.registerComponent('spacebarnavi', {
  schema: {
    enabled: {default: true},
    fly: {default: false}
  },

  init: function() {
      var data = this.data;
      var el = this.el;
      var self = this;
      this.position = {};
      this.velocity = new THREE.Vector3(0,0,0);
      this.acceleration = 65;
      this.easing = 20;

      console.log(this['velocity']);

      //Add keyboard listener.
      if (data.enabled) {
        console.log("breakPoint 2!");
        window.addEventListener('keydown', function (evt) {
          if (evt.code === 'Space' || evt.keyCode === 32) {
            forward = true;
            console.log(forward);
          }
       });
       window.addEventListener('keyup', function (evt) {
         if (evt.code === 'Space' || evt.keyCode === 32) {
           forward = false;
           console.log(forward);
         }
       });
      }
    },

    tick: function (time, delta){
      var currentPosition;
      var data = this.data;
      var el = this.el;
      var movementVector;
      var position = this.position;
      var velocity = this.velocity;

      // if (!velocity[data.adAxis] && !velocity[data.wsAxis] &&
      //     isEmptyObject(this.keys)) { return; }

      // Update velocity.
      delta = delta / 1000;
      this.updateVelocity(delta);

      //if (!velocity[data.adAxis] && !velocity[data.wsAxis]) { return; }

      // Get movement vector and translate position.
      //currentPosition = el.getAttribute('position');
      movementVector = this.getMovementVector(delta);
      el.object3D.position.add(movementVector);
      if (forward) {
        console.log(el.object3D.position);
      }
    },

    updateVelocity: function (delta) {
      var acceleration;
      var data = this.data;
      var velocity = this.velocity;
      var wsAxis;
      var wsSign;

      wsAxis = 'z';

      // If FPS too low, reset velocity.
      if (delta > MAX_DELTA) {
        velocity[wsAxis] = 0;
        return;
      }

      // Decay velocity.
      if (velocity[wsAxis] !== 0) {
        velocity[wsAxis] -= velocity[wsAxis] * this.easing * delta;
      }

      // Clamp velocity easing.
      if (Math.abs(velocity[wsAxis]) < CLAMP_VELOCITY) { velocity[wsAxis] = 0; }

      if (!data.enabled) { return; }

      // Update velocity using keys pressed.
      acceleration = this.acceleration;
      if (data.enabled) {
        if (forward) {
          velocity[wsAxis] -= acceleration * delta;
          //console.log(velocity);
        }
      }
  },

  getMovementVector: (function () {
    var directionVector = new THREE.Vector3(0, 0, 0);
    var rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');

    return function (delta) {
      var rotation = this.el.getAttribute('rotation');
      var velocity = this.velocity;
      var xRotation;

      directionVector.copy(velocity);
      directionVector.multiplyScalar(delta);

      // Absolute.
      if (!rotation) { return directionVector; }

      xRotation = this.data.fly ? rotation.x : 0;

      // Transform direction relative to heading.
      rotationEuler.set(THREE.Math.degToRad(xRotation), THREE.Math.degToRad(rotation.y), 0);
      directionVector.applyEuler(rotationEuler);
      return directionVector;
    };
  })()

});//registerComponent
