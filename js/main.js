// Header scroll behavior
const header = document.getElementById('header');
let lastScroll = 0;
let scrollThreshold = 50;

function handleScroll() {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  
  // Add scrolled class for styling changes
  if (currentScroll > scrollThreshold) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
    header.classList.remove('nav-hidden');
  }
  
  // Hide/show nav based on scroll direction
  if (currentScroll > scrollThreshold) {
    if (currentScroll > lastScroll) {
      // Scrolling down - hide nav
      header.classList.add('nav-hidden');
    } else {
      // Scrolling up - show nav
      header.classList.remove('nav-hidden');
    }
  }
  
  lastScroll = currentScroll;
}

// Course Info CTA Box scroll behavior
let courseInfoCta, hero, exploreButton;

function initCourseInfoCta() {
  courseInfoCta = document.getElementById('courseInfoCta');
  hero = document.querySelector('.hero');
  exploreButton = courseInfoCta ? courseInfoCta.querySelector('.btn-outline') : null;
}

function handleCourseInfoCta() {
  if (!courseInfoCta || !hero) return;
  
  const heroRect = hero.getBoundingClientRect();
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollBottom = currentScroll + windowHeight;
  
  // Check if hero is completely out of view (scrolled past it)
  // heroRect.bottom will be negative or 0 when hero is completely above viewport
  const isPastHero = heroRect.bottom <= 0;
  const isNotAtBottom = scrollBottom < documentHeight - 100;
  
  // Show/hide the entire CTA box based on scroll position (for desktop)
  const isMobile = window.innerWidth <= 960;
  
  if (isMobile) {
    // On mobile, always show the CTA box, but control the "Explore the Course" button separately
    courseInfoCta.classList.add('visible');
    
    // Show "Explore the Course" button only after scrolling past hero
    if (exploreButton) {
      if (isPastHero && isNotAtBottom) {
        exploreButton.style.display = '';
      } else {
        exploreButton.style.display = 'none';
      }
    }
  } else {
    // Desktop behavior: show entire CTA box only after scrolling past hero
    if (isPastHero && isNotAtBottom) {
      courseInfoCta.classList.add('visible');
      if (exploreButton) {
        exploreButton.style.display = '';
      }
    } else {
      courseInfoCta.classList.remove('visible');
    }
  }
}

// Throttle scroll events for better performance
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScroll();
      handleCourseInfoCta();
      ticking = false;
    });
    ticking = true;
  }
});


// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

// Stat cards animation on scroll with number counting
function initStatCardsAnimation() {
  const statCards = document.querySelectorAll('.journey-stats-container .stat-card');
  const statsContainer = document.querySelector('.journey-stats-container');
  
  if (!statCards.length || !statsContainer) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statCards.forEach((card, index) => {
          // Stagger the fade-in animation for each card
          setTimeout(() => {
            card.classList.add('animate');
            
            // Start number animation when card starts fading in
            const numberElement = card.querySelector('.stat-number');
            if (numberElement) {
              animateNumber(numberElement);
            }
          }, index * 200); // Stagger delay: 200ms between each card fade-in
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  observer.observe(statsContainer);
}

// Animate number counting
function animateNumber(element) {
  const text = element.textContent.trim();
  
  // Check if it's a currency value
  if (text.startsWith('$')) {
    const value = parseFloat(text.replace(/[$,]/g, ''));
    if (!isNaN(value)) {
      animateCountUp(element, value, '$', true);
      return;
    }
  }
  
  // Check if it's a number with comma
  const cleanText = text.replace(/,/g, '');
  const value = parseFloat(cleanText);
  if (!isNaN(value)) {
    animateCountUp(element, value, '', false);
    return;
  }
  
  // If not a number, just show it
  element.textContent = text;
}

function animateCountUp(element, targetValue, prefix = '', isCurrency = false) {
  const duration = 1500; // 1.5 seconds
  const startTime = performance.now();
  const startValue = 0;
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentValue = startValue + (targetValue - startValue) * easeOut;
    
    // Format the number
    let formattedValue;
    if (isCurrency) {
      formattedValue = prefix + Math.floor(currentValue).toLocaleString('en-US');
    } else {
      formattedValue = Math.floor(currentValue).toLocaleString('en-US');
    }
    
    element.textContent = formattedValue;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Ensure final value is exact
      if (isCurrency) {
        element.textContent = prefix + Math.floor(targetValue).toLocaleString('en-US');
      } else {
        element.textContent = Math.floor(targetValue).toLocaleString('en-US');
      }
    }
  }
  
  requestAnimationFrame(update);
}

function initRequirementsChecklistAnimation() {
  const checklistItems = document.querySelectorAll('.requirements .checklist-item');
  const requirementsSection = document.querySelector('.requirements');
  
  if (!checklistItems.length || !requirementsSection) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        checklistItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('animate');
          }, index * 250); // Stagger delay: 250ms between each item
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  observer.observe(requirementsSection);
}

function initHeroPromoCardAnimation() {
  const heroPromoCard = document.querySelector('.hero-promo-card');
  
  if (!heroPromoCard) return;
  
  // Add animate class after a short delay to ensure smooth animation
  setTimeout(() => {
    heroPromoCard.classList.add('animate');
  }, 300);
}

// Initialize on page load
function init() {
  initCourseInfoCta();
  handleScroll();
  handleCourseInfoCta();
  initStatCardsAnimation();
  initRequirementsChecklistAnimation();
  initHeroPromoCardAnimation();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

