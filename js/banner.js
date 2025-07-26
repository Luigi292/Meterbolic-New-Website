document.addEventListener('DOMContentLoaded', function() {
  const bannerTrack = document.querySelector('.banner-track');
  const bannerContainer = document.querySelector('.banner-container');
  
  if (!bannerTrack || !bannerContainer) return;

  // Clone the banner items for seamless looping
  const bannerItems = bannerContainer.querySelectorAll('.banner-item');
  const itemsToClone = Array.from(bannerItems).slice(0, 5); // Clone first 5 items
  
  itemsToClone.forEach(item => {
    const clone = item.cloneNode(true);
    bannerContainer.appendChild(clone);
  });

  // Animation variables
  let position = 0;
  const speed = 1;
  let animationId;
  let isPaused = false;
  const itemWidth = bannerItems[0].offsetWidth + 40; // Width + gap
  
  function animateBanner() {
    if (!isPaused) {
      position -= speed;
      
      // Reset position when we've scrolled one full set
      if (position <= -itemWidth * bannerItems.length) {
        position = 0;
      }
      
      bannerContainer.style.transform = `translateX(${position}px)`;
    }
    animationId = requestAnimationFrame(animateBanner);
  }
  
  // Start animation
  animateBanner();
  
  // Pause on hover
  bannerTrack.addEventListener('mouseenter', function() {
    isPaused = true;
  });
  
  bannerTrack.addEventListener('mouseleave', function() {
    isPaused = false;
  });
  
  // Clean up
  window.addEventListener('beforeunload', function() {
    cancelAnimationFrame(animationId);
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    // Recalculate item width on resize
    itemWidth = bannerItems[0].offsetWidth + 40;
  });
});