var SIMULATION_SPEED = 1;


// wrapper for a standard ThreeJS Stage to update and manage Actors with custom behavior
THREE.ActorStage = function( rubeFile ) {

// CONSTANTS

	var CAMERA_NEAR = .001,
		CAMERA_FAR = 500000,
		DPR = window.devicePixelRatio;

// PRIVATE PROPERTIES

	var self = this;


// PUBLIC PROPERTIES

	this.actors = [];
	this.camera;
	this.clock = new THREE.Clock( true );
	this.composer;
	this.container;
	this.controls;
	this.delta = this.clock.getDelta();
	this.effects = [];
	this.materials = [];
	this.renderer;
	this.scene;
	this.world = new Box2D.b2World( new Box2D.b2Vec2(0.0, -25.0) );

// PRIVATE METHODS

	// initialization function, runs on instantiation
	var init = function() {

		// create a container element
		self.container = document.createElement( 'div' );
		self.container.id = "ActorStage";
		document.body.appendChild( self.container );

		// create a Three.js scene
		self.scene = new THREE.Scene();

		// create a container for our scene
		self.sceneContainer = new THREE.Object3D();
		self.scene.add( self.sceneContainer );

		// create and add a camera to our scene
		self.camera = new THREE.PerspectiveCamera( 28, window.innerWidth / window.innerHeight, CAMERA_NEAR, CAMERA_FAR );
		self.camera.position.z = 100;
		self.scene.add(self.camera);

		// create a renderer and set up for retina
		self.renderer = new THREE.WebGLRenderer({
		  devicePixelRatio: DPR
		});

		if(typeof(self.renderer.setPixelRatio) !== "undefined") {
			self.renderer.setPixelRatio( DPR );
		}
		
		self.renderer.setSize( window.innerWidth, window.innerHeight );
		self.renderer.autoClear = false;	

		// add our renderer element to our container
		self.container.appendChild( self.renderer.domElement );

		self.composer = new THREE.EffectComposer( self.renderer );
		self.composer.addPass( new THREE.RenderPass( self.scene, self.camera ));

		// var effect = new THREE.ShaderPass( THREE.FXAAShader );
		// effect.uniforms[ 'resolution' ].value.set( 1 / (window.innerWidth * DPR), 1 / (window.innerHeight * DPR) );
		// self.composer.addPass( effect );
		// self.effects.push( effect );



		var effect = new THREE.ShaderPass( THREE.HorizontalBlurShader );
		effect.uniforms['h'].value = 1 / 1548
		self.composer.addPass( effect );		
		self.effects.push( effect );


		var effect = new THREE.ShaderPass( THREE.FilmShader );
		self.composer.addPass( effect );		
		effect.uniforms['sIntensity'].value = 0;
		effect.uniforms['grayscale'].value = false;
		effect.uniforms['nIntensity'].value = .6;
		self.effects.push( effect );


		// var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
		// effect.uniforms['amount'].value = .0025
		// effect.uniforms['angle'].value = 13
		// self.composer.addPass( effect );		
		// self.effects.push( effect );



		effect.renderToScreen = true;

		// setup THREE trackball controls
		self.controls = new THREE.TrackballControls( self.camera );
		self.controls.rotateSpeed = 1.0;
		self.controls.zoomSpeed = 2.2;
		self.controls.panSpeed = .3;
		self.controls.noZoom = false;
		self.controls.noPan = false;
		self.controls.noRoll = true;
		self.controls.noRotate = false;
		self.controls.dynamicDampingFactor = 0.3;

		// load our rube file into the world, if it's been defined
		Zepto.getJSON(rubeFile, function(data) {
			
			// create physics definitions for actors
			loadSceneIntoWorld(data, self.world);

			// create actors scene definitions
			createActorsFromScene( );
			createContactListeners( );

		});

		requestAnimationFrame(update);

	}

	function createContactListeners( ) {
		var listener = new Box2D.JSContactListener();
		listener.BeginContact = function( contact, data ) {

			var contacts = [];

			var contact = self.world.GetContactList();
			contacts.push( contact );

			var contactPointer = Box2D.getPointer( contact );

		    while ( contactPointer ){
		        contact = contact.GetNext();
		        contacts.push(contact);
		        contactPointer = Box2D.getPointer(contact);
		    }

			for( var i = 0; i < contacts.length; i++) {
				contact = contacts[i];

				var contactAName = contact.GetFixtureA().GetBody().name;
				var contactBName = contact.GetFixtureB().GetBody().name;

				if( contactAName == "kill_zone" ) {
					var b = contact.GetFixtureB().GetBody();
					b.reset = true;
				} else if ( contactBName == "kill_zone" ) {
					var a = contact.GetFixtureA().GetBody();
					a.reset = true;					
				}

			}

		}
		listener.EndContact = function( contact, data ) {

		}
		listener.PostSolve = function( contact, impulse ) {

		}
		listener.PreSolve = function( contact, oldManifold ) {

		}
		self.world.SetContactListener( listener );
	}

	function createActorsFromScene( ) {

		var bodies = [];
	    var body = self.world.GetBodyList();
	    bodies.push(body);

	    var bodyPointer = Box2D.getPointer(body);

	    while (bodyPointer){
	        body = body.GetNext();
	        bodies.push(body);
	        bodyPointer = Box2D.getPointer(body);
	    }

	    for(var b in bodies) {

	    	var bd = bodies[b];

	    	if( bd.jsonDef === undefined ) {
	    		break;
	    	}

	    	if( bd.name == "flipper_left" ) {
	    		self.add( new THREE.FlipperActor( bd, 65 ) );
	    	} else if ( bd.name == "flipper_right" ) {
	    		self.add( new THREE.FlipperActor( bd, 68 ) );
	    	} else if ( bd.name == "Triangle" ) {
	    		self.add( new THREE.TriangleActor( bd ) );
	    	} else if ( bd.name == "SpaceShip" ) {
	    		self.add( new THREE.SpaceShipActor( bd ) );	    		
	    	} else {
	    		self.add( new THREE.WireframeActor( bd ) );
	    	}
	    	

	    	// if(bd.customProperties && bd.customProperties.length) {
	    	// 	for(p in bd.customProperties) {
	    	// 		var prop = bd.customProperties[p];
	    	// 		if(prop.name == "actorType") {
	    	// 			if(prop.string == "Ball") {
						// 	self.add( new THREE.Ball( bd ) );	    					
	    	// 			} else if(prop.string == "Edge") {
	    	// 				self.add( new THREE.WireframeActor( bd ) );
	    	// 			}
	    	// 		}
	    	// 	}
	    	// } else {
	    	// 	self.add( new THREE.WireframeActor( bd ) );
	    	// }

	    }

	}

	function getWorldInfo() {
	    var numBodies = 0;
	    var numFixtures = 0;
	    var numJoints = self.world.GetJointCount();
	    
	    var body = self.world.GetBodyList();

	    var bodyPointer = Box2D.getPointer(body);
	    
	    while (bodyPointer){
	        numBodies++;
	        body = body.GetNext();
	        var fixture = body.GetFixtureList();
	        var fixturePointer = Box2D.getPointer(fixture);
	        while (fixturePointer){
	            numFixtures++;
	            fixture = fixture.GetNext();
	            fixturePointer = Box2D.getPointer(fixture);
	        }
	        bodyPointer = Box2D.getPointer(body);
	    }
	    
	    return ""+numBodies+" bodies, "+numFixtures+" fixtures, "+numJoints+" joints";
	}

	// returns an array of body names, positions, and angles
	function getBodyPositions() {
		var bodies = [];

	    var body = self.world.GetBodyList();

	    var bodyPointer = Box2D.getPointer(body);
	    
	    while (bodyPointer){

	        body = body.GetNext();
	        var b = {};
	        var bwc = body.GetWorldCenter();
	        b.name = body.name;
	        b.position = [ bwc.get_x(), bwc.get_y() ];
	        b.angle = body.GetAngle();
	        bodies.push(b);

	        bodyPointer = Box2D.getPointer(body);
	    }

	    return bodies;

	}

	// runs once per frame
	var update = function() {

		// update delta
		self.delta = self.clock.getDelta();

		for( var i = 0; i < self.effects.length; i++ ) {
			if( self.effects[i].uniforms['time'] !== undefined ) {
				self.effects[i].uniforms['time'].value = self.clock.getElapsedTime();
			}
		}

		// update controls
		self.controls.update();

		if( self.delta > 1/60 ) self.delta = 1/60;

		// update Box2D simulation
		self.world.Step( self.delta * SIMULATION_SPEED, 3, 2);

		// Update our actors
		updateActors();

		// RUN GAME CONTROLLER LOGIC HERE

		render();

		requestAnimationFrame(update);
	}

	// updates our local actors
	var updateActors = function() {
		if(self.actors !== undefined) {
			for(var i = 0; i < self.actors.length; i++) {
				self.actors[i].update( self.delta );
			}
		}

	}

	// renders our scene
	var render = function() {

		// render our scene
		self.renderer.clear();
		self.renderer.render( self.scene, self.camera );

	}

	// load a rube scene 
	var loadRubeScene = function() {

	}

// PUBLIC METHODS

	this.add = function( actor ) {

		if( actor.isActor === true ) {
			this.actors.push( actor );
			this.sceneContainer.add( actor );
		}

	}

// INIT

	// initialize on load
	init();

}