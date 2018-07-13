function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, " "));
}

window.timeScale = 1;

// Demo wrapper
var HoeyParticlesDemo = function( ) {

// CONSTANTS

	var CAMERA_NEAR = .1,
		CAMERA_FAR = 5000,
		DPR = window.devicePixelRatio || 1;

	var MAX_FIREWORKS = parseInt( getParameterByName( "maxFireworks" ) ) || 1
	  , MAX_PARTICLES = parseInt( getParameterByName( "maxParticles" ) ) || 250000
		, PARTICLE_CONTAINERS = parseInt( getParameterByName( "particleContainers" ) ) || 1;

// PRIVATE PROPERTIES

	var self = this;

// PUBLIC PROPERTIES

	this.camera;
	this.composer;
	this.container;
	this.controls;
	this.renderer;
	this.scene;

	this.bufferFiles = [
    'fireworks_01.ogg',
  ];

	this.buffers = {};
	this.gains = {};
	this.sources = {};
	this.ready = false;
	this.started = false;
  this.tick = 0;
// private variables
	var fireworkCounter = 0;

	var sourcePos = new THREE.Vector3();
	var spherePoint = new THREE.Vector3();
	var fireworks = [];
	var clock = new THREE.Clock(true);

	function randomSpherePoint(radius){
	   var u = Math.random();
	   var v = Math.random();
	   var theta = Math.PI * 2 * u;
	   var phi = Math.acos(2 * v - 1);
	   var x = (radius * Math.sin(phi) * Math.cos(theta));
	   var y = (radius * Math.sin(phi) * Math.sin(theta));
	   var z = (radius * Math.cos(phi));
		 spherePoint.set( x, y, z ).normalize().multiplyScalar(2);
		 return spherePoint.clone();
	}

	// preload a million random numbers
  self.randomSpherePoints = [];

  for(var i=1e4; i > 0; i--) {
    self.randomSpherePoints.push( randomSpherePoint(1) );
  }

  var getRandomSpherePoint = function() {
    return ++i >= self.randomSpherePoints.length ? self.randomSpherePoints[i=1] : self.randomSpherePoints[i];
  }

	// struct to simulate a firework flying and then exploding
	var Firework = function( particleSystem ) {

		this.particleSystem = particleSystem;
		this.startTime = -1;
		this.lifespan = 2;
		this.color = 0x444444;
		this.particleRate = 50;
    this.smokeRate = 5000;
		this.position = new THREE.Vector3();
		this.velocity = new THREE.Vector3();
		this.gravity = new THREE.Vector3( 0, -50, 0 );
		this.alive = true;

		this.prevTime = this.startTime;
		this.delta = 0;

		var velDelta = new THREE.Vector3();
		var pos = new THREE.Vector3();
		var vel = new THREE.Vector3();

		var explosionSounds = ['fireworks_01.ogg','fireworks_02.ogg','fireworks_03.ogg','fireworks_04.ogg'];
		fireworkCounter++;

		Firework.prototype.update = function( delta ) {

      this.delta = delta;
			this.lifespan -= this.delta;

			if( this.lifespan > 0 ) {

				velDelta.copy( this.gravity ).multiplyScalar( this.delta );
				this.velocity.add( velDelta );

				velDelta.copy( this.velocity ).multiplyScalar( this.delta );
				this.position.add( velDelta );

				// spawn a smoke trail
				for( var i = 0; i < this.smokeRate * this.delta; i++ ) {
					pos.addVectors( new THREE.Vector3().copy( velDelta ).multiplyScalar( Math.random() ), this.position );
					this.particleSystem.spawnParticle({ position: pos, positionRandomness: .125, smoothPosition: true, velocityRandomness: .65, size: 12.5, sizeRandomness: 15, turbulence: .25, colorRandomness: .05, lifetime: 1, color: this.color });
				}

			} else {

				// explode and die
				var explodeColor = 0xffffff * Math.random();
				var explodeColor2 = 0xffffff;
				var smokeColor = 0x080808;

				// AudioSystem.playSound( explosionSounds[ fireworkCounter % explosionSounds.length ] );

        // fireball
				for( var i = 0; i < this.particleRate; i++ ) {
					pos.addVectors( new THREE.Vector3().copy( velDelta ).multiplyScalar( Math.random() ), this.position );
					this.particleSystem.spawnParticle({ position: pos, positionRandomness: .85, velocityRandomness: 0, size: 12.5, sizeRandomness: 15, turbulence: .052, colorRandomness: .05, lifetime: 1.25, color: 0xffaa77 });
				}

        // main explosion
				var mainExplosionTemplate = { position: this.position, positionRandomness: 0, velocity: spherePoint, velocityRandomness: .40, size: 12, sizeRandomness: 1, turbulence: .075, colorRandomness: .3, lifetime: 2, color: explodeColor };
				for( var i = 0; i < this.particleRate * 15; i++ ) {
					mainExplosionTemplate.velocity = getRandomSpherePoint();
					this.particleSystem.spawnParticle( mainExplosionTemplate );
				}

				var explosionTemplate = { position: this.position, positionRandomness: 0.12, velocity: spherePoint.multiplyScalar(.32), velocityRandomness: 0, size: 6, sizeRandomness: 0, turbulence: .025, colorRandomness: .1, lifetime: .95, color: explodeColor2 };
				var explosionPoint = new THREE.Vector3();
				for( var i = 0; i < this.particleRate * 2; i++ ) {
					explosionPoint.copy( getRandomSpherePoint() );
					explosionTemplate.velocity = explosionPoint.multiplyScalar(.32);
					this.particleSystem.spawnParticle( explosionTemplate );
				}

				var explosionSmokeTemplate = { position: this.position, positionRandomness:1, velocityRandomness: 1, size: 90, sizeRandomness: 0, turbulence: .5, colorRandomness: 0, lifetime: 4, color: smokeColor };
				for( var i = 0; i < this.particleRate; i++ ) {
					this.particleSystem.spawnParticle( explosionSmokeTemplate );
				}

				this.alive = false;

			}

		}

	}

// PRIVATE METHODS

	// initialization function, runs on instantiation
	function setup() {

		// create a container element
		self.container = document.createElement( 'div' );
		self.container.id = "threejs";
		self.container.addEventListener('mousedown', spawnFirework );
		document.body.appendChild( self.container );

		// create a Three.js scene
		self.scene = new THREE.Scene();

		// create and add a camera to our scene
		self.camera = new THREE.PerspectiveCamera( 28, window.innerWidth / window.innerHeight, CAMERA_NEAR, CAMERA_FAR );
		self.camera.position.z = 80;
		self.scene.add(self.camera);

		// create a renderer and set up for retina
		self.renderer = new THREE.WebGLRenderer({
		  devicePixelRatio: DPR
		});

		// Probably deprecated
		if(typeof(self.renderer.setPixelRatio) !== "undefined") {
			self.renderer.setPixelRatio( DPR );
		}

		self.renderer.setSize( window.innerWidth, window.innerHeight );

		// add our renderer element to our container
		self.container.appendChild( self.renderer.domElement );

		// setup THREE trackball controls
		self.controls = new THREE.TrackballControls( self.camera, self.container );
		self.controls.rotateSpeed = 1.0;
		self.controls.zoomSpeed = 2.2;
		self.controls.panSpeed = .3;
		self.controls.dynamicDampingFactor = 0.3;

	}

	function init() {

		// setup a boilerplate threejs scene
		setup();

    var gui = new dat.GUI();
    gui.add( window, 'timeScale', -1, 1);
    var customContainer = document.createElement('div');
    customContainer.id = "guiContainer";
    document.body.appendChild( customContainer );
    customContainer.appendChild(gui.domElement);

		// create a particle system
    self.particleSystem = new THREE.GPUParticleSystem( {
			maxParticles: MAX_PARTICLES,
			containerCount: PARTICLE_CONTAINERS
		} );

    self.scene.add( self.particleSystem );


		requestAnimationFrame(update);

	}


	var spawnFirework = function() {

		var f = new Firework( self.particleSystem );
		f.position.y = -35;
		// f.position.x = ( Math.random() - .5 ) * 50;
		f.velocity.set( ( Math.random() - .5 ) * 20, ( Math.random() * 2.5 ) + 70, ( Math.random() - .5 ) * 20);
		f.lifespan = Math.random() * 1.3 + 1;
		fireworks.push( f );
		// AudioSystem.playSound('fireworks_00.ogg');
	}



	// runs once per frame
	var update = function() {

		// get the elapsed time for the project
    var delta = 0;
    delta = clock.getDelta() * window.timeScale;
    self.tick += delta;

    if( delta > 0 ) {

  		if( fireworks.length < MAX_FIREWORKS ) {
  			spawnFirework();
  		}

  		var deadFireworks = [];

  		for( var i = 0; i < fireworks.length; i++ ) {
  				fireworks[i].update( delta );
  				if( !fireworks[i].alive ) {
  					deadFireworks.push( fireworks[i] );
  				}
  		}

  		// remove all dead fireworks
  		for( var i = 0; i < deadFireworks.length; i++ ) {
  			fireworks.splice( fireworks.indexOf( deadFireworks[i] ), 1 );
  		}

    }

		// update controls
		self.controls.update();

		// update the particle system
    self.particleSystem.update( self.tick );

		// rinse and repeat
		self.renderer.render( self.scene, self.camera );
		requestAnimationFrame(update);

	}

// INIT

	// initialize on load
	init();

}

var demo = new HoeyParticlesDemo();
