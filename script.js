/* FidgetViewer is loaded globally from viewer.js */
let cardViewers = [];

function initLithoCardViewers() {
    if (typeof window.THREE === 'undefined') {
        console.warn('[Shop] THREE.js not available yet');
        return false;
    }
    if (typeof FidgetViewer === 'undefined' && typeof window.FidgetViewer === 'undefined') {
        console.warn('[Shop] FidgetViewer class not available yet');
        return false;
    }
    const ViewerClass = window.FidgetViewer || FidgetViewer;
    console.log('[Shop] Initializing 3D Card Viewers...');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const container = entry.target;
            const modelFile = container.getAttribute('data-model');
            if (entry.isIntersecting) {
                if (!container.viewer) {
                    const viewer = new ViewerClass(container.id);
                    container.viewer = viewer;
                    viewer.loadModel(modelFile);
                    viewer.stop();
                    cardViewers.push(viewer);
                    container.addEventListener('mouseenter', () => viewer.start());
                    container.addEventListener('mouseleave', () => viewer.stop());
                }
            } else {
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

function startApp() {
    let attempts = 0;
    const maxAttempts = 20;
    const checkAndInit = () => {
        attempts++;
        if (initLithoCardViewers()) {
            console.log('[Shop] 3D Viewers initialized successfully');
            return;
        }
        if (attempts < maxAttempts) {
            setTimeout(checkAndInit, 500);
        } else {
            console.error('[Shop] Failed to initialize 3D viewers after 10 seconds.');
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndInit);
    } else {
        checkAndInit();
    }
}
startApp();

const filaments = [
    { name: 'Piros', color: '#ef4444', type: 'standard' },
    { name: 'Zöld', color: '#22c55e', type: 'standard' },
    { name: 'Sárga', color: '#eab308', type: 'standard' },
    { name: 'Kék', color: '#3b82f6', type: 'standard' },
    { name: 'Kobaltkék', color: '#1e3a8a', type: 'standard' },
    { name: 'Ezüst', color: '#94a3b8', type: 'silk' },
    { name: 'Arany-Zöld Duál', color: '#000000', rainbow: 'linear-gradient(135deg, #ffd700 0%, #22c55e 50%, #000000 100%)', type: 'silk' },
    { name: 'Világoskék', color: '#add8e6', type: 'standard' },
    { name: 'Fekete-Rózsaszín Duál', color: '#000000', rainbow: 'linear-gradient(135deg, #000000 0%, #ff69b4 100%)', type: 'silk' },
    { name: 'Rózsaszín-Zöld Duál', color: '#ff69b4', rainbow: 'linear-gradient(135deg, #ff69b4 0%, #22c55e 100%)', type: 'silk' },
    { name: 'Rózsaszín', color: '#ff69b4', type: 'standard' }
];

// Colors grid - render immediately
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
        spool.appendChild(visual);
        spool.appendChild(name);
        colorsGrid.appendChild(spool);
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            formMessage.className = 'form-message info';
            formMessage.textContent = 'Hamarosan elérhető lesz.';
            formMessage.style.display = 'block';
        });
    }
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

const modal = document.getElementById('productModal');
const modalTitle = document.getElementById('modal-title');
const closeModal = document.querySelector('.modal-close');
let fidgetViewer = null;

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
        images: ['kicsihexagon1.jpg', 'kicsihexagon2.jpg'],
        modelFile: 'Small Hexagon.stl',
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
        images: ['halfgyro2.jpg', 'halfgyro1.jpg'],
        modelFile: 'Half Gyro.stl'
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
        images: ['liquidball2.jpg', 'liquidball1.jpg'],
        modelFile: 'Liquid Ball.stl',
        description: '<span style="color: #666;"><i>(Egy kicsit hangosabb, mint a többi termék.)</i></span>'
    },
    'hand-roller': {
        title: 'Hand Roller',
        images: ['handroller1.jpg', 'handroller2.jpg'],
        modelFile: ''
    },
    // Új termékek – leírás eltávolítva
    'twist-fidget': {
        title: 'Twist Fidget',
        images: ['twist_fidget_1.jpg', 'twist_fidget_2.jpg'],
        modelFile: '',
        description: ''
    },
    'transforming-ball': {
        title: 'Transforming Fidget Ball',
        images: ['Transforming_Fidget_Ball_1.jpg', 'Transforming_Fidget_Ball_2.jpg'],
        modelFile: 'Transforming_Fidget_Ball_Micro.stl',
        description: ''
    },
    'honeycomb-hexagon': {
        title: 'Honeycomb Hexagon',
        images: ['Honeycomb_Hexagon_1.jpg', 'Honeycomb_Hexagon_2.jpg'],
        modelFile: 'Honeycomb_Fidget.stl',
        description: ''
    },
    // Litofánok – csak 3D modell, nincs kép, nincs színválasztó (csak fehér)
    'litho-plane': {
        title: 'Litofán Sík',
        images: [],
        modelFile: 'Plane.stl',
        noColors: true,
        description: '<strong>Rendelés:</strong> Csak a hosszt kell megadni, meg a hátulján lévő tartóhoz az átmérőt.<br><strong>Méret:</strong> Min.: 100mm, Max.: 200mm'
    },
    'litho-arc': {
        title: 'Litofán Ív',
        images: [],
        modelFile: 'Arc.stl',
        noColors: true,
        description: '<strong>Rendelés:</strong> Csak a hosszt kell megadni, meg a hátulján lévő tartóhoz az átmérőt.<br><strong>Méret:</strong> Min.: 100mm, Max.: 200mm'
    },
    'litho-cylinder': {
        title: 'Litofán Henger',
        images: [],
        modelFile: 'Cylinder.stl',
        noColors: true,
        description: '<strong>Rendelés:</strong> Csak átmérőt kell megadni.<br><strong>Méret:</strong> Min.: 75mm, Max.: 150mm'
    }
};

document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function () {
        try {
            const productId = this.getAttribute('data-product');
            const product = productData[productId];
            if (!product) return;

            modalTitle.textContent = product.title;

            const modalDesc = document.getElementById('modal-description');
            if (modalDesc) {
                modalDesc.innerHTML = product.description || '';
                modalDesc.style.display = product.description ? 'block' : 'none';
            }

            const mainImageContainer = document.getElementById('modal-photo-container');
            const thumbnailsContainer = document.querySelector('.modal-thumbnails');
            const viewControls = document.querySelector('.view-controls');
            const btnPhoto = document.getElementById('btn-view-photo');
            const btn3d = document.getElementById('btn-view-3d');
            const container3d = document.getElementById('modal-3d-container');

            if (!mainImageContainer || !thumbnailsContainer) return;

            // Reset UI
            mainImageContainer.innerHTML = '';
            thumbnailsContainer.innerHTML = '';
            mainImageContainer.style.display = 'flex';
            if (container3d) container3d.style.display = 'none';
            // Hide color selector by default; only the 3D view handler may show it
            const colorSelectionReset = document.getElementById('color-selection-container');
            if (colorSelectionReset) {
                colorSelectionReset.style.display = 'none';
                colorSelectionReset.innerHTML = '';
            }
            if (btnPhoto) {
                btnPhoto.classList.add('active');
                btnPhoto.style.background = '#6366f1';
                btnPhoto.style.color = 'white';
            }
            if (btn3d) {
                btn3d.classList.remove('active');
                btn3d.style.background = 'white';
                btn3d.style.color = 'black';
            }

            // Determine if we have images
            const hasImages = product.images && product.images.length > 0;

            // Show/hide view controls based on availability of 3D model
            if (product.modelFile) {
                viewControls.style.display = 'flex';
                // Photo button always visible when images exist, otherwise hide it
                btnPhoto.style.display = hasImages ? 'inline-block' : 'none';
                btn3d.style.display = 'inline-block';
            } else {
                viewControls.style.display = 'none';
            }

            // Photo view setup
            if (hasImages) {
                const mainImg = document.createElement('img');
                mainImg.src = `images/${product.images[0]}`;
                mainImg.alt = product.title;
                mainImageContainer.appendChild(mainImg);

                // Thumbnails for ALL images (including the first one, marked active)
                product.images.forEach((imgSrc, idx) => {
                    const thumb = document.createElement('div');
                    thumb.className = 'thumbnail' + (idx === 0 ? ' active' : '');
                    const thumbImg = document.createElement('img');
                    thumbImg.src = `images/${imgSrc}`;
                    thumbImg.alt = `${product.title} ${idx + 1}`;
                    thumb.appendChild(thumbImg);
                    thumb.addEventListener('click', () => {
                        mainImg.src = `images/${imgSrc}`;
                        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                        thumb.classList.add('active');
                    });
                    thumbnailsContainer.appendChild(thumb);
                });
            } else {
                // Nincs kép – placeholder
                mainImageContainer.innerHTML = '<div class="placeholder-image-large" style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;font-size:5rem;background:#eee;">🧊</div>';
                btnPhoto.style.display = 'none';
            }

            // 3D view button handler
            if (product.modelFile && btn3d) {
                btn3d.onclick = () => {
                    mainImageContainer.style.display = 'none';
                    container3d.style.display = 'block';
                    btn3d.classList.add('active');
                    btnPhoto.classList.remove('active');
                    btn3d.style.background = '#6366f1';
                    btn3d.style.color = 'white';
                    btnPhoto.style.background = 'white';
                    btnPhoto.style.color = 'black';

                    if (!fidgetViewer) {
                        const ViewerClass = window.FidgetViewer || FidgetViewer;
                        fidgetViewer = new ViewerClass('modal-3d-container');
                    }
                    fidgetViewer.loadModel(product.modelFile);
                    fidgetViewer.start();
                    fidgetViewer.onResize();

                    // Color selector only for products that allow it (e.g. not lithophanes)
                    const colorSelection = document.getElementById('color-selection-container');
                    if (colorSelection) {
                        colorSelection.innerHTML = '';
                        if (product.noColors) {
                            colorSelection.style.display = 'none';
                            // Lithophanes are always white
                            if (fidgetViewer) fidgetViewer.setMaterial({ color: '#ffffff', type: 'matte' });
                        } else {
                            colorSelection.style.display = 'flex';
                            colorSelection.style.flexWrap = 'wrap';
                            colorSelection.style.gap = '10px';
                            colorSelection.style.justifyContent = 'center';
                            colorSelection.style.marginTop = '15px';
                            filaments.filter(f => f.type === 'standard').forEach(f => {
                                const swatch = document.createElement('div');
                                swatch.style.width = '30px';
                                swatch.style.height = '30px';
                                swatch.style.borderRadius = '50%';
                                swatch.style.border = '2px solid #ddd';
                                swatch.style.cursor = 'pointer';
                                swatch.style.backgroundColor = f.color;
                                swatch.title = f.name;
                                swatch.addEventListener('click', () => {
                                    Array.from(colorSelection.children).forEach(c => c.style.borderColor = '#ddd');
                                    swatch.style.borderColor = '#6366f1';
                                    if (fidgetViewer) fidgetViewer.setMaterial({ color: f.color, type: f.type });
                                });
                                colorSelection.appendChild(swatch);
                            });
                        }
                    }
                };
                // Photo button handler (if images exist)
                if (hasImages && btnPhoto) {
                    btnPhoto.onclick = () => {
                        mainImageContainer.style.display = 'flex';
                        container3d.style.display = 'none';
                        btnPhoto.classList.add('active');
                        btn3d.classList.remove('active');
                        btnPhoto.style.background = '#6366f1';
                        btnPhoto.style.color = 'white';
                        btn3d.style.background = 'white';
                        btn3d.style.color = 'black';
                        const colorSelection = document.getElementById('color-selection-container');
                        if (colorSelection) colorSelection.style.display = 'none';
                    };
                }
            }

            modal.classList.add('show');
            document.body.style.overflow = 'hidden';

            // Ha nincs kép, de van 3D modell, automatikusan nyissuk meg a 3D nézetet
            if (!hasImages && product.modelFile && btn3d && btn3d.onclick) {
                btn3d.onclick();
            }
        } catch (error) {
            console.error("Modal error:", error);
        }
    });
});

function closeModalHandler() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    if (fidgetViewer) fidgetViewer.stop();
}
closeModal.addEventListener('click', closeModalHandler);
modal.addEventListener('click', e => { if (e.target === modal) closeModalHandler(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('show')) closeModalHandler(); });
document.addEventListener('click', e => {
    if (e.target.closest('.modal-cta .btn-primary')) {
        e.preventDefault();
        closeModalHandler();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            setTimeout(() => {
                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }
});