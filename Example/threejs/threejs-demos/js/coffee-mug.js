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

APP.materials.boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
APP.geometry.boxGeometry = new THREE.BoxGeometry(.035, .035, .035);

APP.particleSystemContainer = new THREE.Object3D();

APP.dialog = [
	['Frank', '... anyways, half way down the mountain, Ernie wiped out and got hurt.  Several of us had already stopped around him, and my father skied to a stop next to us and said, “Don’t worry Ian, I’ll get help!” and skied off down the hill.'],
	['Old Jack', 'Huh.'],
	['Frank', 'But it was Ernie, not Ian.  Ian was fine.  We didn’t try to correct him because we knew he didn’t like Ernie, and even though we didn’t like Ernie that much either, we were Boy Scouts and we were supposed to do the right thing, and letting Ernie die on that mountain didn’t seem like the right thing.'],
	['Old Jack', 'Your dad always was a bastard.'],
	['Frank', 'So we let my father think he was getting help for Ian, so that the medic guys would come up and get Ernie with a snow mobile.  I don’t recollect how my father reacted when he found out it was Ernie that got hurt.  I do remember that the cover band in the ski lodge was playing incredibly loud and I didn’t care for it even the least bit.  It was a really long day.'],
	['Old Jack', 'Sounds like it.'],
	['Bob',"Hey there, Jim."],
	['Jim',"Hey Bob.  What's new?"],
	['Bob',"Oh, not much.  Knee's been acting up."],
	['Jim',"Yeah, been wet weather."],
	['Bob',"Bet they'd love some of this out in California."],
	['Jim',"Yeah, wish I was out there."],
	['Bob',"Well, maybe someday."],
	['Jim',"Someday my ass.  I'm too old to move anywhere but Florida."],
	['Bob',"Too humid down there, couldn't stand it."],
	['Jim',"Gets pretty bad here in the summertimes."],
	['Al',"Hey fellas."],
	['Bob',"Hey there, Al."],
	['Jim',"How's it going, Al?"],
	['Al',"Oh, fine.  Knee's acting up."],
	['Bob',"Mine too.  Weather?"],
	['Al',"Nah, been jogging.  Pushed too hard."],
	['Jim',"Look at Al.  Jogging."],
	['Al',"Good one, Jim."],
	['Jim',"Thanks."],
	['Frank', 'I thought they were joking when they said his nickname was “ADD DJ.”  Jesus christ that was like the most wrong I’ve ever been.'],
	['Denise', 'Hey fellas.'],
	['Everyone', 'Denise!'],
	['Denise', 'Looks like you haven`t moved since I left.'],
	['Al', 'Jack hasn`t anyways.'],
	['Old Jack', 'Bite me, Al.'],
	['Al', 'No thanks, Jack.'],
	['Bob', 'You seen Mack Mack`s people lately, D?'],
	['Denise', 'I don’t really know what their story was, but they moved after Gerry threw all their potted plants into their swimming pool in the middle of the night.'],
	['Bob', 'That`s one way to do it.'],
	['Frank', 'Bucks County isn’t the type of place you find a lot of support for government branded terrorist groups, but i swear to you that if the ELF/ALF had started burning down Toll Brothers houses here during the 80s and 90s, nobody would have even batted an eye.'],
	['Bob', 'Who`s he talking to?'],
	['Frank', 'Some of the time, you didn’t even need people to take them down, the one behind my aunt’s place blew down.  Big gust of wind came through during a thunderstorm, lifted the whole roof up, and when it plopped back down again, it crushed the whole damn house into a pile of splinters.  Four thousand square foot mcmansion to empty lot in about 10 seconds.'],
	['Bob', 'Al, can you pass the sugar?'],
	['Al', 'No.'],
	['Frank', 'Before that it used to be a corn field.  From up where the old textile mill had been, all the way down to the edge of the reservoir.  I’ve heard a bunch of stories about the farm, George’s farm, it was, but they’re not my stories to tell.  Stories about chicken shit and hay forts and old man George being a bit of a pervert.'],
	['Denise', 'Cigarette machine`s broken, Jack.'],
	['Al', 'Broken and I`m pretty sure illegal.'],
	['Old Jack', 'Not yet, not till September.'],
	['Frank', 'All my stories start after they tore up the field to start building, and most of them are about the people that moved in to the houses.  The weird kid with the nice clothes that was allowed to play with us sometime that moved into the house just below the new house the younger George had built up by the road.'],
	['Jim', 'One more, Denise.'],
	['Denise', 'Please?'],
	['Jim', 'Please, Denise.  PLEASE.'],
	['Frank', 'The Russian guy that got busted for manufacturing drug paraphernalia.  The British guy with the awesome circular driveway at the house right on the cove of the reservoir, where the bottom corner of the corn field had been.  The geese that came back every single year and covered the whole neighborhood in shit.  They never came into the old neighborhood, only the new one.  It was hilarious.'],
	['Bob', 'Well I better head into the office.'],
	['Al', 'You mean your van?'],
	['Bob', 'Well, the garage I keep the van in.'],
	['Al', 'Got any candy in there?'],
	['Bob', 'You wish.'],
	['Frank', 'All those houses were huge compared to the old houses.  They had weird angles and two story foyers and no one was ever outside.  It looked better the last time I drove through, all the little trees they had planted are almost big now, it looks more like a real street where real people live.  Not quite, but it’s getting closer.']
];

backgroundColor = 0x000000;

THREE.Utils = {
    cameraLookDir: function(camera) {
        var vector = new THREE.Vector3(0, 0, -1);
        vector.applyEuler(camera.rotation, camera.rotation.order);
        return vector;
    }
};


		

APP.BoxActor = function( options ) {

	var self = this;
	this.alive = true;
	this.mesh;
	this.options = options || {};

	APP.stage.setupComposer = function() {

			composer = new THREE.EffectComposer( renderer );
			composer.addPass( new THREE.RenderPass( scene, camera ));
			var effect = new THREE.ShaderPass( THREE.Technicolor3Shader );
			//composer.addPass( effect );		

			// var effect = new THREE.ShaderPass( THREE.FXAAShader );
			// effect.uniforms[ 'h' ].value = 50;
			// effect.uniforms[ 'r' ].value = .35;
			// composer.addPass( effect );	



			var effect = new THREE.ShaderPass( THREE.FilmShader );
			effect.renderToScreen = true;
			composer.addPass( effect );		
			effect.uniforms['sIntensity'].value = 0.0;
			effect.uniforms['grayscale'].value = false;
			effect.uniforms['nIntensity'].value = .96;
			filmEffect = effect;
			
			composer.addPass( effect );
		};


	//typeof(this.options.position) == 'undefined' ? this.options.position = new THREE.Vector3(0, 0, 0) : false;
	this.init = function() {
	

		this.mat = APP.materials.boxMaterial ;
		this.options.centerPosition = new THREE.Vector3(Math.random() *  .25 - .125, Math.random() *  .25 - .125, Math.random() *  .25 - .125);
		this.options.position = def( this.options.position, new THREE.Vector3(Math.random() *  .25 - .125, Math.random() *  .25 - .125, Math.random() *  .25 - .125).multiplyScalar(7.25) );
		this.options.velocity = def( this.options.velocity, new THREE.Vector3(0, 0, 0) );
		this.options.torque = def( this.options.torque, new THREE.Vector3(Math.random() *  .25 - .125, Math.random() *  .25 - .125, Math.random() *  .25 - .125)  );
		this.options.size = def( this.options.size, new THREE.Vector3(1, 1, 1) );
		// this.options.velocity.multiplyScalar(100.);
		this.mesh = new THREE.Mesh(APP.geometry.boxGeometry, this.mat);
		this.mesh.position = this.options.position;
		APP.particleSystemContainer.add( this.mesh );
	}

	this.destroy = function() {
		APP.particleSystemContainer.remove(this.mesh);
	}

	this.update = function() {

		var v = new THREE.Vector3().set( this.options.centerPosition.x, this.options.centerPosition.y, this.options.centerPosition.z ).sub(self.mesh.position).normalize().multiplyScalar(.0001); 	

		self.options.velocity.add( v );


		self.mesh.rotation.x += this.options.torque.x * Math.PI / 180;
		self.mesh.rotation.y += this.options.torque.y * Math.PI / 180;
		self.mesh.rotation.z += this.options.torque.z * Math.PI / 180;
		self.mesh.position.add(self.options.velocity);
		if( self.mesh.position.distanceTo( new THREE.Vector3() ) > 1.5) {
			self.options.velocity.multiplyScalar(-.75);
		}
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

		


		// APP.cameraHolder.position = new THREE.Vector3();
		camera.position.set(0, 20, -36);
		camera.lookAt(new THREE.Vector3())
		camera.setLens(70); // 16mm bolex
		scene.remove(camera);
		APP.cameraHolder = new THREE.Object3D();
		APP.cameraHolder.add(APP.yawObject);
		scene.add(APP.cameraHolder);
		APP.cameraHolder.add(camera);
		// cameraHolder.rotation.y = 270 * Math.PI / 180;
		// controls = new THREE.TrackballControls( camera );

		// controls.rotateSpeed = 1.0;
		// controls.zoomSpeed = 2.2;
		// controls.panSpeed = .3;

		// setup timeline

		// APP.tl.to(camera.position, 1, { y: 2000, z: -1500 }, 0);
		
		APP.tl.play();

		// controls.noZoom = true;
		// controls.noPan = true;
		// controls.noRoll = true;
		// controls.noRotate = true;


		// controls.staticMoving = true;
		// controls.dynamicDampingFactor = 0.3;

		var walkSpeed = .5;

		APP.stage.cameraUpdate = function() {

			// yawObject.rotation.y -= (yawObject.rotation.y + (mouseX * .5) * Math.PI / 180) * .05;
			// pitchObject.rotation.x -= (pitchObject.rotation.x + (mouseY * .5) * Math.PI / 180) * .05;

			// var hDir = THREE.Utils.cameraLookDir(yawObject);
			// var vDir = THREE.Utils.cameraLookDir(pitchObject);

		}

		scene.fog = null;//new THREE.FogExp2(backgroundColor, .015);

	}

	this.setupAssets = function() {

		var self = this;
		// scene.add(APP.particleSystemContainer);
		APP.materials = APP.materials || {};
		APP.models = APP.models || {};
		APP.clock = new THREE.Clock(true);

		self.sun = new THREE.DirectionalLight(0xffcc99, 0);
		self.sun.position.set(1000, 1000, 0);

		self.sun.castShadow = true;
		self.sun.intensity = 0;

		self.sun.shadowDarkness = .5;
		self.sun.shadowMapWidth = 1024;
		self.sun.shadowMapHeight = 1024;
		scene.add(self.sun);

			APP.hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.1 );
			APP.hemiLight.color.setHSL( 0.6, .5, 0 );
			APP.hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
			APP.hemiLight.position.set( 60, 50, 50 );
			scene.add( APP.hemiLight );	

		self.policeLights = new THREE.Object3D();
		self.policeLights.masterBrightness = 0;
		self.policeLights.blue = new THREE.PointLight( 0x0000ff, 1 );
		self.policeLights.red = new THREE.PointLight( 0xff0000, 1 );
		self.policeLights.add( self.policeLights.blue );
		self.policeLights.add( self.policeLights.red );
		self.policeLights.position.set(100, 5, 5);
		// self.policeLights.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial()));
		scene.add(self.policeLights);

		// load collada assets
		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load( './models/coffee-mug2.dae', function ( collada ) {
			var defaultMat = new THREE.MeshPhongMaterial({ color: 0xff0000 });

			APP.colladaScene = collada.scene;
			self.policeLights.parent = APP.colladaScene;
			APP.hemiLight.parent = APP.colladaScene;
			// collada.scene.traverse( function ( child ) {
			for(var i = 0; i < collada.scene.children.length; i++) {
				
				var child = collada.scene.children[i];

				// if ( child instanceof THREE.Object3D ) {
					console.log(child);
					if(["Mug", "Mustard.001", "Mustard"].indexOf(child.name) > -1) {
						child.children[0].castShadow = true;
						// child.children[0].receiveShadow = true;
						if(child.name == "Mug") {
							self.mug = child.children[0];
							self.sceneTarget = new THREE.Object3D();
							scene.add(self.sceneTarget);
							// self.sceneTarget.position = self.mug.position.clone();
							self.sun.target = self.sceneTarget;

						}
						
					} else if(child.name == "Plane") {
						child.children[0].material.shininess = 50;
						child.children[0].material.map = THREE.ImageUtils.loadTexture("textures/diner-table.jpg");
						child.children[0].material.bumpMap = THREE.ImageUtils.loadTexture("textures/Grungemaps0135_L.jpg");
						child.children[0].material.bumpScale = .001;
						child.children[0].receiveShadow = true;
						APP.dinerCounter = child.children[0];
					} else if(child.name == "Coffee") {

					} else {
						collada.scene.remove(child);
					}
				// }

			}
			
			// scale our scene for shadow map purposes
			collada.scene.scale.set(50, 50, 50);
			scene.add(collada.scene);
			collada.scene.rotation.x = 23.439281 * Math.PI / 180;
			collada.scene.rotation.z = 5 * Math.PI / 180;

			APP.tl.add("sunset", "+=40");
			APP.tl.to(self.sun, 5, { intensity: 1 }, 2);
			APP.tl.to(APP.hemiLight, 2, { intensity: .5 }, 2);
			APP.tl.to(collada.scene.rotation, 40, { y: 180 * Math.PI / 180, z: -30 * Math.PI / 180 }, 0, 0);
			APP.tl.to(self.sun, 2, { intensity: 0 }, "-=2");
			APP.tl.to(APP.hemiLight, .05, { intensity: 2 }, "+=0");
			APP.tl.call(function() { 
				// renderer.shadowMapAutoUpdate = false;
				// renderer.clearTarget( A.shadowMap );
			});

			// police cars go by
			APP.policeCar = new TimelineLite();
			APP.policeCar.to(self.policeLights.position, 5, { x: -100 }, 0);
			APP.policeCar.to(self.policeLights, 1, { masterBrightness: 0 }, "+=1");
			APP.policeCar.to(self.policeLights, .25, { masterBrightness: 1 }, 0);
			APP.tl.add(APP.policeCar, "sunset+=6");
			APP.tl.to(APP.hemiLight, 2, { intensity: 0 });
			// APP.tl.add(APP.policeCar, "sunset+=10");
		// // create the universe (so we can eventually make an apple pie from scratch)
		// self.solarSystem = new THREE.Object3D();
		// self.solarSystem.position.set(0,0,0);
		// scene.add(self.solarSystem);

		// // make a holder for the planet itself, and all things attached to it
		// self.planetGround = new THREE.Object3D();
		// // rotate the ground to the latitude of philadelphia
		// // self.planetGround.rotation.x = 39.95 * Math.PI / 180;
		// self.planetGround.rotation.x = (90 - 39.95) * Math.PI / 180;

		// // make a holder for the planet that will account for axial tilt
		// self.planetAxialTilt = new THREE.Object3D();
		// // rotate it to account for that
		// self.planetAxialTilt.rotation.x = 23.439281 * Math.PI / 180;
		// self.planetAxialTilt.rotation.y = 50 * Math.PI / 180;

		// // make our scene the parent of our camera
		APP.cameraHolder.parent = collada.scene;
		// camera.position.set(-0.2742278060620061, 22.787148668710703, -17);


		// self.planetGround.add(collada.scene);
		// self.planetAxialTilt.add(self.planetGround);


		// self.solarSystem.add(self.planetAxialTilt);
		// self.planetAxialTilt.position.x = -1000;




		// self.sunMesh = new THREE.Mesh( new THREE.CircleGeometry(25, 32), new THREE.MeshBasicMaterial());
		// self.sunMesh.rotation.x += -90 * Math.PI / 180;
		// self.sun.add(self.sunMesh);
		
			// self.dinerLight = new THREE.PointLight(0xaaddff, .5);
			// self.dinerLight.position.z = -1050;
			// self.dinerLight.position.y = 850;
			// self.dinerLight.castShadow = false;
			// self.planetGround.add(self.dinerLight);

			// scene.add( new THREE.AmbientLight(0x0000ff) );
			// self.sun.target = self.mug;
			self.ready = true;

		});





	}

	this.update = function() {
		// controls.update();
		// this.cameraUpdate();
		APP.ticks++;
		APP.cameraHolder.rotation.y = (mouseX * .02) * Math.PI / 180;
		APP.cameraHolder.rotation.x = (-mouseY * .06) * Math.PI / 180;
		APP.tl.seek(APP.clock.getElapsedTime() - APP.startTimeOffset);
		if(APP.clock.getElapsedTime() > APP.targetTime) {
			
			// APP.targetTime += APP.dialogDelay;

			// APP.characterCounter = 0;
			

			// $(".dialogArea").append("<p></p>");

			// // $(".dialogArea").append("<p><strong>" + l[0] + ":</strong> " + l[1] + "</p>");

			// // APP.dialogCounter++;
			// if(APP.dialogCounter >= APP.dialog.length - 1) {
			// 	APP.dialogCounter = 0;
			// }

			// while( $(".dialogArea p").length > APP.dialogMaxLength ) {
			// 	$(".dialogArea p")[0].remove();
			// }

		}


		var l = APP.dialog[ APP.dialogCounter ];
		// var s = "<p><strong>" + l[0] + ":</strong> " + l[1] + "</p>";
		var s = l[1];

		if( APP.characterCounter < s.length + 1) {
			if( APP.ticks % 2 == 0) {
				var d = $(".dialogArea p:last-child");
				$(".dialogArea p:last-child").append(s[APP.characterCounter]);
				APP.characterCounter++;				
			}

		} else {

			if(APP.nextLineTimeout === undefined) {
				APP.nextLineTimeout = setTimeout(function() {
					APP.characterCounter = 0;
					APP.dialogCounter++;
					var l = APP.dialog[ APP.dialogCounter ];
					$(".dialogArea").append("<p><strong>" + l[0] + "</strong>: </p>");
					APP.nextLineTimeout = undefined;

			if(APP.dialogCounter >= APP.dialog.length - 1) {
				APP.dialogCounter = 0;
			}

			while( $(".dialogArea p").length > APP.dialogMaxLength ) {
				$(".dialogArea p")[0].remove();
			}
					
				}, APP.dialogDelay * 1000);				
			}




		}

		var yearSpeed = .005;
		if(this.ready) {
			// self.solarSystem.rotation.y += (yearSpeed / 365) * Math.PI / 180;
			// self.planetAxialTilt.rotation.y += yearSpeed * Math.PI / 180;
			self.policeLights.red.intensity = (APP.ticks % 10 <= 1) * self.policeLights.masterBrightness;
			self.policeLights.blue.intensity = (APP.ticks % 15 <= 1)  * self.policeLights.masterBrightness;				

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
