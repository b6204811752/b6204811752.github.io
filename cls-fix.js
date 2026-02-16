// CLS Fix - DISABLE animations that cause layout shifts
// Keep animations disabled permanently to prevent CLS

(function() {
    'use strict';
    
    // DO NOT re-enable animations - they cause massive CLS
    // Animations are disabled in cls-critical-fix.css
    
    window.addEventListener('load', function() {
        // Only mark page as loaded for other purposes
        // Do NOT re-enable animations
        document.body.classList.add('page-loaded');
        
        console.log('✅ Page loaded - CLS protection active (animations disabled)');
    });
    
    // Fallback
    if (document.readyState === 'complete') {
        setTimeout(function() {
            document.body.classList.add('page-loaded');
        }, 100);
    }
})();

