var APP = APP || {};

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

APP.ShaderDemo6 = function() {

	this.actors = [];
	this.ready = false;
	this.resolution = getParameterByName("resolution");

	console.log(this.resolution);
	var self = this;

	this.init = function() {

		APP.stage.animate = function() { 
			APP.stage.play.update(); 
			// APP.stage.cameraUpdate();
			requestAnimationFrame( APP.stage.animate ); 
		};

		// renderer.setClearColor( 0x000000 );
		// APP.disableComposer = true;
		APP.startTime = new Date().getTime();
		APP.updateInterval = 4;
		APP.nextUpdate = APP.updateInterval;
		APP.spawnThreshold = .3;

		APP.stageSize = 10;

		camera.setLens(30, 7.49); // 16mm bolex
		scene.fog = new THREE.FogExp2(backgroundColor, .065);

		scene.remove(camera);

		APP.cameraHolder = new THREE.Object3D();
		APP.cameraHolder.add(camera);
		camera.position.z = .9;
		camera.position.x = 0;
		camera.position.y = 0;
		camera.lookAt(new THREE.Vector3());
		scene.add(APP.cameraHolder);

		scene.fog = null;


		controls = new THREE.TrackballControls( camera );

		controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 2.2;
		controls.panSpeed = .3;

		controls.noZoom = false;
		controls.noPan = false;
		controls.noRoll = true;
		controls.noRotate = true;

		// controls.staticMoving = true;
		controls.dynamicDampingFactor = 0.3;

		var width = this.resolution || 2048,
			height = this.resolution || 2048;

		// this is a static perlin noise texture for initial seeding
		APP.noiseTex = THREE.ImageUtils.loadTexture("textures/2channel-perlin-2048.jpg", THREE.UVMapping, function() {
			APP.ready = true;
		});
		APP.noiseTex.wrapS = APP.noiseTex.wrapT = THREE.RepeatWrapping;
		APP.noiseTex.minFilter = APP.noiseTex.magFilter = THREE.LinearFilter;

		// these two render targets are the FBO's that we will ping-pong between
		APP.front = new THREE.WebGLRenderTarget(width, height, { minFilter: THREE.LinearFilter, maxFilter: THREE.LinearFilter, stencilBuffer: false, depthBuffer: false });
		APP.back = new THREE.WebGLRenderTarget(width, height, { minFilter: THREE.LinearFilter, maxFilter: THREE.LinearFilter, stencilBuffer: false, depthBuffer: false });
		APP.front.wrapS = APP.front.wrapT = THREE.RepeatWrapping;
		APP.back.wrapS = APP.back.wrapT = THREE.RepeatWrapping;
		
		// setup a reference to hold whatever the current RT is
		APP.currentFront = APP.front; 
		APP.currentTarget = APP.front;

		// create a secret scene and camera to use for render textures
		APP.rtScene = new THREE.Scene();
		APP.rtCamera = new THREE.OrthographicCamera( width / -2, width / 2, height / 2, height / -2, -10000, 10000 );
		APP.rtScene.add( APP.rtCamera );

		var ar = window.innerWidth / window.innerHeight;

		var planeSize = window.innerWidth;

		// scene.remove(camera);

		var sw = window.innerWidth * window.devicePixelRatio,
			sh = window.innerHeight * window.devicePixelRatio;

		// camera = new THREE.OrthographicCamera( Math.floor(sw * -.5), Math.floor(sw * .5), Math.floor(sh * -.5), Math.floor(sh * .5), -10000, 10000 );
		// scene.add(camera);

		// this is the shader material we'll use for our simulation, it will
		// be rendered alternately to the front or back render targets
		APP.simulationShader = new THREE.ShaderMaterial( {
			uniforms: {
				"uTime": { type: "f", value: 0.0 },
				"uSize": { type: "f", value: width },
				"tNoise": { type: "t", value: APP.noiseTex },
				"tCurrentFront": { type: "t", value: null }
			},
			vertexShader: document.getElementById( 'vertexShaderSimulation' ).textContent,
			fragmentShader: document.getElementById( 'fragmentShaderSimulation' ).textContent
		} );

		// create a plane to texture with our shader so we can take pictures of it
		// with our render texture stuff
		APP.rtPlane = new THREE.Mesh( new THREE.PlaneBufferGeometry(width, height), APP.simulationShader );
		APP.rtPlane.position.z = -100;
		APP.rtScene.add( APP.rtPlane );

		// now render this out and see what happens
		// renderer.render( APP.rtScene, APP.rtCamera, APP.currentTarget, true );




		// this is the shader material we use to display what's happening in
		// the GPU simulation above
		APP.displayShader = new THREE.ShaderMaterial( {
			uniforms: {
				"uTime": { type: "f", value: 0.0 },
				"tDiffuse": { type: "t", value: APP.currentFront }
			},
			vertexShader: document.getElementById( 'vertexShaderDisplay' ).textContent,
			fragmentShader: document.getElementById( 'fragmentShaderDisplay' ).textContent
		} );

		APP.displayShader.minFilter = APP.displayShader.maxFilter = THREE.NearestFilter;

		// here's a flat plane we'll render to
		APP.flatPlane = new THREE.Mesh(new THREE.SphereGeometry(.25, 128, 128), APP.displayShader);
		APP.flatPlane.position.z = 0;
		APP.flatPlane.rotation.x = 90 * Math.PI / 180;
		scene.add(APP.flatPlane);

		APP.stage.cameraUpdate = function() {
			

			// if( Math.abs((mouseX * 2) / window.innerWidth) > .15 || Math.abs((mouseY * 2) / window.innerHeight) > .1 ) {
			// 	cameraDestY = (mouseY * 2.) * .07 * Math.abs(camera.position.z / 4);
			// 	cameraDestX = ( - mouseX * 2.) * .07 * Math.abs(camera.position.z / 4);

			// 	camera.position.y += (camera.position.y - cameraDestY) * .0005;
			// 	camera.position.x += (camera.position.x - cameraDestX) * .0005;	
			// }

		}



		// window.addEventListener("mousewheel", MouseWheelHandler, false);
		// function MouseWheelHandler(e) {
		// 	// cross-browser wheel delta
		// 	var e = window.event || e; // old IE support
		// 	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

		// 	camera.position.z -= e.wheelDelta * .0005;
		// 	// if(camera.position.z < -4.5) camera.position.z = -4.5;
			
		// 	camera.updateProjectionMatrix();
		// }


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

		if(APP.ready) {

			// render the simulation shader to the current render target
			renderer.render( APP.rtScene, APP.rtCamera, APP.currentTarget, true );
			

			// renderer.render( scene, camera );
			// swap front for back and vice versa
			// var tmp = APP.currentFront;

			// if we used "front" as the source before, use back
			if( APP.currentTarget === APP.front ) {
				APP.simulationShader.uniforms['tCurrentFront'].value = APP.front;
				APP.currentTarget = APP.back;
				APP.currentFront = APP.front;
			} else {
				APP.simulationShader.uniforms['tCurrentFront'].value = APP.back;
				APP.currentTarget = APP.front;
				APP.currentFront = APP.back;
			}

			APP.displayShader.uniforms['tDiffuse'].value = APP.currentFront;
			// APP.simulationShader.needsUpdate = true;
			
			
		}

	}

	this.update = function() {

		controls.update();
		
		// update the time
		APP.time = new Date().getTime() - APP.startTime;
		APP.simulationShader.uniforms['uTime'].value = APP.time;
		APP.displayShader.uniforms['uTime'].value = APP.time;
		// APP.flatPlane.rotation.x += .5 * Math.PI / 180;

		renderer.render( scene, camera );

		// APP.rtPlane.rotation.z += .1 * Math.PI / 180;
		// if(APP.currentFront == APP.front) {
		// 	APP.currentFront = APP.back;
		// 	APP.front = tmp;
		// 	APP.simulationShader.uniforms['uCurrentFront'] = 1.0;
		// } else {
		// 	APP.currentFront = APP.front;
		// 	APP.front = tmp;
		// 	APP.simulationShader.uniforms['uCurrentFront'] = 0.0;
		// }

		// if(APP.time > APP.nextUpdate) {
			APP.nextUpdate = APP.time + APP.updateInterval;
			this.tick();
		// }
		
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
	APP.stage.play = new APP.ShaderDemo6();
	APP.stage.init();

}
