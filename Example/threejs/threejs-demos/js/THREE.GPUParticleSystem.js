THREE.GPUParticleSystem = function( options ) {

  var self = this;
  var options = options || {};

  self.PARTICLE_COUNT = options.maxParticles || 1000000;
  self.PARTICLE_CONTAINERS = options.containerCount || 1;
  self.PARTICLES_PER_CONTAINER = Math.ceil( self.PARTICLE_COUNT / self.PARTICLE_CONTAINERS );
  self.PARTICLE_CURSOR = 0;
  self.time = 0;

  // preload a million random numbers
  self.rand = [];

  for(var i=1e5; i > 0; i--) {
    self.rand.push( Math.random() - .5 );
  }

  self.random = function() {
    return ++i >= self.rand.length ? self.rand[i=1] : self.rand[i];
  }

  self.particleNoiseTex = THREE.ImageUtils.loadTexture("textures/perlin-512.png");
  self.particleNoiseTex.wrapS = self.particleNoiseTex.wrapT = THREE.RepeatWrapping;

  self.particleSpriteTex = THREE.ImageUtils.loadTexture("textures/particle2.png");
  self.particleSpriteTex.wrapS = self.particleSpriteTex.wrapT = THREE.RepeatWrapping;

  self.particleShaderMat = new THREE.ShaderMaterial( {
    transparent: true,
    depthWrite: false,
		uniforms: {
			"uTime": { type: "f", value: 0.0 },
      "uScale": { type: "f", value: 1.0 },
    	"tNoise": { type: "t", value: self.particleNoiseTex },
      "tSprite": { type: "t", value: self.particleSpriteTex }
		},
    attributes: {
      "particlePositionsStartTime": { type: "v4", value: [] },
      "particleVelColSizeLife": { type: "v4", value: [] }
    },
    blending: THREE.AdditiveBlending,
		vertexShader: document.getElementById( 'particleVertexShader' ).textContent,
		fragmentShader: document.getElementById( 'particleFragmentShader' ).textContent
	} );

  self.particleShaderMat.defaultAttributeValues.particlePositionsStartTime = [0, 0, 0, 0];
  self.particleShaderMat.defaultAttributeValues.particleVelColSizeLife = [0, 0, 0, 0];

  self.particleContainers = [];


  // extend Object3D
	THREE.Object3D.apply(this, arguments);

  this.init = function() {

    for( var i = 0; i < self.PARTICLE_CONTAINERS; i++ ) {

      var c = new THREE.GPUParticleContainer( self.PARTICLES_PER_CONTAINER, self );
      self.particleContainers.push( c );
      self.add( c );

    }

  }

  this.spawnParticle = function( options ) {

    self.PARTICLE_CURSOR++;
    if( self.PARTICLE_CURSOR >= self.PARTICLE_COUNT ) {
      self.PARTICLE_CURSOR = 1;
    }

    var currentContainer = self.particleContainers[ Math.floor( self.PARTICLE_CURSOR / self.PARTICLES_PER_CONTAINER ) ];

    currentContainer.spawnParticle( options );

  }

  this.update = function( time ) {
    for( var i = 0; i < self.PARTICLE_CONTAINERS; i++ ) {

      self.particleContainers[i].update( time );

    }
  };

  this.init();

}

THREE.GPUParticleSystem.prototype = Object.create(THREE.Object3D.prototype);
THREE.GPUParticleSystem.prototype.constructor = THREE.GPUParticleSystem;
