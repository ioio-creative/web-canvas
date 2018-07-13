/*
* Three.JS Boilerplate
*
* author: Charlie Hoey <charlie.hoey@gmail.com>
* version 0.0.2
*/

// initialize a namespace
var APP = APP || {};

APP.mouse = { x: 0, y: 0 };

if(window.devicePixelRatio <= 1) {
	APP.DPR = 1;
} else {
	APP.DPR = window.devicePixelRatio;
}

APP.windowHalfX = APP.DPR * window.innerWidth / 2;
APP.windowHalfY = APP.DPR * window.innerHeight / 2;


THREE.StageManager = function() {

	var self = this;

	this.init = function() {
		// create container
		container = document.createElement( 'div' );
		document.body.appendChild( container );

		// SCENE INITIALIZATION
		scene = new THREE.Scene();

		var w = 32, h = 16;

		// create camera
		camera = new THREE.PerspectiveCamera( 28, window.innerWidth / window.innerHeight, .001, 500000 );
		// camera.position.z = 0;
		camera.setLens(8, 7.49); // 16mm bolex

		scene.add(camera);

		this.createRenderer();
		this.setupComposer();

		container.appendChild( renderer.domElement );

		// initialize our current scene
		this.play.init();

		this.animate();
	}

	this.setupComposer = function() {

		composer = new THREE.EffectComposer( renderer );
		composer.addPass( new THREE.RenderPass( scene, camera ));

		// var effect = new THREE.ShaderPass( THREE.FXAAShader );
		// // effect.uniforms[ 'offset' ].value = .35;
		// // effect.uniforms[ 'darkness' ].value = 4;
		// // effect.renderToScreen = true;
		// effect.uniforms[ 'resolution' ].value.set( 1 / (window.innerWidth * APP.DPR ), 1 / (window.innerHeight * APP.DPR) );
		// composer.addPass( effect );

		// var effect = new THREE.ShaderPass( THREE.VignetteShader );
		// effect.uniforms[ 'offset' ].value = .35;
		// effect.uniforms[ 'darkness' ].value = 4;
		// // effect.renderToScreen = true;
		// composer.addPass( effect );

		// var effect = new THREE.ShaderPass( THREE.VerticalTiltShiftShader );
		// effect.uniforms[ 'v' ].value =  4 / 512;
		// effect.uniforms[ 'r' ].value = 256 / 512;
		// // effect.renderToScreen = true;
		// composer.addPass( effect );

		var effect = new THREE.ShaderPass( THREE.FilmShader );
		effect.renderToScreen = true;
		composer.addPass( effect );
		effect.uniforms['sIntensity'].value = 0;
		effect.uniforms['grayscale'].value = false;
		effect.uniforms['nIntensity'].value = .36;
		APP.filmEffect = effect;

	}

	this.createRenderer = function() {

		renderer = new THREE.WebGLRenderer({
		  devicePixelRatio: APP.DPR || 1
		});

		if(typeof(renderer.setPixelRatio) !== "undefined") {
			renderer.setPixelRatio( APP.DPR );
		}

		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.autoClear = false;

	}

	this.animate = function(time) {

		// update our play
		if(typeof(self.play) != "undefined") self.play.update();

		requestAnimationFrame( self.animate );

		self.render();
	}

	this.render = function() {

		renderer.clear();

		if(APP.disableComposer === true) {
			renderer.render( scene, camera );
		} else {
			composer.render( scene, camera );
		}
	}

	window.addEventListener( 'resize', onWindowResize, false );

	function onWindowResize() {

		APP.windowHalfX = APP.DPR * window.innerWidth / 2;
		APP.windowHalfY = APP.DPR * window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight);
	}

}
