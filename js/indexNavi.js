AFRAME.registerComponent('spacebarnavi', {
  schema: {type: 'boolean', default: true},

  init: function() {
      var data = this.data;
      var el = this.el;
      var self = this;
      this.position = {};
      console.log("breakPoint 1!");

      //Add keyboard listener.
      if (data) {
        console.log("breakPoint 2!");
        window.addEventListener('keydown', (function (evt) {
          if (evt.code === 'Space' || evt.keyCode === 32) {
            var currentPosition = el.getAttribute('position');
            var position = this.position;
            position.z = currentPosition.z + 0.1;
            el.setAttribute('position', position);
            //el.object3D.position.z -= 0.1 ;

          }
       }).bind(self));
      }
    },

    tick: function (time, delta){

    }
});
