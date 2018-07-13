var APP = {};
backgroundColor = 0x111111;

APP.PaperChasePlay = function() {

	this.actors = [];
	this.ready = false;
	var self = this;

	this.init = function() {

		// load all our assets
		this.setupAssets();

		camera.position.z = 15;
		camera.position.x = 0;
		camera.position.y = 8;

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
			map: THREE.ImageUtils.loadTexture("textures/paper-chase/paperchase-floor.jpg"),
		});
		APP.materials.paperMaterial = new THREE.MeshBasicMaterial(
		{
			map: THREE.ImageUtils.loadTexture("textures/paper-chase/paperchase-paper.jpg"),
			transparent: true
		});
		APP.materials.lampMaterial = new THREE.MeshBasicMaterial(
		{
			map: THREE.ImageUtils.loadTexture("textures/paper-chase/paperchase-light.jpg"),
		});
		APP.materials.lightbulbMaterial = new THREE.MeshBasicMaterial(
		{
			color: 0xffffff,
			side: THREE.DoubleSide
		});
		// load collada assets

		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load( './models/paper-chase.dae', function ( collada ) {
			collada.scene.traverse( function ( child ) {
				if ( child instanceof THREE.Object3D ) {
					if(child.name == "ComputerPaper" || child.name.split('_')[0] == "ComputerPaper") {
						child.children[0].material = APP.materials.paperMaterial;
					} else if($.inArray(child.name, ['Cylinder', 'Light_000', 'Cylinder_001', 'Light_001']) > -1) {
						child.children[0].material = APP.materials.lampMaterial;
					} else if(child.name == "Floor") {
						child.children[0].material = APP.materials.floorMaterial;
					} else if(child.name == "Bulbs" || child.name == "Bulbs_001") {
						child.children[0].material = APP.materials.lightbulbMaterial;
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
	APP.stage.play = new APP.PaperChasePlay();
	APP.stage.init();
}
