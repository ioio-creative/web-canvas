var APP = APP || {};

APP.ShaderDemo5 = function() {

	this.actors = [];
	this.ready = false;
	var self = this;

	this.init = function() {

		renderer.setClearColor( 0x000000 );

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
		camera.position.z = 2;
		camera.position.x = 2;
		camera.position.y = 1;
		camera.lookAt(new THREE.Vector3());
		scene.add(APP.cameraHolder);
		APP.zoomDivider = 12;
		APP.shaderMat = new THREE.ShaderMaterial( {
			transparent: true,
			depthTest: false,
			uniforms: {
				"uTime": { type: "f", value: 0.0 },
				"tDiffuse": { type: "t", value: THREE.ImageUtils.loadTexture("textures/particle.png") },
				"uZoomMultiplyer": { type: "f", value: APP.zoomDivider / (new THREE.Vector3().distanceTo(camera.position)) }
			},
			vertexShader: document.getElementById( 'vertexShader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent
		} );

		// APP.shaderMat.lights = true;
		APP.shaderPlane = new THREE.PointCloud(new THREE.PlaneBufferGeometry(10, .1, 417, 417), APP.shaderMat);
		APP.shaderPlane.scale.set(3, 3, 3);
		scene.add(APP.shaderPlane);
		// APP.shaderPlane.rotation.x = -55 * Math.PI / 180;
		APP.shaderPlane.position.y = 0;
		scene.add(APP.shaderPlane);


		APP.stage.cameraUpdate = function() {

		}

		window.addEventListener("mousewheel", MouseWheelHandler, false);
		function MouseWheelHandler(e) {
			// cross-browser wheel delta
			var e = window.event || e; // old IE support
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
			// camera.fov -= e.wheelDelta * .01;
			camera.position.z -= e.wheelDelta * .0005;
			if(camera.position.z < -4.5) camera.position.z = -4.5;
			APP.shaderMat.uniforms['uZoomMultiplyer'].value = APP.zoomDivider / (new THREE.Vector3().distanceTo(camera.position));
			// console.log(camera.position.z);
			camera.lookAt(new THREE.Vector3());
			// console.log(camera.fov);
			//camera.position.z -= e.wheelDelta * .01;
			camera.updateProjectionMatrix();
		}


		scene.fog = null;//new THREE.FogExp2(0, .0005);

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
		APP.time = new Date().getTime() - APP.startTime;
		APP.shaderMat.uniforms['uTime'].value = APP.time * .000000250;
		// APP.shaderPlane.rotation.y += .25 * Math.PI / 180;

		if(APP.time > APP.nextUpdate) {

			APP.nextUpdate = APP.time + APP.updateInterval;
			this.tick();
			// console.log("tick");
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
	APP.stage.play = new APP.ShaderDemo5();
	APP.stage.init();

}
