/**
 * ADVANCED PERFORMANCE BOOST - JavaScript Layer
 * Optimizes resource loading, reduces main thread work, improves FCP
 * Complements cls-fix.js to push performance from 60 to 70+
 */

(function() {
    'use strict';
    
    // ===== EARLY PERFORMANCE MARKS =====
    performance.mark('boost-script-start');
    
    // ===== FONT LOADING OPTIMIZATION =====
    // Preload critical fonts immediately
    if ('fonts' in document) {
        Promise.all([
            document.fonts.load('600 1em Poppins'),
            document.fonts.load('400 1em Poppins')
        ]).then(function() {
            document.documentElement.classList.add('fonts-loaded');
        }).catch(function() {
            // Fallback if font loading fails
            document.documentElement.classList.add('fonts-failed');
        });
    }
    
    // ===== LAZY LOADING ENHANCEMENT =====
    // Add native lazy loading to images without it
    if ('loading' in HTMLImageElement.prototype) {
        document.addEventListener('DOMContentLoaded', function() {
            var images = document.querySelectorAll('img:not([loading])');
            images.forEach(function(img) {
                // Don't lazy load hero/logo images
                if (!img.classList.contains('logo-img') && 
                    !img.closest('.hero')) {
                    img.loading = 'lazy';
                }
            });
        });
    }
    
    // ===== SCROLL PERFORMANCE =====
    // Throttle scroll events to reduce main thread work
    var scrollTimeout;
    var isScrolling = false;
    
    function handleScroll() {
        if (!isScrolling) {
            document.body.classList.add('scrolling');
            isScrolling = true;
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            document.body.classList.remove('scrolling');
            isScrolling = false;
        }, 150);
    }
    
    // Use passive listeners for better scroll performance
    var supportsPassive = false;
    try {
        var opts = Object.defineProperty({}, 'passive', {
            get: function() { supportsPassive = true; }
        });
        window.addEventListener('test', null, opts);
    } catch (e) {}
    
    window.addEventListener('scroll', handleScroll, 
        supportsPassive ? { passive: true } : false);
    
    // ===== PREFETCH NEXT PAGE =====
    // Prefetch likely next pages on hover
    var prefetched = {};
    
    function prefetchLink(url) {
        if (prefetched[url]) return;
        
        var link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
        prefetched[url] = true;
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        var navLinks = document.querySelectorAll('a[href$=".html"]');
        navLinks.forEach(function(link) {
            link.addEventListener('mouseenter', function() {
                prefetchLink(this.href);
            }, { passive: true, once: true });
        });
    });
    
    // ===== REDUCE MAIN THREAD WORK =====
    // Defer non-critical work until idle
    if ('requestIdleCallback' in window) {
        requestIdleCallback(function() {
            // Initialize non-critical features
            initNonCriticalFeatures();
        }, { timeout: 2000 });
    } else {
        setTimeout(initNonCriticalFeatures, 2000);
    }
    
    function initNonCriticalFeatures() {
        // Any non-critical initialization here
        performance.mark('non-critical-features-loaded');
    }
    
    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    // Only animate elements when they'revisible
    if ('IntersectionObserver' in window) {
        var animationObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });
        
        document.addEventListener('DOMContentLoaded', function() {
            // Observe elements that should animate on scroll
            var animateElements = document.querySelectorAll(
                '.service-card, .fleet-card, .testimonial-card, .route-card'
            );
            animateElements.forEach(function(el) {
                animationObserver.observe(el);
            });
        });
    }
    
    // ===== OPTIMIZE EXTERNAL RESOURCES =====
    // Lazy load external iframes
    window.addEventListener('load', function() {
        var iframes = document.querySelectorAll('iframe[data-src]');
        iframes.forEach(function(iframe) {
            iframe.src = iframe.getAttribute('data-src');
        });
    });
    
    // ===== NETWORK INFORMATION API =====
    // Adjust quality based on connection
    if ('connection' in navigator) {
        var connection = navigator.connection;
        
        if (connection.effectiveType === 'slow-2g' || 
            connection.effectiveType === '2g' ||
            connection.saveData) {
            // Disable non-essential features on slow connections
            document.documentElement.classList.add('slow-connection');
        }
    }
    
    // ===== WEB VITALS MONITORING =====
    // Track Core Web Vitals improvements
    if ('PerformanceObserver' in window) {
        // Track LCP
        try {
            var lcpObserver = new PerformanceObserver(function(list) {
                var entries = list.getEntries();
                var lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {}
        
        // Track CLS
        try {
            var clsValue = 0;
            var clsObserver = new PerformanceObserver(function(list) {
                list.getEntries().forEach(function(entry) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        console.log('CLS:', clsValue);
                    }
                });
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {}
        
        // Track FID
        try {
            var fidObserver = new PerformanceObserver(function(list) {
                list.getEntries().forEach(function(entry) {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {}
    }
    
    // ===== RESOURCE HINTS =====
    // Add dynamic resource hints based on user behavior
    window.addEventListener('load', function() {
        // Preconnect to likely third-party origins
        var origins = [
            'https://fonts.gstatic.com',
            'https://images.unsplash.com',
            'https://ui-avatars.com'
        ];
        
        origins.forEach(function(origin) {
            var link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = origin;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    });
    
    // ===== CACHE OPTIMIZATION =====
    // Use service worker for aggressive caching
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('Service Worker registered for caching');
                })
                .catch(function(error) {
                    console.log('Service Worker registration failed');
                });
        });
    }
    
    // ===== PERFORMANCE MEASUREMENT =====
    window.addEventListener('load', function() {
        setTimeout(function() {
            performance.mark('boost-script-end');
            performance.measure('boost-script-duration', 
                'boost-script-start', 'boost-script-end');
            
            var measure = performance.getEntriesByName('boost-script-duration')[0];
            console.log('Performance Boost Script Duration:', measure.duration + 'ms');
            
            // Log key metrics
            var perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.fetchStart);
                console.log('Full Page Load:', perfData.loadEventEnd - perfData.fetchStart);
            }
        }, 0);
    });
    
})();
