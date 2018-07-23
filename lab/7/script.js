if (!Detector.webgl)
  Detector.addGetWebGLMessage();

var container,
  stats,
  controls;
var camera,
  scene,
  renderer,
  light;

var clock = new THREE.Clock();

var mixers = [];

init();
animate();

var cursorX;
var cursorY;

function init() {

  document.onmousemove = function(e) {
    cursorX = e.pageX;
    cursorY = e.pageY;
  }

  container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(100, 250, 300);

  controls = new THREE.OrbitControls(camera);
  controls.target.set(0, 50, 0);
  controls.update();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  //scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
  scene.fog = null;

  light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 200, 0);
  scene.add(light);

  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 200, 100);
  light.castShadow = true;
  light.shadow.camera.top = 180;
  light.shadow.camera.bottom = -100;
  light.shadow.camera.left = -120;
  light.shadow.camera.right = 120;


  scene.add(light);

  // scene.add( new THREE.CameraHelper( light.shadow.camera ) );

  // ground
  var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({color: 0x999999, depthWrite: false}));
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  //scene.add(grid);

  var texture = new THREE.TextureLoader().load('textures/4Kmap.png');

  // immediately use the texture for material creation
  var material = new THREE.MeshPhongMaterial({map: texture});

  // model
  var loader = new THREE.FBXLoader();
  loader.load('models/fbx/Hotpot_a.fbx', function(object) {
  
    object.castShadow = true;
    object.receiveShadow = true;

    object.mixer = new THREE.AnimationMixer(object);
    mixers.push(object.mixer);

    var action = object.mixer.clipAction(object.animations[0]);
    action.play();

    for (var i in object.children) {

      object.children[i].material = material;
      if (object.children[i].isMesh) {

        object.children[i].castShadow = true;
        object.children[i].receiveShadow = true;

      }
    }
/*
    object.traverse(function(child) {
      if (child.type == "Group") {
        child.children[0].material = material;
      }
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
*/
    scene.add(object);

  });

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  // to antialias the shadow
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.appendChild(renderer.domElement);
  console.log(renderer)
  window.addEventListener('resize', onWindowResize, false);

  // stats
  stats = new Stats();
  container.appendChild(stats.dom);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function animate() {

  requestAnimationFrame(animate);

  if (mixers.length > 0) {

    for (var i = 0; i < mixers.length; i++) {

      mixers[i].update(clock.getDelta());

    }

  }

  renderer.render(scene, camera);

  stats.update();

  light.position.set(0, 100 + cursorX*0.1, 50 + cursorY*0.1);

}
