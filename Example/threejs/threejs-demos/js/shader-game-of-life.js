var APP = APP || {};
var controls;
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
	this.staticView = getParameterByName("staticView");

	this.raycaster = new THREE.Raycaster();
	// this.raycaster.precision = .000001;
	this.mouse = new THREE.Vector2();
	this.mouseDown = false;

	console.log(this.resolution);
	var self = this;

	this.init = function() {

		renderer.setClearColor( 0x000000 );
		// APP.disableComposer = true;
		APP.startTime = new Date().getTime();
		APP.updateInterval = 4;
		APP.nextUpdate = APP.updateInterval;
		APP.spawnThreshold = .3;

		APP.stageSize = 10;

		camera.setLens(13, 7.49); // 16mm bolex
		scene.fog = new THREE.FogExp2(backgroundColor, .065);

		// scene.remove(camera);

		// APP.cameraHolder = new THREE.Object3D();
		// APP.cameraHolder.add(camera);
		camera.position.z = 200;
		camera.position.x = 0;
		camera.position.y = 0;
		camera.lookAt(new THREE.Vector3());
		// scene.add(APP.cameraHolder);

		scene.fog = null;

		var width = this.resolution || 2048,
			height = this.resolution || 2048;

		self.width = width;
		self.height = height;

		// this is a static perlin noise texture for initial seeding
		APP.noiseTex = THREE.ImageUtils.loadTexture("textures/noise-" + width + ".png", THREE.UVMapping, function() {
			APP.ready = true;
		});
		APP.noiseTex.wrapS = APP.noiseTex.wrapT = THREE.RepeatWrapping;
		APP.noiseTex.minFilter = APP.noiseTex.maxFilter = THREE.NearestFilter;



		// these two render targets are the FBO's that we will ping-pong between
		APP.front = new THREE.WebGLRenderTarget(width, height, { minFilter: THREE.NearestFilter, maxFilter: THREE.NearestFilter, stencilBuffer: false, depthBuffer: false });
		APP.back = new THREE.WebGLRenderTarget(width, height, { minFilter: THREE.NearestFilter, maxFilter: THREE.NearestFilter, stencilBuffer: false, depthBuffer: false });
		APP.front.wrapS = APP.front.wrapT = THREE.RepeatWrapping;
		APP.back.wrapS = APP.back.wrapT = THREE.RepeatWrapping;
		APP.front.magFilter = THREE.NearestFilter;
		APP.back.magFilter = THREE.NearestFilter;

		// APP.front.anistropy = APP.back.anistropy = 2;
		
		// setup a reference to hold whatever the current RT is
		APP.currentFront = APP.front; 
		APP.currentTarget = APP.front;

		// create a secret scene and camera to use for render textures
		APP.rtScene = new THREE.Scene();
		APP.rtCamera = new THREE.OrthographicCamera( width / -2, width / 2, height / 2, height / -2, -10000, 10000 );
		APP.rtScene.add( APP.rtCamera );

		var ar = window.innerWidth / window.innerHeight;

		var planeSize = window.innerWidth;

		var sw = window.innerWidth * DPR,
			sh = window.innerHeight * DPR;

		if(this.staticView) {
			scene.remove(camera);
			camera = new THREE.OrthographicCamera( Math.floor(sw * -.5), Math.floor(sw * .5), Math.floor(sh * -.5), Math.floor(sh * .5), -10000, 10000 );
			scene.add(camera);			
		}

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

		// controls.keys = [ 65, 83, 68 ];

		// this is the shader material we'll use for our simulation, it will
		// be rendered alternately to the front or back render targets
		APP.simulationShader = new THREE.ShaderMaterial( {
			uniforms: {
				"uTime": { type: "f", value: 0.0 },
				"uSize": { type: "f", value: width },
				"uMouseDown": { type: "f", value: 0.0 },
				"uMouseCoords": { type: "v2", value: new THREE.Vector2(0, 0) },
				"tCurrentFront": { type: "t", value: APP.noiseTex }
			},
			vertexShader: document.getElementById( 'vertexShaderSimulation' ).textContent,
			fragmentShader: document.getElementById( 'fragmentShaderSimulation' ).textContent
		} );
		// APP.simulationShader.minFilter = APP.simulationShader.maxFilter = THREE.NearestFilter;

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
			depthTest: false,
			side: THREE.DoubleSide,
			uniforms: {
				"uTime": { type: "f", value: 0.0 },
				"tDiffuse": { type: "t", value: APP.currentFront }
			},
			vertexShader: document.getElementById( 'vertexShaderDisplay' ).textContent,
			fragmentShader: document.getElementById( 'fragmentShaderDisplay' ).textContent
		} );

		// APP.displayShader.minFilter = APP.displayShader.maxFilter = THREE.NearestFilter;

		// here's a flat plane we'll render to
		APP.flatPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(width, height), APP.displayShader);
		// APP.flatPlane.position.z = -10;
		scene.add(APP.flatPlane);

		APP.stage.cameraUpdate = function() {
			

			// if( Math.abs((mouseX * 2) / window.innerWidth) > .15 || Math.abs((mouseY * 2) / window.innerHeight) > .1 ) {
			// 	cameraDestY = (mouseY * 2.) * .07 * Math.abs(camera.position.z / 4);
			// 	cameraDestX = ( - mouseX * 2.) * .07 * Math.abs(camera.position.z / 4);

			// 	camera.position.y += (camera.position.y - cameraDestY) * .0005;
			// 	camera.position.x += (camera.position.x - cameraDestX) * .0005;	
			// }

		}

		APP.stage.animate = function() { 
			controls.update();
			APP.stage.play.update(); 
			// APP.stage.cameraUpdate();
			requestAnimationFrame( APP.stage.animate ); 
		};

		// track position of mouse
		function onMouseMove( event ) {
			self.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			self.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		}
		document.addEventListener( 'mousemove', onMouseMove, false );

		// track mouse status
		function onMouseDown( event ) {
			self.mouseDown = true;
		}
		document.addEventListener( 'mousedown', onMouseDown, false );

		function onMouseUp( event ) {
			self.mouseDown = false;
		}
		document.addEventListener( 'mouseup', onMouseUp, false );

		// track shift key, so we can rotate if it's held down
		document.addEventListener( 'keydown', function( event ) {
			if( event.which == 16 ) {
				controls.noRotate = false;
			}
		});

		document.addEventListener( 'keyup', function( event ) {
			if( event.which == 16 ) {
				controls.noRotate = true;
			}
		});

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

			if(self.mouseDown) {
				// handle mouse movement stuff
				this.raycaster.setFromCamera( self.mouse, camera );
				var intersects = this.raycaster.intersectObjects( scene.children );

				if(intersects.length) {
					var touchUV = new THREE.Vector2(
						( intersects[0].point.x + (this.width * .5) ) / this.width ,
						( intersects[0].point.y + (this.height * .5) ) / this.height
					);
					console.log(touchUV);
					APP.simulationShader.uniforms['uMouseDown'].value = 1;
					APP.simulationShader.uniforms['uMouseCoords'].value = touchUV;
				}
			} else {
				APP.simulationShader.uniforms['uMouseDown'].value = 0;
			}
			
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
				// console.log('front');
			} else {
				APP.simulationShader.uniforms['tCurrentFront'].value = APP.back;
				APP.currentTarget = APP.front;
				APP.currentFront = APP.back;
				// console.log('back');
			}

			APP.displayShader.uniforms['tDiffuse'].value = APP.currentFront;
			// APP.simulationShader.needsUpdate = true;
			
			
		}

	}

	this.update = function() {

		// update the time
		APP.time = new Date().getTime() - APP.startTime;
		APP.simulationShader.uniforms['uTime'].value = APP.time;
		APP.displayShader.uniforms['uTime'].value = APP.time;
		// APP.flatPlane.rotation.z += .5 * Math.PI / 180;

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

		if(APP.time > APP.nextUpdate) {
			APP.nextUpdate = APP.time + APP.updateInterval;
			this.tick();
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
	APP.stage.play = new APP.ShaderDemo6();
	APP.stage.init();

}
