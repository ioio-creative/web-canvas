var APP = APP || {};

THREE.Utils = {
    cameraLookDir: function(camera) {
        var vector = new THREE.Vector3(0, 0, -1);
        vector.applyEuler(camera.rotation, camera.rotation.order);
        return vector;
    }
};
APP.BakedWithSpecular = function() {

	this.actors = [];
	this.ready = false;
	var self = this;

	this.init = function() {

		// load all our assets
		this.setupAssets();

		var pitchObject = new THREE.Object3D();
		pitchObject.add(camera);

		var yawObject = new THREE.Object3D();
		yawObject.add(pitchObject);

		var cameraHolder = new THREE.Object3D();
		cameraHolder.add(yawObject);
		scene.add(cameraHolder);

		cameraHolder.position = new THREE.Vector3(0, 3.5, 0);
		cameraHolder.rotation.y = 90 * Math.PI / 180;
		var walkSpeed = .001;
		APP.stage.cameraUpdate = function() {

			yawObject.rotation.y -= (yawObject.rotation.y + (mouseX * .5) * Math.PI / 180) * .05;
			pitchObject.rotation.x -= (pitchObject.rotation.x + (mouseY * .5) * Math.PI / 180) * .05;

			var hDir = THREE.Utils.cameraLookDir(yawObject);
			var vDir = THREE.Utils.cameraLookDir(pitchObject);
			if(key.isPressed('W')) {
				cameraHolder.position.add(hDir.multiplyScalar(walkSpeed));
			}
			if(key.isPressed('S')) {
				cameraHolder.position.add(hDir.multiplyScalar(-walkSpeed));
			}
			if(key.isPressed('A')) {
				//
			}
			if(key.isPressed('D')) {
				cameraHolder.translateX(1);
			}
			if(key.isPressed('Q')) {
				cameraHolder.translateY(-walkSpeed);
			}
			if(key.isPressed('E')) {
				cameraHolder.translateY(walkSpeed);
			}
		}
		scene.fog = null;

	}

	this.setupAssets = function() {
		APP.materials = APP.materials || {};
		APP.models = APP.models || {};


		APP.materials.floorMaterial = new THREE.MeshBasicMaterial(
		{
			map: THREE.ImageUtils.loadTexture("textures/tiled-room-walls-lb.png"),
		});
		APP.materials.lightMaterial = new THREE.MeshBasicMaterial(
		{
			color: 0xffffff
		});
		// load collada assets
		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load( './models/tiled-room.dae', function ( collada ) {
			collada.scene.traverse( function ( child ) {
				if ( child instanceof THREE.Object3D ) {
					if(child.name == "target-cube") {
						child.children[0].material = APP.materials.floorMaterial;
					} else if(child.name == "Light") {
						child.children[0].material = APP.materials.lightMaterial;
					} else if(child.name == "Plane") {
						collada.scene.remove(child);
					}
				}
			});
			collada.scene.rotation.y = -90 * Math.PI / 180;
			scene.add(collada.scene);
		});
	}

	this.update = function() {
		if(this.ready) {

		}

	}

	this.add = function( actor ) {
		actor.init();
		this.actors.push(actor);
	}

	this.remove = function( actor ) {
		// remove actor from list
		var i = this.actors.indexOf(actor);
		if(i > -1) {
			this.actors.splice(i, 1);
		}
		actor.destroy();
	}

}

window.onload = function() {
	APP.stage = new THREE.StageManager();
	APP.stage.play = new APP.BakedWithSpecular();
	APP.stage.init();
}
