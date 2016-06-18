var scene,
  camera,
  renderer,
  container,
  controlsm,

  camX = 0,
  camY = 0,
  camZ = 5,

  clearColor = 0xdddddd,

  ambL,
  ambLColor = 0xcccccc,

  dirL,
  dirLColor = 0xeeeeee,


  boxWidth = 1,
  boxHeight = 1,
  boxDepth = 1,
  boxColor = 0xcccccc,

  simpleCube,
  speed = 0.01;

var OnWindowResize = function _resizer() {
    camera.aspect = container.offsetWidth / container.offsetHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(container.offsetWidth, container.offsetHeight)
};

var OnLoad = function _init() {
    container = document.getElementById('container');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        45,
        container.offsetWidth / container.offsetHeight,
        0.1,
        1000);

    camera.position.set(camX, camY, camZ);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(container.offsetWidth, container.offsetHeight);

    renderer.setClearColor(clearColor, 1.0);

    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    window.addEventListener('resize', OnWindowResize, false);

    ambL = new THREE.AmbientLight(ambLColor);
    scene.add(ambL);
    dirL = new THREE.DirectionalLight(dirLColor, 0.5);
    dirL.position.set(1, 1, 0);

    scene.add(dirL);

    geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    material = new THREE.MeshLambertMaterial({color: boxColor});

    simpleCube = new THREE.Mesh(geometry, material);

    scene.add(simpleCube);

    Run();
};

var Run = function _runner() {

    window.requestAnimationFrame(Run);
    controls.update();

    renderer.render(scene, camera);
};

var RotateMesh = function (mesh, speeed) {
    mesh.rotation.x += speed;
    mesh.rotation.y -= speed;
    mesh.rotation.z += speed;
};
