(function () {
  const el = document.getElementById('civic-viewer');
  if (!el || !window.THREE || !THREE.GLTFLoader) return;

  const h = el.clientHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, el.clientWidth / h, 0.1, 100);
  camera.position.set(0, 1.6, 7);
  camera.lookAt(0, 0.7, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(el.clientWidth, h);
  el.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x222244, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1);
  key.position.set(3, 5, 4);
  scene.add(key);
  const pink = new THREE.PointLight(0xff2e88, 1.5, 12);
  pink.position.set(-3, 1, 2);
  scene.add(pink);
  const cyan = new THREE.PointLight(0x00e5ff, 1.5, 12);
  cyan.position.set(3, 1, -2);
  scene.add(cyan);

  const pivot = new THREE.Group();
  scene.add(pivot);

  new THREE.GLTFLoader().load(
    'models/civic.glb',
    (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.set(-center.x, -box.min.y, -center.z);
      const wrap = new THREE.Group();
      wrap.add(model);
      wrap.scale.setScalar(4 / Math.max(size.x, size.y, size.z));
      pivot.add(wrap);
    },
    undefined,
    () => {
      el.innerHTML = '<p style="padding:20px;color:#8a8aa8">No se pudo cargar el modelo.</p>';
    }
  );

  let arrastrando = false;
  let ultimoX = 0;
  el.addEventListener('pointerdown', (e) => {
    arrastrando = true;
    ultimoX = e.clientX;
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener('pointermove', (e) => {
    if (!arrastrando) return;
    pivot.rotation.y += (e.clientX - ultimoX) * 0.01;
    ultimoX = e.clientX;
  });
  const soltar = () => { arrastrando = false; };
  el.addEventListener('pointerup', soltar);
  el.addEventListener('pointercancel', soltar);

  window.addEventListener('resize', () => {
    const w = el.clientWidth;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  function animar() {
    requestAnimationFrame(animar);
    if (!arrastrando) pivot.rotation.y += 0.005;
    renderer.render(scene, camera);
  }
  animar();
})();
