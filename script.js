// FidgetViewer is loaded globally from viewer.js

// Mini 3D card viewers for lithophane section
let cardViewers = [];

function initLithoCardViewers() {
    if (!window.THREE || !window.FidgetViewer) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const container = entry.target;
            const modelFile = container.getAttribute('data-model');
            
            if (entry.isIntersecting) {
                // Initialize if not already done
                if (!container.viewer) {
                    const viewer = new FidgetViewer(container.id);
                    container.viewer = viewer;
                    viewer.loadModel(modelFile);
                    // Cards should not auto-rotate at all based on user request
                    viewer.stop(); // Init static
                    cardViewers.push(viewer);

                    // Start animation ONLY when hovering or when visible if preferred, 
                    // but user said "only when they want to move it".
                    // So we start the loop but autoRotate is false.
                    // Actually, to save battery, we only 'start' the loop when mouse enters.
                    container.addEventListener('mouseenter', () => viewer.start());
                    container.addEventListener('mouseleave', () => viewer.stop());
                } else {
                    // Resume if needed, or keep static
                }
            } else {
                // Out of view, stop the loop to save resources
                if (container.viewer) {
                    container.viewer.stop();
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.litho-card-viewer').forEach(container => {
        observer.observe(container);
    });
}

// Run after scripts load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initLithoCardViewers, 500); // Give time for browser to settle
    });
} else {
    setTimeout(initLithoCardViewers, 500);
}


// Filament Palette
const filaments = [
    { name: 'Piros', color: '#ef4444', type: 'standard' },
    { name: 'Zöld', color: '#22c55e', type: 'standard' },
    { name: 'Sárga', color: '#eab308', type: 'standard' },
    { name: 'Kék', color: '#3b82f6', type: 'standard' },
    { name: 'Kobaltkék', color: '#1e3a8a', type: 'standard' },
    { name: 'Ezüst', color: '#94a3b8', type: 'silk' },
    { name: 'Moon Palace (Rainbow Silk)', color: '#d0a6b0', type: 'silk', rainbow: 'linear-gradient(45deg, #a855f7, #fbbf24, #22d3ee)' },
    { name: 'Matte Rainbow', color: '#f87171', type: 'matte', rainbow: 'linear-gradient(45deg, #f87171, #fb923c, #fbbf24, #4ade80)' },
    { name: 'Blue-Green Dual', color: '#0ea5e9', type: 'silk', rainbow: 'linear-gradient(45deg, #3b82f6, #10b981)' },
    { name: 'Blue-Pink Dual', color: '#8b5cf6', type: 'silk', rainbow: 'linear-gradient(45deg, #3b82f6, #ec4899)' }
];

// Render Colors in the new section
const colorsGrid = document.getElementById('colorsGrid');
if (colorsGrid) {
    filaments.forEach(f => {
        const spool = document.createElement('div');
        spool.className = 'filament-spool';

        const visual = document.createElement('div');
        visual.className = 'spool-visual';

        const color = document.createElement('div');
        color.className = 'filament-color';
        if (f.rainbow) {
            color.style.background = f.rainbow;
        } else {
            color.style.backgroundColor = f.color;
        }

        visual.appendChild(color);

        const name = document.createElement('span');
        name.className = 'filament-name';
        name.textContent = f.name;

        const type = document.createElement('span');
        type.className = 'filament-type';
        // Translate type names
        let typeName = f.type;
        if (f.type === 'standard') typeName = 'Normál';
        if (f.type === 'silk') typeName = 'Selyemfényű';
        if (f.type === 'matte') typeName = 'Matt';
        type.textContent = typeName;

        spool.appendChild(visual);
        spool.appendChild(name);
        // Type removed as per request
        // spool.appendChild(type);

        colorsGrid.appendChild(spool);
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form handler - Netlify Functions
// Contact form handler
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    console.log("Script loaded, looking for contactForm..."); // Debug

    if (contactForm) {
        console.log("Contact form found!"); // Debug
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log("Form submission intercepted"); // Debug

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Küldés...';
            submitButton.disabled = true;
            formMessage.style.display = 'none';

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            fetch('/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => { throw new Error(text) });
                    }
                    return response.json();
                })
                .then(data => {
                    formMessage.className = 'form-message success';
                    formMessage.textContent = 'Köszönjük az üzeneted! Hamarosan válaszolunk.';
                    formMessage.style.display = 'block';
                    contactForm.reset();
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                })
                .catch((error) => {
                    console.error('Hiba:', error);
                    formMessage.className = 'form-message error';
                    formMessage.textContent = 'Hiba történt a küldéskor. (' + error.message + ')';
                    formMessage.style.display = 'block';
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                });
        });
    } else {
        console.error("Contact form NOT found in DOM"); // Debug
    }
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe product cards
document.querySelectorAll('.product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Product Modal functionality
const modal = document.getElementById('productModal');
const modalTitle = document.getElementById('modal-title');
const closeModal = document.querySelector('.modal-close');

// 3D Viewer Instance
let fidgetViewer = null;

// Product data (magyar nevek)
const productData = {
    'fidget-blanket': {
        title: 'Blanket (Normál verzió)',
        images: ['blanket1.jpg', 'blanket2.jpg'],
        modelFile: 'Blanket.stl',
        description: '<strong>Méret:</strong> 100x100 mm'
    },
    'fidget-blanket-mini': {
        title: 'Blanket (Mini verzió)',
        images: ['mini_blanket1.jpg', 'mini_blanket2.jpg'],
        modelFile: 'Blanket_mini.stl',
        description: '<strong>Méret:</strong> 60x60 mm'
    },
    'hexagon-twist': {
        title: 'Nagy Hexagon',
        images: ['hexagon1.jpg', 'hexagon2.jpg'],
        modelFile: 'Hexagon.stl',
        description: '<strong>Méret:</strong> 145 mm átmérő'
    },
    'hexagon-mini': {
        title: 'Kicsi Hexagon',
        images: [],
        modelFile: 'Small Hexagon.3mf',
        description: '<strong>Méret:</strong> 82 mm átmérő'
    },
    'gyro-ring-pack': {
        title: 'Gyro Gyűrűk (5 db-os csomag)',
        images: ['gyro1_(5pack).jpg', 'gyro2_(5pack).jpg'],
        modelFile: 'Gyro 5 pack.stl',
        description: '<strong>Méretek a csomagban:</strong><br>• 44 mm átmérő<br>• 52 mm átmérő<br>• 58 mm átmérő<br>• 65 mm átmérő<br>• 72 mm átmérő'
    },
    'gyro-ring': {
        title: 'Gyro Gyűrű (1 db)',
        images: ['gyro1_(1pack).jpg', 'gyro2_(1pack).jpg'],
        modelFile: 'Gyro 1 pack.stl',
        description: '<strong>Választható méretek:</strong><br>44 mm, 52 mm, 58 mm, 65 mm, vagy 72 mm átmérő'
    },
    'half-gyro': {
        title: 'Half Gyro',
        images: [],
        modelFile: 'Half Gyro.3mf'
    },
    'gear-spinner': {
        title: 'Pörgettyű Kerekekkel',
        images: ['gear_spinner1.jpg', 'gear_spinner2.jpg'],
        modelFile: 'planetary-gears.stl',
        description: '<strong>Méret:</strong> 60 mm átmérő'
    },
    'spinner-ring': {
        title: 'Sima Pörgettyű',
        images: ['rign_spinner1.jpg', 'rign_spinner2.jpg'],
        description: '<strong>Választható belső átmérők:</strong><br>15.7 mm, 16.5 mm, 17.3 mm, 18.1 mm, 19.0 mm, 19.8 mm, 20.6 mm, 21.4 mm, 22.2 mm, 23.0 mm, 23.8 mm'
    },
    'planetary-gear': {
        title: '2 Ujjas Pörgettyű',
        images: ['dual_ring_spinner1.jpg', 'dual_ring_spinner2.jpg'],
        description: '<strong>Méret:</strong> 75x35 mm'
    },
    'cube-angled': {
        title: 'Végtelen Kocka',
        images: ['inifinty_cube1.jpg', 'infinity_cube2.jpg'],
        modelFile: 'infinity cube.stl'
    },
    'slinky': {
        title: 'Slinky',
        images: ['slinky1.jpg', 'slinky2.jpg'],
        modelFile: 'slinky.stl',
        description: '<strong>Méret:</strong> 105 mm magasság, 68 mm átmérő'
    },
    'sectioned-cube': {
        title: 'Liquid Cube',
        images: ['liquid_cube1.jpg', 'liquid_cube2.jpg'],
        modelFile: 'liquid cube.stl',
        description: '<strong>Méret:</strong> 60x60x60 mm<br><br><span style="color: #666;"><i>(Egy kicsit hangosabb, mint a többi termék.)</i></span>'
    },
    'liquid-ball': {
        title: 'Liquid Ball',
        images: [],
        modelFile: 'Liquid Ball.3mf',
        description: '<span style="color: #666;"><i>(Egy kicsit hangosabb, mint a többi termék.)</i></span>'
    },
    'hand-roller': {
        title: 'Hand Roller',
        images: [],
        modelFile: ''
    },
    'litho-plane': {
        title: 'Litofán Sík',
        images: [],
        modelFile: 'Plane.stl',
        description: '<strong>Rendelés:</strong> Csak a hosszt kell megadni, meg a hátulján lévő tartóhoz az átmérőt.<br><strong>Méret:</strong> Min.: 100mm, Max.: 200mm'
    },
    'litho-arc': {
        title: 'Litofán Ív',
        images: [],
        modelFile: 'Arc.stl',
        description: '<strong>Rendelés:</strong> Csak a hosszt kell megadni, meg a hátulján lévő tartóhoz az átmérőt.<br><strong>Méret:</strong> Min.: 100mm, Max.: 200mm'
    },
    'litho-cylinder': {
        title: 'Litofán Henger',
        images: [],
        modelFile: 'Cylinder.stl',
        description: '<strong>Rendelés:</strong> Csak átmérőt kell megadni.<br><strong>Méret:</strong> Min.: 75mm, Max.: 150mm'
    }
};

// Open modal on product card click
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function () {
        try {
            const productId = this.getAttribute('data-product');
            const product = productData[productId];

            if (product) {
                modalTitle.textContent = product.title;

                const modalDesc = document.getElementById('modal-description');
                if (modalDesc) {
                    if (product.description) {
                        // Allow HTML in description like <br> for line breaks
                        modalDesc.innerHTML = product.description;
                        modalDesc.style.display = 'block';
                    } else {
                        modalDesc.style.display = 'none';
                    }
                }

                const mainImageContainer = document.getElementById('modal-photo-container');
                const thumbnailsContainer = document.querySelector('.modal-thumbnails');
                const viewControls = document.querySelector('.view-controls');
                const btnPhoto = document.getElementById('btn-view-photo');
                const btn3d = document.getElementById('btn-view-3d');
                const container3d = document.getElementById('modal-3d-container');

                if (!mainImageContainer || !thumbnailsContainer) {
                    console.error("Critical modal elements missing");
                    return;
                }

                // Reset UI state
                mainImageContainer.innerHTML = '';
                thumbnailsContainer.innerHTML = '';
                mainImageContainer.style.display = 'flex';

                if (container3d) container3d.style.display = 'none';

                if (btnPhoto) {
                    btnPhoto.classList.add('active');
                    btnPhoto.style.background = '#6366f1';
                    btnPhoto.style.color = 'white';
                    btnPhoto.style.borderColor = '#6366f1';
                }

                if (btn3d) {
                    btn3d.classList.remove('active');
                    btn3d.style.background = 'white';
                    btn3d.style.color = 'black';
                    btn3d.style.borderColor = '#ccc';
                }

                // Show/Hide 3D Button based on model availability
                if (product.modelFile && viewControls && btn3d && container3d) {
                    viewControls.style.display = 'flex';

                    // Setup 3D Button Click
                    btn3d.onclick = () => {
                        mainImageContainer.style.display = 'none';
                        container3d.style.display = 'block';
                        btn3d.classList.add('active');
                        btnPhoto.classList.remove('active');

                        // Style updates
                        btn3d.style.background = '#6366f1';
                        btn3d.style.color = 'white';
                        btn3d.style.borderColor = '#6366f1';
                        btnPhoto.style.background = 'white';
                        btnPhoto.style.color = 'black';
                        btnPhoto.style.borderColor = '#ccc';

                        // Initialize Viewer
                        if (!fidgetViewer) {
                            fidgetViewer = new FidgetViewer('modal-3d-container');
                        }
                        fidgetViewer.loadModel(product.modelFile);
                        fidgetViewer.onResize(); // Force resize check

                        // Inject Color Selection for 3D Viewer (Standard Colors Only)
                        const colorSelection = document.getElementById('color-selection-container');
                        if (colorSelection) {
                            if (productId.startsWith('litho-')) {
                                colorSelection.style.display = 'none';
                                colorSelection.innerHTML = '';
                            } else {
                                colorSelection.innerHTML = '';
                                colorSelection.style.display = 'flex';
                                colorSelection.style.flexWrap = 'wrap';
                                colorSelection.style.gap = '10px';
                                colorSelection.style.justifyContent = 'center';
                                colorSelection.style.marginTop = '15px';

                                // Filter for standard colors only
                                const standardColors = filaments.filter(f => f.type === 'standard');

                                standardColors.forEach(f => {
                                    const swatch = document.createElement('div');
                                    swatch.style.width = '30px';
                                    swatch.style.height = '30px';
                                    swatch.style.borderRadius = '50%';
                                    swatch.style.border = '2px solid #ddd';
                                    swatch.style.cursor = 'pointer';
                                    swatch.style.backgroundColor = f.color;
                                    swatch.title = f.name;

                                    swatch.addEventListener('click', () => {
                                        // Highlight selected
                                        Array.from(colorSelection.children).forEach(c => c.style.borderColor = '#ddd');
                                        swatch.style.borderColor = '#6366f1';

                                        // Set color in viewer
                                        if (fidgetViewer) {
                                            fidgetViewer.setMaterial({
                                                color: f.color,
                                                type: f.type
                                            });
                                        }
                                    });

                                    colorSelection.appendChild(swatch);
                                });

                                // Add disclaimer text
                                const disclaimer = document.createElement('p');
                                disclaimer.textContent = '(A színek a valóságban eltérhetnek)';
                                disclaimer.style.width = '100%';
                                disclaimer.style.textAlign = 'center';
                                disclaimer.style.marginTop = '10px';
                                disclaimer.style.fontSize = '0.9em';
                                disclaimer.style.color = '#666';
                                colorSelection.appendChild(disclaimer);
                            }
                        }
                    };

                    // Setup Photo Button Click
                    btnPhoto.onclick = () => {
                        mainImageContainer.style.display = 'flex';
                        container3d.style.display = 'none';
                        btnPhoto.classList.add('active');
                        btn3d.classList.remove('active');

                        // Style updates
                        btnPhoto.style.background = '#6366f1';
                        btnPhoto.style.color = 'white';
                        btnPhoto.style.borderColor = '#6366f1';
                        btn3d.style.background = 'white';
                        btn3d.style.color = 'black';
                        btn3d.style.borderColor = '#ccc';

                        // Hide color selection in photo mode
                        const colorSelection = document.getElementById('color-selection-container');
                        if (colorSelection) colorSelection.style.display = 'none';
                    };

                } else {
                    viewControls.style.display = 'none';
                }

                if (product.images && product.images.length > 0) {
                    // Main image
                    const mainImg = document.createElement('img');
                    mainImg.src = `images/${product.images[0]}`;
                    mainImg.alt = product.title;
                    mainImageContainer.appendChild(mainImg);

                    // Thumbnails
                    product.images.forEach((imgSrc, index) => {
                        const thumb = document.createElement('div');
                        thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
                        const thumbImg = document.createElement('img');
                        thumbImg.src = `images/${imgSrc}`;
                        thumbImg.alt = `${product.title} ${index + 1}`;
                        thumb.appendChild(thumbImg);

                        thumb.addEventListener('click', () => {
                            mainImg.src = `images/${imgSrc}`;
                            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                            thumb.classList.add('active');
                            // Switch to photo view if in 3D
                            if (btnPhoto.onclick) btnPhoto.onclick();
                        });
                        thumbnailsContainer.appendChild(thumb);
                    });
                } else {
                    mainImageContainer.innerHTML = '<div class="placeholder-image-large" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; font-size: 5rem; background: #eee;">🧊</div>';
                }

                // Show modal
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';

                // Ha nincs kép, de van 3D modell, automatikusan a 3D nézet nyíljon meg
                if ((!product.images || product.images.length === 0) && product.modelFile) {
                    if (btn3d && btn3d.onclick) {
                        btn3d.onclick();
                    }
                }
            }
        } catch (error) {
            console.error("Modal error:", error);
            alert("Hiba történt a megnyitáskor: " + error.message);
        }
    });
});

// Close modal
function closeModalHandler() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    // Stop 3D viewer animation loop to save resources and WebGL contexts
    if (fidgetViewer) {
        fidgetViewer.stop();
    }
}

closeModal.addEventListener('click', closeModalHandler);

// Close modal when clicking outside
modal.addEventListener('click', function (e) {
    if (e.target === modal) {
        closeModalHandler();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModalHandler();
    }
});

// Handle order button click in modal
document.addEventListener('click', function (e) {
    if (e.target.closest('.modal-cta .btn-primary')) {
        e.preventDefault();
        closeModalHandler();

        // Scroll to contact section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            setTimeout(() => {
                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }
});
