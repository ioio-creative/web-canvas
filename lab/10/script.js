if (!Detector.webgl)
  Detector.addGetWebGLMessage();
THREE.Cache.enabled = true;

var materialShaderNormal, materialShaderBlack;
var materialBlack, materialNormal, materialGround;
var mesh, ground;

var shadowCameraHelper;

var dirLight;

var container,
  stats;
var camera,
  cameraTarget,
  scene,
  renderer,
  composer;

var group;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

//Mouse / Touch
var targetRotation = 0;
var targetRotationOnMouseDown = 0;
var mouseX = 0;

var mouseXOnMouseDown = 0;
var pressState;

var cursorX = windowHalfX;
var cursorY = windowHalfY;
var pCursorX = windowHalfX;
var pCursorY = windowHalfY;

var prevTime, currTime;

//RUN
init();
animate();

//SETUP
function init() {
  container = document.createElement('div');
  document.body.appendChild(container);

  // CAMERA
  camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 10000);
  //camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 3500);
  camera.position.set(0, 0, 1000);
  cameraTarget = new THREE.Vector3(0, 0, 0);

  console.log(camera)
  // SCENE
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFFFFFF);
  scene.fog = new THREE.Fog(0x000000, 0, 5000);
  // LIGHTS

  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.color.setRGB(1, 1, 1);
  dirLight.position.set(0, 1.75, 500);
  //dirLight.position.multiplyScalar( 60 );
  scene.add(dirLight);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.x = 8192;
  dirLight.shadow.mapSize.y = 8192;
  var d = 6000;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.camera.far = 10000;
  dirLight.shadow.bias = -0.0001;
  dirLightHeper = new THREE.DirectionalLightHelper(dirLight, 10);
  //scene.add(dirLightHeper);

  // GROUND
  var groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
  materialGround = new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0xffffff});
  materialGround.color.setRGB(1, 1, 1);
  ground = new THREE.Mesh(groundGeo, materialGround);
  ground.rotation.x = 0;
  ground.position.y = -2000;
  scene.add(ground);

  ground.receiveShadow = true;

  group = new THREE.Group();
  group.position.y = 0;
  scene.add(group);

  materialBlack = new THREE.MeshPhongMaterial({color: 0x000000});
  //var materialWire = new MeshLineMaterial();
  materialNormal = new THREE.MeshNormalMaterial();
  materialBlack.onBeforeCompile = function(shader) {
    // console.log( shader )
    shader.uniforms.time = {
      value: 0
    };
    shader.uniforms.val = {
      value: 0
    };
    shader.vertexShader = 'uniform float time;\n' + 'uniform float val;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', [
      'float theta = sin( time + position.y ) / val;',
      'float c = cos( theta );',
      'float s = sin( theta );',
      'mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );',
      'vec3 transformed = vec3( position ) * m;',
      'vNormal = vNormal * m;'
    ].join('\n'));
    materialShaderBlack = shader;
  };

  materialNormal.onBeforeCompile = function(shader) {
    // console.log( shader )
    shader.uniforms.time = {
      value: 0
    };
    shader.uniforms.val = {
      value: 0
    };
    shader.vertexShader = 'uniform float time;\n' + 'uniform float val;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', [
      'float theta = sin( time + position.y ) / val;',
      'float c = cos( theta );',
      'float s = sin( theta );',
      'mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );',
      'vec3 transformed = vec3( position ) * m;',
      'vNormal = vNormal * m;'
    ].join('\n'));
    materialShaderNormal = shader;
  };

  // model
  var loader = new THREE.FBXLoader();
  loader.load('models/fbx/IOIO.fbx', function(geometry) {

    var selectedGeometry = geometry.children[0].geometry;

    mesh = new THREE.Mesh(selectedGeometry, materialBlack);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    //  console.log(geometry.children[0].geometry)
    console.log(materialNormal)
    materialNormal.wireframe = true;

    materialNormal.wireframeLinewidth = 7.8;
    geometry.scale.setScalar(2)
    scene.add(mesh);
    group.add(mesh);
  });

  /*
var loader = new THREE.JSONLoader();
loader.load( 'models/animated/flamingo.js', function( geometry ) {
  var material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 20, morphTargets: true, vertexColors: THREE.FaceColors, flatShading: true } );
  var mesh = new THREE.Mesh( geometry, material );
  var s = 0.35;
  mesh.scale.set( s, s, s );
  mesh.position.y = 15;
  mesh.rotation.y = -1;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add( mesh );
  var mixer = new THREE.AnimationMixer( mesh );
  mixer.clipAction( geometry.animations[ 0 ] ).setDuration( 1 ).play();
  mixers.push( mixer );
} );
*/
  // RENDERER
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // softer shadows
  container.appendChild(renderer.domElement);

  //Create Shader Passes
  var renderModel = new THREE.RenderPass(scene, camera);
  copyPass = new THREE.ShaderPass(THREE.CopyShader);
  composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderModel);
  composer.addPass(copyPass);
  copyPass.renderToScreen = true;

  composer = new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene, camera));

  var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
  var width = window.innerWidth || 2;
  var height = window.innerHeight || 2;
  effectFXAA.uniforms['resolution'].value.set(1 / width, 1 / height);
  effectFXAA.renderToScreen = true;
  composer.addPass(effectFXAA);
  console.log(effectFXAA)
  // STATS
  stats = new Stats();
  //container.appendChild( stats.dom );
  // EVENTS
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('touchstart', onDocumentTouchStart, false);
  document.addEventListener('touchend', onDocumentTouchEnd, false);
  document.addEventListener('touchmove', onDocumentTouchMove, false);
  //  document.addEventListener('keypress', onDocumentKeyPress, false);
  //  document.addEventListener('keydown', onDocumentKeyDown, false);

  window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

}
/*
function onDocumentKeyDown(event) {
  if (firstLetter) {
    firstLetter = false;
    text = "";
  }
  var keyCode = event.keyCode;
  // backspace
  if (keyCode == 8) {
    event.preventDefault();
    text = text.substring(0, text.length - 1);

    return false;
  }
}
function onDocumentKeyPress(event) {
  var keyCode = event.which;
  // backspace
  if (keyCode == 8) {
    event.preventDefault();
  } else {
    var ch = String.fromCharCode(keyCode);
    text += ch;
  }
}
*/
function onDocumentMouseDown(event) {
  pressState = true;
  event.preventDefault();
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('mouseup', onDocumentMouseUp, false);
  document.addEventListener('mouseout', onDocumentMouseOut, false);
  mouseXOnMouseDown = event.clientX - windowHalfX;
  targetRotationOnMouseDown = targetRotation;
}
function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
}
function onDocumentMouseUp(event) {
  pressState = false;
  document.removeEventListener('mousemove', onDocumentMouseMove, false);
  document.removeEventListener('mouseup', onDocumentMouseUp, false);
  document.removeEventListener('mouseout', onDocumentMouseOut, false);

}
function onDocumentMouseOut(event) {
  document.removeEventListener('mousemove', onDocumentMouseMove, false);
  document.removeEventListener('mouseup', onDocumentMouseUp, false);
  document.removeEventListener('mouseout', onDocumentMouseOut, false);
}
function onDocumentTouchStart(event) {
  pressState = true;
  alert("touch start");
  if (event.touches.length == 1) {
    event.preventDefault();
    mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;
  }
}
function onDocumentTouchEnd(event) {
  event.preventDefault();
  pressState = false;
  console.log("touch end")
  alert("touch end");
}
function onDocumentTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mouseX = event.touches[0].pageX - windowHalfX;
    targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;
  }
}
//
function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}
function render() {

  //camera
  camera.lookAt(cameraTarget);

  //mouseUpdate
  document.onmousemove = function(e) {
    cursorX = e.pageX;
    cursorY = e.pageY;
  }

  //TEXT ROATAION
  group.rotation.y += (targetRotation - group.rotation.y) * 0.05;

  var rotation = Math.abs(group.rotation.y * 180 / Math.PI % 360);
  if (rotation < 90) {
    rotation = rotation;
  } else if (rotation >= 90 && rotation < 180) {
    rotation = 180 - rotation;
  } else if (rotation >= 180 && rotation < 270) {
    rotation = Math.abs(180 - rotation);
  } else {
    rotation = Math.abs(360 - rotation);
  }
  //if(rotation < 90){
  var groundZPos = convertRange(rotation, [
    0, 90
  ], [15, 450])

  var dirLigtPosX = convertRange(cursorX, [
    0, window.innerWidth
  ], [-250, 250])

  ground.position.z = -groundZPos;
  //camera.position.x = -cursorX;
  //camera.position.y = cursorY;

  //Light
  dirLight.position.x = dirLigtPosX;
  var dirLigtIntensity = convertRange(Math.abs(dirLigtPosX), [
    0, 200
  ], [0.4, 0.8])
  dirLight.intensity = dirLigtIntensity;

  if (pressState != undefined) {
    if (pressState) {
      renderer.clear();
      renderer.render(scene, camera);
      mesh.material = materialNormal;
      dirLight.color.setRGB(0, 0, 0);
    } else {
      composer.render(scene, camera);
      mesh.material = materialBlack;
      dirLight.color.setRGB(1, 1, 1);
    }
  } else {
    composer.render(scene, camera);
  }

  //Shader
  var shaderOffsetY = convertRange(cursorY, [
    0, window.innerHeight
  ], [-5, 5])

  var shaderOffsetY2 = convertRange(cursorY, [
    0, window.innerHeight
  ], [10, 70])

  var shaderOffsetY3 = convertRange(cursorY, [
    0, window.innerHeight
  ], [200, 400])

  var shaderOffsetI;
  if (cursorX >= window.innerWidth / 2) {
    shaderOffsetI = convertRange(cursorX, [
      window.innerWidth / 2,
      window.innerWidth
    ], [300, 5])
    var shaderOffsetX = convertRange(cursorX, [
      window.innerWidth / 2,
      window.innerWidth
    ], [0.5, 0.25])
  } else {
    shaderOffsetI = convertRange(cursorX, [
      0, window.innerWidth / 2
    ], [5, 300])
    var shaderOffsetX = convertRange(cursorX, [
      0, window.innerWidth / 2
    ], [0.25, 0.5])
  }
  //console.log(shaderOffsetI)
  //Shader
  if (materialShaderBlack) {
    //materialShader.uniforms.time.value = performance.now() / 1000;
    //materialShader.uniforms.val.value = Math.sin(performance.now() / 500) * 60.0;
    materialShaderBlack.uniforms.time.value = performance.now() / 1000;
    materialShaderBlack.uniforms.val.value = Math.sin(shaderOffsetX) * 30;
  }
  if (materialShaderNormal) {
    materialShaderNormal.uniforms.time.value = performance.now() / shaderOffsetY3;
    materialShaderNormal.uniforms.val.value = Math.sin(performance.now() / shaderOffsetY3) * shaderOffsetY2;
    //  console.log(materialShader.uniforms)
  }
}
//Other Functions
function decimalToHex(d) {
  var hex = Number(d).toString(16);
  hex = "000000".substr(0, 6 - hex.length) + hex;
  return hex.toUpperCase();
}

function convertRange(value, r1, r2) {
  return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}
