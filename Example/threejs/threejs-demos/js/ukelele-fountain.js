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

APP.UkeleleFountainPlay = function() {

	this.actors = [];
	this.ready = false;
	var self = this;

	this.init = function() {
		
		// load all our assets
		this.setupAssets();

		camera.position.z = 5;

		// ambient light
		var ambient = new THREE.AmbientLight( backgroundColor );
		scene.add( ambient );

		var pointLight = new THREE.PointLight({ color: 0xffcc99 });
		pointLight.position.y = -1;
		scene.add(pointLight);

	}

	this.setupAssets = function() {
		APP.materials = APP.materials || {};
		APP.models = APP.models || {};

		APP.materials.ukeMaterial = new THREE.MeshPhongMaterial(
		{ 
			map: THREE.ImageUtils.loadTexture("textures/ukelele.jpg"),
			color: 0xffffff,
			ambient: 0x666666,
			side: THREE.DoubleSide,
			shininess: 100
		});

		// load collada assets
		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load( './models/ukelele.dae', function ( collada ) {
			collada.scene.traverse( function ( child ) {
				if ( child instanceof THREE.Object3D ) {
					if(child.name == "Ukelele") {
						child.children[0].material = APP.materials.ukeMaterial;
						APP.models.ukeModel = child;
						self.ready = true;
					}
				}
			});
		});
	}

	this.update = function() {
		if(this.ready) {
			for(var i = 0; i < this.actors.length; i++) {
				this.actors[i].update();
				if(this.actors[i].mesh.position.y < -10) {
					this.remove(this.actors[i]);
				}
			}
			if(this.actors.length < 700) {
				for(i = 0; i < 3; i++) {
					var size = Math.random() + .1;
					this.add(new APP.UkeleleActor({ torque: new THREE.Vector3(Math.random() * 6 - 3, Math.random() * 6 - 3, 0), velocity: new THREE.Vector3(Math.random() * .1 - .05, .15, Math.random() * .1 - .05) }));					
				}
			}			
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
	APP.stage.play = new APP.UkeleleFountainPlay();
	APP.stage.init();
}
