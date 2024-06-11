// Create the scene
const scene = new THREE.Scene();

// Create a camera, which determines what we'll see when we render the scene
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer and add it to the DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a basic player cube
const playerGeometry = new THREE.BoxGeometry();
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);

let bullets = [];

// Add lighting to make the player cube visible
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Add event listeners for movement and shooting
const keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);
document.addEventListener('click', shoot);

function shoot(event) {
    const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    bullet.position.set(player.position.x, player.position.y, player.position.z);
    
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    bullets.push({ mesh: bullet, direction: direction.clone() });
    scene.add(bullet);
}

function update() {
    if (keys['w']) player.position.z -= 0.1;
    if (keys['s']) player.position.z += 0.1;
    if (keys['a']) player.position.x -= 0.1;
    if (keys['d']) player.position.x += 0.1;
    
    bullets.forEach((bullet, index) => {
        bullet.mesh.position.add(bullet.direction.clone().multiplyScalar(0.2));
        if (bullet.mesh.position.length() > 50) {
            scene.remove(bullet.mesh);
            bullets.splice(index, 1);
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    update();
    
    renderer.render(scene, camera);
}

animate();
