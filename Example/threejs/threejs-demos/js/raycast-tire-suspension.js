var APP = APP || {};
APP.materials = {};
APP.geometry = {};

APP.dialogCounter = 0;

APP.startTimeOffset = 0;

APP.dialogDelay = 0;
APP.targetTime = APP.dialogDelay;
APP.ticks = 0;
APP.dialogMaxLength = 2;
APP.characterCounter = 0;

backgroundColor = 0x000000;

THREE.Utils = {
    cameraLookDir: function(camera) {
        var vector = new THREE.Vector3(0, 0, -1);
        vector.applyEuler(camera.rotation, camera.rotation.order);
        return vector;
    }
};
var controls;

APP.WarRoomPlay = function() {

	this.actors = [];
	this.ready = false;
	var self = this;

	this.init = function() {
		
		// APP.tl = new TimelineLite();
		// APP.tl.eventCallback("onComplete", function() {
		// 	APP.startTimeOffset = APP.clock.getElapsedTime();
		// });

		// load all our assets
		this.setupAssets();

		// setup our flame material
		APP.flameMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: 0xff6600, transparent: true });


		// APP.moon = new THREE.DirectionalLight(0x444488);
		// APP.moonTarget = new THREE.Object3D();
		// APP.moonTarget.position.x = -10;
		// APP.moonTarget.position.y = -2
		// scene.add(APP.moonTarget);
		// APP.moon.target = APP.moonTarget;
		// scene.add(APP.moon);

		APP.sun = new THREE.DirectionalLight(0xffdddd, 1);
		APP.sunTarget = new THREE.Object3D();
		APP.sun.position.y = 40;
		APP.sun.exponent = 10;
		APP.sun.angle = 10 * Math.PI / 180;
		scene.add(APP.sunTarget);
		APP.sunTarget.target = APP.sunTarget;
		scene.add(APP.sun);


		APP.ground = new THREE.DirectionalLight(0xbbccff, .25);
		APP.groundTarget = new THREE.Object3D();
		APP.ground.position.y = -12;
		APP.ground.position.z = 20;
		// APP.ground.exponent = 10;
		// APP.ground.angle = 10 * Math.PI / 180;
		scene.add(APP.groundTarget);
		APP.groundTarget.target = APP.groundTarget;
		scene.add(APP.ground);

		// APP.floor = new THREE.Mesh( new THREE.PlaneGeometry(22, 22), new THREE.MeshLambertMaterial({ color: 0x333333,  }) );
		// APP.floor.rotation.x = -90 * Math.PI / 180;
		// APP.floor.position.y = -5;
		// scene.add( APP.floor );
		// APP.lightBalls = [];
		// for(var i = 0; i < 3; i++) {
		// 	var c = 0xffffff * Math.random();
		// 	var b = new THREE.Mesh(new THREE.SphereGeometry(.5, 16, 32), new THREE.MeshBasicMaterial({ color: c }));

		// 	b.add(new THREE.PointLight(c, .5));
		// 	APP.lightBalls.push(b);
		// 	b.seed = Math.random() * 10;
		// 	scene.add(b);
		// }

		// APP.headlights = new THREE.Object3D();
		// APP.headlights.position.z = 8;
		// APP.headlights.position.y = 2;
		// scene.add(APP.headlights);

		// var x = new THREE.SpotLight(0xffddaa, 1, 0, .7);
		// var xt = new THREE.Object3D();
		// x.position.x = -1;
		// xt.position.z = -5;
		// xt.position.y = -1;
		// xt.position.x = -1;
		// APP.headlights.add(xt);
		// x.target = xt;
		// APP.headlights.add(x);

		// var x = new THREE.SpotLight(0xffddaa, 1, 0, .7);
		// var xt = new THREE.Object3D();
		// x.position.x = 1;
		// xt.position.z = -5;
		// xt.position.y = -1;
		// xt.position.x = 1;
		// APP.headlights.add(xt);
		// x.target = xt;
		// APP.headlights.add(x);
		camera.position.z = 8;
		controls = new THREE.TrackballControls( camera );

		controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 2.2;
		controls.panSpeed = .3;

		controls.noZoom = false;
		controls.noPan = false;
		controls.noRoll = true;
		controls.noRotate = false;

		// controls.staticMoving = true;
		controls.dynamicDampingFactor = 0.3;

		scene.fog = new THREE.FogExp2(0x000000, .045);

	}

	this.setupAssets = function() {

		var self = this;
		// scene.add(APP.particleSystemContainer);
		APP.materials = APP.materials || {};
		APP.models = APP.models || {};
		APP.clock = new THREE.Clock(true);


		// load collada assets
		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load( './models/tire.dae', function ( collada ) {

			APP.colladaScene = collada.scene;

			for(var i = 0; i < APP.colladaScene.children.length; i++) {

				var c = APP.colladaScene.children[i];

				if(c.name == "Camera") {

				} else if(c.name == "Tire" || c.name == "RobotDish") {
					APP.Tire = c;
					var m = c.children[0].material = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('./textures/wheel-AO.jpg') });

					m.shininess = 15;

					m.specular = new THREE.Color(0x222222);
					m.emissive = new THREE.Color(0x555555);
				} else if(c.name == "Fill" || c.name == "Key" || c.name == "Camera") {
					collada.scene.remove(c);
					collada.scene.children[i] = new THREE.Object3D();
				}
			}
			
			APP.Raycaster = new THREE.Raycaster();
			APP.sceneHolder = new THREE.Object3D();
			scene.add(APP.sceneHolder);

			APP.sceneHolder.add(APP.Tire);

			// GENERATE ROAD SURFACE
			APP.ROAD_RESOLUTION = 20;
			APP.ROAD_SEGEMENT_COUNT = 5;
				
			APP.RoadSegments = new THREE.Object3D();
			APP.RoadSegments.position.x = -APP.ROAD_RESOLUTION * (APP.ROAD_SEGEMENT_COUNT - 5);
			APP.sceneHolder.add( APP.RoadSegments );
			APP.segment_counter = 0;
			APP.segment_points = [];
			APP.random_points = [];
			APP.road_needs_update = false;

			Math.seedrandom("whatevs");


			self.ready = true;

		});
	}

	this.spawnTile = function() {

		var randomPoints = [];

		for ( var i = 0; i < APP.ROAD_RESOLUTION; i ++ ) {
			var segPos = -(APP.segment_counter * APP.ROAD_RESOLUTION) + i;
			randomPoints.unshift( new THREE.Vector3( segPos, THREE.Math.randFloat( -.25, .25 ), 0 ) );
		}

		var newArray = APP.random_points.concat( randomPoints );
		APP.random_points = newArray;

		APP.segment_counter += 1;

		APP.road_needs_update = true;

	}

	this.updateRoad = function() {

		var randomSpline =  new THREE.SplineCurve3( APP.random_points );

		var extrudeSettings = {
			steps			: 300,
			bevelEnabled	: false,
			extrudePath		: randomSpline
		};

		var pts = [];
		var rw = 2.5, rh = .1;
		pts.push( new THREE.Vector2(-rw * .5, 0) );
		pts.push( new THREE.Vector2(-rw * .5, rh) );
		pts.push( new THREE.Vector2(rw * .5, rh) );
		pts.push( new THREE.Vector2(rw * .5, 0) );

		var shape = new THREE.Shape( pts );

		var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

		var material2 = new THREE.MeshLambertMaterial( { color: 0xccc9c9, wireframe: false, shading: THREE.SmoothShading } );

		var mesh = new THREE.Mesh( geometry, material2 );

		APP.RoadSegments.remove(APP.RoadMesh);
		APP.RoadMesh = mesh;
		APP.RoadSegments.add( mesh );


	}

	this.killTiles = function() {

		var killPos = new THREE.Vector3().addVectors(APP.Tire.position, new THREE.Vector3(APP.ROAD_RESOLUTION * 3, 10, 0));
		APP.Raycaster.set( killPos, new THREE.Vector3(0, -1, 0) );

		// see if a road segment is far behind us, and if it is kill it
		var intersect = APP.Raycaster.intersectObject( APP.RoadSegments, true );

		if(intersect.length > 0) {
			APP.random_points.splice(0, APP.ROAD_RESOLUTION);
			APP.road_needs_update = true;
		}

	}

	this.updateTiles = function() {

		this.killTiles();

		while( APP.random_points.length < ( APP.ROAD_RESOLUTION * APP.ROAD_SEGEMENT_COUNT ) - 1 ) {

			this.spawnTile();

		}

		if(APP.road_needs_update) {
			APP.road_needs_update = false;
			this.updateRoad();
		}
	}



	this.update = function() {
		
		controls.update();
		
		APP.ticks++;
		APP.filmEffect.uniforms['time'].value = APP.ticks;

		var yearSpeed = .005;
		if(this.ready) {		

			this.updateTiles();
			var castPos = new THREE.Vector3().addVectors( APP.Tire.position, new THREE.Vector3( -.35, 0, 0 ) );
			APP.Raycaster.set( castPos, new THREE.Vector3(0, -1, 0) );
			
			APP.RoadSegments.position.x += .1;

			// see where the road is
			var intersect = APP.Raycaster.intersectObject( APP.RoadSegments, true );

			// the tire radius
			APP.TIRE_RADIUS = .93;

			if(intersect.length > 0) {

				var newPoint = intersect[0].point.y + APP.TIRE_RADIUS;

				if( APP.Tire.position.y - newPoint > .001 ) {
					APP.Tire.position.y -= .015;
				} else {
					APP.Tire.position.y = newPoint;
				}

				// rotate the tire
				APP.Tire.rotation.z += 3.65 * Math.PI / 180;				
			}

			if(APP.clock.getElapsedTime() > APP.targetTime) {
				APP.targetTime = APP.clock.getElapsedTime() + 1/60;
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


	APP.stage.play = new APP.WarRoomPlay();
	APP.stage.init();
}
