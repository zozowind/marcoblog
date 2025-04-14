// Magic Ruler implementation using Three.js
class MagicRuler {
    constructor() {
        this.segments = [];
        this.oddColor = '#ff4444';
        this.evenColor = '#4444ff';
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.container = document.getElementById('canvas-container');
        this.selectedSegment = null;
        this.segmentCount = 24;
        this.segmentSize = { x: 1, y: 0.5, z: 0.5 }; // Size of each segment
        this.rotationAxis = 'z'; // Default rotation axis
        this.rotationAngle = Math.PI / 2; // Default rotation angle (90 degrees)
        this.init();
    }

    init() {
        this.setupScene();
        this.createMagicRuler();
        this.setupControls();
        this.setupLights();
        this.setupEventListeners();
        this.animate();
    }

    setupScene() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(15, 10, 15);
        this.camera.lookAt(0, 0, 0);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // Add grid and axes for reference
        const gridHelper = new THREE.GridHelper(20, 20);
        this.scene.add(gridHelper);

        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Hemisphere light for better overall lighting
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x404040, 0.5);
        this.scene.add(hemisphereLight);
    }

    createSegmentGeometry() {
        const { x, y, z } = this.segmentSize;
        
        // Create a custom geometry for the segment with 5 faces
        const geometry = new THREE.BufferGeometry();
        
        // Define vertices
        const vertices = new Float32Array([
            // Front square face (connection face)
            -x/2, -y/2, z/2,  // 0
            x/2, -y/2, z/2,   // 1
            x/2, y/2, z/2,    // 2
            -x/2, y/2, z/2,   // 3
            
            // Back square face (connection face)
            -x/2, -y/2, -z/2, // 4
            x/2, -y/2, -z/2,  // 5
            x/2, y/2, -z/2,   // 6
            -x/2, y/2, -z/2,  // 7
            
            // Cut face vertex (diagonal cut)
            0, 0, 0           // 8 (center point of the cut)
        ]);
        
        // Define indices for faces
        const indices = [
            // Front square face (for connection)
            0, 1, 2,
            0, 2, 3,
            
            // Back square face (for connection)
            5, 4, 7,
            5, 7, 6,
            
            // Top triangular face
            3, 2, 8,
            
            // Bottom triangular face
            1, 0, 8,
            
            // Right rectangular face (actually two triangles)
            2, 6, 8,
            6, 5, 8,
            
            // Left rectangular face (actually two triangles)
            4, 0, 8,
            0, 3, 8
        ];
        
        // Set attributes
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        
        // Compute normals for proper lighting
        geometry.computeVertexNormals();
        
        return geometry;
    }

    createMagicRuler() {
        const geometry = this.createSegmentGeometry();
        
        // Create pivot groups first, which will hold the segments
        const pivots = [];
        const totalLength = this.segmentSize.x * this.segmentCount;
        const startPos = -totalLength / 2 + this.segmentSize.x / 2;
        
        // Create the first pivot at the starting position
        const firstPivot = new THREE.Group();
        firstPivot.position.x = startPos;
        this.scene.add(firstPivot);
        pivots.push(firstPivot);
        
        // Create the remaining pivots, each linked to the previous one
        for (let i = 1; i < this.segmentCount; i++) {
            const pivot = new THREE.Group();
            pivot.position.x = this.segmentSize.x; // Position relative to parent
            
            // Add this pivot to the previous one
            pivots[i-1].add(pivot);
            pivots.push(pivot);
        }
        
        // Now create and add segments to the pivots
        for (let i = 0; i < this.segmentCount; i++) {
            // Create material with alternating colors
            const color = i % 2 === 0 ? this.evenColor : this.oddColor;
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(color),
                side: THREE.DoubleSide,
                metalness: 0.2,
                roughness: 0.5
            });
            
            // Create the segment mesh
            const segment = new THREE.Mesh(geometry, material);
            segment.castShadow = true;
            segment.receiveShadow = true;
            segment.userData.isSegment = true;
            segment.userData.index = i;
            
            // Position the segment within its pivot (centered at the pivot point)
            segment.position.x = 0;
            
            // Add to pivot and store reference
            pivots[i].add(segment);
            segment.pivot = pivots[i];
            this.segments.push(segment);
        }
    }

    applyColors() {
        const oddColor = document.getElementById('odd-color').value;
        const evenColor = document.getElementById('even-color').value;
        
        this.segments.forEach((segment, index) => {
            const color = index % 2 === 0 ? evenColor : oddColor;
            segment.material.color.set(color);
        });
    }

    resetPosition() {
        // Reset all rotations to initial straight position
        this.segments.forEach(segment => {
            if (segment.pivot) {
                // Reset rotation of the pivot
                segment.pivot.rotation.set(0, 0, 0);
            }
        });
    }

    randomFold() {
        // Apply random fold to each segment's pivot
        this.segments.forEach((segment, index) => {
            if (segment.pivot && index > 0) {
                // Choose a random axis for rotation
                const axes = ['x', 'y', 'z'];
                const randomAxis = axes[Math.floor(Math.random() * 3)];
                const randomAngle = Math.random() * Math.PI * 2;
                
                // Apply rotation to the chosen axis
                segment.pivot.rotation[randomAxis] = randomAngle;
            }
        });
    }

    foldSegment(segmentIndex, angle) {
        if (segmentIndex >= 0 && segmentIndex < this.segments.length) {
            const segment = this.segments[segmentIndex];
            if (segment.pivot) {
                if (this.rotationAxis === 'random') {
                    // Choose a random axis for this fold
                    const axes = ['x', 'y', 'z'];
                    const randomAxis = axes[Math.floor(Math.random() * 3)];
                    segment.pivot.rotation[randomAxis] += angle;
                } else {
                    // Use the selected axis
                    segment.pivot.rotation[this.rotationAxis] += angle;
                }
            }
        }
    }

    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Mouse click for segment selection and folding
        let isDragging = false;
        let startX, startY;
        
        this.container.addEventListener('mousedown', (event) => {
            startX = event.clientX;
            startY = event.clientY;
            isDragging = false;
        });
        
        this.container.addEventListener('mousemove', (event) => {
            if (Math.abs(event.clientX - startX) > 5 || Math.abs(event.clientY - startY) > 5) {
                isDragging = true;
            }
        });
        
        this.container.addEventListener('mouseup', (event) => {
            if (!isDragging) {
                // Only handle clicks, not drags (drags are for camera control)
                this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                
                this.raycaster.setFromCamera(this.mouse, this.camera);
                const intersects = this.raycaster.intersectObjects(this.scene.children, true);
                
                for (let i = 0; i < intersects.length; i++) {
                    const object = intersects[i].object;
                    if (object.userData.isSegment) {
                        this.selectedSegment = object;
                        // Fold with the current rotation angle
                        this.foldSegment(object.userData.index, this.rotationAngle);
                        break;
                    }
                }
            }
        });

        // Button event listeners
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetPosition();
        });

        document.getElementById('random-fold-btn').addEventListener('click', () => {
            this.randomFold();
        });

        document.getElementById('apply-colors').addEventListener('click', () => {
            this.applyColors();
        });

        // Rotation axis selector
        const rotationAxisSelect = document.getElementById('rotation-axis');
        rotationAxisSelect.addEventListener('change', (event) => {
            this.rotationAxis = event.target.value;
        });

        // Rotation amount selector
        const rotationAmountSelect = document.getElementById('rotation-amount');
        const customAngleContainer = document.getElementById('custom-angle-container');
        const customAngleInput = document.getElementById('custom-angle');
        const angleValueDisplay = document.getElementById('angle-value');

        rotationAmountSelect.addEventListener('change', (event) => {
            const value = event.target.value;
            if (value === 'custom') {
                customAngleContainer.style.display = 'block';
                this.rotationAngle = (parseInt(customAngleInput.value) * Math.PI) / 180;
            } else {
                customAngleContainer.style.display = 'none';
                this.rotationAngle = (parseInt(value) * Math.PI) / 180;
            }
        });

        customAngleInput.addEventListener('input', (event) => {
            const degrees = parseInt(event.target.value);
            angleValueDisplay.textContent = `${degrees}°`;
            this.rotationAngle = (degrees * Math.PI) / 180;
        });
        
        // Initialize with the colors from the inputs
        this.applyColors();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const magicRuler = new MagicRuler();
}); 