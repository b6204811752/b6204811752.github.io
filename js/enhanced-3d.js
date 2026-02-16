// =====================================================
// ENHANCED 3D INTERACTIONS & MODERN ANIMATIONS
// Car Rental Ranchi - 2026 Premium JavaScript
// =====================================================

(function() {
    'use strict';

    // =====================================
    // 3D Card Tilt Effect on Mouse Move
    // =====================================
    function init3DTiltEffect() {
        const cards = document.querySelectorAll('.service-card, .fleet-card, .fare-card, .why-card, .why-card-city, .route-info-card, .testimonial-card, .payment-method, .stat-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 15;
                const rotateY = (centerX - x) / 15;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
            });
            
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'all 0.15s ease';
            });
        });
    }

    // =====================================
    // Scroll Reveal Animation (Performance)
    // =====================================
    function initScrollReveal() {
        const elements = document.querySelectorAll(
            '.service-card, .fleet-card, .fare-card, .why-card, .why-card-city, ' +
            '.route-info-card, .place-card, .testimonial-card, .payment-method, ' +
            '.stat-card, .contact-item, .faq-item, .area-column, .about-feature, ' +
            '.section-header, .about-wrapper, .contact-wrapper, .calculator-wrapper, ' +
            '.tariff-table, .popular-routes, .feature-badge, .destination-image-card'
        );
        
        elements.forEach((el, index) => {
            if (!el.classList.contains('animate-on-scroll')) {
                el.classList.add('animate-on-scroll');
                // Add variety
                const animations = ['', 'slide-left', 'slide-right', 'scale-up'];
                const animClass = animations[index % 4];
                if (animClass) el.classList.add(animClass);
            }
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // =====================================
    // Smooth Counter with Easing
    // =====================================
    function initSmoothCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }
        
        function animateValue(el, start, end, duration) {
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutQuart(progress);
                const current = Math.floor(start + (end - start) * easedProgress);
                
                el.textContent = current.toLocaleString() + (end > 100 ? '+' : '');
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = end.toLocaleString() + '+';
                }
            }
            
            requestAnimationFrame(update);
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = 'true';
                    const target = parseInt(entry.target.dataset.target);
                    animateValue(entry.target, 0, target, 2500);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }

    // =====================================
    // Magnetic Button Effect
    // =====================================
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-submit, .btn-fleet, .btn-service, .calc-button');
        
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // =====================================
    // Parallax Scrolling for Sections
    // =====================================
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.hero, .city-hero, .stats-section, .cta-section-city');
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const rate = el.dataset.parallaxRate || 0.3;
                const offset = scrolled * rate;
                el.style.backgroundPosition = `center ${offset}px`;
            });
        }
        
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // =====================================
    // Typing Animation for Hero
    // =====================================
    function initTypingAnimation() {
        const heroSubtitle = document.querySelector('.hero-subtitle, .city-hero-subtitle');
        if (!heroSubtitle) return;
        
        const texts = [
            heroSubtitle.textContent,
            '🚗 Best Taxi Service in Ranchi',
            '⭐ 4.9/5 Rating on Google',
            '📞 Call Now: +91-7488341848'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;
        
        // Don't override original text immediately
        setTimeout(() => {
            function type() {
                const currentText = texts[textIndex];
                
                if (isPaused) {
                    setTimeout(type, 2000);
                    isPaused = false;
                    isDeleting = true;
                    return;
                }
                
                if (!isDeleting) {
                    heroSubtitle.textContent = currentText.substring(0, charIndex + 1);
                    charIndex++;
                    
                    if (charIndex === currentText.length) {
                        isPaused = true;
                    }
                } else {
                    heroSubtitle.textContent = currentText.substring(0, charIndex - 1);
                    charIndex--;
                    
                    if (charIndex === 0) {
                        isDeleting = false;
                        textIndex = (textIndex + 1) % texts.length;
                    }
                }
                
                const typingSpeed = isDeleting ? 40 : 70;
                setTimeout(type, typingSpeed);
            }
            
            charIndex = texts[0].length;
            isPaused = true;
            type();
        }, 4000);
    }

    // =====================================
    // Gradient Text Animation
    // =====================================
    function initGradientText() {
        const titles = document.querySelectorAll('.section-header h2');
        titles.forEach(title => {
            title.addEventListener('mouseenter', () => {
                title.style.backgroundImage = 'linear-gradient(135deg, #ff6b35, #004e89, #ffd700, #ff6b35)';
                title.style.backgroundSize = '300% auto';
                title.style.backgroundClip = 'text';
                title.style.webkitBackgroundClip = 'text';
                title.style.webkitTextFillColor = 'transparent';
                title.style.animation = 'shimmer 3s linear infinite';
            });
            
            title.addEventListener('mouseleave', () => {
                title.style.backgroundImage = '';
                title.style.backgroundSize = '';
                title.style.backgroundClip = '';
                title.style.webkitBackgroundClip = '';
                title.style.webkitTextFillColor = '';
                title.style.animation = '';
            });
        });
    }

    // =====================================
    // Smooth Image Loading with Blur Reveal
    // =====================================
    function initImageReveal() {
        const images = document.querySelectorAll('img:not([data-no-reveal])');
        
        images.forEach(img => {
            if (img.complete) return;
            
            img.style.filter = 'blur(10px)';
            img.style.transition = 'filter 0.5s ease';
            
            img.addEventListener('load', () => {
                img.style.filter = 'blur(0)';
            });
        });
    }

    // =====================================
    // Enhanced Scroll Progress
    // =====================================
    function initScrollProgress() {
        let progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            document.body.prepend(progressBar);
        }
        
        function updateProgress() {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        }
        
        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateProgress);
        });
    }

    // =====================================
    // Intersection Observer for Section Entry
    // =====================================
    function initSectionAnimations() {
        const sections = document.querySelectorAll('section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => observer.observe(section));
    }

    // =====================================
    // Dynamic Cursor Trail
    // =====================================
    function initCursorEffects() {
        // Only for desktop
        if (window.innerWidth < 1024) return;
        
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor-trail';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 107, 53, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            transition: all 0.15s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });
        
        // Enlarge on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .service-card, .fleet-card, .faq-question');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.borderColor = 'rgba(255, 215, 0, 0.6)';
                cursor.style.left = (parseFloat(cursor.style.left) - 10) + 'px';
                cursor.style.top = (parseFloat(cursor.style.top) - 10) + 'px';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.borderColor = 'rgba(255, 107, 53, 0.5)';
            });
        });
    }

    // =====================================
    // Smooth Page Transitions - DISABLED
    // =====================================
    // COMPLETE DISABLE: This feature was causing persistent gradient overlay issues
    // When navigating back to pages, the overlay would stick and block content
    // Disabled to ensure clean, immediate page loads without interference
    function initPageTransitions() {
        // CLEANUP ONLY: Remove any leftover overlays from previous versions
        document.querySelectorAll('.page-transition-overlay').forEach(el => el.remove());
        
        // Ensure body is always fully visible and interactive
        document.body.style.opacity = '1';
        document.body.style.removeProperty('transition');
        
        // NO OVERLAY CREATION
        // NO PAGE ANIMATIONS
        // NO LINK INTERCEPTION
        // Just clean, standard browser navigation
        
        console.log('✅ Page transitions disabled - clean navigation mode');
    }

    // =====================================
    // Enhanced FAQ Accordion with Animation
    // =====================================
    function initEnhancedFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all
                    faqItems.forEach(other => {
                        other.classList.remove('active');
                        const otherAnswer = other.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                        }
                    });
                    
                    // Open clicked if wasn't active
                    if (!isActive) {
                        item.classList.add('active');
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                });
            }
        });
    }

    // =====================================
    // Notification Bar (Non-intrusive)
    // =====================================
    function initNotificationBar() {
        // Only show once per session
        if (sessionStorage.getItem('notifShown')) return;
        
        setTimeout(() => {
            const notif = document.createElement('div');
            notif.className = 'promo-notification';
            notif.style.cssText = `
                position: fixed;
                bottom: 100px;
                left: 30px;
                background: linear-gradient(135deg, #0c1445, #004e89);
                color: white;
                padding: 20px 25px;
                border-radius: 16px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 9998;
                max-width: 320px;
                animation: slideInRight 0.5s ease;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.1);
            `;
            notif.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                    <strong style="font-size:1rem;">🎉 Special Offer!</strong>
                    <span onclick="this.parentElement.parentElement.remove()" style="cursor:pointer; font-size:1.3rem; line-height:1;">&times;</span>
                </div>
                <p style="font-size:0.9rem; margin:0 0 12px 0; opacity:0.9;">Get 10% OFF on your first booking! Use code: <strong style="color:#ffd700;">FIRST10</strong></p>
                <a href="tel:+917488341848" style="display:inline-block; padding:8px 20px; background:linear-gradient(135deg, #ff6b35, #ff8c61); color:white; border-radius:25px; font-size:0.85rem; font-weight:600; text-decoration:none;">Book Now →</a>
            `;
            document.body.appendChild(notif);
            sessionStorage.setItem('notifShown', 'true');
            
            // Auto remove after 10 seconds
            setTimeout(() => {
                if (notif.parentElement) {
                    notif.style.animation = 'slideOutLeft 0.5s ease forwards';
                    setTimeout(() => notif.remove(), 500);
                }
            }, 10000);
        }, 5000);
    }

    // =====================================
    // Initialize All Enhancements
    // =====================================
    function initAll() {
        init3DTiltEffect();
        initScrollReveal();
        initSmoothCounters();
        initMagneticButtons();
        initParallax();
        initGradientText();
        initImageReveal();
        initScrollProgress();
        initSectionAnimations();
        initPageTransitions();
        initEnhancedFAQ();
        initNotificationBar();
        initParticleHero();
        initSmoothScrollLinks();
        initLazyImageFade();
        // initFloatingActions(); // Disabled - using HTML buttons instead
        
        // Only on desktop
        if (window.innerWidth >= 1024) {
            initCursorEffects();
        }
        
        // Typing animation only on homepage
        if (document.querySelector('.hero')) {
            initTypingAnimation();
        }
        
        console.log('%c🎨 3D Effects & Animations Loaded!', 'font-size: 14px; color: #ffd700; font-weight: bold;');
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    // Add slideInRight and slideOutLeft keyframes
    const animStyles = document.createElement('style');
    animStyles.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(-100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutLeft {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(-100px); opacity: 0; }
        }
        .section-visible {
            animation: scaleIn 0.6s ease forwards;
        }
        @keyframes scaleIn {
            from { opacity: 0.8; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(animStyles);

    // =====================================
    // Particle Effect on Hero Background
    // =====================================
    function initParticleHero() {
        const hero = document.querySelector('.hero, .city-hero');
        if (!hero || window.innerWidth < 768) return;
        
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
        hero.style.position = 'relative';
        hero.insertBefore(canvas, hero.firstChild);
        
        const ctx = canvas.getContext('2d');
        const particles = [];
        const count = 40;
        
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2 + 0.5,
                dx: (Math.random() - 0.5) * 0.6,
                dy: (Math.random() - 0.5) * 0.6,
                alpha: Math.random() * 0.4 + 0.1
            });
        }
        
        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,215,0,${p.alpha})`;
                ctx.fill();
                
                // Draw connecting lines
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(255,215,0,${0.08 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
        
        window.addEventListener('resize', () => {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        });
    }

    // =====================================
    // Smooth Scroll for Anchor Links
    // =====================================
    function initSmoothScrollLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // =====================================
    // Lazy Image Fade-In on Load
    // =====================================
    function initLazyImageFade() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            img.style.transform = 'scale(0.95)';
            
            if (img.complete) {
                img.style.opacity = '1';
                img.style.transform = 'scale(1)';
            } else {
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1)';
                });
            }
        });
    }

    // =====================================
    // Floating Action Buttons (WhatsApp & Call)
    // =====================================
    // DISABLED - Using HTML static buttons instead to avoid duplicates
    // function initFloatingActions() {
    //     if (document.querySelector('.floating-actions')) return;
    //     
    //     const floatingDiv = document.createElement('div');
    //     floatingDiv.className = 'floating-actions';
    //     floatingDiv.innerHTML = `
    //         <a href="https://wa.me/917488341848?text=Hi,%20I%20need%20a%20taxi%20in%20Ranchi" class="float-btn float-btn-whatsapp" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
    //             <i class="fab fa-whatsapp"></i>
    //         </a>
    //         <a href="tel:+917488341848" class="float-btn float-btn-call" aria-label="Call Now">
    //             <i class="fas fa-phone"></i>
    //         </a>
    //     `;
    //     document.body.appendChild(floatingDiv);
    // }

    // =====================================
    // Utility Functions (Debounce & Throttle)
    // =====================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // =====================================
    // Network Status Detection
    // =====================================
    function initNetworkStatus() {
        if (!('onLine' in navigator)) return;
        
        function updateOnlineStatus() {
            const status = navigator.onLine ? 'online' : 'offline';
            if (!navigator.onLine) {
                showNotification('You are offline. Some features may not work.', 'warning');
            }
        }
        
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
    }

    // =====================================
    // Show Notification Helper
    // =====================================
    function showNotification(message, type = 'info') {
        const existing = document.querySelector('.app-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `app-notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'warning' ? '#ff6b35' : '#004e89'};
            color: #fff;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 100000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // =====================================
    // Performance Monitoring
    // =====================================
    function initPerformanceMonitoring() {
        if (!('performance' in window)) return;
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    const loadTime = perfData.loadEventEnd - perfData.fetchStart;
                    console.log(`%c⚡ Page Load Time: ${(loadTime / 1000).toFixed(2)}s`, 'color: #4CAF50; font-weight: bold;');
                    
                    // Report slow pages
                    if (loadTime > 3000) {
                        console.warn('Page load time exceeds recommended 3s threshold');
                    }
                }
                
                // Log resource timing
                const resources = performance.getEntriesByType('resource');
                const totalResourceTime = resources.reduce((sum, r) => sum + r.duration, 0);
                console.log(`%c📊 Resources loaded: ${resources.length} (${(totalResourceTime / 1000).toFixed(2)}s total)`, 'color: #2196F3;');
            }, 0);
        });
    }

    // =====================================
    // Service Worker Registration (PWA)
    // =====================================
    function initServiceWorker() {
        if (!('serviceWorker' in navigator)) return;
        
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registered:', registration.scope);
                })
                .catch(error => {
                    console.log('❌ Service Worker registration failed:', error);
                });
        });
    }

    // =====================================
    // Lazy Load Background Images
    // =====================================
    function initLazyBackgrounds() {
        const lazyBackgrounds = document.querySelectorAll('[data-bg]');
        
        if ('IntersectionObserver' in window) {
            const bgObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        el.style.backgroundImage = `url(${el.dataset.bg})`;
                        el.removeAttribute('data-bg');
                        bgObserver.unobserve(el);
                    }
                });
            });
            
            lazyBackgrounds.forEach(bg => bgObserver.observe(bg));
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyBackgrounds.forEach(bg => {
                bg.style.backgroundImage = `url(${bg.dataset.bg})`;
            });
        }
    }

    // =====================================
    // Keyboard Navigation Enhancement
    // =====================================
    function initKeyboardNavigation() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape key closes modals/menus
            if (e.key === 'Escape') {
                const navMenu = document.getElementById('navMenu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
            
            // Ctrl/Cmd + K for quick booking
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const bookingForm = document.getElementById('booking');
                if (bookingForm) {
                    bookingForm.scrollIntoView({ behavior: 'smooth' });
                    const firstInput = bookingForm.querySelector('input, select');
                    if (firstInput) firstInput.focus();
                }
            }
        });
        
        // Improve focus trap in navigation
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
            });
            
            navToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navToggle.click();
                }
            });
        }
    }

    // =====================================
    // Form Validation Enhancement
    // =====================================
    function initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const inputs = form.querySelectorAll('[required]');
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('error');
                        input.setAttribute('aria-invalid', 'true');
                    } else {
                        input.classList.remove('error');
                        input.removeAttribute('aria-invalid');
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    showNotification('Please fill all required fields', 'warning');
                }
            });
        });
    }

    // =====================================
    // Copy to Clipboard Utility
    // =====================================
    function initCopyToClipboard() {
        const phoneNumbers = document.querySelectorAll('[href^="tel:"]');
        
        phoneNumbers.forEach(phone => {
            phone.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const number = phone.href.replace('tel:', '');
                
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(number).then(() => {
                        showNotification('Phone number copied!', 'info');
                    });
                }
            });
        });
    }

    // =====================================
    // Initialize All Enhancements
    // =====================================
    function initAll() {
        try {
            // Performance monitoring first
            initPerformanceMonitoring();
            
            // Core features
            init3DTiltEffect();
            initScrollReveal();
            initSmoothCounters();
            initMagneticButtons();
            initParallax();
            initGradientText();
            initImageReveal();
            initScrollProgress();
            initSectionAnimations();
            initPageTransitions();
            initEnhancedFAQ();
            initNotificationBar();
            initParticleHero();
            initSmoothScrollLinks();
            initLazyImageFade();
            // initFloatingActions(); // Disabled - using HTML buttons instead
            
            // New enhancements
            initNetworkStatus();
            initLazyBackgrounds();
            initKeyboardNavigation();
            initFormValidation();
            initCopyToClipboard();
            
            // PWA - Service Worker for offline capability
            initServiceWorker();
            
            // Only on desktop
            if (window.innerWidth >= 1024) {
                initCursorEffects();
            }
            
            // Typing animation only on homepage
            if (document.querySelector('.hero')) {
                initTypingAnimation();
            }
            
            console.log('%c🎨 3D Effects & Animations Loaded!', 'font-size: 14px; color: #ffd700; font-weight: bold;');
            console.log('%c⚡ Performance Mode: Active', 'font-size: 12px; color: #4CAF50;');
        } catch (error) {
            console.error('Error initializing enhancements:', error);
            // Graceful degradation - site still works without enhancements
        }
    }

})();
