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

// Contact Form Handler
const contactForm = {
    init() {
        const forms = document.querySelectorAll('form, .contact-form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmission(form);
            });
        });
    },

    handleSubmission(form) {
        const formData = new FormData(form);
        const name = formData.get('name') || document.getElementById('name')?.value.trim();
        const email = formData.get('email') || document.getElementById('email')?.value.trim();
        const message = formData.get('message') || document.getElementById('message')?.value.trim();

        // Validation
        if (!name || !email || !message) {
            notifications.show('Please fill in all required fields.', 'error');
            return;
        }

        if (!utils.isValidEmail(email)) {
            notifications.show('Please enter a valid email address.', 'error');
            return;
        }

        // Submit simulation
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            form.reset();
            notifications.show(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
        }, 1500);
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

// Main Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core features
    notifications.init();
    mobileMenu.init();
    smoothScroll.init();
    readMore.init();
    contactForm.init();
    headerEffects.init();
    scrollAnimations.init();
    interactiveEffects.init();
    
    // Show welcome message
    consoleWelcome.show();
});

// Optional features initialization
window.addEventListener('load', () => {
    // Uncomment to enable optional features:
    optionalFeatures.initTypingEffect();
    optionalFeatures.initParticleBackground();
});

// Export for potential use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        utils,
        notifications,
        mobileMenu,
        smoothScroll,
        readMore,
        contactForm,
        headerEffects,
        scrollAnimations,
        interactiveEffects,
        optionalFeatures
    };
}