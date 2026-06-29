let scene, camera, renderer, controls;
let cubeGroup;

const size = 1;
const gap = 0.05;

/* ===== Init ===== */

function initCube3D() {
    const canvas = document.getElementById("cubeCanvas");

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0d0d);

    camera = new THREE.PerspectiveCamera(
        45,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
    );

    camera.position.set(6, 6, 6);

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7);
    scene.add(light);

    createCube();

    animate();
}

/* ===== Cube ===== */

function createCube() {
    cubeGroup = new THREE.Group();

    const colors = {
        U: 0xffffff, // white
        D: 0xffff00, // yellow
        F: 0x00ff00, // green
        B: 0x0000ff, // blue
        L: 0xffa500, // orange
        R: 0xff0000  // red
    };

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {

                const geometry = new THREE.BoxGeometry(size, size, size);

                let materials = [
                    new THREE.MeshBasicMaterial({ color: x === 1 ? colors.R : 0x111111 }), // right
                    new THREE.MeshBasicMaterial({ color: x === -1 ? colors.L : 0x111111 }), // left
                    new THREE.MeshBasicMaterial({ color: y === 1 ? colors.U : 0x111111 }), // top
                    new THREE.MeshBasicMaterial({ color: y === -1 ? colors.D : 0x111111 }), // bottom
                    new THREE.MeshBasicMaterial({ color: z === 1 ? colors.F : 0x111111 }), // front
                    new THREE.MeshBasicMaterial({ color: z === -1 ? colors.B : 0x111111 })  // back
                ];

                let cube = new THREE.Mesh(geometry, materials);

                cube.position.set(
                    x * (size + gap),
                    y * (size + gap),
                    z * (size + gap)
                );

                cubeGroup.add(cube);
            }
        }
    }

    scene.add(cubeGroup);
}

/* ===== Animation ===== */

function animate() {
    requestAnimationFrame(animate);

    if (controls) controls.update();

    renderer.render(scene, camera);
}

/* ===== Resize ===== */

window.addEventListener("resize", () => {
    const canvas = document.getElementById("cubeCanvas");

    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
});

/* expose */
window.initCube3D = initCube3D;