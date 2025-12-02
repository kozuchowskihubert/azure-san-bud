// Professional Plumbing & Sanitary Services - HAOS Style JavaScript

// ============================================
// API SERVICE
// ============================================

class APIService {
    constructor(baseURL = '') {
        this.baseURL = baseURL;
    }

    async request(url, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(this.baseURL + url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // GET request
    async get(url) {
        return this.request(url, { method: 'GET' });
    }

    // POST request
    async post(url, data) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Services API
    async getServices() {
        return this.get('/services/api');
    }

    async getService(id) {
        return this.get(`/services/api/${id}`);
    }

    // Appointments API
    async createAppointment(data) {
        return this.post('/appointments/api', data);
    }
}

// Create global API instance
const api = new APIService();

// ============================================
// NOTIFICATION SYSTEM
// ============================================

class NotificationManager {
    static show(message, type = 'info', duration = 5000) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show notification-toast`;
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            animation: slideInRight 0.4s ease;
        `;
        
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 300);
        }, duration);
    }

    static success(message) {
        this.show(message, 'success');
    }

    static error(message) {
        this.show(message, 'danger');
    }

    static warning(message) {
        this.show(message, 'warning');
    }

    static info(message) {
        this.show(message, 'info');
    }
}

// ============================================
// LOADING SPINNER
// ============================================

class LoadingManager {
    static show(element = document.body) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-overlay';
        spinner.innerHTML = `
            <div class="spinner-border text-orange" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;
        spinner.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.appendChild(spinner);
        return spinner;
    }

    static hide(spinner) {
        if (spinner && spinner.parentNode) {
            spinner.remove();
        }
    }
}

// ============================================
// SERVICES LOADER
// ============================================

class ServicesLoader {
    static async loadAndDisplay(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const spinner = LoadingManager.show(container);
        
        try {
            const services = await api.getServices();
            this.renderServices(services, container);
            LoadingManager.hide(spinner);
        } catch (error) {
            console.error('Error loading services:', error);
            container.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i>
                    Failed to load services. Please try again later.
                </div>
            `;
            LoadingManager.hide(spinner);
        }
    }

    static renderServices(services, container) {
        container.innerHTML = services.map(service => `
            <div class="col-md-6 col-lg-4 mb-4 fade-in">
                <div class="card service-card h-100">
                    <div class="card-body">
                        <div class="service-icon">
                            <i class="bi bi-tools"></i>
                        </div>
                        <h5 class="card-title text-orange">${service.name}</h5>
                        <p class="card-text">${service.description}</p>
                        <div class="mt-3">
                            <span class="badge bg-secondary">
                                <i class="bi bi-tag"></i> ${service.category}
                            </span>
                            <span class="badge bg-info ms-2">
                                <i class="bi bi-clock"></i> ${service.duration_minutes} min
                            </span>
                        </div>
                        <div class="mt-3">
                            <h4 class="text-orange mb-0">$${service.price.toFixed(2)}</h4>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary btn-sm w-100" 
                                onclick="bookService(${service.id})">
                            <i class="bi bi-calendar-check"></i> Book This Service
                        </button>
                        <a href="/services/${service.id}" 
                           class="btn btn-outline-secondary btn-sm w-100 mt-2">
                            <i class="bi bi-info-circle"></i> View Details
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// ============================================
// BOOKING FORM HANDLER
// ============================================

class BookingFormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Load services into select dropdown
        this.loadServices();
        
        // Add real-time validation
        this.addValidation();
    }

    async loadServices() {
        const serviceSelect = this.form.querySelector('#service_id');
        if (!serviceSelect) return;

        try {
            const services = await api.getServices();
            services.forEach(service => {
                const option = document.createElement('option');
                option.value = service.id;
                option.textContent = `${service.name} - $${service.price.toFixed(2)} (${service.duration_minutes} min)`;
                serviceSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading services:', error);
            NotificationManager.error('Failed to load services');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.form.checkValidity()) {
            e.stopPropagation();
            this.form.classList.add('was-validated');
            return;
        }

        const formData = new FormData(this.form);
        const data = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            postal_code: formData.get('postal_code'),
            service_id: parseInt(formData.get('service_id')),
            scheduled_date: formData.get('scheduled_date'),
            scheduled_time: formData.get('scheduled_time'),
            notes: formData.get('notes')
        };

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Booking...';

        try {
            const result = await api.createAppointment(data);
            NotificationManager.success('Appointment booked successfully! We\'ll contact you shortly.');
            
            // Reset form
            this.form.reset();
            this.form.classList.remove('was-validated');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = '/appointments';
            }, 2000);
        } catch (error) {
            console.error('Error creating appointment:', error);
            NotificationManager.error('Failed to book appointment. Please try again.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    addValidation() {
        // Email validation
        const emailInput = this.form.querySelector('#email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailInput.value)) {
                    emailInput.setCustomValidity('Please enter a valid email address');
                } else {
                    emailInput.setCustomValidity('');
                }
            });
        }

        // Phone validation
        const phoneInput = this.form.querySelector('#phone');
        if (phoneInput) {
            phoneInput.addEventListener('blur', () => {
                const phonePattern = /^[\d\s\-\+\(\)]+$/;
                if (phoneInput.value && !phonePattern.test(phoneInput.value)) {
                    phoneInput.setCustomValidity('Please enter a valid phone number');
                } else {
                    phoneInput.setCustomValidity('');
                }
            });
        }
    }
}

// ============================================
// GLOBAL FUNCTIONS
// ============================================

function bookService(serviceId) {
    window.location.href = `/appointments/book?service_id=${serviceId}`;
}

// ============================================
// DOM READY INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚰 Plumbing Services App Initialized');

    // Auto-dismiss alerts
    const alerts = document.querySelectorAll('.alert:not(.notification-toast)');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
            bsAlert.close();
        }, 5000);
    });

    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Active nav link highlighting
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize booking form if present
    if (document.getElementById('booking-form')) {
        new BookingFormHandler('booking-form');
    }

    // Load services dynamically if container exists
    if (document.getElementById('services-container')) {
        ServicesLoader.loadAndDisplay('services-container');
    }

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .feature-card').forEach(el => {
        observer.observe(el);
    });
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Debounce function
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

// Export utilities
window.AppUtils = {
    formatCurrency,
    formatDate,
    debounce,
    NotificationManager,
    LoadingManager,
    api
};

// Add CSS animations
const style = document.createElement('style');
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
`;
document.head.appendChild(style);
