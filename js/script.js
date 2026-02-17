// =====================================
// Navigation and Mobile Menu
// =====================================
// Performance Utilities: Debounce and Throttle
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.getElementById('header');

// Toggle mobile menu with accessibility
if (navToggle) {
    navToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Update ARIA attribute
        navToggle.setAttribute('aria-expanded', isActive);
        
        // Prevent body scroll when menu is open
        if (isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Also support Enter key for accessibility
    navToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navToggle.click();
        }
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navToggle) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (navToggle) {
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
        
        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Header scroll effect - Throttled for better performance
const handleScroll = throttle(() => {
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}, 100);

window.addEventListener('scroll', handleScroll, { passive: true });

// =====================================
// Smooth Scrolling
// =====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// =====================================
// Booking Form Trip Type Dropdown
// =====================================
const tripTypeSelect = document.getElementById('tripType');
const returnDateGroup = document.getElementById('returnDateGroup');
const returnDateInput = document.getElementById('returnDate');
const dropLocationInput = document.getElementById('dropLocation');
const dropLocationGroup = dropLocationInput ? dropLocationInput.closest('.form-group') : null;

if (tripTypeSelect) {
    tripTypeSelect.addEventListener('change', function() {
        const selectedType = this.value;
        
        // Show/hide return date for round trip
        if (selectedType === 'roundtrip') {
            if (returnDateGroup) {
                returnDateGroup.style.display = 'block';
                returnDateInput.required = true;
            }
            if (dropLocationGroup) {
                dropLocationGroup.style.display = 'block';
                dropLocationInput.required = true;
            }
        } else if (selectedType === 'local') {
            // For local trips, hide drop location and return date
            if (returnDateGroup) {
                returnDateGroup.style.display = 'none';
                returnDateInput.required = false;
            }
            if (dropLocationGroup) {
                dropLocationGroup.style.display = 'none';
                dropLocationInput.required = false;
            }
            // Update drop location placeholder
            if (dropLocationInput) {
                dropLocationInput.placeholder = 'Local area (within city)';
            }
        } else {
            // One way or airport - show drop location, hide return date
            if (returnDateGroup) {
                returnDateGroup.style.display = 'none';
                returnDateInput.required = false;
            }
            if (dropLocationGroup) {
                dropLocationGroup.style.display = 'block';
                dropLocationInput.required = true;
            }
            if (dropLocationInput) {
                dropLocationInput.placeholder = 'Enter drop location';
            }
        }
    });
}

// =====================================
// Booking Form Submission
// =====================================
// Booking Form Submission - Google Form Integration with Hidden Iframe
// =====================================
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        // Create hidden iframe for form submission (avoids CORS issues)
        let hiddenIframe = document.getElementById('hidden_iframe');
        if (!hiddenIframe) {
            hiddenIframe = document.createElement('iframe');
            hiddenIframe.name = 'hidden_iframe';
            hiddenIframe.id = 'hidden_iframe';
            hiddenIframe.style.display = 'none';
            document.body.appendChild(hiddenIframe);
        }
        
        // Track submission status
        let submissionTimeout = null;
        let isSubmitting = false;
        
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (isSubmitting) {
                return false;
            }

            // Process form data
            
            // Get form values
            const tripType = document.getElementById('tripType').value;
            const pickupLocation = document.getElementById('pickupLocation').value;
            const dropLocation = document.getElementById('dropLocation').value;
            const pickupDate = document.getElementById('pickupDate').value;
            const pickupTime = document.getElementById('pickupTime').value;
            const carType = document.getElementById('carType').value;
            const mobileNumber = document.getElementById('mobileNumber').value;
            const returnDate = document.getElementById('returnDate') ? document.getElementById('returnDate').value : '';
            
            // Get trip type text for display
            const tripTypeText = document.getElementById('tripType').options[document.getElementById('tripType').selectedIndex].text;
            const carTypeText = document.getElementById('carType').options[document.getElementById('carType').selectedIndex].text;
            
            // Validate mobile number
            if (!mobileNumber.match(/^[0-9]{10}$/)) {
                alert('❌ Please enter a valid 10-digit mobile number');
                return;
            }
            
            // Validate required fields
            if (!tripType || !pickupLocation || !pickupDate || !pickupTime || !carType) {
                alert('❌ Please fill all required fields');
                return;
            }
            
            // Map trip type values to Google Form format (must match exactly)
            const tripTypeMapping = {
                'oneway': 'One Way Trip',
                'roundtrip': 'Round Trip',
                'local': 'Local Rental(hours)',
                'airport': 'Airport Transfer'
            };
            
            // Map car type values to Google Form format
            const carTypeMapping = {
                'sedan': 'Sedan',
                'ertiga': 'MUV',
                'innova': 'SUV',
                'luxury': 'Luxury'
            };
            
            // Show loading state
            const submitButton = bookingForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitButton.disabled = true;
            isSubmitting = true;
            
            // Google Form URL
            const googleFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSdUoXyun_N1BYtlAD2HZyGX2tLtTO0LIaayOEqWq3GgqoCAnQ/formResponse';
            
            // Create a temporary form for submission
            const tempForm = document.createElement('form');
            tempForm.action = googleFormURL;
            tempForm.method = 'POST';
            tempForm.target = 'hidden_iframe';
            tempForm.style.display = 'none';
            
            // Add form fields
            const fields = [
                { name: 'entry.219265158', value: tripTypeMapping[tripType] || tripTypeText },
                { name: 'entry.1594636824', value: pickupDate },
                { name: 'entry.1069431231', value: pickupLocation },
                { name: 'entry.1297259824', value: dropLocation },
                { name: 'entry.2064504236', value: pickupTime },
                { name: 'entry.1057979598', value: mobileNumber },
                { name: 'entry.681528332', value: carTypeMapping[carType] || carType }
            ];
            
            // Build form data
            fields.forEach((field) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = field.name;
                input.value = field.value;
                tempForm.appendChild(input);
            });
            
            document.body.appendChild(tempForm);
            
            // Set up iframe load handler BEFORE submitting
            hiddenIframe.onload = function() {
                // Only trigger if we're actually submitting
                if (isSubmitting) {
                    clearTimeout(submissionTimeout);
                    
                    // Show success popup
                    alert('✅ SUCCESS!\n\nYour booking has been submitted successfully!\nWe will contact you soon on: ' + mobileNumber);
                    
                    // Update button state
                    submitButton.innerHTML = '<i class="fas fa-check-circle"></i> Booking Submitted!';
                    submitButton.style.backgroundColor = '#28a745';
                    
                    // Show success message div
                    const successMessage = document.getElementById('bookingSuccessMessage');
                    if (successMessage) {
                        successMessage.style.display = 'block';
                        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                    
                    // Create booking summary for WhatsApp
                    let message = `NEW BOOKING\n\n`;
                    message += `Trip: ${tripTypeText}\n`;
                    message += `From: ${pickupLocation}\n`;
                    if (tripType !== 'local') {
                        message += `To: ${dropLocation}\n`;
                    }
                    message += `Date: ${pickupDate} at ${pickupTime}\n`;
                    if (tripType === 'roundtrip' && returnDate) {
                        message += `Return: ${returnDate}\n`;
                    }
                    message += `Vehicle: ${carTypeText}\n`;
                    message += `Mobile: ${mobileNumber}\n\n`;
                    message += `Please confirm availability.`;
                    
                    // Ask for WhatsApp confirmation
                    setTimeout(() => {
                        const sendWhatsApp = confirm('Would you like to send a confirmation message via WhatsApp?\n\n(This will help us process your booking faster)');
                        
                        if (sendWhatsApp) {
                            const phoneNumber = '917488341848';
                            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, '_blank');
                        }
                        
                        // Reset form after 2 seconds
                        setTimeout(() => {
                            bookingForm.reset();
                            submitButton.innerHTML = originalButtonText;
                            submitButton.style.backgroundColor = '';
                            submitButton.disabled = false;
                            isSubmitting = false;
                            if (successMessage) {
                                successMessage.style.display = 'none';
                            }
                            // Remove temp form
                            if (tempForm.parentNode) {
                                tempForm.parentNode.removeChild(tempForm);
                            }
                        }, 2000);
                    }, 1000);
                }
            };
            
            // Set timeout for error detection (10 seconds - increased from 5)
            submissionTimeout = setTimeout(() => {
                if (isSubmitting) {
                    // Show error popup
                    alert('❌ SUBMISSION FAILED!\n\nThere was a problem submitting your booking.\n\nPlease try again or contact us directly via WhatsApp.');
                    
                    // Update button state
                    submitButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed - Try Again';
                    submitButton.style.backgroundColor = '#dc3545';
                    
                    setTimeout(() => {
                        submitButton.innerHTML = originalButtonText;
                        submitButton.style.backgroundColor = '';
                        submitButton.disabled = false;
                        isSubmitting = false;
                        // Remove temp form
                        if (tempForm.parentNode) {
                            tempForm.parentNode.removeChild(tempForm);
                        }
                    }, 3000);
                }
            }, 10000);
            
            // Submit the form
            try {
                tempForm.submit();
            } catch (error) {
                console.error('Form submission error:', error);
                clearTimeout(submissionTimeout);
                alert('❌ SUBMISSION ERROR!\n\nThere was a problem submitting your booking.\n\nPlease try again or contact us directly via WhatsApp.');
                
                submitButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error - Try Again';
                submitButton.style.backgroundColor = '#dc3545';
                
                setTimeout(() => {
                    submitButton.innerHTML = originalButtonText;
                    submitButton.style.backgroundColor = '';
                    submitButton.disabled = false;
                    isSubmitting = false;
                    if (tempForm.parentNode) {
                        tempForm.parentNode.removeChild(tempForm);
                    }
                }, 3000);
            }
            
            return false; // Prevent form submission
        });
    } else {
        console.error('❌ Booking form not found!');
    }
});

// =====================================
// Contact Form Submission
// =====================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const service = formData.get('service');
        const message = formData.get('message');
        
        // Here you would typically send the data to your server
        alert('Thank you for contacting us! We will get back to you soon.');
        
        // Optionally send to WhatsApp
        const phoneNumber = '917488341848';
        const whatsappMessage = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\nMessage: ${message}`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Uncomment to redirect to WhatsApp
        // window.open(whatsappUrl, '_blank');
        
        // Reset form
        contactForm.reset();
    });
}

// =====================================
// Counter Animation
// =====================================
const counters = document.querySelectorAll('.stat-number');
const speed = 200; // The lower the slower

const animateCounters = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounters(), 1);
        } else {
            counter.innerText = target.toLocaleString();
        }
    });
};

// Intersection Observer for counter animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    observer.observe(statsSection);
}

// =====================================
// FAQ Accordion
// =====================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Close all other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// =====================================
// Scroll to Top Button (Left Bottom)
// =====================================
const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    const handleScrollTop = throttle(() => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    }, 100);

    window.addEventListener('scroll', handleScrollTop, { passive: true });
    
    // Check on load
    handleScrollTop();

    scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, false);
    
    // Fallback for browsers that don't support smooth scroll
    scrollTopBtn.addEventListener('click', function(e) {
        if (!('scrollBehavior' in document.documentElement.style)) {
            e.preventDefault();
            window.scroll(0, 0);
        }
    }, false);
} else {
    console.error('Scroll button not found!');
}

// =====================================
// Lazy Loading Images - Optimized
// =====================================
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[loading=\"lazy\"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback to Intersection Observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px', // Start loading 50px before entering viewport
            threshold: 0.01
        });

        images.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }
};

// Execute lazy loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lazyLoadImages);
} else {
    lazyLoadImages();
}

// =====================================
// Dynamic Date in Footer
// =====================================
const updateYear = () => {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
};

updateYear();

// =====================================
// Form Input Validation
// =====================================
const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Add real-time validation to phone inputs
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validatePhone(this.value)) {
            this.style.borderColor = 'var(--danger-color)';
            this.setCustomValidity('Please enter a valid phone number');
        } else {
            this.style.borderColor = 'var(--success-color)';
            this.setCustomValidity('');
        }
    });
    
    input.addEventListener('input', function() {
        this.style.borderColor = '#e0e0e0';
    });
});

// Add real-time validation to email inputs
const emailInputs = document.querySelectorAll('input[type="email"]');
emailInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.style.borderColor = 'var(--danger-color)';
            this.setCustomValidity('Please enter a valid email address');
        } else {
            this.style.borderColor = 'var(--success-color)';
            this.setCustomValidity('');
        }
    });
    
    input.addEventListener('input', function() {
        this.style.borderColor = '#e0e0e0';
    });
});

// =====================================
// Booking Widget - Auto-fill Today's Date
// =====================================
const dateInputs = document.querySelectorAll('input[type="date"]');
dateInputs.forEach(input => {
    if (!input.value) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        input.value = `${yyyy}-${mm}-${dd}`;
        input.min = `${yyyy}-${mm}-${dd}`;
    }
});

// =====================================
// Click to Call Analytics (Optional)
// =====================================
const callButtons = document.querySelectorAll('a[href^="tel:"]');
callButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Track call button clicks
        // If you're using Google Analytics, you can track this:
        // gtag('event', 'click', {
        //     'event_category': 'Contact',
        //     'event_label': 'Phone Call',
        //     'value': button.getAttribute('href')
        // });
    });
});

// =====================================
// WhatsApp Link Analytics (Optional)
// =====================================
const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
whatsappButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Track WhatsApp button clicks
        // If you're using Google Analytics:
        // gtag('event', 'click', {
        //     'event_category': 'Contact',
        //     'event_label': 'WhatsApp',
        // });
    });
});

// =====================================
// Testimonials Auto-rotate (Optional)
// =====================================
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');

const rotateTestimonials = () => {
    if (testimonials.length > 0) {
        // Hide all testimonials
        testimonials.forEach(card => {
            card.style.display = 'none';
        });
        
        // Show current testimonial
        testimonials[currentTestimonial].style.display = 'block';
        
        // Move to next testimonial
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    }
};

// Uncomment to enable auto-rotation
// setInterval(rotateTestimonials, 5000);

// =====================================
// Page Load Animation
// =====================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .fleet-card, .why-card, .testimonial-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
});

// =====================================
// Price Calculator (Optional Feature)
// =====================================
const calculatePrice = (distance, carType) => {
    const rates = {
        'hatchback': 9,
        'sedan': 10,
        'suv': 12,
        'innova': 15
    };
    
    const baseRate = rates[carType] || 10;
    const price = distance * baseRate;
    const driverAllowance = distance > 250 ? 300 : 0;
    
    return {
        basePrice: price,
        driverAllowance: driverAllowance,
        totalPrice: price + driverAllowance
    };
};

// Example usage:
// const estimate = calculatePrice(300, 'sedan');
// console.log('Estimated Price:', estimate.totalPrice);

// =====================================
// Local Storage for Repeat Customers
// =====================================
const saveCustomerInfo = (data) => {
    localStorage.setItem('customerInfo', JSON.stringify(data));
};

const loadCustomerInfo = () => {
    const saved = localStorage.getItem('customerInfo');
    return saved ? JSON.parse(saved) : null;
};

// Auto-fill form with saved customer info
const autoFillForms = () => {
    const savedInfo = loadCustomerInfo();
    
    if (savedInfo) {
        const nameInputs = document.querySelectorAll('input[type="text"][placeholder*="Name"]');
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        const emailInputs = document.querySelectorAll('input[type="email"]');
        
        nameInputs.forEach(input => {
            if (!input.value && savedInfo.name) {
                input.value = savedInfo.name;
            }
        });
        
        phoneInputs.forEach(input => {
            if (!input.value && savedInfo.phone) {
                input.value = savedInfo.phone;
            }
        });
        
        emailInputs.forEach(input => {
            if (!input.value && savedInfo.email) {
                input.value = savedInfo.email;
            }
        });
    }
};

// Call auto-fill on page load
setTimeout(autoFillForms, 500);

// =====================================
// Instant Fare Calculator - KM Based
// =====================================
const calcBtn = document.getElementById('calcBtn');
const fareResult = document.getElementById('fareResult');
const fareAmount = document.getElementById('fareAmount');
const fareDetails = document.getElementById('fareDetails');

if (calcBtn) {
    calcBtn.addEventListener('click', function() {
        const kmInput = document.getElementById('calcKm');
        const carRate = document.getElementById('calcCar').value;
        
        if (!kmInput || !kmInput.value) {
            alert('⚠️ Please enter distance in kilometers');
            kmInput.focus();
            return;
        }
        
        const km = parseFloat(kmInput.value);
        
        // Validation
        if (km <= 0) {
            alert('⚠️ Please enter a valid distance (greater than 0 km)');
            kmInput.focus();
            return;
        }
        
        if (km > 1000) {
            alert('⚠️ Maximum distance is 1000 km. For longer trips, please contact us directly.');
            kmInput.focus();
            return;
        }
        
        const rate = parseFloat(carRate);
        
        // Simple calculation: KM × Rate
        const totalFare = km * rate;
        
        // Get vehicle name for display
        const carSelect = document.getElementById('calcCar');
        const carName = carSelect.options[carSelect.selectedIndex].text;
        
        // Display result with animation
        fareAmount.textContent = `₹${Math.round(totalFare).toLocaleString()}`;
        
        // Show calculation breakdown
        if (fareDetails) {
            fareDetails.innerHTML = `
                <strong>Calculation:</strong> ${km} km × ₹${rate}/km = ₹${Math.round(totalFare).toLocaleString()}<br>
                <strong>Vehicle:</strong> ${carName}
            `;
        }
        
        fareResult.style.display = 'block';
        
        // Smooth scroll to result
        fareResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Log for debugging
    });
    
    // Allow Enter key to calculate
    const kmInput = document.getElementById('calcKm');
    if (kmInput) {
        kmInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calcBtn.click();
            }
        });
    }
}

// =====================================
// Live Booking Counter Animation
// =====================================
const liveBookings = document.getElementById('liveBookings');

if (liveBookings) {
    function updateBookingCount() {
        const min = 18;
        const max = 35;
        const randomCount = Math.floor(Math.random() * (max - min + 1)) + min;
        
        liveBookings.style.opacity = '0';
        setTimeout(() => {
            liveBookings.textContent = randomCount;
            liveBookings.style.opacity = '1';
        }, 300);
    }
    
    // Update every 30 seconds
    setInterval(updateBookingCount, 30000);
}

// =====================================
// Keyboard Shortcuts
// =====================================
// Keyboard Shortcuts - REMOVED (hijacked 'c' and 'w' keys during normal typing)

// =====================================
// Print Functionality
// =====================================
const printPage = () => {
    window.print();
};

// =====================================
// Share Functionality (Web Share API)
// =====================================
const shareWebsite = async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Car Rental Ranchi',
                text: 'Best taxi service in Ranchi - Affordable car rentals for local and outstation trips',
                url: window.location.href
            });
        } catch (err) {
        }
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    }
};

// =====================================
// Performance Monitoring
// =====================================
window.addEventListener('load', () => {
    // Calculate and log page load time
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    // If using Google Analytics, you can send this data:
    // gtag('event', 'timing_complete', {
    //     'name': 'load',
    //     'value': loadTime,
    //     'event_category': 'Performance'
    // });
});

// =====================================
// Offline Detection
// =====================================
window.addEventListener('online', () => {
    // You can show a notification here
});

window.addEventListener('offline', () => {
    alert('You are currently offline. Some features may not work properly.');
});

// =====================================
// Console Welcome Message
// =====================================
// =====================================
// Initialize everything when DOM is ready
// =====================================
document.addEventListener('DOMContentLoaded', () => {
    // Any additional initialization code can go here
});

// =====================================
// Enhanced UI/UX Features - 2026
// =====================================

// Scroll Progress Indicator
function updateScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (!scrollProgress) {
        // Create progress bar if it doesn't exist
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
    }
    
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
}

window.addEventListener('scroll', updateScrollProgress);

// Scroll Animations
function revealOnScroll() {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);
        
        if (isVisible) {
            element.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Back to Top Button - REMOVED (duplicate of #scrollTop static button)
// Using the static HTML .scroll-top button instead

// Floating WhatsApp Button - DISABLED (Using HTML static buttons instead to avoid duplicates)
// function createFloatingWhatsApp() {
//     if (!document.querySelector('.floating-whatsapp')) {
//         const whatsappBtn = document.createElement('a');
//         whatsappBtn.href = 'https://wa.me/917488341848?text=Hi,%20I%20need%20a%20taxi';
//         whatsappBtn.target = '_blank';
//         whatsappBtn.className = 'floating-whatsapp';
//         whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
//         whatsappBtn.setAttribute('aria-label', 'Contact us on WhatsApp');
//         document.body.appendChild(whatsappBtn);
//     }
// }

// window.addEventListener('load', createFloatingWhatsApp);

// Image Lightbox
function initLightbox() {
    // Create lightbox element if it doesn't exist
    if (!document.querySelector('.lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-content" src="" alt="Lightbox image">
        `;
        document.body.appendChild(lightbox);
        
        // Close lightbox on click
        lightbox.addEventListener('click', (e) => {
            if (e.target.classList.contains('lightbox') || e.target.classList.contains('lightbox-close')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Add click handlers to gallery images
    const galleryImages = document.querySelectorAll('.gallery-item img, .place-image');
    galleryImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            const lightbox = document.querySelector('.lightbox');
            const lightboxImg = document.querySelector('.lightbox-content');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || 'Gallery image';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
}

window.addEventListener('load', initLightbox);

// Animated Counter - REMOVED (duplicate of animateCounters/IntersectionObserver above)

// Reading Time Estimator
function calculateReadingTime() {
    const article = document.querySelector('.city-hero-content, article, main');
    if (article) {
        const text = article.textContent;
        const wordsPerMinute = 200;
        const wordCount = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        
        // Display reading time if element exists
        const readingTimeElement = document.querySelector('.reading-time');
        if (readingTimeElement) {
            readingTimeElement.textContent = `${readingTime} min read`;
        }
    }
}

window.addEventListener('load', calculateReadingTime);

// Smooth Scroll for Anchor Links - REMOVED (duplicate of handler at top of file)

// Share on Social Media
function shareOnSocial(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${title}%20${url}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show success message
        showToast('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Toast Notification
function showToast(message, duration = 3000) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 15px 30px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Add slideUp and slideDown animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax Effect for Hero Background
function parallaxEffect() {
    const hero = document.querySelector('.city-hero, .hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
}

window.addEventListener('scroll', parallaxEffect);

// Device Detection
function detectDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
    
    document.body.classList.add(isMobile ? 'is-mobile' : 'is-desktop');
    if (isTablet) {
        document.body.classList.add('is-tablet');
    }
}

window.addEventListener('load', detectDevice);
