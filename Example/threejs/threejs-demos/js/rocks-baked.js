var APP = {};

APP.RocksBakedPlay = function() {

	this.actors = [];
	this.ready = false;
	var self = this;

	this.init = function() {

		// load all our assets
		this.setupAssets();

		camera.position.z = 5;
		camera.position.x = 0;
		camera.position.y = 5;

		this.controls = new THREE.TrackballControls( camera );
    this.controls.rotateSpeed = .750;
		this.controls.zoomSpeed = .52;
		this.controls.panSpeed = .03;

		this.controls.noZoom = false;
		this.controls.noPan = true;
		this.controls.noRoll = true;
		this.controls.dynamicDampingFactor = .55;

		var self =this;

		APP.stage.cameraUpdate = function() {

			self.controls.update();
		}

		scene.fog = null;

	}

	this.setupAssets = function() {
		APP.materials = APP.materials || {};
		APP.models = APP.models || {};


		APP.materials.floorMaterial = new THREE.MeshBasicMaterial(
		{
			map: THREE.ImageUtils.loadTexture("textures/floor-rocks.jpg"),
		});
		APP.materials.rocksMaterial = new THREE.MeshBasicMaterial(
		{
			map: THREE.ImageUtils.loadTexture("textures/rocks-cb.jpg"),
		});
		APP.materials.lightMaterial = new THREE.MeshBasicMaterial(
		{
			color: 0x1EE700
		});
		// load collada assets
		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load( './models/floor-rocks.dae', function ( collada ) {
			console.log(collada.scene);
			collada.scene.traverse( function ( child ) {
				if ( child instanceof THREE.Object3D ) {
					if(child.name == "Rocks") {
						child.children[0].material = APP.materials.rocksMaterial;
					} else if(child.name == "Floor") {
						child.children[0].material = APP.materials.floorMaterial;
					} else if(child.name == "Bullet") {
						child.children[0].material = APP.materials.lightMaterial;
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
	APP.stage.play = new APP.RocksBakedPlay();
	APP.stage.init();
}
