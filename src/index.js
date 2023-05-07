// Initialisation de la scène et du moteur de rendu
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Fonction pour créer la scène
const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Création de la caméra
    const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 1.5, -5), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    // Création de la lumière
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

// Ajout d'un arbre
    BABYLON.SceneLoader.ImportMesh("", "https://models.babylonjs.com/Demos/Tree/", "tree.babylon", scene, (meshes) => {
        const tree = meshes[0];
        tree.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
        tree.position.y = 0;
        tree.position.x = -3;
    });


    // Création d'objets ramassables (déchets)
    const wasteMaterials = [new BABYLON.Color3(0.8, 0.4, 0), new BABYLON.Color3(0.4, 0.8, 0), new BABYLON.Color3(0.4, 0.4, 0.8),];
    const wasteMeshes = [];
    for (let i = 0; i < 10; i++) {
        const wasteMesh = BABYLON.MeshBuilder.CreateBox("waste_" + i, {size: 0.3}, scene);
        const wasteMaterial = new BABYLON.StandardMaterial("wasteMaterial_" + i, scene);
        wasteMaterial.diffuseColor = wasteMaterials[i % wasteMaterials.length];
        wasteMesh.material = wasteMaterial;
        wasteMesh.position = new BABYLON.Vector3(Math.random() * 18 - 9, 0.15, Math.random() * 18 - 9);
        wasteMeshes.push(wasteMesh);
    }

    // Interaction avec les objets ramassables
    const pickUpDistance = 1.5;
    scene.onPointerDown = (evt, pickResult) => {
        if (pickResult.hit && wasteMeshes.includes(pickResult.pickedMesh)) {
            const distance = BABYLON.Vector3.Distance(camera.position, pickResult.pickedPoint);
            if (distance < pickUpDistance) {
                pickResult.pickedMesh.dispose();
                wasteMeshes.splice(wasteMeshes.indexOf(pickResult.pickedMesh), 1);
            }
        }
    };

    return scene;
};

// Appel de la fonction createScene
const scene = createScene();

// Lancement du moteur de rendu
engine.runRenderLoop(() => {
    scene.render();
});

// Ajustement de la taille du canvas lors du redimensionnement de la fenêtre
window.addEventListener("resize", () => {
    engine.resize();
});