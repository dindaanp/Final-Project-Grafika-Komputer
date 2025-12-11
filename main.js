import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// SETUP DASAR
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x79a6d2); 
scene.fog = new THREE.Fog(0x79a6d2, 8, 30);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

// POSISI START: DARI PINTU
camera.position.set(0, 1.6, 4.0); 

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.capabilities.isWebGL2 = true; 
renderer.outputColorSpace = THREE.SRGBColorSpace; 
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 1.5, -2.0); 

// CONTROLS: GHOST MODE
controls.listenToKeyEvents(window); 
controls.keyPanSpeed = 20.0; 
controls.enablePan = true; 
controls.minDistance = 0.1; 
controls.maxDistance = 15.0; 
controls.maxPolarAngle = Math.PI - 0.1; 
controls.minPolarAngle = 0.1; 

// 2. ARSITEKTUR & MATERIAL
const W = 8;   
const D = 10; 
const H = 4.5; 
const ROOF_H = 3.0; 

const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();

// Texture
const darkWoodTex = textureLoader.load('./assets/textures/dark_wood_texture.jpg');
darkWoodTex.wrapS = darkWoodTex.wrapT = THREE.RepeatWrapping; darkWoodTex.repeat.set(2, 2);
darkWoodTex.colorSpace = THREE.SRGBColorSpace; 

const roofWoodTex = textureLoader.load('./assets/textures/roof_wood_texture.jpg');
roofWoodTex.wrapS = roofWoodTex.wrapT = THREE.RepeatWrapping; 
roofWoodTex.repeat.set(2, 1); 
roofWoodTex.rotation = Math.PI / 4; 
roofWoodTex.center.set(0.5, 0.5);
roofWoodTex.colorSpace = THREE.SRGBColorSpace;

const backWallTex = textureLoader.load('./assets/textures/roof_wood_texture.jpg');
backWallTex.wrapS = backWallTex.wrapT = THREE.RepeatWrapping;
backWallTex.repeat.set(2, 1); 
backWallTex.rotation = Math.PI / 4; 
backWallTex.center.set(0.5, 0.5);
backWallTex.colorSpace = THREE.SRGBColorSpace;

const carpetTex = textureLoader.load('./assets/textures/green_carpet_texture.jpg');
carpetTex.wrapS = carpetTex.wrapT = THREE.RepeatWrapping; carpetTex.repeat.set(4, 5);
carpetTex.colorSpace = THREE.SRGBColorSpace;

const patternTex = textureLoader.load('./assets/textures/window_pattern_alpha.png');
patternTex.colorSpace = THREE.SRGBColorSpace;

const caligraphyTex = textureLoader.load('./assets/textures/gold_caligraphy_pattern.png');
caligraphyTex.wrapS = caligraphyTex.wrapT = THREE.RepeatWrapping;
caligraphyTex.repeat.set(2, 2); 
caligraphyTex.colorSpace = THREE.SRGBColorSpace;

// Material
const woodDarkMat = new THREE.MeshStandardMaterial({ map: darkWoodTex, roughness: 0.7, side: THREE.DoubleSide }); 
const woodRoofMat = new THREE.MeshStandardMaterial({ map: roofWoodTex, side: THREE.DoubleSide, roughness: 0.5 });
const backWallMat = new THREE.MeshStandardMaterial({ map: backWallTex, side: THREE.DoubleSide, roughness: 0.5 }); 
const carpetMat = new THREE.MeshStandardMaterial({ map: carpetTex, roughness: 1, side: THREE.DoubleSide });
const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 0.2, transparent: true, roughness: 0, side: THREE.DoubleSide });
const patternMat = new THREE.MeshBasicMaterial({ map: patternTex, transparent: true, side: THREE.DoubleSide });
const cableMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5, roughness: 0.5 });

const caligraphyMat = new THREE.MeshStandardMaterial({ 
    map: caligraphyTex,       
    color: 0xffd700,          
    metalness: 1.0,           
    roughness: 0.15,          
    transparent: true,        
    side: THREE.DoubleSide,
    emissive: 0xffd700,       
    emissiveIntensity: 0.2    
});

// 3. BANGUN STRUKTUR RUANGAN
// Lantai
const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), carpetMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Pilar
const pilarGeo = new THREE.BoxGeometry(0.35, H, 0.35);
[[-W/2, -D/2], [W/2, -D/2], [-W/2, D/2], [W/2, D/2]].forEach(pos => {
    const pilar = new THREE.Mesh(pilarGeo, woodDarkMat);
    pilar.position.set(pos[0], H/2, pos[1]);
    pilar.castShadow = true;
    scene.add(pilar);
});

const createBeam = (geo, x, z, rotY=0) => {
    const beam = new THREE.Mesh(geo, woodDarkMat);
    beam.position.set(x, H, z);
    beam.rotation.y = rotY;
    scene.add(beam);
};
createBeam(new THREE.BoxGeometry(W, 0.2, 0.2), 0, -D/2); 
createBeam(new THREE.BoxGeometry(W, 0.2, 0.2), 0, D/2);  
createBeam(new THREE.BoxGeometry(0.2, 0.2, D), -W/2, 0); 
createBeam(new THREE.BoxGeometry(0.2, 0.2, D), W/2, 0);  

// ATAP LIMAS
const roofGeo = new THREE.ConeGeometry(W * 0.85, ROOF_H, 4, 1, true);
const roof = new THREE.Mesh(roofGeo, woodRoofMat);
roof.position.set(0, H + (ROOF_H/2), 0);
roof.rotation.y = Math.PI / 4; 
roof.receiveShadow = true;
scene.add(roof);

// GARIS PENJELAS ATAp
const lineMat = new THREE.LineBasicMaterial({ color: 0xffeebb, linewidth: 2 });
const edges = new THREE.EdgesGeometry(roofGeo);
const roofLines = new THREE.LineSegments(edges, lineMat);
roofLines.position.y -= 0.002;
roof.add(roofLines);

const capSize = 0.25; 
const capGeo = new THREE.BoxGeometry(capSize, 0, capSize);
const capLines = new THREE.LineSegments(new THREE.EdgesGeometry(capGeo), lineMat);
capLines.position.set(0, (ROOF_H / 2) - 0.001, 0);
roof.add(capLines);

// DINDING SAMPING (1/3 KAYU + ORNAMEN GOLD, 2/3 KACA)
const frontLen = D / 3;       
const backLen = (D / 3) * 2;  

// 1. Dinding Dasar Kayu
const woodPartGeo = new THREE.PlaneGeometry(frontLen, H);

// 2. Panel Ornamen Kaligrafi
const ornamentW = frontLen - 0.4; 
const ornamentH = H - 0.8;        
const caligraphyPartGeo = new THREE.PlaneGeometry(ornamentW, ornamentH);

// Fungsi bikin dinding samping
const createSideWall = (xPos, rotY) => {
    // 1. Dinding Kayu (Depan)
    const woodPart = new THREE.Mesh(woodPartGeo, backWallMat); 
    woodPart.position.set(xPos, H/2, -D/2 + frontLen/2);
    woodPart.rotation.y = rotY;
    woodPart.receiveShadow = true;
    scene.add(woodPart);

    // 2. Tempelan Kaligrafi Emas
    const caligraphyPart = new THREE.Mesh(caligraphyPartGeo, caligraphyMat);
    const offset = xPos > 0 ? -0.01 : 0.01; 
    caligraphyPart.position.set(xPos + offset, H/2, -D/2 + frontLen/2); 
    caligraphyPart.rotation.y = rotY;
    scene.add(caligraphyPart);

};

createSideWall(-W/2, Math.PI / 2);
createSideWall(W/2, -Math.PI / 2);

// TEMBOK DEPAN (BELAKANG MIHRAB) KAYU
const frontWallBacking = new THREE.Mesh(new THREE.PlaneGeometry(W, H), backWallMat);
frontWallBacking.position.set(0, H/2, -D/2); 
frontWallBacking.receiveShadow = true;
scene.add(frontWallBacking);

// 4. LOAD ASSETS
function loadModel(filename, pos, scale, rotY = 0) {
    gltfLoader.load(`./assets/models/${filename}`, (gltf) => {
        const model = gltf.scene;
        model.position.set(pos.x, pos.y, pos.z);
        // Scale handling
        if (typeof scale === 'number') {
            model.scale.set(scale, scale, scale);
        } else {
            model.scale.set(scale.x, scale.y, scale.z);
        }
        
        model.rotation.y = rotY;
        
        model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                
                if (filename === 'bismillahbisaa.glb' && node.material) {
                    node.material.color.set(0xCCCCCC);
                    node.material.metalness = 0.1;
                }

                if (filename === 'etalase2.glb' && node.material) {
                    node.material.color.set(0xffffff); 
                    node.material.metalness = 0.4;     
                    node.material.roughness = 0.2;     
                }
            }
        });
        scene.add(model);
    }, undefined, (e) => console.error(`Gagal load ${filename}:`, e));
}

// MIHRAB
loadModel('mihrabfix.glb', {x: 0, y: 0, z: -4.8}, 1.5, Math.PI); 

// PINTU (BELAKANG)
loadModel('pintu.glb', {x: 0, y: 0, z: 5.0}, {x: 2.2, y: 2.0, z: 1.0}, Math.PI); 

// JENDELA KANAN & KIRI (LURUS & SEJAJAR)
const winScaleVal = 1.9; 
const winY = -0.1; 

// KIRI (X = -4.0)
loadModel('jendela2.glb', {x: -4.0, y: winY, z: -0.53}, winScaleVal, Math.PI/2);
loadModel('jendela2.glb', {x: -4.0, y: winY, z: 0.8}, winScaleVal, Math.PI/2);
loadModel('jendela2.glb', {x: -4.0, y: winY, z: 2.5}, winScaleVal, Math.PI/2);
loadModel('jendela2.glb', {x: -4.0, y: winY, z: 4.2}, winScaleVal, Math.PI/2);

// KANAN (X = 4.0)
loadModel('jendela2.glb', {x: 4.0, y: winY, z: -0.53}, winScaleVal, -Math.PI/2);
loadModel('jendela2.glb', {x: 4.0, y: winY, z: 0.8}, winScaleVal, -Math.PI/2);
loadModel('jendela2.glb', {x: 4.0, y: winY, z: 2.5}, winScaleVal, -Math.PI/2);
loadModel('jendela2.glb', {x: 4.0, y: winY, z: 4.2}, winScaleVal, -Math.PI/2);

// TIANG UTAMA (TIANG.GLB) DI 4 SUDUT (OFFSET KE DALAM)
// menentukan jarak "mundur" dari tembok
const margin = 0.6; 
const posX = (W / 2) - margin; // Posisi X agak ke dalam
const posZ = (D / 2) - margin; // Posisi Z agak ke dalam
const scaleTiang = 1.25; 

// 1. Depan Kiri (Dekat Mihrab)
loadModel('tiang.glb', {x: -2.50, y: 0.0, z: -3.30}, scaleTiang);

// 2. Depan Kanan (Dekat Mihrab)
loadModel('tiang.glb', {x: 2.50, y: 0.0, z: -3.30}, scaleTiang);

// 3. Belakang Kiri (Dekat Pintu Masuk)
loadModel('tiang.glb', {x: -2.50, y: 0.0, z: 3.30}, scaleTiang);

// 4. Belakang Kanan (Dekat Pintu Masuk)
loadModel('tiang.glb', {x: 2.50, y: 0.0, z: 3.30}, scaleTiang);

// BALOK ATAS DI 4 SISI
const beamY = H + -1.30;
const offset = 1.50;

// Balok Atas Samping (Kiri & Kanan)
// Skala panjang baru: (D/2) / 2 = D/4
loadModel('balokatass.glb', {x: -W/2 + offset, y: beamY, z: 0}, {x: D/4, y: 1.0, z: 1.0}, Math.PI/2); // Kiri 
loadModel('balokatass.glb', {x: W/2 - offset, y: beamY, z: 0}, {x: D/4, y: 1.0, z: 1.0}, -Math.PI/2); // Kanan 

// Balok Atas Depan & Belakang
// Skala panjang baru: (W/2) / 2 = W/4
loadModel('balokatass.glb', {x: 0, y: beamY, z: -D/2 + offset}, {x: W/4, y: 1.0, z: 1.0}, Math.PI); // Depan 
loadModel('balokatass.glb', {x: 0, y: beamY, z: D/2 - offset}, {x: W/4, y: 1.0, z: 1.0}, 0); // Belakang

// LAMPU GANTUNG
const LAMP_Y = 3.5;
loadModel('lampu gantunggg.glb', {x: 0, y: LAMP_Y, z: 0}, 0.6); 

const roofPeakY = H + ROOF_H;
const cableLength = roofPeakY - LAMP_Y; 
const cableGeo = new THREE.CylinderGeometry(0.015, 0.015, cableLength);
const cable = new THREE.Mesh(cableGeo, cableMat);
cable.position.set(0, LAMP_Y + (cableLength / 2), 0);
scene.add(cable);

// ASET LAINNYA
loadModel('sekat.glb', {x: -1.80, y: 0.01, z: 0}, 1.0, 0); 
loadModel('mejangaji.glb', {x: -1.5, y: 0.0, z: -3.5}, 0.5, Math.PI); 
loadModel('mic.glb', {x: 2.0, y: 0, z: -4.0}, 1); 
loadModel('bismillahbisaa.glb', {x: -3.50, y: 0.02, z: 2.30}, 1.20, -Math.PI/2);
loadModel('etalase2.glb', {x: -3.50, y: 0.01, z: 4.0}, 0.85, Math.PI/2); 
loadModel('etalase2.glb', {x: -3.50, y: 0.01, z: -4.0}, 0.85, Math.PI/2);  
loadModel('kipasangin.gltf', {x: -2.5, y: H + 0.2, z: 0}, 1.0); 
loadModel('kipasangin.gltf', {x: 2.5, y: H + 0.2, z: 0}, 1.0);
loadModel('kotakamal.glb', {x: 2.50, y: -0.6, z: 4.20}, 3.50, Math.PI/2);

// 5. RENDER & ANIMATE
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(5, 10, 5);
sunLight.castShadow = true;
scene.add(sunLight);

const lampLight = new THREE.PointLight(0xffaa00, 1.5, 10);
lampLight.position.set(0, LAMP_Y - 0.2, -0.5); 
scene.add(lampLight);

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // TEMBOK
    if (camera.position.x > 3.9) camera.position.x = 3.9;
    if (camera.position.x < -3.9) camera.position.x = -3.9;
    if (camera.position.z > 4.9) camera.position.z = 4.9; 
    if (camera.position.z < -4.8) camera.position.z = -4.8; 
    
    if (camera.position.y > 6.0) camera.position.y = 6.0; 
    if (camera.position.y < 0.5) camera.position.y = 0.5;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
animate();