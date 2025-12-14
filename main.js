import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Setup dasar
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x79a6d2); 
scene.fog = new THREE.Fog(0x79a6d2, 8, 30);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

// Posisi start view dari pintu
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

// Controls
controls.listenToKeyEvents(window); 
controls.keyPanSpeed = 20.0; 
controls.enablePan = true; 
controls.minDistance = 0.1; 
controls.maxDistance = 15.0; 
controls.maxPolarAngle = Math.PI - 0.1; 

controls.minPolarAngle = Math.PI / 6.0; 

// Arsitektur & material
const W = 8;   
const D = 10; 
const H = 4.5; 
const ROOF_H = 3.0; 

const Y_MAX_CAMERA_FIX = 4.2;    // tinggi maksimal kamera
const TARGET_Y_LIMIT_FIX = 4.2;  // tinggi maksimal target panning

const TARGET_X_LIMIT = (W/2) - 1.0;
const TARGET_Z_LIMIT = (D/2) - 1.0;


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

// Bangun struktur ruangan
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

// atap limas
const roofGeo = new THREE.ConeGeometry(W * 0.85, ROOF_H, 4, 1, true);
const roof = new THREE.Mesh(roofGeo, woodRoofMat);
roof.position.set(0, H + (ROOF_H/2), 0);
roof.rotation.y = Math.PI / 4; 
roof.receiveShadow = true;
scene.add(roof);

// Garis penjelas atap
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

// Dinding samping (1/3 kayu + ornamen gold, 2/3 kaca)
const frontLen = D / 3;       
const backLen = (D / 3) * 2;  

// dinding dasar kayu
const woodPartGeo = new THREE.PlaneGeometry(frontLen, H);

// ornamen kaligrafi
const ornamentW = frontLen - 0.4; 
const ornamentH = H - 0.8;        
const caligraphyPartGeo = new THREE.PlaneGeometry(ornamentW, ornamentH);

// Fungsi bikin dinding samping
const createSideWall = (xPos, rotY) => {
    // dinding kayu (depan)
    const woodPart = new THREE.Mesh(woodPartGeo, backWallMat); 
    woodPart.position.set(xPos, H/2, -D/2 + frontLen/2);
    woodPart.rotation.y = rotY;
    woodPart.receiveShadow = true;
    scene.add(woodPart);

    // 2. tempelan kaligrafi gold
    const caligraphyPart = new THREE.Mesh(caligraphyPartGeo, caligraphyMat);
    const offset = xPos > 0 ? -0.01 : 0.01; 
    caligraphyPart.position.set(xPos + offset, H/2, -D/2 + frontLen/2); 
    caligraphyPart.rotation.y = rotY;
    scene.add(caligraphyPart);

};

createSideWall(-W/2, Math.PI / 2);
createSideWall(W/2, -Math.PI / 2);

// Tembok depan (belakang mihrab) kayu
const frontWallBacking = new THREE.Mesh(new THREE.PlaneGeometry(W, H), backWallMat);
frontWallBacking.position.set(0, H/2, -D/2); 
frontWallBacking.receiveShadow = true;
scene.add(frontWallBacking);

// Load asset
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
                    node.material.color.set(0xffffff);
                    node.material.metalness = 0.4;     
                    node.material.roughness = 0.2;
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

// Mihrab
loadModel('mihrabfix.glb', {x: 0, y: 0, z: -4.8}, 1.5, Math.PI); 

// Pintu
loadModel('pintu.glb', {x: 0, y: 0, z: 5.0}, {x: 2.2, y: 2.0, z: 1.0}, Math.PI); 

// Jendela kanan & kiri
const winScaleVal = 1.9; 
const winY = -0.1; 

// kiri
loadModel('jendela2.glb', {x: -4.0, y: winY, z: -0.53}, winScaleVal, Math.PI/2);
loadModel('jendela2.glb', {x: -4.0, y: winY, z: 0.8}, winScaleVal, Math.PI/2);
loadModel('jendela2.glb', {x: -4.0, y: winY, z: 2.5}, winScaleVal, Math.PI/2);
loadModel('jendela2.glb', {x: -4.0, y: winY, z: 4.0}, winScaleVal, Math.PI/2);

// kanan
loadModel('jendela2.glb', {x: 4.0, y: winY, z: -0.53}, winScaleVal, -Math.PI/2);
loadModel('jendela2.glb', {x: 4.0, y: winY, z: 0.8}, winScaleVal, -Math.PI/2);
loadModel('jendela2.glb', {x: 4.0, y: winY, z: 2.5}, winScaleVal, -Math.PI/2);
loadModel('jendela2.glb', {x: 4.0, y: winY, z: 4.0}, winScaleVal, -Math.PI/2);

// Tiang besar di 4 sudut (offset ke dalam)
const margin = 0.6; 
const posX = (W / 2) - margin; // posisi X agak ke dalam
const posZ = (D / 2) - margin; // posisi Z agak ke dalam
const scaleTiang = 1.25; 

// depan kiri
loadModel('tiang.glb', {x: -2.50, y: 0.0, z: -3.30}, scaleTiang);

// depan kanan
loadModel('tiang.glb', {x: 2.50, y: 0.0, z: -3.30}, scaleTiang);

// belakang kiri
loadModel('tiang.glb', {x: -2.50, y: 0.0, z: 3.30}, scaleTiang);

// belakang kanan
loadModel('tiang.glb', {x: 2.50, y: 0.0, z: 3.30}, scaleTiang);

// Balok atas di 4 sisi
const beamY = H + -1.30;
const offset = 1.50;
const SCALE_X_SAMPING = D/4; 
const SCALE_X_DEPAN = W/4;    

// balok atas samping (kiri & kanan)
loadModel('balokatass.glb', {x: -W/2 + offset, y: beamY, z: 0}, {x: SCALE_X_SAMPING, y: 1.0, z: 1.0}, Math.PI/2); // kiri 
loadModel('balokatass.glb', {x: W/2 - offset, y: beamY, z: 0}, {x: SCALE_X_SAMPING, y: 1.0, z: 1.0}, -Math.PI/2); // kanan 

// balok atas depan & belakang
loadModel('balokatass.glb', {x: 0, y: beamY, z: -D/2 + offset}, {x: SCALE_X_DEPAN, y: 1.0, z: 1.0}, Math.PI); // depan 
loadModel('balokatass.glb', {x: 0, y: beamY, z: D/2 - offset}, {x: SCALE_X_DEPAN, y: 1.0, z: 1.0}, 0); // belakang

// Kipas
const NAIK_OFFSET_FAN = 1.60; 

// Kipas1
const FAN_Y_1 = beamY + NAIK_OFFSET_FAN; 
const FAN_Z_1 = -1.5;                  

loadModel('kipasfix.glb', { x: -W/2 + 1.85, y: FAN_Y_1, z: FAN_Z_1 }, 2.1, Math.PI / 2); //kiri
loadModel('kipasfix.glb', { x: W/2 - 1.85, y: FAN_Y_1, z: FAN_Z_1 }, 2.1, -Math.PI / 2); //kanan

// Kipas2
const FAN_Y_2 = beamY + NAIK_OFFSET_FAN;
const FAN_Z_2 = 1.5;

loadModel('kipasfix.glb', { x: -W/2 + 1.85, y: FAN_Y_2, z: FAN_Z_2 }, 2.1, Math.PI / 2); // kiri
loadModel('kipasfix.glb', { x: W/2 - 1.85, y: FAN_Y_2, z: FAN_Z_2 }, 2.1, -Math.PI / 2); // kanan
  
// Speaker
const FRONT_BALOK_Z = -D/2 + offset; 
const MUNDUR_OFFSET_SPEAKER = 0.60;

const SPEAKER_Y = beamY; 
const SPEAKER_Z = FRONT_BALOK_Z + MUNDUR_OFFSET_SPEAKER;

loadModel('speaker.glb', { x: -1.6, y: SPEAKER_Y, z: SPEAKER_Z }, 1.25, 0);
loadModel('speaker.glb', { x:  1.6, y: SPEAKER_Y, z: SPEAKER_Z }, 1.25, 0);

// CCTV
const NAIK_OFFSET_CCTV = 1.60; 
loadModel('cctv.glb', { x: W/2 - 2.0, y: H - 0.02, z: D/2 - 1.79 }, 0.05, Math.PI / 1);

// Lampu gantung
const LAMP_Y = 3.5;
loadModel('lampu gantunggg.glb', {x: 0, y: LAMP_Y, z: 0}, 0.6); 

const roofPeakY = H + ROOF_H;
const cableLength = roofPeakY - LAMP_Y; 
const cableGeo = new THREE.CylinderGeometry(0.015, 0.015, cableLength);
const cable = new THREE.Mesh(cableGeo, cableMat);
cable.position.set(0, LAMP_Y + (cableLength / 2), 0);
scene.add(cable);

// Aset lainnya
loadModel('sekat.glb', {x: -1.80, y: 0.01, z: 0}, 1.0, 0); 
loadModel('mejangaji.glb', {x: -1.5, y: 0.0, z: -3.5}, 0.5, Math.PI); 
loadModel('mic.glb', {x: 2.0, y: 0, z: -4.0}, 1); 
loadModel('bismillahbisaa.glb', {x: -3.50, y: 0.02, z: 2.30}, 1.20, -Math.PI/2);
loadModel('etalase2.glb', {x: -3.50, y: 0.01, z: 4.0}, 0.85, Math.PI/2); 
loadModel('etalase2.glb', {x: -3.50, y: 0.01, z: -3.5}, 0.85, Math.PI/2);  
loadModel('kotakamal.glb', {x: 2.50, y: -0.6, z: 4.20}, 3.50, Math.PI/2);

// Render & animate
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(5, 10, 5);
sunLight.castShadow = true;
scene.add(sunLight);

// PointLight
const lampLight = new THREE.PointLight(0xffaa00, 2.0, 10); // intensitas
lampLight.position.set(0, LAMP_Y, 0); 
scene.add(lampLight);

// status lampu
let isLampOn = true; 
const AMBIENT_INTENSITY_ON = 0.7;
const AMBIENT_INTENSITY_OFF = 0.1; // agar seperti gelap
const POINT_INTENSITY_ON = 2.0;
const POINT_INTENSITY_OFF = 0.0;

// Tombol 'L' (toggle light)
window.addEventListener('keydown', (event) => {
    if (event.key.toUpperCase() === 'L') {
        isLampOn = !isLampOn;
        console.log(`Lampu di-toggle. Status: ${isLampOn ? 'ON' : 'OFF'}`);
    }
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // Batas panning target
    const TARGET_X_LIMIT = (W/2) - 1.0;
    const TARGET_Z_LIMIT = (D/2) - 1.0;
    const TARGET_Y_LIMIT = H + 0.1; // kunci target di ketinggian balok
    const Y_MAX_CAMERA = H + 0.1;  // batas maksimal ketinggian kamera

    // Mencegah panning ke ujung
    if (controls.target.x > TARGET_X_LIMIT) controls.target.x = TARGET_X_LIMIT;
    if (controls.target.x < -TARGET_X_LIMIT) controls.target.x = -TARGET_X_LIMIT;
    
    if (controls.target.z > TARGET_Z_LIMIT) controls.target.z = TARGET_Z_LIMIT; 
    if (controls.target.z < -TARGET_Z_LIMIT) controls.target.z = -TARGET_Z_LIMIT; 
    
    // Mencegah rotasi kamera melihat ke atas atap
    if (controls.target.y > TARGET_Y_LIMIT) controls.target.y = TARGET_Y_LIMIT;
    if (controls.target.y < 0.5) controls.target.y = 0.5;

    // Toggle lampu
    if (isLampOn) {
        ambientLight.intensity = AMBIENT_INTENSITY_ON;
        lampLight.intensity = POINT_INTENSITY_ON;
    } else {
        ambientLight.intensity = AMBIENT_INTENSITY_OFF;
        lampLight.intensity = POINT_INTENSITY_OFF;
    }

    // Tembok (membatasi posisi kamera)
    if (camera.position.x > 3.9) camera.position.x = 3.9;
    if (camera.position.x < -3.9) camera.position.x = -3.9;
    if (camera.position.z > 4.9) camera.position.z = 4.9; 
    if (camera.position.z < -4.8) camera.position.z = -4.8; 
    
    if (camera.position.y > Y_MAX_CAMERA) camera.position.y = Y_MAX_CAMERA; 
    if (camera.position.y < 0.5) camera.position.y = 0.5;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
animate();