document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  
  // Scroll to top button
  const scrollToTopButton = document.createElement('button');
  scrollToTopButton.className = 'scrollToTop';
  scrollToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(scrollToTopButton);
  
  scrollToTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollToTopButton.classList.add('show');
    } else {
      scrollToTopButton.classList.remove('show');
    }
  });
});