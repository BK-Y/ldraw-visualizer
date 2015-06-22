/// <reference path="./parser/FileService.ts" />
/// <reference path="./parser/LdrawFile.ts" />
/// <reference path="./renderer/LdrawFileRenderer.ts" />

module LdrawVisualizer {

	if (!Detector.webgl) Detector.addGetWebGLMessage();

	var container;
	var camera, controls, scene, renderer, ldrawFile: LdrawFile;
	var showAxes = true;

	FileService.GetLdrawFile('3001.dat', (parsedFile: LdrawFile) => {
		ldrawFile = parsedFile;
		console.log(parsedFile);
		init();
		render();
	});

	function animate() {
		requestAnimationFrame(animate);
		controls.update();
	}

	function init() {
		camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.z = 200;

		controls = new THREE.OrbitControls(camera);
		controls.damping = 0.2;
		controls.addEventListener('change', render);

		scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2(0x111111, 0.002);

		if (showAxes) {
			scene.add(buildAxes(1000));
		}


		Renderer.LdrawFileRenderer.Render(scene, ldrawFile);

		// lights
		var directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(1, .6, -.2);
		scene.add(directionalLight);

		directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(-1, -1.5, 1.7);
		scene.add(directionalLight);

		var ambientLight = new THREE.AmbientLight(0x000000);
		scene.add(ambientLight);
		
		// renderer
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor(scene.fog.color);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);

		container = document.getElementById('container');
		container.appendChild(renderer.domElement);

		window.addEventListener('resize', onWindowResize, false);

		animate();
	}

	function buildAxes(length) {
        var axes = new THREE.Object3D();

        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0), 0xFF0000, false)); // +X
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-length, 0, 0), 0xFF0000, true)); // -X
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0), 0x00FF00, false)); // +Y
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -length, 0), 0x00FF00, true)); // -Y
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length), 0x0000FF, false)); // +Z
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -length), 0x0000FF, true)); // -Z

        return axes;

	}

	function buildAxis(src, dst, colorHex, dashed) {
        var geom = new THREE.Geometry(),
            mat;

        if (dashed) {
			mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
        } else {
			mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
        }

        geom.vertices.push(src.clone());
        geom.vertices.push(dst.clone());
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line(geom, mat, THREE.LinePieces);

        return axis;

	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);

		render();
	}

	function render() {
		renderer.render(scene, camera);
	}
}