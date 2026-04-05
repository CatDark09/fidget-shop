// viewer.js - Global Version
// No imports needed, we use the global 'THREE' object from the script tag in index.html

class FidgetViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        // Default Color (Nice blue/purple from theme)
        this.defaultColor = 0x6366f1;
        this.currentMesh = null;

        this.init();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x18181b); // Neutral dark charcoal background

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 50, 100);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        if (THREE.sRGBEncoding) this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 2.0;

        // Lighting - Professional PBR Setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(10, 20, 10);
        this.scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
        fillLight.position.set(-10, 5, -10);
        this.scene.add(fillLight);

        const topLight = new THREE.PointLight(0xffffff, 0.5);
        topLight.position.set(0, 50, 0);
        this.scene.add(topLight);

        // Animation Loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);

        // Handle Resize
        window.addEventListener('resize', () => this.onResize());
    }

            loadModel(modelPath) {
        // Remove old model
        if (this.currentMesh) {
            this.scene.remove(this.currentMesh);
            if (this.currentMesh.geometry) this.currentMesh.geometry.dispose();
            if (this.currentMesh.material) this.currentMesh.material.dispose();
            
            // Handle groups (3MF)
            if (this.currentMesh.isGroup) {
                this.currentMesh.traverse((child) => {
                    if (child.isMesh) {
                        child.geometry.dispose();
                        if (Array.isArray(child.material)) {
                            child.material.forEach(m => m.dispose());
                        } else if (child.material) {
                            child.material.dispose();
                        }
                    }
                });
            }
            this.currentMesh = null;
        }

        // Add Loading Indicator
        this.showLoading();

        const ext = modelPath.split('.').pop().toLowerCase();
        
        const onLoad = (object) => {
            this.hideLoading();
            
            // Use Standard Material for PBR (Physically Based Rendering)
            const defaultMaterial = new THREE.MeshStandardMaterial({
                color: this.defaultColor,
                roughness: 0.5,
                metalness: 0.1
            });

            let mainObject;
            if (ext === '3mf') {
                // 3MF returns a Group
                mainObject = object;
                
                // Override materials and center
                mainObject.traverse((child) => {
                    if (child.isMesh) {
                        child.material = defaultMaterial;
                        // Some 3MF files have geometry offsets, we let the external box logic center it
                    }
                });
                
                // Rotate upright if needed, though 3MF usually specifies up-axis.
                // We'll apply the typical rotation
                mainObject.rotation.set(-Math.PI / 2, 0, 0);

            } else {
                // STL returns Geometry
                mainObject = new THREE.Mesh(object, defaultMaterial);
                
                // Center the geometry
                object.computeBoundingBox();
                const center = new THREE.Vector3();
                object.boundingBox.getCenter(center);
                object.translate(-center.x, -center.y, -center.z);

                // Rotate it upright
                mainObject.rotation.x = -Math.PI / 2;
            }

            this.scene.add(mainObject);
            this.currentMesh = mainObject;

            // Adjust camera to fit
            this.fitCameraToMesh(mainObject);
        };

        const onProgress = (xhr) => {
            if (xhr.lengthComputable) {
                const percentComplete = Math.round((xhr.loaded / xhr.total) * 100);
                this.updateProgress(percentComplete);
            }
        };

        const onError = (error) => {
            this.hideLoading();
            console.error('An error occurred loading the model', error);
            if (this.container) {
                this.container.innerHTML = '<p style="color:red; text-align:center; padding-top: 20px;">Hiba a 3D modell betöltésekor</p>';
            }
        };

        if (ext === '3mf') {
            const loader = new THREE.3MFLoader();
            loader.load(`models/${modelPath}`, onLoad, onProgress, onError);
        } else {
            const loader = new THREE.STLLoader();
            loader.load(`models/${modelPath}`, onLoad, onProgress, onError);
        }
    }

    showLoading() {
        if (!this.loaderElement) {
            this.loaderElement = document.createElement('div');
            this.loaderElement.className = 'viewer-loader';
            this.loaderElement.innerHTML = `
                <div class="loader-content">
                    <div class="spinner"></div>
                    <p>Modell betöltése... <span class="progress-text">0%</span></p>
                </div>
            `;
            this.container.appendChild(this.loaderElement);
        }
        this.loaderElement.style.display = 'flex';
        this.updateProgress(0);
    }

    hideLoading() {
        if (this.loaderElement) {
            this.loaderElement.style.display = 'none';
        }
    }

    updateProgress(percent) {
        if (this.loaderElement) {
            const text = this.loaderElement.querySelector('.progress-text');
            if (text) text.textContent = `${percent}%`;
        }
    }

    // Updated Method: Set Color and Material Properties (PBR)
            setMaterial(options) {
        if (this.currentMesh) {
            const applyProps = (material) => {
                if (options.color) material.color.set(options.color);
                
                // Handle Silk vs Matte properties with MeshStandardMaterial
                if (options.type === 'silk') {
                    material.roughness = 0.25; // Shiny/Silk effect
                    material.metalness = 0.7; // Metallic look
                } else if (options.type === 'matte') {
                    material.roughness = 0.95; // Very dull
                    material.metalness = 0.0; // Non-metallic
                } else {
                    // Standard Plastic
                    material.roughness = 0.5;
                    material.metalness = 0.1;
                }
            };

            if (this.currentMesh.isGroup) {
                this.currentMesh.traverse((child) => {
                    if (child.isMesh && child.material) {
                        applyProps(child.material);
                    }
                });
            } else if (this.currentMesh.material) {
                applyProps(this.currentMesh.material);
            }
        }
    }

    fitCameraToMesh(mesh) {
        const box = new THREE.Box3().setFromObject(mesh);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        this.camera.position.x = center.x + size; // Move camera back based on size
        this.camera.position.y = center.y + size * 0.5;
        this.camera.position.z = center.z + size;
        this.camera.lookAt(center);

        this.controls.target.copy(center);
    }

    onResize() {
        if (!this.container) return;
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(this.animate);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
