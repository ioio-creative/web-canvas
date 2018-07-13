var APP = APP || {};

APP.FlappyBirdPlay = function() {

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

			camera.lookAt(new THREE.Vector3(-1, 2.25, 0));
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
		var loader = new THREE.JSONLoader();
		this.animation = {};
		loader.load('models/flappy-bird.js', function(geometry, materials) {

			var mesh, material;

			// create a mesh
			mesh = new THREE.SkinnedMesh(
				geometry,
				new THREE.MeshFaceMaterial(materials)
			);

			// define materials collection
			material = mesh.material.materials;

			// enable skinning
			for (var i = 0; i < materials.length; i++) {
				var mat = materials[i];
				mat.skinning = true;
				mat.shading = THREE.FlatShading;
			}

			for(var i = 0; i < 250; i++) {
				var m = mesh.clone();
				m.position.x = Math.random() * 100 - 50;
				m.position.y = Math.random() * 100 - 50;
				m.position.z = Math.random() * 100 - 50;
				// add animation data to the animation handler
				THREE.AnimationHandler.add(m.geometry.animations[0]);
				scene.add(m);

				// create animation
				self.animation = new THREE.Animation(
					m,
					'ArmatureAction',
					THREE.AnimationHandler.CATMULLROM
				);

				// play the anim
				self.animation.play(Math.random()); 				
			}

			
			
			

			
			APP.pl = new THREE.PointLight(0xffffff, 5);
			APP.pl.position.y = 5;
			APP.pl.position.z = 2;
			scene.add(APP.pl);

			APP.al = new THREE.AmbientLight(0xffffff);
			scene.add(APP.al);
			APP.bird = mesh;
			self.ready = true;
		});
	}

	this.update = function() {
		if(this.ready) {
			THREE.AnimationHandler.update(.01);
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
	APP.stage.play = new APP.FlappyBirdPlay();
	APP.stage.init();
}
