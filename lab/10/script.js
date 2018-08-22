if (!Detector.webgl)
  Detector.addGetWebGLMessage();
THREE.Cache.enabled = true;

var composer;
var materialShader;
var materialShader2;
var materialBlack;
var materialNormal;
var mesh;

var container,
  stats,
  color;
var camera,
  cameraTarget,
  scene,
  renderer;
var group;
var firstLetter = true;
var text = "IOIO",
  height = 500,
  size = 200,
  hover = 0,
  curveSegments = 20,
  bevelEnabled = false,
  font = undefined,
  fontName = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
  fontWeight = "regular"; // normal bold
var mirror = false;
var fontMap = {
  "helvetiker": 0,
  "optimer": 1,
  "gentilis": 2,
  "droid/droid_sans": 3,
  "droid/droid_serif": 4
};
var weightMap = {
  "regular": 0,
  "bold": 1
};
var reverseFontMap = [];
var reverseWeightMap = [];
for (var i in fontMap)
  reverseFontMap[fontMap[i]] = i;
for (var i in weightMap)
  reverseWeightMap[weightMap[i]] = i;
var targetRotation = 0;
var targetRotationOnMouseDown = 0;
var mouseX = 0;
var mouseXOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var fontIndex = 1;
init();
animate();
function decimalToHex(d) {
  var hex = Number(d).toString(16);
  hex = "000000".substr(0, 6 - hex.length) + hex;
  return hex.toUpperCase();
}
function init() {
  container = document.createElement('div');
  document.body.appendChild(container);
  //permalink = document.getElementById("permalink");
  // CAMERA
  camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 10000);
  //camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1500 );
  camera.position.set(0, 150, 1000);
  cameraTarget = new THREE.Vector3(0, 150, 0);
  // SCENE
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFFFFFF);
  scene.fog = new THREE.Fog(0x000000, 250, 1400);
  // LIGHTS
  var dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
  dirLight.position.set(0, 0, 1).normalize();
  scene.add(dirLight);
  var pointLight = new THREE.PointLight(0xffffff, 1.5);
  pointLight.position.set(0, 100, 90);
  pointLight.color.setRGB(0, 0, 0);
  scene.add(pointLight);

  group = new THREE.Group();
  group.position.y = 100;
  scene.add(group);


  materialBlack = new THREE.MeshPhongMaterial();
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
    materialShader = shader;
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
    materialShader2 = shader;
  };

  // model
  var loader = new THREE.FBXLoader();
  loader.load('models/fbx/IOIO.fbx', function(geometry) {
    /*
        object.mixer = new THREE.AnimationMixer( object );
        mixers.push( object.mixer );

        var action = object.mixer.clipAction( object.animations[ 0 ] );
        action.play();

        object.traverse( function ( child ) {

          if ( child.isMesh ) {

            child.castShadow = true;
            child.receiveShadow = true;

          }

        } );
    */
    var geometry2 = geometry.children[0].geometry;
    mesh = new THREE.Mesh(geometry2, materialBlack);

    //  console.log(geometry.children[0].geometry)
    //console.log(material)
    materialNormal.wireframe = true;
    materialBlack.wireframe = false;
    geometry.scale.setScalar(2)
    scene.add(mesh);
    group.add(mesh);
  });
  var plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(10000, 10000), new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0.5, transparent: true}));
  plane.position.y = 100;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // RENDERER
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
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

  // STATS
  stats = new Stats();
  //container.appendChild( stats.dom );
  // EVENTS
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('touchstart', onDocumentTouchStart, false);
  document.addEventListener('touchmove', onDocumentTouchMove, false);
  document.addEventListener('keypress', onDocumentKeyPress, false);
  document.addEventListener('keydown', onDocumentKeyDown, false);

  window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
//
function boolToNum(b) {
  return b
    ? 1
    : 0;
}
/*
function updatePermalink() {
  var link = hex + fontMap[fontName] + weightMap[fontWeight] + boolToNum(bevelEnabled) + "#" + encodeURI(text);
  permalink.href = "#" + link;
  window.location.hash = link;
}
*/
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

function onDocumentMouseDown(event) {
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
      mesh.material = materialNormal;
}
function onDocumentMouseUp(event) {
  document.removeEventListener('mousemove', onDocumentMouseMove, false);
  document.removeEventListener('mouseup', onDocumentMouseUp, false);
  document.removeEventListener('mouseout', onDocumentMouseOut, false);
  mesh.material = materialBlack;
}
function onDocumentMouseOut(event) {
  document.removeEventListener('mousemove', onDocumentMouseMove, false);
  document.removeEventListener('mouseup', onDocumentMouseUp, false);
  document.removeEventListener('mouseout', onDocumentMouseOut, false);
}
function onDocumentTouchStart(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;
  }
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
  group.rotation.y += (targetRotation - group.rotation.y) * 0.05;
  camera.lookAt(cameraTarget);
  //  renderer.clear();
  //  renderer.render( scene, camera );
  if (materialShader) {
    materialShader.uniforms.time.value = performance.now() / 1000;
    materialShader.uniforms.val.value = Math.sin(performance.now() / 500) * 60.0;
    //  console.log(materialShader.uniforms)
/*
    console.log(Math.round(performance.now()) % 10 == 0 )
    if(mesh.material == materialNormal && Math.round(performance.now()) % 10 == 0)
    {
      mesh.material = materialBlack;
    }else{
      mesh.material = materialNormal
    }
*/
  }
  if (materialShader2) {
    materialShader2.uniforms.time.value = performance.now() / 1000;
    materialShader2.uniforms.val.value = Math.sin(performance.now() / 500) * 60.0;
    //  console.log(materialShader.uniforms)
/*
    console.log(Math.round(performance.now()) % 10 == 0 )
    if(mesh.material == materialNormal && Math.round(performance.now()) % 10 == 0)
    {
      mesh.material = materialBlack;
    }else{
      mesh.material = materialNormal
    }
*/
  }

  //console.log(mouseX)
  composer.render(scene, camera);
}
