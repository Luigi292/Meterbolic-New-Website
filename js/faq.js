// faq.js - Modern, Professional Implementation for Meterbolic FAQ Page
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer if element exists
  const setCurrentYear = function() {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
      currentYearElement.textContent = new Date().getFullYear();
    }
  };

  // Category switching functionality
  const setupCategorySwitching = function() {
    const categories = document.querySelectorAll('.meterbolic-category');
    const faqGroups = document.querySelectorAll('.meterbolic-faq-group');
    
    // Function to activate a specific category
    const activateCategory = function(categoryName) {
      // Update active state of category buttons
      categories.forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-category') === categoryName);
      });

      // Show/hide FAQ groups
      faqGroups.forEach(group => {
        group.classList.toggle('show', group.classList.contains(categoryName));
      });
    };

    // Set up category click handlers
    categories.forEach(category => {
      category.addEventListener('click', function() {
        const categoryToShow = this.getAttribute('data-category');
        activateCategory(categoryToShow);
        
        // Update URL hash without page reload
        history.pushState(null, null, `#${categoryToShow}-faqs`);
      });
    });

    // Return the activateCategory function for external use
    return { activateCategory };
  };

  // Accordion functionality
  const setupAccordion = function() {
    const questions = document.querySelectorAll('.meterbolic-faq-question');
    
    questions.forEach(question => {
      question.addEventListener('click', function() {
        // Toggle active state on clicked question
        this.classList.toggle('active');
        
        // Toggle answer visibility
        const answer = this.nextElementSibling;
        answer.classList.toggle('show');
        
        // Close other questions in the same group if desired
        // (Remove if you want multiple questions open at once)
        /*
        const parentGroup = this.closest('.meterbolic-faq-group');
        parentGroup.querySelectorAll('.meterbolic-faq-question').forEach(q => {
          if (q !== this) {
            q.classList.remove('active');
            q.nextElementSibling.classList.remove('show');
          }
        });
        */
      });
    });
  };

  // Handle hash navigation (for deep linking to specific FAQ sections)
  const setupHashNavigation = function(activateCategoryFn) {
    const handleHashNavigation = function() {
      if (window.location.hash) {
        const hash = window.location.hash;
        
        // Check if hash matches a FAQ category
        if (hash === '#testing-faqs') {
          // Activate the testing category
          activateCategoryFn('testing');
          
          // Scroll to the section after a small delay
          setTimeout(() => {
            const targetSection = document.getElementById('testing-faqs');
            if (targetSection) {
              const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
              const targetPosition = targetSection.getBoundingClientRect().top + 
                                   window.pageYOffset - navbarHeight;
              
              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
              });
            }
          }, 100);
        }
      }
    };

    // Initial hash navigation check
    handleHashNavigation();

    // Listen for hash changes (if user manually changes URL)
    window.addEventListener('hashchange', handleHashNavigation);
  };

  // Scroll-to-top button functionality
  const setupScrollToTop = function() {
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.className = 'meterbolic-scroll-to-top';
    scrollToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopButton.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopButton);
    
    // Click handler
    scrollToTopButton.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
      scrollToTopButton.classList.toggle('show', window.pageYOffset > 300);
    });

    // Add styles dynamically to avoid needing extra CSS file
    const style = document.createElement('style');
    style.textContent = `
      .meterbolic-scroll-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--meterbolic-primary);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
      }
      
      .meterbolic-scroll-to-top.show {
        opacity: 1;
        visibility: visible;
      }
      
      .meterbolic-scroll-to-top:hover {
        background-color: var(--meterbolic-primary-dark);
        transform: translateY(-3px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      }
    `;
    document.head.appendChild(style);
  };

  // Smooth scrolling for anchor links
  const setupSmoothScrolling = function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          const targetPosition = targetElement.getBoundingClientRect().top + 
                               window.pageYOffset - navbarHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  // Initialize all functionality
  const init = function() {
    setCurrentYear();
    const { activateCategory } = setupCategorySwitching();
    setupAccordion();
    setupHashNavigation(activateCategory);
    setupScrollToTop();
    setupSmoothScrolling();
    
    // Activate the first category by default if none is active
    if (!document.querySelector('.meterbolic-category.active')) {
      document.querySelector('.meterbolic-category').click();
    }
  };

  // Start the show!
  init();
});