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

		renderer.shadowMapEnabled = true;

		// camera.setLens(24); // 16mm bolex

		APP.moon = new THREE.DirectionalLight(0x222244);
		APP.moonTarget = new THREE.Object3D();
		APP.moonTarget.position.x = -10;
		APP.moonTarget.position.y = -2
		scene.add(APP.moonTarget);
		APP.moon.target = APP.moonTarget;
		scene.add(APP.moon);

		APP.sun = new THREE.SpotLight(0xffffdc, 2);
		APP.sunTarget = new THREE.Object3D();
		APP.sun.position.y = 40;
		APP.sun.exponent = 10;
		APP.sun.angle = 10 * Math.PI / 180;
		scene.add(APP.sunTarget);
		APP.sunTarget.target = APP.sunTarget;
		scene.add(APP.sun);


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
		camera.position.x = 15;
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

		scene.fog = new THREE.FogExp2(0x000000, .035);

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
		loader.load( './models/hoverbot2.dae', function ( collada ) {

			APP.colladaScene = collada.scene;
			APP.thrusters = [];

			for(var i = 0; i < APP.colladaScene.children.length; i++) {

				var c = APP.colladaScene.children[i];

				if(c.name == "Camera") {
					// camera.position.set(c.position.x, c.position.y, c.position.z);

					// camera.lookAt(new THREE.Vector3());

				} else if(c.name == "RobotBody" || c.name == "RobotDish") {

					if(c.children[0].material.materials !== undefined) {
						var m = c.children[0].material.materials[0];
					} else {
						var m = c.children[0].material;
					}

					m.specularMap = THREE.ImageUtils.loadTexture('./models/spec-map2.jpg');
					// m.bumpMap = THREE.ImageUtils.loadTexture('./models/road-spec-map.jpg');
					// m.bumpScale = .02;
					m.shininess = 30;
					// m.emissive = new THREE.Color(0x111111);
					m.specular = new THREE.Color(0x222222);
				} else if(c.name == "Fill" || c.name == "Key" || c.name == "Camera") {
					collada.scene.remove(c);
					collada.scene.children[i] = new THREE.Object3D();
					// scene.add(c);
				}
			}
			
			// scale our scene for shadow map purposes
			// collada.scene.scale.set(50, 50, 50);
			//scene.add(collada.scene);

			APP.sceneHolder = new THREE.Object3D();
			scene.add(APP.sceneHolder);

			var sceneLength = 16;

			for(var i = 0; i < 1; i++) {
				var x = collada.scene.clone();

				for(var p = 0; p < x.children.length; p++) {
					
					var c = x.children[p];

					if(c.name == "Thruster") {
						APP.thrusters.push(c.children[0]);
					}

					v = new THREE.PointLight(0xff6600, .05);
					v.position.y = -2.5;
					v.distance = 5;
					c.thrustLight = v;
					c.add(v);

				}

				x.position.z = sceneLength * i;
				x.rando = Math.random();
				APP.sceneHolder.add(x);
			}

			self.ready = true;

		});
	}

	this.update = function() {
		
		controls.update();
		
		APP.ticks++;
		APP.filmEffect.uniforms['time'].value = APP.ticks;




		var yearSpeed = .005;
		if(this.ready) {		

			for(var i = 0; i < APP.thrusters.length; i++) {

				var t = APP.thrusters[i];
				
				if(APP.clock.getElapsedTime() > APP.targetTime) {

					var m = new THREE.Mesh( new THREE.CircleGeometry(.5, 8), APP.flameMaterial);
					m.rando = Math.random();
					m.rotation.x = -90 * Math.PI / 180;
					m.position.y = -1.25;
					t.add( m );
				}


				if(t.children.length > 0) {
					for(c in t.children) {
						t.children[c].position.y -= .075;
						t.children[c].rotation.y += (30 * (t.children[c].rando - .5)) * Math.PI / 180;
						t.children[c].rotation.x += (30 * (t.children[c].rando - .5)) * Math.PI / 180;
						t.children[c].scale.x = t.children[c].scale.y = (t.children[c].position.y - 3) * .125;
						t.children[c].material.opacity = 1 - ((-t.children[c].position.y) / 4);
						if(t.children[c].position.y < -4) {
							t.remove(t.children[c]);
						}
					}
				}

				t.parent.thrustLight.intensity = Math.abs(Math.sin(Math.random() + APP.ticks * .1) * .45);

			}
			
			// APP.sceneHolder.position.z += .02;
			for(i = 0; i < APP.sceneHolder.children.length; i++) {
				var c = APP.sceneHolder.children[i];
				if(APP.sceneHolder.position.z + c.position.z > 32) {
					c.position.z -= APP.sceneHolder.children.length * 16;
				}
				c.position.y = Math.sin(APP.ticks * .025 + (c.rando * 3)) * .25;
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
