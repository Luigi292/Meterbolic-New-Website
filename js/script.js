document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // GENERAL PAGE SCRIPTS
    // ======================
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if the link is part of the navbar (handled in navbar.js)
            if (!this.closest('.navbar') && !this.classList.contains('mobileLink')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ======================
    // BANNER ANIMATION
    // ======================
    const bannerTrack = document.querySelector('.banner-track');
    if (bannerTrack) {
        const bannerContainer = bannerTrack.querySelector('.banner-container');
        const bannerItems = bannerContainer.querySelectorAll('.banner-item');
        
        // Duplicate items for infinite loop
        bannerItems.forEach(item => {
            const clone = item.cloneNode(true);
            bannerContainer.appendChild(clone);
        });
        
        // Animation variables
        let animationId;
        let position = 0;
        const speed = 1; // Adjust speed as needed
        
        function animateBanner() {
            position -= speed;
            
            // Reset position when half of the content has scrolled
            if (position <= -bannerContainer.scrollWidth / 2) {
                position = 0;
            }
            
            bannerContainer.style.transform = `translateX(${position}px)`;
            animationId = requestAnimationFrame(animateBanner);
        }
        
        // Start animation
        animateBanner();
        
        // Pause on hover
        bannerTrack.addEventListener('mouseenter', () => {
            cancelAnimationFrame(animationId);
        });
        
        bannerTrack.addEventListener('mouseleave', () => {
            animateBanner();
        });
    }
    
    // ======================
    // LAZY LOADING IMAGES
    // ======================
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ======================
    // HERO SECTION ANIMATION
    // ======================
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // Add animation class after short delay
        setTimeout(() => {
            heroSection.classList.add('animate-in');
        }, 300);
    }
    
    // ======================
    // FEATURES SECTION INTERACTIVITY
    // ======================
    const featureItems = document.querySelectorAll('.featureItem');
    if (featureItems.length > 0) {
        featureItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.querySelector('.featureIcon').style.transform = 'scale(1.2)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.querySelector('.featureIcon').style.transform = 'scale(1)';
            });
        });
    }
});




