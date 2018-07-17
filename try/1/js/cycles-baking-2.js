var APP = {};

APP.CyclesBakingPlay = function() {

	this.actors = [];
	this.ready = false;
	var self = this;

	this.init = function() {

		// load all our assets
		this.setupAssets();

		camera.position.z = 3;
		camera.position.x = 0;
		camera.position.y = 3;

		this.controls = new THREE.TrackballControls( camera );
    this.controls.rotateSpeed = .750;
		this.controls.zoomSpeed = .52;
		this.controls.panSpeed = .03;

		this.controls.noZoom = false;
		this.controls.noPan = true;
		this.controls.noRoll = true;
		this.controls.dynamicDampingFactor = .55;

		var self = this;
		APP.stage.cameraUpdate = function() {
			self.controls.update();
			// camera.lookAt(new THREE.Vector3(0, 2.25, 0));
			// //videoSphere.rotation.x += ((mouseY ) * .003) * Math.PI / 180;
			//
			// cameraDestY = (mouseY ) * .07 * Math.abs(camera.position.z / 4);
			// cameraDestX = ( - mouseX ) * .07 * Math.abs(camera.position.z / 4);
			//
			// camera.position.y -= (camera.position.y - cameraDestY) * .005;
			// camera.position.x -= (camera.position.x - cameraDestX) * .005;
		}

		scene.fog = null;

	}

	this.setupAssets = function() {
		APP.materials = APP.materials || {};
		APP.models = APP.models || {};

/*
		APP.materials.floorMaterial = new THREE.MeshBasicMaterial(
		{
			map: THREE.ImageUtils.loadTexture("textures/floor-cubes-cb.jpg"),
		});*/
		APP.materials.cubesMaterial = new THREE.MeshBasicMaterial(
		{
			map: THREE.ImageUtils.loadTexture("textures/4Kmap.png"),
		});
		APP.materials.lightMaterial = new THREE.MeshBasicMaterial(
		{
			color: 0xffffff,
			side: THREE.DoubleSide
		});
		// load collada assets
		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load( './models/Hotpot_blender_converted.dae', function ( collada ) {
			collada.scene.traverse( function ( child ) {
				if ( child instanceof THREE.Object3D ) {
						console.log(child)
					if(child.name == "Cube_3") {

						child.children[0].material = APP.materials.cubesMaterial;
					}


/*
					else if(child.name == "Floor") {
						child.children[0].material = APP.materials.floorMaterial;
					} else if(child.name == "Light") {
						child.children[0].material = APP.materials.lightMaterial;
					}
					*/
				}
			});
		//	collada.scene.rotation.y = -90 * Math.PI / 180;
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
	APP.stage.play = new APP.CyclesBakingPlay();
	APP.stage.init();
}
