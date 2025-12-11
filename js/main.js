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

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('.nav');

if (mobileMenuToggle && nav) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    nav.classList.toggle('active');
  });

  // Close mobile menu when clicking on a nav link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.classList.remove('active');
      nav.classList.remove('active');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
      mobileMenuToggle.classList.remove('active');
      nav.classList.remove('active');
    }
  });
}

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

// Stat cards animation on scroll
function initStatCardsAnimation() {
  const statCards = document.querySelectorAll('.stat-card');
  const journeySection = document.querySelector('.journey');
  
  if (!statCards.length || !journeySection) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('animate');
          }, index * 250); // Stagger delay: 250ms between each card
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  observer.observe(journeySection);
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

