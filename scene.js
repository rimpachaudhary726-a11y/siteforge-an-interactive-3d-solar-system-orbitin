const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xffcc00, emissiveIntensity: 1 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const createPlanet = (radius, distance, color) => {
    const geometry = new THREE.SphereGeometry(radius, 16, 16);
    const material = new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: 0.8 });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = distance;
    return planet;
};

const earth = createPlanet(0.3, 3, 0x0000ff);
const moon = createPlanet(0.1, 0.5, 0xaaaaaa);
const mars = createPlanet(0.2, 5, 0xff0000);
scene.add(earth);
scene.add(mars);
earth.add(moon);

const animate = function () {
    requestAnimationFrame(animate);
    
    sun.rotation.y += 0.01;

    earth.rotation.y += 0.02;
    earth.position.x = Math.sin(Date.now() * 0.001) * 3;
    moon.rotation.y += 0.05;

    mars.rotation.y += 0.02;
    
    controls.update();
    renderer.render(scene, camera);
};

camera.position.z = 10;

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

try {
    const testCanvas = document.createElement('canvas');
    if (!testCanvas.getContext('webgl') && !testCanvas.getContext('experimental-webgl')) throw new Error('no webgl');
} catch(e) {
    const err = document.getElementById('webgl-error');
    if (err) { err.style.display = 'block'; err.textContent = 'WebGL is not supported in your browser.'; }
    throw e;
}

animate();