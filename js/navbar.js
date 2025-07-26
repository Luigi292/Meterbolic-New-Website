// navbar.js - Optimized and fixed navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // GLOBAL VARIABLES
    // ======================
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuIcon = document.querySelector('.mobileMenuIcon');
    const navbar = document.querySelector('.navbar');
    const mobileLinks = document.querySelectorAll('.mobileLink, .mobileRegisterBtn');
    const desktopLinks = document.querySelectorAll('.navLinks a');
    const scrollToTop = document.getElementById('scrollToTop');
    
    // Calculate navbar height once and store it
    const navbarHeight = navbar.offsetHeight;
    document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
    
    // Scroll behavior variables
    let lastScrollPosition = 0;
    const scrollThreshold = 100;
    const scrollHideThreshold = 200;

    // ======================
    // MOBILE MENU TOGGLE
    // ======================
    function toggleMobileMenu() {
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        mobileMenuOverlay.classList.toggle('active');
        mobileMenuButton.classList.toggle('active');
        document.body.classList.toggle('noScroll');
        
        // Toggle between hamburger and close icon
        mobileMenuIcon.classList.toggle('fa-bars');
        mobileMenuIcon.classList.toggle('fa-times');
    }
    
    if (mobileMenuButton && mobileMenuOverlay) {
        mobileMenuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    // ======================
    // NAVIGATION FUNCTIONALITY
    // ======================
    function handleLinkClick(link, isMobile, e) {
        if (e) e.preventDefault();
        
        // Close mobile menu if open
        if (isMobile && mobileMenuOverlay.classList.contains('active')) {
            toggleMobileMenu();
        }
        
        // Update active link
        updateActiveLink(link, isMobile);
        
        // Smooth scroll for anchor links
        if (link.getAttribute('href').startsWith('#')) {
            scrollToSection(link.getAttribute('href'));
        }
    }

    function updateActiveLink(link, isMobile) {
        if (link.classList.contains('mobileLink') || !isMobile) {
            const links = isMobile ? 
                document.querySelectorAll('.mobileLink') : 
                document.querySelectorAll('.navLinks a');
            
            links.forEach(item => item.classList.remove('activeLink'));
            link.classList.add('activeLink');
            
            // Sync active state between mobile and desktop
            const href = link.getAttribute('href');
            const otherLinks = isMobile ? 
                document.querySelectorAll('.navLinks a') : 
                document.querySelectorAll('.mobileLink');
            
            otherLinks.forEach(otherLink => {
                if (otherLink.getAttribute('href') === href) {
                    otherLink.classList.add('activeLink');
                }
            });
        }
    }

    function scrollToSection(sectionId) {
        const targetElement = document.querySelector(sectionId);
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + 
                              window.pageYOffset - navbarHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Update URL without page reload
        if (history.pushState) {
            history.pushState(null, null, sectionId);
        } else {
            window.location.hash = sectionId;
        }
    }

    // Set up event listeners for links
    mobileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            handleLinkClick(this, true, e);
        });
    });
    
    desktopLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                handleLinkClick(this, false, e);
            }
        });
    });

    // ======================
    // SCROLL BEHAVIOR
    // ======================
    function handleScroll() {
        const currentScrollPosition = window.pageYOffset;
        
        // Scroll to top button visibility
        if (scrollToTop) {
            scrollToTop.classList.toggle('show', currentScrollPosition > 300);
        }
        
        // Navbar hide/show logic
        if (currentScrollPosition <= navbarHeight) {
            // At top of page
            navbar.classList.remove('scrolled', 'hidden');
        } else {
            // Scrolling down
            if (currentScrollPosition > lastScrollPosition && 
                currentScrollPosition > scrollHideThreshold) {
                navbar.classList.add('hidden');
            } 
            // Scrolling up
            else if (currentScrollPosition < lastScrollPosition) {
                navbar.classList.remove('hidden');
            }
            
            // Scrolled state for styling
            navbar.classList.toggle('scrolled', currentScrollPosition > scrollThreshold);
        }
        
        lastScrollPosition = currentScrollPosition;
        updateActiveLinkOnScroll();
    }

    // ======================
    // ACTIVE LINK ON SCROLL
    // ======================
    function updateActiveLinkOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });
        
        if (currentSection) {
            // Update desktop links
            desktopLinks.forEach(link => {
                link.classList.toggle('activeLink', 
                    link.getAttribute('href') === `#${currentSection}`);
            });
            
            // Update mobile links
            document.querySelectorAll('.mobileLink').forEach(link => {
                link.classList.toggle('activeLink', 
                    link.getAttribute('href') === `#${currentSection}`);
            });
        }
    }

    // ======================
    // EVENT LISTENERS
    // ======================
    window.addEventListener('scroll', handleScroll);
    
    // Close mobile menu when clicking outside or pressing Escape
    document.addEventListener('click', function(e) {
        if (mobileMenuOverlay.classList.contains('active') && 
            !e.target.closest('.mobileMenuOverlay') && 
            !e.target.closest('.mobileMenuButton')) {
            toggleMobileMenu();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
    
    // Scroll to top button
    if (scrollToTop) {
        scrollToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Initialize
    updateActiveLinkOnScroll();
    
    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});





    // ======================
    // MOBILE APP POPUP
    // ======================
    const appIcon = document.getElementById('appIcon');
    const appPopup = document.getElementById('appPopup');
    
    if (appIcon && appPopup) {
        let popupTimeout;
        
        appIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            appPopup.classList.toggle('visible');
        });
        
        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!appIcon.contains(e.target) && !appPopup.contains(e.target)) {
                appPopup.classList.remove('visible');
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                appPopup.classList.remove('visible');
            }
        });
        
        // Hover behavior for desktop
        appIcon.addEventListener('mouseenter', function() {
            clearTimeout(popupTimeout);
            appPopup.classList.add('visible');
        });
        
        appIcon.addEventListener('mouseleave', function() {
            popupTimeout = setTimeout(() => {
                appPopup.classList.remove('visible');
            }, 300);
        });
        
        appPopup.addEventListener('mouseenter', function() {
            clearTimeout(popupTimeout);
        });
        
        appPopup.addEventListener('mouseleave', function() {
            popupTimeout = setTimeout(() => {
                appPopup.classList.remove('visible');
            }, 300);
        });
    }