var APP = {};

var q = function(options, myVar, myDefault) {
	

	function isDefined(target, path) {
	    if (typeof target != 'object' || target == null) {
	        return false;
	    }

	    var parts = path.split('.');

	    while(parts.length) {
	        var branch = parts.shift();
	        if (!(branch in target)) {
	            return false;
	        }

	        target = target[branch];
	    }

	    return true;
	}
}

var def = function(variable, defaultValue) {
	if(typeof(variable) == 'undefined') {
		return defaultValue;
	} else {
		return variable;
	}
}

APP.FallingSphereActor = function( options ) {

	var self = this;
	this.alive = true;
	this.mesh;
	this.options = options || {};

	//typeof(this.options.position) == 'undefined' ? this.options.position = new THREE.Vector3(0, 0, 0) : false;
	this.init = function() {
		var mat = new THREE.MeshPhongMaterial(
			{ 
				color: 0x666666,
				specular: 0x666666,
				shininess: 100,
				map: THREE.ImageUtils.loadTexture("textures/styrofoam.jpg"),
				normalMap: THREE.ImageUtils.loadTexture("textures/styrofoam_NRM.png"),
				specularMap: THREE.ImageUtils.loadTexture("textures/styrofoam_SPEC.png")
			}

		);
		this.options.position = def( this.options.position, new THREE.Vector3(0, 0, 0) );
		this.options.velocity = def( this.options.velocity, new THREE.Vector3(Math.random() *  .25 - .125, Math.random() *  .25 - .125, Math.random() *  .25 - .125) );
		this.options.torque = def( this.options.torque, new THREE.Vector3(0, 0, 0) );
		this.options.size = def( this.options.size, new THREE.Vector3(1, 1, 1) );

		//this.mesh = new THREE.Mesh(new THREE.BoxGeometry(this.options.size.x, this.options.size.y, this.options.size.z), mat );
		this.mesh = new THREE.Mesh(new THREE.SphereGeometry(this.options.size.x * .5, 16, 32), mat );
		this.mesh.position = this.options.position;
		scene.add( this.mesh );
	}

	this.destroy = function() {
		scene.remove(this.mesh);
	}

	this.update = function() {
		var x = self.mesh.position.clone();
		x.normalize().multiplyScalar(-.0067);
		self.options.velocity.add( x );
		self.mesh.rotation.x += this.options.torque.x * Math.PI / 180;
		self.mesh.rotation.y += this.options.torque.y * Math.PI / 180;
		self.mesh.rotation.z += this.options.torque.z * Math.PI / 180;
		self.mesh.position.add(self.options.velocity);

	}

};

APP.FallingSpheresPlay = function() {

	this.actors = [];

	this.init = function() {
		this.actors = [];
		camera.position.z = 3;
		// ambient light
		var ambient = new THREE.AmbientLight( backgroundColor );
		scene.add( ambient );

		// point lights
		var lightCount = 3;
		for(var x = 0; x < lightCount; x++) {
				var lpos = new THREE.Vector3(x - (lightCount / 2) + .5, 0, 0);//new THREE.Vector3(x - 7, 0, -2);
				var c = (Math.random()*0xffffff / 2) + (0x888888);
				var m = new THREE.Mesh(new THREE.SphereGeometry(.25, 8, 16), new THREE.MeshBasicMaterial({ color: c }))
				m.position.add(lpos);
				scene.add(m);


				var point = new THREE.PointLight( c, 1, 10 );
				point.position.add(lpos);
				scene.add( point );	
		}

		console.log("video turntable initialized.");
	}

	this.update = function() {
		for(var i = 0; i < this.actors.length; i++) {
			this.actors[i].update();
			//if(this.actors[i].mesh.position.y < -6) {
			//	this.remove(this.actors[i]);
			//}
		}
		if(this.actors.length < 10) {
			var size = Math.random() + .1;
			this.add(new APP.FallingSphereActor({ size: new THREE.Vector3(size, size, size), position: new THREE.Vector3(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 5 - 2.5), torque: new THREE.Vector3(Math.random() * 6 - 3, Math.random() * 6 - 3, 0) }));
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
	APP.stage.play = new APP.FallingSpheresPlay();
	APP.stage.init();
}
