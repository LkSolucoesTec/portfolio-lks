// --- INÍCIO DO ARQUIVO JAVASCRIPT ---

document.addEventListener('DOMContentLoaded', () => {

    // --- ORQUESTRADOR E ANIMAÇÕES DE ENTRADA ---
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-site-content');
    const header = document.querySelector('.main-header');

    function startIntroAnimation() {
        setTimeout(() => {
            document.getElementById('loading-container')?.style.setProperty('opacity', '0');
            setTimeout(() => {
                document.getElementById('loading-container')?.style.setProperty('display', 'none');
                const photoContainer = document.getElementById('animated-photo-container');
                if (photoContainer) {
                    photoContainer.style.opacity = '1';
                    photoContainer.querySelector('img')?.style.setProperty('animation-play-state', 'running');
                    const photoAfter = document.querySelector('#animated-photo-container');
                    if(photoAfter) photoAfter.classList.add('start-glow');
                }
            }, 500);
        }, 2500);

        setTimeout(() => {
            document.getElementById('curtain-transition')?.classList.add('active');
        }, 5800);
        
        setTimeout(() => {
            if (preloader) preloader.style.opacity = '0';
            if (mainContent) mainContent.style.opacity = '1';
            
            setTimeout(() => {
                if (preloader) preloader.style.display = 'none';
                 if (header) {
                    header.classList.add('visible');
                    const nav = header.querySelector('nav');
                    if(nav) nav.style.animationPlayState = 'running';
                 }
            }, 1000);

            typewriter('main-title', 'LKS SOLUÇÕES TECNOLÓGICAS', () => {
                typewriter('subtitle', 'Criando o futuro. Uma linha de cada vez.');
            });
        }, 6600);
    }
    
    // --- EFEITO MATRIX DE FUNDO (SUTIL) ---
    const matrixCanvas = document.getElementById('matrix-background');
    if (matrixCanvas) {
        const ctx = matrixCanvas.getContext('2d');
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
        const alphabet = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュル01';
        const fontSize = 16;
        const columns = Math.ceil(matrixCanvas.width / (fontSize * 2));
        const rainDrops = [];
        for (let x = 0; x < columns; x++) { rainDrops[x] = 1; }
        const drawMatrix = () => {
            ctx.fillStyle = 'rgba(4, 13, 31, 0.1)';
            ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            ctx.fillStyle = 'rgba(0, 191, 255, 0.4)';
            ctx.font = fontSize + 'px monospace';
            for (let i = 0; i < rainDrops.length; i++) {
                if (Math.random() > 0.15) {
                    const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                    ctx.fillText(text, i * (fontSize * 2), rainDrops[i] * fontSize);
                    if (rainDrops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                        rainDrops[i] = 0;
                    }
                    rainDrops[i]++;
                }
            }
        };
        setInterval(drawMatrix, 90); // Mais lento
    }

    // --- LÓGICA DO MENU MOBILE ---
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    if (navToggle && mobileMenuOverlay) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            mobileMenuOverlay.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
        mobileMenuOverlay.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                mobileMenuOverlay.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // --- EFEITO TYPEWRITER ---
    function typewriter(elementId, text, callback) {
        const element = document.getElementById(elementId);
        if (!element) return;
        let i = 0;
        element.innerHTML = '';
        const typing = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
                const h1 = document.querySelector('.hero-content h1');
                if (h1) h1.classList.add('hide-cursor');
                if (callback) callback();
            }
        }, 80);
    }

    // --- LÓGICA DO CARROSSEL 3D DO PORTFÓLIO ---
    const carousel = document.getElementById("carousel");
    if (carousel) {
        const cards = carousel.querySelectorAll(".card");
        const prevBtn = document.getElementById("prev-btn");
        const nextBtn = document.getElementById("next-btn");
        let currentCardIndex = 0;
        const totalCards = cards.length;
        let rotationInterval = null;
        let isPopupOpen = false;

        function getResponsiveSettings() {
            const width = window.innerWidth;
            if (width <= 600) return { rotationStep: 360 / totalCards, radius: 180 };
            if (width <= 768) return { rotationStep: 360 / totalCards, radius: 220 };
            return { rotationStep: 360 / totalCards, radius: 320 };
        }

        function setCardPositions() {
            const { rotationStep, radius } = getResponsiveSettings();
            cards.forEach((card, i) => {
                const rotateY = i * rotationStep;
                const angleRad = (rotateY * Math.PI) / 180;
                const x = Math.sin(angleRad) * radius;
                const z = Math.cos(angleRad) * radius;
                card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg)`;
            });
            rotateCarousel();
            updateCardFocus();
        }

        function updateCardFocus() {
            cards.forEach((card, i) => {
                const isCurrent = i === currentCardIndex;
                card.style.transform = card.style.transform.replace(/ scale\([\d.]+\)/, "");
                card.style.transform += ` scale(${isCurrent ? 1.2 : 1})`;
                card.style.zIndex = isCurrent ? "10" : "0";
                card.style.opacity = isCurrent ? "1" : "0.7";
            });
        }

        function rotateCarousel() {
            const { rotationStep } = getResponsiveSettings();
            const rotateDeg = -rotationStep * currentCardIndex;
            carousel.style.transform = `rotateY(${rotateDeg}deg)`;
        }

        function startRotation() {
            if (rotationInterval || isPopupOpen) return;
            rotationInterval = setInterval(() => {
                currentCardIndex = (currentCardIndex + 1) % totalCards;
                setCardPositions();
            }, 3000);
        }

        function stopRotation() {
            clearInterval(rotationInterval);
            rotationInterval = null;
        }
        
        nextBtn.addEventListener("click", () => {
            stopRotation();
            currentCardIndex = (currentCardIndex + 1) % totalCards;
            setCardPositions();
        });

        prevBtn.addEventListener("click", () => {
            stopRotation();
            currentCardIndex = (currentCardIndex - 1 + totalCards) % totalCards;
            setCardPositions();
        });

        carousel.addEventListener("mouseover", () => { if (!isPopupOpen) stopRotation(); });
        carousel.addEventListener("mouseout", () => { if (!isPopupOpen) startRotation(); });

        const popups = document.querySelectorAll('.popup');
        function showPopup(cardId) {
            popups.forEach(p => p.classList.remove("show"));
            const popup = document.getElementById(`popup-${cardId}`);
            if (popup) {
                popup.classList.add("show");
                isPopupOpen = true;
                stopRotation();
            }
        }
        function closePopups() {
            popups.forEach(popup => popup.classList.remove("show"));
            isPopupOpen = false;
            startRotation();
        }
        document.querySelectorAll(".popup-close").forEach(btn => btn.addEventListener("click", closePopups));
        cards.forEach((card, index) => {
            card.addEventListener("click", (e) => {
                e.stopPropagation();
                if(index === currentCardIndex) {
                    showPopup(card.dataset.id);
                } else {
                    currentCardIndex = index;
                    setCardPositions();
                }
            });
        });
        
        setCardPositions();
        startRotation();
        window.addEventListener("resize", setCardPositions);
    }

    // --- LÓGICA DE REVELAR SEÇÕES NO SCROLL ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => revealObserver.observe(el));

    // INICIAR A ANIMAÇÃO DE ENTRADA
    startIntroAnimation();
});