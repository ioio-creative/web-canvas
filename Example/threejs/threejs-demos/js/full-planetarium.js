var APP = APP || {};
APP.simulationSpeed = 0;
APP.simTime = 0;
APP.targetTime = 0;
APP.cameraMinDistance = 6.651577100283082e-9;
var controls; 

// Sun radius: 695800
// Earth radius: 6,371km
// Earth orbit radius: 149600000
var Star = function(arguments) {
    
    // Run the Object3D constructor with the given arguments
    THREE.Object3D.apply(this, arguments);

	this.radius = arguments.radius || 1.;

    if(arguments.color === undefined) arguments.color = 0x0000ff;

    // add a sphere for the sun
    // this.sphere = new THREE.Mesh( new THREE.SphereGeometry(this.radius, 16, 32), new THREE.MeshBasicMaterial( { color: arguments.color } ) );
    
    // this.add(this.sphere);
};
// Make MyObject3D have the same methods as Mesh
Star.prototype = Object.create(THREE.Object3D.prototype);
// Make sure the right constructor gets called
Star.prototype.constructor = Star;

var Planet = function(arguments) {
    
    // Run the Object3D constructor with the given arguments
    THREE.Object3D.apply(this, arguments);

	this.radius = arguments.radius || 1.;

    if(arguments.color === undefined) arguments.color = 0x0000ff;

    this.texture = THREE.ImageUtils.loadTexture("textures/earth_1024_bw.jpg");

    this.container = new THREE.Object3D();
    this.add(this.container);

    // add a sphere for the planet
    this.sphere = new THREE.Mesh( new THREE.SphereGeometry(this.radius, 64, 32), new THREE.MeshBasicMaterial( { map: this.texture, color: 0xcccccc} ) );
    
    this.container.add(this.sphere);
};
// Make MyObject3D have the same methods as Mesh
Planet.prototype = Object.create(THREE.Object3D.prototype);
// Make sure the right constructor gets called
Planet.prototype.constructor = Planet;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;		

}

function logslider(position) {
  // position will be between 0 and 100
  var minp = 0;
  var maxp = 100;

  // The result should be between 100 an 10000000
  var minv = Math.log(1);
  var maxv = Math.log(4e12);

  // calculate adjustment factor
  var scale = (maxv-minv) / (maxp-minp);

  return Math.exp(minv + scale*(position-minp));
}

function toScreenPosition(obj, camera)
{
    var vector = new THREE.Vector3();

    var widthHalf = 0.5*renderer.context.canvas.width;
    var heightHalf = 0.5*renderer.context.canvas.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return { 
        x: vector.x,
        y: vector.y
    };

};

APP.ShaderDemo5 = function() {

	this.actors = [];
	this.ready = false;
	var self = this;

	sunRadius = 695800;

	this.init = function() {

		APP.sceneWrapper = new THREE.Object3D();
		scene.add(APP.sceneWrapper);

		APP.Sun = new Star({ radius: 1, color: 0xffffff });
		APP.sceneWrapper.add(APP.Sun);

		APP.Earth = new Planet({ radius: 0.009156419107615395 * .0000001 })
		// APP.Earth.position.z = 215 * .00000000001;
//		APP.Earth.rotation.x = 90 * Math.PI / 180;
		//APP.Earth.lookAt( new THREE.Vector3(1.3431, 1.04763, 132.615) ); // point earth towards Polaris
		APP.Earth.rotation.x = 90 * Math.PI / 180;
		APP.Sun.add(APP.Earth);

		APP.SunLight = new THREE.DirectionalLight(0xffffff, 1.7);
		APP.SunLight.target = APP.Earth;
		APP.SunLight.position.z = -.1;
		APP.SunLight.position.x = 41;
		APP.sceneWrapper.add(APP.SunLight);
		APP.sceneWrapper.rotation.x = -90 * Math.PI / 180;
		// APP.SunLabelGeo = new THREE.TextGeometry("Sun", { height: 1, size: 1, curveSegments: 3});
		// APP.SunLabel = new THREE.Object3D();
		// var m = new THREE.Mesh( APP.SunLabelGeo, new THREE.MeshBasicMaterial({ wireframe: true}) );
		// m.rotation.z = 90 * Math.PI / 180;
		// APP.SunLabel.add(m);
		// APP.SunLabel.scale.set(.0001, .0001, .0001);
		// scene.add( APP.SunLabel );

		$('#time').noUiSlider({
			start: 2015,
			connect: "lower",
			orientation: "horizontal",
			range: {
				'min': -50000 + (2015 * 2.35),
				'max': 50000
			}
		});

		// Bind the color changing function
		// to the slide event.
		$('#time').on('slide', function() {
			APP.targetTime = parseInt($("#time").val());
		});		



		$('#distance').noUiSlider({
			start: 0,
			connect: "lower",
			orientation: "vertical",
			range: {
				'min': 0,
				'max': 100
			}
		});

		APP.prevDistance = 0;

		$('#distance').on('slide', function() {
			var newDistance = parseFloat($("#distance").val());
			var delta = newDistance - APP.prevDistance;
			APP.prevDistance = newDistance;
			var ns = (1 / logslider( newDistance ));
			APP.targetDist = ns;
			//APP.sceneWrapper.scale.copy(new THREE.Vector3( ns, ns, ns ));
		});

		// APP.disableComposer = false;
		renderer.autoClear = false;
		//renderer.setClearColor( 0x000000, .15 );
		// APP.disableComposer = true;
		APP.startTime = new Date().getTime();
		APP.updateInterval = 75;
		APP.nextUpdate = APP.updateInterval;
		APP.spawnThreshold = .3;

		APP.stageSize = 10;

		camera.setLens(35, 43.2); // 16mm bolex
		scene.fog = null;//new THREE.FogExp2(backgroundColor, .065);

		scene.remove(camera);

		APP.cameraHolder = new THREE.Object3D();
		APP.cameraHolder.add(camera);


		APP.noiseTex = THREE.ImageUtils.loadTexture("textures/rgb-perlin-seamless-512.png");
		APP.noiseTex.wrapT = APP.noiseTex.wrapS = THREE.RepeatWrapping;
		// APP.noiseTex.minFilter = APP.noiseTex.maxFilter = THREE.NearestFilter;

		APP.particleTex = THREE.ImageUtils.loadTexture("textures/star-particle-clean.png")

		camera.position.z = APP.cameraMinDistance;
		camera.position.x = 0;
		camera.position.y = 0;
		camera.lookAt(new THREE.Vector3(0, 0, 0));

		controls = new THREE.TrackballControls( camera, $('canvas')[0] );

		controls.rotateSpeed = .2;
		controls.zoomSpeed = 5.2;
		controls.panSpeed = .3;

		controls.noZoom = true;
		controls.noPan = true;
		controls.noRoll = false;

		controls.minDistance = camera.position.z;
		controls.maxDistance = 50000;
		// controls.noRotate = true;

		var starsJson = $.getJSON('data/stardata.json', function(data) {

			APP.starData = data;

			var starGeo = new THREE.BufferGeometry();
			APP.starGeo = starGeo;

			starGeo.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(data.vertices), 3 ));
			starGeo.addAttribute( 'velocity', new THREE.BufferAttribute( new Float32Array(data.velocities), 3 ));
			starGeo.addAttribute( 'magnitude', new THREE.BufferAttribute( new Float32Array(data.magnitudes), 1 ));
			starGeo.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array(data.colors), 3 ));

			APP.attrs = {
				velocity: { type: 'v3', value: null },
				magnitude: { type: 'f', value: null }
			};

			APP.shaderMat = new THREE.ShaderMaterial( {
				transparent: true,
				vertexColors: THREE.VertexColors,
				alphaTest: .5,
				attributes: APP.attrs,
				uniforms: {
					"uTime": { type: "f", value: 0.0 },
					"uCameraDistance": { type: "f", value: 0.0 },
					"uCameraPosition": { type: "v3", value: camera.position.clone() },
					"uScale": { type: "f", value: 1. },
					"tDiffuse": { type: "t", value: APP.particleTex },
				},
				vertexShader: document.getElementById( 'vertexShader' ).textContent,
				fragmentShader: document.getElementById( 'fragmentShader' ).textContent
			} );


			APP.particleMat = new THREE.PointCloudMaterial({ size: 1, vertexColors: THREE.VertexColors, map: APP.particleTex, transparent: true });
			APP.particleMat.alphaTest = .05;


			APP.shaderPlane = new THREE.PointCloud(starGeo, APP.shaderMat);
			APP.shaderPlane.scale.multiplyScalar(10);
			APP.sceneWrapper.add(APP.shaderPlane);
			window.addEventListener( 'mousemove', onMouseMove, false );
			//APP.cameraHolder.parent = APP.Earth;


			// draw constellation lines
			var constellationGeo = new THREE.BufferGeometry();

			var lineVerts = [];
			var lineVels = [];

			// convert compressed strip data into single block of vertices
			for(i in data.lines) {

				// get the current points list for the line
				var ai = data.lines[i];
				var av = data.lineVelocities[i];

				// move on if it is blank
				if(ai[0] == null) break;


				for(var x = 0; x < ai.length - 1; x++) {

					var line_start = ai[x];
					var line_end = ai[x + 1];

					var line_vel_start = av[x];
					var line_vel_end = av[x + 1];

					// push the current line beginning point
					lineVerts.push(line_start[0]);
					lineVerts.push(line_start[1]);
					lineVerts.push(line_start[2]);

					// push the velocity for the beginning point
					lineVels.push(line_vel_start[0]);
					lineVels.push(line_vel_start[1]);
					lineVels.push(line_vel_start[2]);

					// push the current line ending point
					lineVerts.push(line_end[0]);
					lineVerts.push(line_end[1]);
					lineVerts.push(line_end[2]);

					lineVels.push(line_vel_end[0]);
					lineVels.push(line_vel_end[1]);
					lineVels.push(line_vel_end[2]);					

				}

			}

			constellationGeo.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(lineVerts), 3 ));
			constellationGeo.addAttribute( 'velocity', new THREE.BufferAttribute( new Float32Array(lineVels), 3 ));

			APP.lineAttrs = {
				velocity: { type: 'v3', value: null }
			};

			APP.lineMat = new THREE.ShaderMaterial( {
				transparent: true,
				vertexColors: THREE.VertexColors,
				alphaTest: .5,
				attributes: APP.lineAttrs,
				uniforms: {
					"uTime": { type: "f", value: 0.0 },
					"uCameraDistance": { type: "f", value: 0.0 },
					"uCameraPosition": { type: "v3", value: camera.position.clone() },
					"tDiffuse": { type: "t", value: APP.particleTex },
				},
				vertexShader: document.getElementById( 'vertexShaderLine' ).textContent,
				fragmentShader: document.getElementById( 'fragmentShaderLine' ).textContent
			});

			APP.constLines = new THREE.Line( constellationGeo, APP.lineMat, THREE.LinePieces );
			APP.sceneWrapper.add(APP.constLines);

			$(".constellationSwitch").click(function() {
				if( $(this).hasClass('off') ) {
					$(this).removeClass('off');
					APP.constLines.visible = true;
				} else {
					$(this).addClass('off');
					APP.constLines.visible = false;
				}
			})

			self.ready = true;
			$("#loader").addClass('loaderOff');

			setTimeout(function() {
				$("#loader").css({ display: "none" });
			}, 1100);

		});


		// controls.staticMoving = true;
		controls.dynamicDampingFactor = 0.25;
			
		scene.add(APP.cameraHolder);
		APP.zoomDivider = 12;




		APP.stage.cameraUpdate = function() {

		}

		window.addEventListener("mousewheel", MouseWheelHandler, false);
		function MouseWheelHandler(e) {

		}


		scene.fog = null;//new THREE.FogExp2(0, .0005);

		// load all our assets
		this.setupAssets();
	}

	this.setupAssets = function() {

		APP.materials = APP.materials || {};
		APP.models = APP.models || {};

	}

	this.tick = function() {

	}

	this.update = function() {
		controls.update();



		// $(".console").text([camera.position.x, camera.position.y, camera.position.z].join(","));
		APP.simTime += (APP.targetTime - APP.simTime) * .1;



		APP.Earth.container.rotation.y += .025 * Math.PI / 180;
		var cy = 2015 + APP.simTime;
		
		if(cy < 0) {
			var suffix = "BCE";
		} else {
			var suffix = "CE";
		}
	
		$(".currentYear .year").text( Math.abs(Math.floor(2015 + APP.simTime)) + " " + suffix);

		var ly = ( 1 / APP.sceneWrapper.scale.x ) * .000000012 - .000000012;
		if(ly < 3) {
			// ly = (ly / 0.00000005215529).toFixed(2) + " <small>million miles</small>"; 
			ly = ly.toFixed(4) + " <small>lightyears</small>";
		} else {
			ly = Math.round(ly) + " <small>lightyears</small>";
		}
		$(".currentDist .distance").html( ly );
		// update the time
		APP.time = new Date().getTime() - APP.startTime;
		
		// APP.shaderPlane.rotation.y += .05 * Math.PI / 180;
		// APP.shaderPlane.rotation.x += .025 * Math.PI / 180;
		if(APP.time > APP.nextUpdate) {
			
			APP.nextUpdate = APP.time + APP.updateInterval;
			this.tick();
			// console.log("tick");
		}

		if(self.ready) {
		var tt = (APP.targetDist - APP.sceneWrapper.scale.x) * .5;
		var newPos = new THREE.Vector3( tt, tt, tt );
		APP.sceneWrapper.scale.add( newPos );
		// raycaster.setFromCamera( mouse, camera );
		// // calculate objects intersecting the picking ray
		// var intersects = raycaster.intersectObject( APP.shaderPlane );

		// if(intersects.length) {
		// 	console.log(intersects[intersects.length - 1].index);
		// }
			// APP.SunLabel.lookAt(camera.position);
			// console.log(toScreenPosition(APP.shaderPlane, camera));
			APP.shaderMat.uniforms['uTime'].value = APP.simTime;
			APP.shaderMat.uniforms['uScale'].value = APP.sceneWrapper.scale.x;
			APP.lineMat.uniforms['uTime'].value = APP.simTime;

			var v = camera.position.clone();
			APP.shaderMat.uniforms['uCameraPosition'].value = v;
			APP.lineMat.uniforms['uCameraPosition'].value = v;

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
	APP.stage.play = new APP.ShaderDemo5();
	APP.stage.init();

}
