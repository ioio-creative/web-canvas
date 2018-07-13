var APP = APP || {};

APP.ShaderDemo3 = function() {

	this.actors = [];
	this.ready = false;
	var self = this;

	this.init = function() {

		APP.startTime = new Date().getTime();
		APP.updateInterval = 75;
		APP.nextUpdate = APP.updateInterval;
		APP.spawnThreshold = .3;

		APP.stageSize = 10;

		camera.setLens(13, 7.49); // 16mm bolex
		scene.fog = new THREE.FogExp2(backgroundColor, .065);

		scene.remove(camera);

		APP.cameraHolder = new THREE.Object3D();
		APP.cameraHolder.add(camera);
		scene.add(APP.cameraHolder);

		APP.shaderMat = new THREE.ShaderMaterial( {
			// wireframe: true,
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"uTime": { type: "f", value: 0.0 },
				"tExplosion": { type: "t", value: THREE.ImageUtils.loadTexture( 'textures/explosion.png' ) },
			},
			vertexShader: document.getElementById( 'vertexShader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent
		} );
		// APP.shaderMat.lights = true;
		APP.shaderPlane = new THREE.Mesh(new THREE.PlaneGeometry(160, 100, 164, 164), APP.shaderMat);
		APP.shaderPlane.rotation.x = -55 * Math.PI / 180;
		APP.shaderPlane.position.y = 12;
		scene.add(APP.shaderPlane);

		// setup initial camera position
		camera.position.z = 85;
		camera.position.x = 0;
		camera.position.y = 0;
		// camera.lookAt(new THREE.Vector3(0, 2.5, 0));

		APP.stage.cameraUpdate = function() {

		}

		scene.fog = null;//new THREE.FogExp2(backgroundColor, .015);

		// load all our assets
		this.setupAssets();
	}

	this.setupAssets = function() {

		APP.materials = APP.materials || {};
		APP.models = APP.models || {};

		self.ready = true;

	}

	this.tick = function() {

	}

	this.update = function() {

		// update the time
		// APP.shaderPlane.rotation.y += .25 * Math.PI / 180;
		APP.time = new Date().getTime() - APP.startTime;
		APP.shaderMat.uniforms['uTime'].value = APP.time * .00010;
		if(APP.time > APP.nextUpdate) {
			
			APP.nextUpdate = APP.time + APP.updateInterval;
			this.tick();
			console.log("tick");
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
	APP.stage.play = new APP.ShaderDemo3();
	APP.stage.init();

}
