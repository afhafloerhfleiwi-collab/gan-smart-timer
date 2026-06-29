
let scene, camera, renderer, cubeGroup;

function initCube3D() {
    try {
        const canvas = document.getElementById("cubeCanvas");

        if (!canvas) {
            console.warn("No cube canvas found");
            return;
        }

        // =========================
        // SCENE
        // =========================
        scene = new THREE.Scene();

        // =========================
        // CAMERA (FIXED SAFE INIT)
        // =========================
        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        camera.position.z = 5;

        // =========================
        // RENDERER
        // =========================
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);

        // =========================
        // SIMPLE CUBE (PLACEHOLDER VISUAL)
        // =========================
        const geometry = new THREE.BoxGeometry(2, 2, 2);

        const material = new THREE.MeshNormalMaterial();

        const cube = new THREE.Mesh(geometry, material);

        cubeGroup = new THREE.Group();
        cubeGroup.add(cube);
        scene.add(cubeGroup);

        // =========================
        // ANIMATION LOOP
        // =========================
        function animate() {
            requestAnimationFrame(animate);

            if (cubeGroup) {
                cubeGroup.rotation.x += 0.01;
                cubeGroup.rotation.y += 0.01;
            }

            renderer.render(scene, camera);
        }

        animate();

        // =========================
        // RESIZE FIX (IMPORTANT)
        // =========================
        window.addEventListener("resize", () => {
            if (!camera || !renderer) return;

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        console.log("🧊 Cube3D initialized safely");

    } catch (err) {
        console.warn("Cube3D failed but app continues:", err);
    }
}

/* export */
window.initCube3D = initCube3D;
