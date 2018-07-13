var APP = APP || {};
APP.materials = {};
APP.geometry = {};

APP.dialogCounter = 0;

APP.startTimeOffset = 0;

APP.dialogDelay = 3;
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

APP.WarRoomPlay = function() {

	this.actors = [];
	this.ready = false;
	var self = this;

	this.init = function() {
		
		APP.tl = new TimelineLite();
		APP.tl.eventCallback("onComplete", function() {
			APP.startTimeOffset = APP.clock.getElapsedTime();
		});

		// load all our assets
		this.setupAssets();

		renderer.shadowMapEnabled = true;

		camera.setLens(24); // 16mm bolex

		APP.moon = new THREE.DirectionalLight(0x222244);
		APP.moonTarget = new THREE.Object3D();
		APP.moonTarget.position.x = -10;
		APP.moonTarget.position.y = -2
		scene.add(APP.moonTarget);
		APP.moon.target = APP.moonTarget;
		scene.add(APP.moon);

		// APP.lightBalls = [];
		// for(var i = 0; i < 3; i++) {
		// 	var c = 0xffffff * Math.random();
		// 	var b = new THREE.Mesh(new THREE.SphereGeometry(.5, 16, 32), new THREE.MeshBasicMaterial({ color: c }));

		// 	b.add(new THREE.PointLight(c, .5));
		// 	APP.lightBalls.push(b);
		// 	b.seed = Math.random() * 10;
		// 	scene.add(b);
		// }

		APP.headlights = new THREE.Object3D();
		APP.headlights.position.z = 8;
		APP.headlights.position.y = 2;
		scene.add(APP.headlights);

		var x = new THREE.SpotLight(0xffddaa, 1, 0, .7);
		var xt = new THREE.Object3D();
		x.position.x = -1;
		xt.position.z = -5;
		xt.position.y = -1;
		xt.position.x = -1;
		APP.headlights.add(xt);
		x.target = xt;
		APP.headlights.add(x);

		var x = new THREE.SpotLight(0xffddaa, 1, 0, .7);
		var xt = new THREE.Object3D();
		x.position.x = 1;
		xt.position.z = -5;
		xt.position.y = -1;
		xt.position.x = 1;
		APP.headlights.add(xt);
		x.target = xt;
		APP.headlights.add(x);

		// scene.remove(camera);
		// APP.cameraHolder = new THREE.Object3D();

		// scene.add(APP.cameraHolder);
		// APP.cameraHolder.add(camera);
		// cameraHolder.rotation.y = 270 * Math.PI / 180;
		// controls = new THREE.TrackballControls( camera );

		// controls.rotateSpeed = 1.0;
		// controls.zoomSpeed = 2.2;
		// controls.panSpeed = .3;

		// // setup timeline

		// // APP.tl.to(camera.position, 1, { y: 2000, z: -1500 }, 0);

		// controls.noZoom = true;
		// controls.noPan = true;
		// controls.noRoll = true;
		// controls.noRotate = true;


		// controls.staticMoving = true;
		// controls.dynamicDampingFactor = .33;

		scene.fog = new THREE.FogExp2(backgroundColor, .025);

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
		loader.load( './models/road-segment1-bake-test.dae', function ( collada ) {

			APP.colladaScene = collada.scene;

			for(var i = 0; i < APP.colladaScene.children.length; i++) {

				var c = APP.colladaScene.children[i];

				if(c.name == "Camera") {
					camera.position.set(c.position.x, c.position.y, c.position.z);

					camera.lookAt(new THREE.Vector3());

				} else if(c.name == "RoadwayMerged") {
					var m = c.children[0].material;
					m.specularMap = THREE.ImageUtils.loadTexture('./models/road-spec-map.jpg');
					m.bumpMap = THREE.ImageUtils.loadTexture('./models/road-spec-map.jpg');
					m.bumpScale = .02;
					m.shininess = 30;
					m.emissive = new THREE.Color(0x222222);
					m.specular = new THREE.Color(0x666666);
				} else if(c.name == "Fill" || c.name == "Key") {
					collada.scene.remove(c);
					collada.scene.children[i] = new THREE.Object3D();
					scene.add(c);
				}
			}
			
			// scale our scene for shadow map purposes
			// collada.scene.scale.set(50, 50, 50);
			//scene.add(collada.scene);

			APP.sceneHolder = new THREE.Object3D();
			scene.add(APP.sceneHolder);

			var sceneLength = 16;

			for(var i = -3; i < 3; i++) {
				var x = collada.scene.clone();
				x.position.z = sceneLength * i;
				APP.sceneHolder.add(x);
			}


			self.ready = true;

		});
	}

	this.update = function() {
		// controls.update();
		// this.cameraUpdate();
		APP.ticks++;

		// for(var i = 0; i < APP.lightBalls.length; i++) {
		// 	var b = APP.lightBalls[i];
		// 	var t = (APP.ticks + (b.seed * 504)) * .02;
		// 	b.position.x = (Math.sin(t)) * 5;
		// 	b.position.y = (Math.cos((t + Math.PI) * 1.024) + 2) * 1;
		// 	b.position.z = (Math.cos((t + Math.PI) * 1.05) + 1);			
		// }
		APP.headlights.position.x = Math.sin(APP.ticks * .025) * 2;
		// APP.cameraHolder.rotation.y = (mouseX * .02) * Math.PI / 180;
		// APP.cameraHolder.rotation.x = (-mouseY * .06) * Math.PI / 180;
		APP.tl.seek(APP.clock.getElapsedTime() - APP.startTimeOffset);

		if(APP.clock.getElapsedTime() > APP.targetTime) {


		}

		var yearSpeed = .005;
		if(this.ready) {		
			APP.sceneHolder.position.z += .2 * Math.sin(APP.ticks * .015) + .22;
			for(i = 0; i < APP.sceneHolder.children.length; i++) {
				var c = APP.sceneHolder.children[i];
				if(APP.sceneHolder.position.z + c.position.z > 32) {
					c.position.z -= APP.sceneHolder.children.length * 16;
				}
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
