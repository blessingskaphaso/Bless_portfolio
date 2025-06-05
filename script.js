// Author: Peter Blessings Kaphaso

// Utility Functions
const utils = {
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    throttle(func, wait) {
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

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
};

// Notification System
const notifications = {
    init() {
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    color: white;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    z-index: 10000;
                    max-width: 400px;
                    animation: slideIn 0.3s ease-out;
                }
                .notification-success { background: #10b981; }
                .notification-error { background: #ef4444; }
                .notification-info { background: #3b82f6; }
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
                    font-size: 1.25rem;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }
            `;
            document.head.appendChild(style);
        }
    },

    show(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Event listeners
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 5000);
    }
};

// Mobile Menu Handler
const mobileMenu = {
    init() {
        const btn = document.querySelector('.mobile-menu-btn');
        const menu = document.querySelector('.nav-menu');
        
        if (!btn || !menu) return;

        btn.addEventListener('click', () => {
            menu.classList.toggle('active');
            const icon = btn.querySelector('i');
            
            if (menu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Close menu when clicking links
        menu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                menu.classList.remove('active');
                const icon = btn.querySelector('i');
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }
};

// Smooth Scrolling
const smoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                    const offsetTop = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

// Read More Functionality
const readMore = {
    init() {
        // Generic read more buttons
        document.querySelectorAll('.read-more-btn').forEach(button => {
            button.addEventListener('click', () => {
                const content = button.previousElementSibling;
                if (content?.classList.contains('read-more-content')) {
                    content.classList.toggle('expanded');
                    button.textContent = content.classList.contains('expanded') ? 'Read Less' : 'Read More';
                }
            });
        });

        // Specific read more handlers
        this.handleSpecificReadMore('readMoreBtn', 'blogContent');
        this.handleSpecificReadMore('aboutReadMoreBtn', 'aboutContent');
    },

    handleSpecificReadMore(btnId, contentId) {
        const btn = document.getElementById(btnId);
        const content = document.getElementById(contentId);
        
        if (btn && content) {
            btn.addEventListener('click', () => {
                content.classList.toggle('show');
                btn.textContent = content.classList.contains('show') ? 'Read Less' : 'Read More';
            });
        }
    }
};

// Header Effects
const headerEffects = {
    init() {
        const header = document.querySelector('header');
        if (!header) return;

        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', utils.throttle(() => {
            const currentScrollY = window.scrollY;
            
            // Background blur effect
            if (currentScrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            }

            // Hide/show header
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        }, 10));
    }
};

// Scroll Animations
const scrollAnimations = {
    init() {
        this.initAnimationStyles();
        this.initIntersectionObserver();
        this.initParallaxEffect();
    },

    initAnimationStyles() {
        if (document.querySelector('#animation-styles')) return;

        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease-out;
            }
            .animate-on-scroll.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            section {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            section.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    },

    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe sections and cards
        document.querySelectorAll('section, .project-card, .blog-card, .contact-container').forEach(el => {
            observer.observe(el);
        });
    },

    initParallaxEffect() {
        const parallaxHandler = utils.throttle(() => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        }, 10);

        window.addEventListener('scroll', parallaxHandler);
    }
};

// Interactive Effects
const interactiveEffects = {
    init() {
        this.initProjectCardHovers();
        this.initKeyboardNavigation();
        this.initLoadingAnimation();
        this.updateFooterYear();
    },

    initProjectCardHovers() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.style.transition = 'transform 0.3s ease';
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    },

    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!e.altKey) return;

            const shortcuts = {
                'h': 'home',
                'a': 'about', 
                'p': 'projects',
                'c': 'contact'
            };

            const targetId = shortcuts[e.key];
            if (targetId) {
                e.preventDefault();
                document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    },

    initLoadingAnimation() {
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });
    },

    updateFooterYear() {
        const currentYear = new Date().getFullYear();
        const footerText = document.querySelector('footer p');
        
        if (footerText && !footerText.textContent.includes(currentYear)) {
            footerText.textContent = footerText.textContent.replace(
                'All rights reserved.',
                `All rights reserved. ${currentYear}`
            );
        }
    }
};

// Console Welcome Message
const consoleWelcome = {
    show() {
        console.log(`
        ╔═══════════════════════════════════════╗
        ║  Welcome to Peter Blessings Kaphaso  ║
        ║            Portfolio Site             ║
        ║                                       ║
        ║  Interested in working together?      ║
        ║  Let's build something amazing!       ║
        ╚═══════════════════════════════════════╝
        `);
    }
};

// Optional Features
const optionalFeatures = {
    // Typing Effect for Hero Title
    initTypingEffect() {
        const titleElement = document.querySelector('.hero-title');
        if (!titleElement) return;

        const originalText = titleElement.textContent;
        titleElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                titleElement.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 500);
    },

    // Particle Background Effect
    initParticleBackground() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0.1;
        `;
        
        hero.style.position = 'relative';
        hero.appendChild(canvas);

        const resizeCanvas = () => {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle system
        const particles = [];
        const particleCount = 50;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'white';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animate);
        };

        animate();
    }
};

/**
 * Enhanced Web3Forms Contact Form Handler
 * A complete, production-ready contact form solution
 * Author: Peter Blessings Kaphaso
 */

class ContactFormHandler {
    constructor(config = {}) {
        this.config = {
            accessKey: '8caaa11e-cc72-4add-8c88-aa2b978cd1ce',
            apiUrl: 'https://api.web3forms.com/submit',
            selectors: {
                forms: ['form', '.contact-form', '#contact-form'],
                name: ['[name="name"]', '#name'],
                email: ['[name="email"]', '#email'],
                subject: ['[name="subject"]', '#subject'],
                message: ['[name="message"]', '#message'],
                submit: ['button[type="submit"]', 'input[type="submit"]', '.submit-btn']
            },
            validation: {
                name: { min: 2, max: 100 },
                email: { max: 100 },
                subject: { max: 200 },
                message: { min: 10, max: 2000 }
            },
            messages: {
                success: 'Message sent successfully! I\'ll get back to you within 24 hours.',
                error: 'Failed to send message. Please try again or email me directly.',
                validation: {
                    nameRequired: 'Please enter your full name',
                    nameMin: 'Name must be at least 2 characters',
                    nameMax: 'Name is too long (max 100 characters)',
                    emailRequired: 'Please enter your email address',
                    emailInvalid: 'Please enter a valid email address',
                    emailMax: 'Email is too long (max 100 characters)',
                    messageRequired: 'Please write a message',
                    messageMin: 'Message must be at least 10 characters',
                    messageMax: 'Message is too long (max 2000 characters)',
                    subjectMax: 'Subject is too long (max 200 characters)'
                }
            },
            debug: false,
            ...config
        };

        this.isSubmitting = false;
        this.notifications = new NotificationManager();
        this.validator = new FormValidator(this.config.validation, this.config.messages.validation);
        
        this.init();
    }

    init() {
        this.log('Initializing contact form handler...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bindEvents());
        } else {
            this.bindEvents();
        }

        this.setupGlobalErrorHandler();
        
        if (this.config.debug) {
            this.addDebugTools();
        }
    }

    bindEvents() {
        const forms = this.findElements(this.config.selectors.forms);
        
        if (forms.length === 0) {
            this.log('No contact forms found', 'warn');
            return;
        }

        forms.forEach((form, index) => {
            this.log(`Binding form ${index + 1}`);
            
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(form);
            });

            // Add real-time validation
            this.setupRealtimeValidation(form);
        });

        this.log(`${forms.length} form(s) initialized successfully`);
    }

    setupRealtimeValidation(form) {
        const fields = form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            field.addEventListener('input', () => {
                this.clearFieldError(field);
            });
        });
    }

    async handleSubmit(form) {
        if (this.isSubmitting) {
            this.log('Form submission already in progress', 'warn');
            return;
        }

        this.log('Starting form submission...');
        this.isSubmitting = true;

        try {
            // Extract and validate form data
            const formData = this.extractFormData(form);
            const validationResult = this.validator.validateAll(formData);

            if (!validationResult.isValid) {
                this.notifications.show(validationResult.errors[0], 'error');
                this.highlightInvalidFields(form, validationResult.fieldErrors);
                return;
            }

            // Show loading state
            const submitButton = this.findElement(this.config.selectors.submit, form);
            const loadingState = this.setLoadingState(submitButton, true);

            // Submit to Web3Forms
            const success = await this.submitToWeb3Forms(formData);

            if (success) {
                this.handleSuccess(form, formData);
            }

        } catch (error) {
            this.handleError(error, form);
        } finally {
            this.isSubmitting = false;
            this.setLoadingState(this.findElement(this.config.selectors.submit, form), false);
        }
    }

    extractFormData(form) {
        const data = {};
        const formDataObj = new FormData(form);

        // Try to get data from FormData first, then fallback to direct element access
        data.name = this.getFieldValue('name', formDataObj, form);
        data.email = this.getFieldValue('email', formDataObj, form);
        data.subject = this.getFieldValue('subject', formDataObj, form);
        data.message = this.getFieldValue('message', formDataObj, form);

        this.log('Extracted form data:', data);
        return data;
    }

    getFieldValue(fieldName, formData, form) {
        // Try FormData first
        let value = formData.get(fieldName);
        
        // Fallback to direct element access
        if (!value) {
            const element = this.findElement(this.config.selectors[fieldName], form);
            value = element ? element.value : '';
        }

        return (value || '').trim();
    }

    async submitToWeb3Forms(data) {
        const payload = new FormData();
        
        // Required Web3Forms fields
        payload.append('access_key', this.config.accessKey);
        payload.append('name', data.name);
        payload.append('email', data.email);
        payload.append('subject', data.subject || `Contact from ${data.name}`);
        payload.append('message', this.formatMessage(data));
        
        // Optional fields for better email handling
        payload.append('from_name', data.name);
        payload.append('reply_to', data.email);
        
        // Optional: Add botcheck for spam protection
        payload.append('botcheck', '');

        this.log('Submitting to Web3Forms...');

        const response = await fetch(this.config.apiUrl, {
            method: 'POST',
            body: payload
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        this.log('Web3Forms response:', result);

        if (result.success) {
            return true;
        } else {
            throw new Error(result.message || 'Unknown API error');
        }
    }

    formatMessage(data) {
        const timestamp = new Date().toLocaleString();
        
        return `
Portfolio Contact Form Submission
${'='.repeat(50)}

FROM: ${data.name}
EMAIL: ${data.email}
SUBJECT: ${data.subject || 'Contact Form Message'}

MESSAGE:
${'-'.repeat(30)}
${data.message}

${'='.repeat(50)}
Sent: ${timestamp}
Source: Peter Blessings Kaphaso Portfolio
        `.trim();
    }

    handleSuccess(form, data) {
        this.log('Form submitted successfully');
        
        // Reset form
        form.reset();
        this.clearAllFieldErrors(form);
        
        // Show success notification
        const message = `
            <div class="success-message">
                <div class="success-icon">✅</div>
                <div class="success-title">Message Sent!</div>
                <div class="success-text">Thank you ${data.name}! ${this.config.messages.success}</div>
            </div>
        `;
        
        this.notifications.show(message, 'success', 5000);
        
        // Track success
        this.trackEvent('contact_form_success', { name: data.name, email: data.email });
    }

    handleError(error, form) {
        this.log('Form submission failed:', error, 'error');
        
        let userMessage = this.config.messages.error;
        
        // Provide specific error messages
        if (error.message.includes('network') || error.name === 'TypeError') {
            userMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('400')) {
            userMessage = 'Invalid form data. Please check all fields.';
        } else if (error.message.includes('429')) {
            userMessage = 'Too many requests. Please wait and try again.';
        } else if (error.message.includes('401') || error.message.includes('403')) {
            userMessage = 'Service configuration error. Please try again later.';
        }

        const errorHtml = `
            <div class="error-message">
                <div class="error-icon">⚠️</div>
                <div class="error-title">Oops! Something went wrong</div>
                <div class="error-text">${userMessage}</div>
                <div class="error-alternative">
                    Alternative: <a href="mailto:blesskapha@outlook.com">blesskapha@outlook.com</a>
                </div>
            </div>
        `;
        
        this.notifications.show(errorHtml, 'error', 8000);
        
        // Track error
        this.trackEvent('contact_form_error', { 
            error: error.message,
            type: error.name 
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = this.getFieldName(field);
        
        if (!fieldName) return true;

        const result = this.validator.validateField(fieldName, value);
        
        if (!result.isValid) {
            this.showFieldError(field, result.error);
            return false;
        } else {
            this.clearFieldError(field);
            return true;
        }
    }

    getFieldName(field) {
        // Determine field type based on name attribute or other identifiers
        const name = field.name || field.id || '';
        
        if (name.includes('name') || field.type === 'text') return 'name';
        if (name.includes('email') || field.type === 'email') return 'email';
        if (name.includes('subject')) return 'subject';
        if (name.includes('message') || field.tagName.toLowerCase() === 'textarea') return 'message';
        
        return null;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
        `;
        
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 1px #ef4444';
        
        // Insert after the field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    clearFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        
        field.style.borderColor = '';
        field.style.boxShadow = '';
    }

    clearAllFieldErrors(form) {
        const errorElements = form.querySelectorAll('.field-error');
        errorElements.forEach(el => el.remove());
        
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.style.borderColor = '';
            field.style.boxShadow = '';
        });
    }

    highlightInvalidFields(form, fieldErrors) {
        Object.keys(fieldErrors).forEach(fieldName => {
            const field = this.findElement(this.config.selectors[fieldName], form);
            if (field) {
                this.showFieldError(field, fieldErrors[fieldName]);
            }
        });
    }

    setLoadingState(button, isLoading) {
        if (!button) return null;

        const originalContent = button.dataset.originalContent || button.innerHTML;
        
        if (isLoading) {
            button.dataset.originalContent = originalContent;
            button.innerHTML = '<span class="spinner"></span> Sending...';
            button.disabled = true;
            button.style.opacity = '0.7';
        } else {
            button.innerHTML = originalContent;
            button.disabled = false;
            button.style.opacity = '';
            delete button.dataset.originalContent;
        }

        return { button, originalContent };
    }

    findElement(selectors, context = document) {
        for (const selector of selectors) {
            const element = context.querySelector(selector);
            if (element) return element;
        }
        return null;
    }

    findElements(selectors, context = document) {
        const elements = [];
        for (const selector of selectors) {
            elements.push(...context.querySelectorAll(selector));
        }
        return elements;
    }

    trackEvent(eventName, data = {}) {
        // Google Analytics 4
        if (window.gtag) {
            gtag('event', eventName, {
                event_category: 'contact_form',
                ...data
            });
        }

        // Custom tracking
        if (window.dataLayer) {
            window.dataLayer.push({
                event: eventName,
                ...data
            });
        }

        this.log(`Event tracked: ${eventName}`, data);
    }

    setupGlobalErrorHandler() {
        window.addEventListener('unhandledrejection', (event) => {
            if (event.reason && event.reason.message && event.reason.message.includes('Web3Forms')) {
                this.log('Unhandled promise rejection in contact form:', event.reason, 'error');
                event.preventDefault();
            }
        });
    }

    /*/addDebugTools() {
        if (!this.isDevelopment()) return;

        Add test button
        const testButton = document.createElement('button');
        testButton.textContent = '🧪 Test Contact Form';
        testButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 8px 12px;
            background: #10b981;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;
        testButton.addEventListener('click', () => this.runTest());
        document.body.appendChild(testButton);

        this.log('Debug tools added');
    } */

    async runTest() {
        this.log('Running contact form test...');
        
        const testData = {
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Message',
            message: 'This is a test message to verify the contact form integration.'
        };

        try {
            const success = await this.submitToWeb3Forms(testData);
            if (success) {
                alert('✅ Test successful! Check your email inbox.');
                this.log('Test completed successfully');
            }
        } catch (error) {
            alert(`❌ Test failed: ${error.message}`);
            this.log('Test failed:', error, 'error');
        }
    }

    isDevelopment() {
        return (
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.search.includes('debug=true') ||
            this.config.debug
        );
    }
    log(message, data = null, level = 'info') {
        if (!this.config.debug && level !== 'error') return;

        const timestamp = new Date().toISOString();
        const prefix = `[ContactForm:${timestamp}]`;

        switch (level) {
            case 'error':
                console.error(prefix, message, data);
                break;
            case 'warn':
                console.warn(prefix, message, data);
                break;
            default:
                console.log(prefix, message, data);
        }
    }
}

/**
 * Enhanced Notification Manager
 * Handles all notification types with animation and positioning
 */
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.maxNotifications = 5;
        this.init();
    }

    init() {
        this.createContainer();
        this.injectStyles();
    }

    createContainer() {
        if (document.querySelector('#notification-container')) return;

        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
            max-width: 400px;
        `;
        document.body.appendChild(this.container);
    }

    injectStyles() {
        if (document.querySelector('#notification-manager-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-manager-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            .notification-item {
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                margin-bottom: 12px;
                overflow: hidden;
                pointer-events: auto;
                animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                position: relative;
                max-width: 100%;
            }

            .notification-item.removing {
                animation: slideOutRight 0.3s ease-in forwards;
            }

            .notification-header {
                padding: 16px 20px 12px;
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 12px;
            }

            .notification-content {
                flex: 1;
                min-width: 0;
            }

            .notification-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #6b7280;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .notification-close:hover {
                background: #f3f4f6;
                color: #374151;
            }

            .notification-progress {
                height: 3px;
                background: rgba(0, 0, 0, 0.1);
                position: relative;
                overflow: hidden;
            }

            .notification-progress-bar {
                height: 100%;
                background: currentColor;
                transition: transform 0.1s linear;
                transform-origin: left;
            }

            /* Success notification */
            .notification-success {
                border-left: 4px solid #10b981;
                color: #065f46;
            }

            .notification-success .notification-progress-bar {
                background: #10b981;
            }

            .success-message {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .success-icon {
                font-size: 20px;
                animation: pulse 1s ease-in-out;
            }

            .success-title {
                font-weight: 600;
                font-size: 16px;
                color: #065f46;
            }

            .success-text {
                font-size: 14px;
                color: #047857;
                line-height: 1.4;
            }

            /* Error notification */
            .notification-error {
                border-left: 4px solid #ef4444;
                color: #7f1d1d;
            }

            .notification-error .notification-progress-bar {
                background: #ef4444;
            }

            .error-message {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .error-icon {
                font-size: 20px;
                animation: pulse 1s ease-in-out;
            }

            .error-title {
                font-weight: 600;
                font-size: 16px;
                color: #7f1d1d;
            }

            .error-text {
                font-size: 14px;
                color: #991b1b;
                line-height: 1.4;
            }

            .error-alternative {
                font-size: 12px;
                color: #6b7280;
                margin-top: 4px;
            }

            .error-alternative a {
                color: #3b82f6;
                text-decoration: none;
            }

            .error-alternative a:hover {
                text-decoration: underline;
            }

            /* Info notification */
            .notification-info {
                border-left: 4px solid #3b82f6;
                color: #1e3a8a;
            }

            .notification-info .notification-progress-bar {
                background: #3b82f6;
            }

            /* Spinner for loading states */
            .spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid #f3f3f3;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Mobile responsiveness */
            @media (max-width: 640px) {
                #notification-container {
                    left: 20px;
                    right: 20px;
                    top: 20px;
                    max-width: none;
                }

                .notification-item {
                    margin-bottom: 8px;
                }

                .notification-header {
                    padding: 12px 16px 8px;
                }

                .success-title, .error-title {
                    font-size: 15px;
                }

                .success-text, .error-text {
                    font-size: 13px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    show(message, type = 'info', duration = 5000) {
        // Remove oldest notifications if we exceed the limit
        while (this.notifications.length >= this.maxNotifications) {
            this.remove(this.notifications[0]);
        }

        const notification = this.create(message, type, duration);
        this.notifications.push(notification);
        this.container.appendChild(notification.element);

        // Start auto-remove timer
        if (duration > 0) {
            notification.timer = setTimeout(() => {
                this.remove(notification);
            }, duration);
        }

        return notification;
    }

    create(message, type, duration) {
        const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const element = document.createElement('div');
        element.className = `notification-item notification-${type}`;
        element.id = id;

        const progressBar = duration > 0 ? `
            <div class="notification-progress">
                <div class="notification-progress-bar" style="animation: progress ${duration / 1000}s linear forwards;"></div>
            </div>
        ` : '';

        element.innerHTML = `
            <div class="notification-header">
                <div class="notification-content">${message}</div>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
            ${progressBar}
        `;

        // Add progress bar animation
        if (duration > 0) {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes progress {
                    from { transform: scaleX(1); }
                    to { transform: scaleX(0); }
                }
            `;
            document.head.appendChild(style);
        }

        // Bind close button
        const closeBtn = element.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            const notification = this.notifications.find(n => n.id === id);
            if (notification) this.remove(notification);
        });

        return {
            id,
            element,
            type,
            timer: null
        };
    }

    remove(notification) {
        if (!notification || !notification.element.parentNode) return;

        // Clear timer
        if (notification.timer) {
            clearTimeout(notification.timer);
        }

        // Add removing animation
        notification.element.classList.add('removing');

        // Remove from DOM after animation
        setTimeout(() => {
            if (notification.element.parentNode) {
                notification.element.remove();
            }
            
            // Remove from notifications array
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }

    clear() {
        this.notifications.forEach(notification => this.remove(notification));
    }
}

/**
 * Form Validator
 * Handles all form validation logic
 */
class FormValidator {
    constructor(rules, messages) {
        this.rules = rules;
        this.messages = messages;
    }

    validateAll(data) {
        const errors = [];
        const fieldErrors = {};

        // Validate each field
        Object.keys(data).forEach(fieldName => {
            if (this.rules[fieldName]) {
                const result = this.validateField(fieldName, data[fieldName]);
                if (!result.isValid) {
                    errors.push(result.error);
                    fieldErrors[fieldName] = result.error;
                }
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
            fieldErrors
        };
    }

    validateField(fieldName, value) {
        const rules = this.rules[fieldName];
        const messages = this.messages;

        if (!rules) {
            return { isValid: true };
        }

        // Required field validation
        if (fieldName === 'name' || fieldName === 'email' || fieldName === 'message') {
            if (!value || value.length === 0) {
                return {
                    isValid: false,
                    error: messages[fieldName + 'Required'] || `${fieldName} is required`
                };
            }
        }

        // Length validations
        if (rules.min && value.length < rules.min) {
            return {
                isValid: false,
                error: messages[fieldName + 'Min'] || `${fieldName} is too short`
            };
        }

        if (rules.max && value.length > rules.max) {
            return {
                isValid: false,
                error: messages[fieldName + 'Max'] || `${fieldName} is too long`
            };
        }

        // Email specific validation
        if (fieldName === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return {
                    isValid: false,
                    error: messages.emailInvalid || 'Please enter a valid email address'
                };
            }
        }

        return { isValid: true };
    }
}

// Main Application Initialization
class PortfolioApp {
    constructor() {
        this.modules = [
            notifications,
            mobileMenu,
            smoothScroll,
            readMore,
            headerEffects,
            scrollAnimations,
            interactiveEffects,
            consoleWelcome
        ];
        
        this.contactForm = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeModules());
        } else {
            this.initializeModules();
        }
    }

    initializeModules() {
        console.log('🚀 Initializing Portfolio Application...');

        try {
            // Initialize core modules
            this.modules.forEach(module => {
                if (module && typeof module.init === 'function') {
                    module.init();
                }
            });

            // Initialize contact form handler
            this.contactForm = new ContactFormHandler({
                debug: this.isDevelopment()
            });

            // Initialize optional features if needed
            if (this.shouldInitOptionalFeatures()) {
                optionalFeatures.initTypingEffect();
                optionalFeatures.initParticleBackground();
            }

            // Show console welcome message
            consoleWelcome.show();

            console.log('✅ Portfolio Application initialized successfully');

        } catch (error) {
            console.error('❌ Error initializing portfolio application:', error);
        }
    }

    shouldInitOptionalFeatures() {
        // Check if user wants enhanced animations
        const params = new URLSearchParams(window.location.search);
        return params.has('enhanced') || localStorage.getItem('portfolio-enhanced') === 'true';
    }

    isDevelopment() {
        return (
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.search.includes('debug=true')
        );
    }
}

// Performance Monitoring
const performanceMonitor = {
    init() {
        if (!window.performance) return;

        // Monitor page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                
                if (perfData) {
                    console.log('📊 Performance Metrics:', {
                        'DNS Lookup': `${Math.round(perfData.domainLookupEnd - perfData.domainLookupStart)}ms`,
                        'Connection': `${Math.round(perfData.connectEnd - perfData.connectStart)}ms`,
                        'First Byte': `${Math.round(perfData.responseStart - perfData.requestStart)}ms`,
                        'DOM Ready': `${Math.round(perfData.domContentLoadedEventEnd - perfData.navigationStart)}ms`,
                        'Page Load': `${Math.round(perfData.loadEventEnd - perfData.navigationStart)}ms`
                    });
                }
            }, 0);
        });
    }
};

// Error Tracking
const errorTracker = {
    init() {
        window.addEventListener('error', (event) => {
            console.error('🐛 JavaScript Error:', {
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error?.stack
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('🐛 Unhandled Promise Rejection:', event.reason);
        });
    }
};

// Initialize everything when script loads
(() => {
    'use strict';
    
    // Initialize error tracking first
    errorTracker.init();
    
    // Initialize performance monitoring
    performanceMonitor.init();
    
    // Initialize main application
    window.portfolioApp = new PortfolioApp();
    
    // Make utilities available globally for debugging
    if (window.location.search.includes('debug=true')) {
        window.portfolioUtils = {
            utils,
            notifications,
            ContactFormHandler,
            NotificationManager,
            FormValidator
        };
    }
})();