document.addEventListener('DOMContentLoaded', function() {
  // Initialize form validation for both modal and contact page forms
  const forms = document.querySelectorAll('.registrationForm');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      // Reset error messages
      const errorMessages = form.querySelectorAll('.error-message');
      errorMessages.forEach(msg => {
        msg.style.display = 'none';
        msg.textContent = '';
      });
      
      // Validate form fields
      let isValid = true;
      
      // Validate full name
      const fullName = form.querySelector('#fullName');
      if (fullName && !fullName.value.trim()) {
        const errorElement = form.querySelector('#fullNameError') || document.getElementById('fullNameError');
        errorElement.textContent = 'Please enter your full name';
        errorElement.style.display = 'block';
        isValid = false;
      }
      
      // Validate email
      const email = form.querySelector('#email');
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
          const errorElement = form.querySelector('#emailError') || document.getElementById('emailError');
          errorElement.textContent = 'Please enter your email';
          errorElement.style.display = 'block';
          isValid = false;
        } else if (!emailRegex.test(email.value)) {
          const errorElement = form.querySelector('#emailError') || document.getElementById('emailError');
          errorElement.textContent = 'Please enter a valid email';
          errorElement.style.display = 'block';
          isValid = false;
        }
      }
      
      // Validate interest
      const interest = form.querySelector('#interest');
      if (interest && !interest.value) {
        const errorElement = form.querySelector('#interestError') || document.getElementById('interestError');
        errorElement.textContent = 'Please select an option';
        errorElement.style.display = 'block';
        isValid = false;
      }
      
      // Validate consent
      const consent = form.querySelector('#consent');
      if (consent && !consent.checked) {
        const errorElement = form.querySelector('#consentError') || document.getElementById('consentError');
        errorElement.textContent = 'You must agree to receive emails';
        errorElement.style.display = 'block';
        isValid = false;
      }
      
      // If form is not valid, prevent submission
      if (!isValid) {
        e.preventDefault();
      }
      
      // If valid, let the form submit naturally to the PHP file
      // The button will show loading state
      if (isValid) {
        const submitBtn = form.querySelector('.submitButton') || document.getElementById('waitlistSubmitBtn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        }
      }
    });
  });

  // Handle error messages from PHP
  const urlParams = new URLSearchParams(window.location.search);
  const errorParam = urlParams.get('error');
  
  if (errorParam) {
    const errors = errorParam.split('|');
    errors.forEach(error => {
      if (error === 'send_error') {
        alert('There was an error sending your message. Please try again later.');
      } else {
        // Map errors to fields
        if (error.includes('name')) {
          const errorElement = document.getElementById('fullNameError');
          errorElement.textContent = error;
          errorElement.style.display = 'block';
        } else if (error.includes('email')) {
          const errorElement = document.getElementById('emailError');
          errorElement.textContent = error;
          errorElement.style.display = 'block';
        } else if (error.includes('interest')) {
          const errorElement = document.getElementById('interestError');
          errorElement.textContent = error;
          errorElement.style.display = 'block';
        } else if (error.includes('agree')) {
          const errorElement = document.getElementById('consentError');
          errorElement.textContent = error;
          errorElement.style.display = 'block';
        }
      }
    });
  }

  // Modal specific functionality (only if modal exists on page)
  const modal = document.querySelector('.modalOverlay');
  if (modal) {
    const openButtons = document.querySelectorAll('[id*="registerBtn"], [id*="RegisterBtn"]');
    const closeButton = document.querySelector('.modalCloseButton');
    
    openButtons.forEach(button => {
      button.addEventListener('click', () => {
        modal.classList.add('show');
      });
    });
    
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        modal.classList.remove('show');
      });
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  }

  // Contact section click handler
  const contactSection = document.querySelector('.contactSection');
  const contactContainer = document.querySelector('.contactContainer');
  
  if (contactSection && contactContainer) {
    contactSection.addEventListener('click', function(e) {
      // If the click is NOT inside the form container
      if (!contactContainer.contains(e.target)) {
        window.location.href = 'index.html';
      }
    });
  }
});