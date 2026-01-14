/**
 * Professional Portfolio JavaScript
 * Author: Peter Blessings Kaphaso
 */

(function() {
    'use strict';

    // DOM Elements
    const elements = {
        header: document.getElementById('header'),
        navToggle: document.getElementById('nav-toggle'),
        navMenu: document.getElementById('nav-menu'),
        backToTop: document.getElementById('backToTop'),
        contactForm: document.getElementById('contact-form'),
        navLinks: document.querySelectorAll('.nav-link'),
        skillBars: document.querySelectorAll('.skill-progress')
    };

    // Configuration
    const config = {
        scrollThreshold: 100,
        animationDuration: 1000,
        contactFormEndpoint: 'https://api.web3forms.com/submit',
        contactFormAccessKey: '8caaa11e-cc72-4add-8c88-aa2b978cd1ce'
    };

    // Utility Functions
    const utils = {
        // Debounce function for performance optimization
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Throttle function for scroll events
        throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Check if element is in viewport
        isInViewport(element, threshold = 0.1) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;

            return (
                rect.top >= -rect.height * threshold &&
                rect.left >= -rect.width * threshold &&
                rect.bottom <= windowHeight + rect.height * threshold &&
                rect.right <= windowWidth + rect.width * threshold
            );
        },

        // Smooth scroll to element
        scrollToElement(element, offset = 80) {
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        },

        // Show notification
        showNotification(message, type = 'info', duration = 5000) {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <span>${message}</span>
                    <button class="notification-close">&times;</button>
                </div>
            `;

            // Add styles if not already present
            if (!document.querySelector('#notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    .notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        padding: 1rem 1.5rem;
                        border-radius: 0.5rem;
                        color: white;
                        z-index: 10000;
                        max-width: 400px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        transform: translateX(100%);
                        opacity: 0;
                        transition: all 0.3s ease;
                    }
                    .notification.show {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    .notification-info { background: #3b82f6; }
                    .notification-success { background: #10b981; }
                    .notification-error { background: #ef4444; }
                    .notification-warning { background: #f59e0b; }
                    .notification-content {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 1rem;
                    }
                    .notification-close {
                        background: none;
                        border: none;
                        color: white;
                        font-size: 1.2rem;
                        cursor: pointer;
                        padding: 0;
                    }
                `;
                document.head.appendChild(style);
            }

            document.body.appendChild(notification);

            // Show notification
            setTimeout(() => notification.classList.add('show'), 100);

            // Handle close button
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            });

            // Auto remove
            if (duration > 0) {
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => notification.remove(), 300);
                }, duration);
            }

            return notification;
        }
    };

    // Navigation Manager (Updated for Multi-Page)
    const navigationManager = {
        init() {
            this.bindEvents();
            this.setActivePage();
        },

        bindEvents() {
            // Mobile menu toggle
            if (elements.navToggle && elements.navMenu) {
                elements.navToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
            }

            // Close mobile menu when clicking a link
            elements.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (elements.navToggle && elements.navMenu && 
                    !elements.navToggle.contains(e.target) && 
                    !elements.navMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        },

        toggleMobileMenu() {
            elements.navMenu.classList.toggle('active');
            elements.navToggle.classList.toggle('active');
        },

        closeMobileMenu() {
            elements.navMenu.classList.remove('active');
            elements.navToggle.classList.remove('active');
        },

        setActivePage() {
            // Get current page filename
            let currentPage = window.location.pathname.split('/').pop();
            
            // Default to index.html if empty or just /
            if (!currentPage || currentPage === '' || currentPage === '/') {
                currentPage = 'index.html';
            }

            // Remove active class from all links
            elements.navLinks.forEach(link => {
                link.classList.remove('active');
                
                // Get the href attribute
                const linkHref = link.getAttribute('href');
                
                // Check if this link matches the current page
                if (linkHref === currentPage || 
                    (currentPage === 'index.html' && linkHref === 'index.html') ||
                    (currentPage === '' && linkHref === 'index.html')) {
                    link.classList.add('active');
                }
            });
        }
    };

    // Header Manager
    const headerManager = {
        init() {
            this.bindEvents();
        },

        bindEvents() {
            window.addEventListener('scroll', utils.throttle(this.handleScroll.bind(this), 16));
        },

        handleScroll() {
            const scrollY = window.scrollY;
            
            if (elements.header) {
                if (scrollY > config.scrollThreshold) {
                    elements.header.classList.add('scrolled');
                } else {
                    elements.header.classList.remove('scrolled');
                }
            }
        }
    };

    // Back to Top Manager
    const backToTopManager = {
        init() {
            this.bindEvents();
        },

        bindEvents() {
            window.addEventListener('scroll', utils.throttle(this.handleScroll.bind(this), 100));
            
            if (elements.backToTop) {
                elements.backToTop.addEventListener('click', this.scrollToTop.bind(this));
            }
        },

        handleScroll() {
            if (!elements.backToTop) return;

            if (window.scrollY > config.scrollThreshold * 2) {
                elements.backToTop.classList.add('visible');
            } else {
                elements.backToTop.classList.remove('visible');
            }
        },

        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    // Animation Manager
    const animationManager = {
        init() {
            this.observeElements();
            this.animateSkillBars();
        },

        observeElements() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        
                        // Add specific animation classes
                        const animationType = entry.target.dataset.animation || 'fade-in-up';
                        entry.target.classList.add(animationType);
                    }
                });
            }, observerOptions);

            // Observe sections and cards
            const elementsToAnimate = document.querySelectorAll('.section-header, .about-content, .timeline-item, .skill-category, .project-card, .service-card');
            elementsToAnimate.forEach(el => observer.observe(el));
        },

        animateSkillBars() {
            const skillsSection = document.getElementById('skills');
            if (!skillsSection) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.startSkillBarAnimation();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(skillsSection);
        },

        startSkillBarAnimation() {
            elements.skillBars.forEach((bar, index) => {
                setTimeout(() => {
                    const width = bar.dataset.width || '0%';
                    bar.style.width = width;
                }, index * 200);
            });
        }
    };

    // Contact Form Manager
    const contactFormManager = {
        init() {
            this.bindEvents();
        },

        bindEvents() {
            if (elements.contactForm) {
                elements.contactForm.addEventListener('submit', this.handleSubmit.bind(this));
            }
        },

        async handleSubmit(e) {
            e.preventDefault();
            
            const formData = new FormData(elements.contactForm);
            const submitButton = elements.contactForm.querySelector('button[type="submit"]');
            
            // Validation
            if (!this.validateForm(formData)) {
                return;
            }

            // Show loading state
            this.setLoadingState(submitButton, true);

            try {
                // Add access key for Web3Forms
                formData.append('access_key', config.contactFormAccessKey);
                
                // Format the message
                const message = this.formatMessage(formData);
                formData.set('message', message);

                const response = await fetch(config.contactFormEndpoint, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    utils.showNotification('Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
                    elements.contactForm.reset();
                    this.trackEvent('contact_form_success');
                } else {
                    throw new Error(result.message || 'Failed to send message');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                utils.showNotification('Failed to send message. Please try again or email me directly at blesskapha@outlook.com', 'error');
                this.trackEvent('contact_form_error', { error: error.message });
            } finally {
                this.setLoadingState(submitButton, false);
            }
        },

        validateForm(formData) {
            const firstName = formData.get('firstName')?.trim();
            const lastName = formData.get('lastName')?.trim();
            const email = formData.get('email')?.trim();
            const subject = formData.get('subject')?.trim();
            const message = formData.get('message')?.trim();

            if (!firstName || firstName.length < 2) {
                utils.showNotification('Please enter a valid first name', 'error');
                return false;
            }

            if (!lastName || lastName.length < 2) {
                utils.showNotification('Please enter a valid last name', 'error');
                return false;
            }

            if (!email || !this.isValidEmail(email)) {
                utils.showNotification('Please enter a valid email address', 'error');
                return false;
            }

            if (!subject) {
                utils.showNotification('Please select a subject', 'error');
                return false;
            }

            if (!message || message.length < 10) {
                utils.showNotification('Please enter a message with at least 10 characters', 'error');
                return false;
            }

            return true;
        },

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        formatMessage(formData) {
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const budget = formData.get('budget') || 'Not specified';
            const message = formData.get('message');
            const timestamp = new Date().toLocaleString();

            return `
Portfolio Contact Form Submission
================================

FROM: ${firstName} ${lastName}
EMAIL: ${email}
SUBJECT: ${subject}
BUDGET: ${budget}

MESSAGE:
--------
${message}

================================
Sent: ${timestamp}
Source: Peter Blessings Kaphaso Portfolio
            `.trim();
        },

        setLoadingState(button, isLoading) {
            if (isLoading) {
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            } else {
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            }
        },

        trackEvent(eventName, data = {}) {
            // Google Analytics 4
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    event_category: 'contact_form',
                    ...data
                });
            }

            // Custom analytics
            if (window.dataLayer) {
                window.dataLayer.push({
                    event: eventName,
                    ...data
                });
            }

            console.log(`Event tracked: ${eventName}`, data);
        }
    };

    // Performance Manager
    const performanceManager = {
        init() {
            this.lazyLoadImages();
            this.prefetchPages();
            this.monitorPerformance();
        },

        lazyLoadImages() {
            const images = document.querySelectorAll('img[data-src]');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                images.forEach(img => imageObserver.observe(img));
            } else {
                // Fallback for older browsers
                images.forEach(img => {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                });
            }
        },

        prefetchPages() {
            const links = document.querySelectorAll('a[href$=".html"]');
            links.forEach(link => {
                link.addEventListener('mouseenter', () => {
                    const prefetchLink = document.createElement('link');
                    prefetchLink.rel = 'prefetch';
                    prefetchLink.href = link.href;
                    document.head.appendChild(prefetchLink);
                });
            });
        },

        monitorPerformance() {
            if ('performance' in window) {
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        const perfData = performance.getEntriesByType('navigation')[0];
                        if (perfData) {
                            console.log('Performance Metrics:', {
                                'DNS Lookup': Math.round(perfData.domainLookupEnd - perfData.domainLookupStart),
                                'Connection': Math.round(perfData.connectEnd - perfData.connectStart),
                                'First Byte': Math.round(perfData.responseStart - perfData.requestStart),
                                'DOM Ready': Math.round(perfData.domContentLoadedEventEnd - perfData.navigationStart),
                                'Page Load': Math.round(perfData.loadEventEnd - perfData.navigationStart)
                            });
                        }
                    }, 0);
                });
            }
        }
    };

    // Error Handler
    const errorHandler = {
        init() {
            window.addEventListener('error', this.handleError);
            window.addEventListener('unhandledrejection', this.handlePromiseRejection);
        },

        handleError(error) {
            console.error('JavaScript Error:', {
                message: error.message,
                source: error.filename,
                line: error.lineno,
                column: error.colno,
                stack: error.error?.stack
            });
        },

        handlePromiseRejection(event) {
            console.error('Unhandled Promise Rejection:', event.reason);
        }
    };

    // Theme Manager
    const themeManager = {
        init() {
            this.detectSystemTheme();
            this.bindEvents();
        },

        detectSystemTheme() {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark-theme');
            }
        },

        bindEvents() {
            if (window.matchMedia) {
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                    if (e.matches) {
                        document.documentElement.classList.add('dark-theme');
                    } else {
                        document.documentElement.classList.remove('dark-theme');
                    }
                });
            }
        }
    };

    // Analytics Manager
    const analyticsManager = {
        init() {
            this.trackPageView();
            this.trackScrollDepth();
            this.trackTimeOnPage();
        },

        trackPageView() {
            if (typeof gtag !== 'undefined') {
                gtag('config', 'GA_MEASUREMENT_ID', {
                    page_title: document.title,
                    page_location: window.location.href
                });
            }
        },

        trackScrollDepth() {
            let maxScroll = 0;
            const milestones = [25, 50, 75, 100];
            const tracked = new Set();

            window.addEventListener('scroll', utils.throttle(() => {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = Math.round((scrollTop / docHeight) * 100);

                if (scrollPercent > maxScroll) {
                    maxScroll = scrollPercent;
                }

                milestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !tracked.has(milestone)) {
                        tracked.add(milestone);
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'scroll_depth', {
                                event_category: 'engagement',
                                event_label: `${milestone}%`,
                                value: milestone
                            });
                        }
                    }
                });
            }, 500));
        },

        trackTimeOnPage() {
            const startTime = Date.now();
            
            window.addEventListener('beforeunload', () => {
                const timeOnPage = Math.round((Date.now() - startTime) / 1000);
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'time_on_page', {
                        event_category: 'engagement',
                        value: timeOnPage
                    });
                }
            });
        }
    };

    // Accessibility Manager
    const accessibilityManager = {
        init() {
            this.enhanceKeyboardNavigation();
            this.addSkipLinks();
            this.improveFormLabels();
        },

        enhanceKeyboardNavigation() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('using-keyboard');
                }
            });

            document.addEventListener('mousedown', () => {
                document.body.classList.remove('using-keyboard');
            });

            // Add focus styles for keyboard users
            const style = document.createElement('style');
            style.textContent = `
                .using-keyboard *:focus {
                    outline: 2px solid #3b82f6 !important;
                    outline-offset: 2px !important;
                }
            `;
            document.head.appendChild(style);
        },

        addSkipLinks() {
            const skipLink = document.createElement('a');
            skipLink.href = '#main';
            skipLink.textContent = 'Skip to main content';
            skipLink.className = 'skip-link';
            
            const skipLinkStyles = document.createElement('style');
            skipLinkStyles.textContent = `
                .skip-link {
                    position: absolute;
                    top: -40px;
                    left: 6px;
                    background: #000;
                    color: white;
                    padding: 8px;
                    text-decoration: none;
                    z-index: 1000;
                    border-radius: 4px;
                }
                .skip-link:focus {
                    top: 6px;
                }
            `;
            
            document.head.appendChild(skipLinkStyles);
            document.body.insertBefore(skipLink, document.body.firstChild);
        },

        improveFormLabels() {
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (!input.getAttribute('aria-label') && !document.querySelector(`label[for="${input.id}"]`)) {
                    const placeholder = input.getAttribute('placeholder');
                    if (placeholder) {
                        input.setAttribute('aria-label', placeholder);
                    }
                }
            });
        }
    };

    // Main Application
    const app = {
        init() {
            // Initialize all managers
            try {
                navigationManager.init();
                headerManager.init();
                backToTopManager.init();
                animationManager.init();
                contactFormManager.init();
                performanceManager.init();
                errorHandler.init();
                themeManager.init();
                analyticsManager.init();
                accessibilityManager.init();

                console.log('Portfolio application initialized successfully');
                
                // Add to global scope for debugging
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    window.portfolioApp = this;
                    window.portfolioUtils = utils;
                }
                
            } catch (error) {
                console.error('Failed to initialize portfolio application:', error);
                errorHandler.handleError(error);
            }
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', app.init.bind(app));
    } else {
        app.init();
    }

    // Export for external use
    window.Portfolio = app;

})();
document.addEventListener("DOMContentLoaded", function () {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
