THREE.Actor = function() {
	// extend Object3D
	THREE.Object3D.apply(this, arguments);
	// flag us as an actor
	this.isActor = true;

	this.update = function( delta ) {
		console.log("Actor updated.");
	}
}

THREE.Actor.prototype = Object.create(THREE.Object3D.prototype);
THREE.Actor.prototype.constructor = THREE.Actor;