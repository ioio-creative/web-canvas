function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, " "));
}


// Demo wrapper
var AutumnScene = function( ) {

// CONSTANTS

	var CAMERA_NEAR = .1
		, CAMERA_FAR = 5000
		, DPR = window.devicePixelRatio || 1
    , SCENE_FILE = 'autumn-scene-prep3.dae'
    , BACKGROUND_COLOR = 0x85ada6
    , ROTATION_RATE = 10;

// PRIVATE PROPERTIES

	var self = this;

// PUBLIC PROPERTIES

	this.camera;
	this.composer;
	this.container;
	this.controls;
	this.renderer;
	this.scene;

  this.tick = 0;
// private variables
	var clock = new THREE.Clock(true);

// PRIVATE METHODS

	// initialization function, runs on instantiation
	function setup() {

		// create a container element
		self.container = document.createElement( 'div' );
		self.container.id = "threejs";
		document.body.appendChild( self.container );

		// create a Three.js scene
		self.scene = new THREE.Scene();

		// create and add a camera to our scene
		self.camera = new THREE.PerspectiveCamera( 28, window.innerWidth / window.innerHeight, CAMERA_NEAR, CAMERA_FAR );
		self.camera.position.z = 10;
    self.camera.position.y = -30;

		self.scene.add(self.camera);

		// create a renderer and set up for retina
		self.renderer = new THREE.WebGLRenderer({
		  devicePixelRatio: DPR
		});

    self.renderer.setClearColor( BACKGROUND_COLOR );
		self.scene.fog = new THREE.FogExp2(BACKGROUND_COLOR, .0125);

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

    var loader = new THREE.ColladaLoader();
    loader.load( './models/' + SCENE_FILE, function ( collada ) {

      for(var i = 0; i < collada.scene.children.length; i++) {

        var child = collada.scene.children[i];

        if( child.name === "Ground" ) {
          child.children[0].material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture("./models/autumn-scene.jpg") })
          self.tree = child;
          self.scene.add(child);
        }

      }


  		requestAnimationFrame( update );

    } );


	}

	// runs once per frame
	var update = function() {

		// get the elapsed time for the project
    var delta = 0;
    delta = clock.getDelta();
    self.tick += delta;

    if( delta > 0 ) {

    }

    self.tree.rotation.z += (ROTATION_RATE * delta) * Math.PI / 180;

    var zoom = ( 1. - ( self.camera.position.z / 80. ) ) * 5.;

    zoom = Math.max( 0.15, Math.min( 5., zoom ) );

		// update controls
		self.controls.update();

		// rinse and repeat
		self.renderer.render( self.scene, self.camera );
		requestAnimationFrame(update);

	}

// INIT

	// initialize on load
	init();

}

var demo = new AutumnScene();
