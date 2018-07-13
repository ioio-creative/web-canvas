var APP = {};

APP.UkeleleActor = function( options ) {

	var self = this;
	this.alive = true;
	this.mesh;
	this.options = options || {};

	//typeof(this.options.position) == 'undefined' ? this.options.position = new THREE.Vector3(0, 0, 0) : false;
	this.init = function() {
		
		this.mat = APP.materials.ukeMaterial;

		this.options.position = def( this.options.position, new THREE.Vector3(0, 0, 0) );
		this.options.velocity = def( this.options.velocity, new THREE.Vector3(Math.random() *  .25 - .125, Math.random() *  .25 - .125, Math.random() *  .25 - .125) );
		this.options.torque = def( this.options.torque, new THREE.Vector3(0, 0, 0) );
		this.options.size = def( this.options.size, new THREE.Vector3(1, 1, 1) );

		this.mesh = APP.models.ukeModel.clone();
		this.mesh.position = this.options.position;
		scene.add( this.mesh );
	}

	this.destroy = function() {
		scene.remove(this.mesh);
	}

	this.update = function() {
		self.options.velocity.add( new THREE.Vector3(0, -.0025, 0) );
		self.mesh.rotation.x += this.options.torque.x * Math.PI / 180;
		self.mesh.rotation.y += this.options.torque.y * Math.PI / 180;
		self.mesh.rotation.z += this.options.torque.z * Math.PI / 180;
		self.mesh.position.add(self.options.velocity);

	}

};

APP.CyclesBakingPlay = function() {

	this.actors = [];
	this.ready = false;
	var self = this;

	this.init = function() {
		
		// load all our assets
		this.setupAssets();

		camera.position.z = 5;
		camera.position.x = 0;
		camera.position.y = 11;

		APP.stage.cameraUpdate = function() {

			camera.lookAt(new THREE.Vector3(0, 2.25, 0));
			//videoSphere.rotation.x += ((mouseY ) * .003) * Math.PI / 180;

			cameraDestY = (mouseY ) * .07 * Math.abs(camera.position.z / 4);
			cameraDestX = ( - mouseX ) * .07 * Math.abs(camera.position.z / 4);

			camera.position.y -= (camera.position.y - cameraDestY) * .005;
			camera.position.x -= (camera.position.x - cameraDestX) * .005;
		}

		scene.fog = null;

	}

	this.setupAssets = function() {
		APP.materials = APP.materials || {};
		APP.models = APP.models || {};

		APP.materials.monkeyMaterial = new THREE.MeshBasicMaterial(
		{ 
			map: THREE.ImageUtils.loadTexture("textures/monkey-cb.jpg"),
		});
		APP.materials.floorMaterial = new THREE.MeshBasicMaterial(
		{ 
			map: THREE.ImageUtils.loadTexture("textures/floor-cb.jpg"),
		});
		APP.materials.cubeMaterial = new THREE.MeshBasicMaterial(
		{ 
			map: THREE.ImageUtils.loadTexture("textures/cube-cb.jpg"),
		});
		APP.materials.lightMaterial = new THREE.MeshBasicMaterial(
		{ 
			color: 0xffffff,
			side: THREE.DoubleSide
		});
		// load collada assets
		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load( './models/cycles-bake-demo.dae', function ( collada ) {
			collada.scene.traverse( function ( child ) {
				if ( child instanceof THREE.Object3D ) {
					if(child.name == "Monkey") {
						child.children[0].material = APP.materials.monkeyMaterial;
					} else if(child.name == "Cube") {
						child.children[0].material = APP.materials.cubeMaterial;
					} else if(child.name == "Floor") {
						child.children[0].material = APP.materials.floorMaterial;
					} else if(child.name == "Light") {
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
	APP.stage.play = new APP.CyclesBakingPlay();
	APP.stage.init();
}
