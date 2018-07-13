var APP = APP || {};

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

		// load all our assets
		this.setupAssets();

    camera.position.x = 25;
    camera.position.y = 5;

		this.controls = new THREE.TrackballControls( camera );
    this.controls.rotateSpeed = .050;
		this.controls.zoomSpeed = .22;
		this.controls.panSpeed = .03;

		this.controls.noZoom = false;
		this.controls.noPan = true;
		this.controls.noRoll = true;
		// this.controls.noRotate = true;

		// this.controls.staticMoving = true;
		this.controls.dynamicDampingFactor = .95;

var self = this;

		APP.stage.cameraUpdate = function() {
      self.controls.update();
		}

		scene.fog = null;

	}

	this.setupAssets = function() {

		var self = this;

		APP.materials = APP.materials || {};
		APP.models = APP.models || {};

		APP.materials.lightMaterial = new THREE.MeshBasicMaterial(
		{
			color: 0x1EE700
		});
		// load collada assets
		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load( './models/war-room-wip.dae', function ( collada ) {
			var defaultMat = new THREE.MeshPhongMaterial({ color: 0xff0000 });
			collada.scene.traverse( function ( child ) {
				if ( child instanceof THREE.Object3D ) {
					//console.log(child.name);
					if(child.name == "USSR-Map") {
						child.children[0].material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("textures/war-room/russian-map-sm.jpg") })
					} else if(child.name == "US-Map") {
						child.children[0].material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("textures/war-room/us-map-texture.jpg") })
					} else if(child.name == "Europe-Map") {
						child.children[0].material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("textures/war-room/europe-map-texture.jpg") })
					} else if(child.name == "Polar-Map") {
						child.children[0].material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("textures/war-room/russian-map-sm.jpg") })
					} else if(child.name == "Table-Screen") {
						child.children[0].material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("textures/war-room/wall-graph.png") })
					} else if(child.name == "Text-Screen") {
						child.children[0].material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("textures/war-room/text-texture.png") })
					} else if(child.name == "BinderCover" || child.name.split('_')[0] == "BinderCover") {
						console.log(child.name);
						child.children[0].material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("textures/war-room/megadeaths-binder-baked.jpg") })
					} else if(child.name == "Floor") {
						//child.children[0].material.normalMap = THREE.ImageUtils.loadTexture("textures/war-room/WaveNormals.png");
						//child.children[0].material.needsUpdate = true;
						var bumpTex = THREE.ImageUtils.loadTexture("textures/war-room/tile-bump.jpg?x=" + Math.random());
						bumpTex.wrapS = bumpTex.wrapT = THREE.RepeatWrapping;
						bumpTex.generateMipmaps = false;
						bumpTex.magFilter = THREE.LinearFilter;
						bumpTex.minFilter = THREE.LinearFilter;
						child.children[0].material = new THREE.MeshPhongMaterial({
							color: 0x000000,
							specular: 0x222222,
							shininess: 25,
							bumpMap: bumpTex,
							bumpScale: .025
						});
					}
				}
			});

			scene.add(collada.scene);

		});
	}

	this.update = function() {


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
