// =====================================
// PERFORMANCE BOOST JS
// Additional optimizations for PageSpeed
// =====================================

(function() {
    'use strict';

    // 1. Font Loading Optimization
    if ('fonts' in document) {
        // Preload critical fonts
        Promise.all([
            document.fonts.load('400 1em Poppins'),
            document.fonts.load('600 1em Poppins'),
            document.fonts.load('700 1em Poppins')
        ]).then(() => {
            document.documentElement.classList.add('fonts-loaded');
            document.body.classList.add('loaded');
        }).catch(err => {
            console.warn('Font loading failed:', err);
            document.body.classList.add('loaded'); // Still mark as loaded
        });
    } else {
        // Fallback for browsers without Font Loading API
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 300);
    }

    // 2. Lazy Loading Enhancement (add to images without lazy attribute)
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            // Skip hero and logo images (they're critical)
            if (!img.closest('.hero') && !img.classList.contains('logo')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }

    // 3. Throttled Scroll Performance
    let scrollTimeout;
    let isScrolling = false;
    
    const handleScroll = () => {
        if (!isScrolling) {
            document.body.classList.add('scrolling');
            isScrolling = true;
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('scrolling');
            isScrolling = false;
        }, 150);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 4. Prefetch next page on link hover
    const prefetchedLinks = new Set();
    
    const prefetchLink = (url) => {
        if (prefetchedLinks.has(url)) return;
        
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
        prefetchedLinks.add(url);
    };
    
    document.addEventListener('mouseover', (e) => {
        const link = e.target.closest('a[href^="/"], a[href^="./"], a[href^="../"]');
        if (link && link.href) {
            prefetchLink(link.href);
        }
    }, { passive: true });

    // 5. Intersection Observer for animations
    if ('IntersectionObserver' in window) {
        const animateOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    animateOnScroll.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe cards and sections
        const elementsToAnimate = document.querySelectorAll(
            '.service-card, .fleet-card, .destination-card, .testimonial-card, .feature-card'
        );
        
        elementsToAnimate.forEach(el => {
            animateOnScroll.observe(el);
        });
    }

    // 6. Network Information API - Reduce features on slow connections
    if ('connection' in navigator) {
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (conn) {
            const slowConnections = ['slow-2g', '2g'];
            
            if (slowConnections.includes(conn.effectiveType) || conn.saveData) {
                // Disable animations on slow connections
                document.documentElement.classList.add('reduce-motion');
                
                // Disable autoplay videos
                document.querySelectorAll('video[autoplay]').forEach(video => {
                    video.removeAttribute('autoplay');
                });
                
                console.log('Slow connection detected. Reduced features for better performance.');
            }
        }
    }

    // 7. Web Vitals Monitoring (for debugging)
    const logWebVital = (metric) => {
        console.log(`${metric.name}: ${metric.value.toFixed(2)}`);
    };

    // Monitor LCP
    if ('PerformanceObserver' in window) {
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                logWebVital({
                    name: 'LCP',
                    value: lastEntry.renderTime || lastEntry.loadTime
                });
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

            // Monitor CLS
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                logWebVital({ name: 'CLS', value: clsValue });
            });
            clsObserver.observe({ type: 'layout-shift', buffered: true });

            // Monitor FID
            const fidObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    logWebVital({
                        name: 'FID',
                        value: entry.processingStart - entry.startTime
                    });
                }
            });
            fidObserver.observe({ type: 'first-input', buffered: true });
        } catch (e) {
            console.log('Web Vitals monitoring not supported');
        }
    }

    // 8. Resource Hints - Preconnect to third-party origins
    const addPreconnect = (url) => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = url;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    };

    // Add preconnects after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            addPreconnect('https://cdnjs.cloudflare.com');
            addPreconnect('https://fonts.googleapis.com');
            addPreconnect('https://fonts.gstatic.com');
        }, 1000);
    });

    // 9. Service Worker Registration (if available)
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(reg => {
                console.log('Service Worker registered:', reg.scope);
            }).catch(err => {
                console.log('Service Worker registration failed:', err);
            });
        });
    }

    // 10. Optimize images with native lazy loading fallback
    if (!('loading' in HTMLImageElement.prototype)) {
        // Import lazysizes library dynamically for older browsers
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        script.async = true;
        document.body.appendChild(script);
    }

    console.log('Performance boost initialized ✓');
})();
