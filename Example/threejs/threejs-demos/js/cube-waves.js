var APP = APP || {};

APP.CubeWaves = function() {

	this.actors = [];
	this.ready = false;
	var self = this;

	this.init = function() {

		APP.startTime = new Date().getTime();
		camera.setLens(13, 7.49); // 16mm bolex
		scene.fog = new THREE.FogExp2(backgroundColor, .065);

		// load all our assets
		this.setupAssets();
//		camera.lookAt(new THREE.Vector3(0, 0, 0));
		// setup initial camera position
		camera.position.z = 4;
		camera.position.x = 0;
		camera.position.y = -15;
		camera.rotation.x = 75 * Math.PI / 180;

		APP.stage.cameraUpdate = function() {

		}

		//scene.fog = null;

	}

	this.setupAssets = function() {

		APP.materials = APP.materials || {};
		APP.models = APP.models || {};

		APP.pl = new THREE.PointLight(0xffffff, 5);
		APP.pl.position.y = 5;
		APP.pl.position.z = 21;
		scene.add(APP.pl);



		APP.block_geo = new THREE.BoxGeometry(1, 1, 1);
		APP.block_mat = new THREE.MeshPhongMaterial({ color: 0x0099ff, transparent: true, opacity: .55 });

		APP.GRID_SIZE = 30;
		APP.GRID = [];

		APP.GridContainer = new THREE.Object3D();
		scene.add(APP.GridContainer);
		APP.GridContainer.position.set(-APP.GRID_SIZE / 2, -APP.GRID_SIZE / 2, 0);

		for(var y = 0; y < APP.GRID_SIZE; y++) {
			APP.GRID.push([]);
			for(var x = 0; x < APP.GRID_SIZE; x++) {
				var m = new THREE.Mesh(APP.block_geo, APP.block_mat);
				m.position.set(x, y, 0);
				APP.GRID[y].push(m);
				APP.GridContainer.add(m);
			}
		}

		self.ready = true;

	}

	this.update = function() {
		
		// update the time
		APP.time = new Date().getTime() - APP.startTime;



		// update particles
		if(this.ready) {
			for(var y = 0; y < APP.GRID_SIZE; y++) {
				for(var x = 0; x < APP.GRID_SIZE; x++) {
					APP.GRID[y][x].position.z = Math.sin( APP.time * .001 + ( x / ( APP.GRID_SIZE * .5 ) ) ) * 2.75;
					APP.GRID[y][x].position.z += Math.cos( APP.time * .002 + ( y / APP.GRID_SIZE ) * 10 );
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
	APP.stage.play = new APP.CubeWaves();
	APP.stage.init();
}
