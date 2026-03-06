/* ============================================
   CASTLEWOOD INTERNATIONAL PRE-SCHOOL
   JavaScript — Interactivity & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // STICKY HEADER
  // ============================================
  const header = document.getElementById('header');

  const handleScroll = () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  // ============================================
  // MOBILE NAVIGATION TOGGLE
  // ============================================
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    header.classList.toggle('menu-open');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navLinks.classList.remove('active');
      header.classList.remove('menu-open');
      document.body.style.overflow = '';
    });
  });


  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // ============================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ============================================
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));


  // ============================================
  // TESTIMONIAL CAROUSEL
  // ============================================
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');
  const dots = dotsContainer.querySelectorAll('.carousel-dot');

  let currentSlide = 0;
  let autoPlayInterval;

  const getCardsPerView = () => {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const getTotalSlides = () => {
    const cards = track.querySelectorAll('.testimonial-card');
    return Math.max(1, Math.ceil(cards.length - getCardsPerView() + 1));
  };

  const updateCarousel = () => {
    const cardsPerView = getCardsPerView();
    const card = track.querySelector('.testimonial-card');
    if (!card) return;

    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    const cardWidth = card.offsetWidth + gap;
    const offset = currentSlide * cardWidth;

    track.style.transform = `translateX(-${offset}px)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  };

  const nextSlide = () => {
    const totalSlides = getTotalSlides();
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  };

  const prevSlide = () => {
    const totalSlides = getTotalSlides();
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  };

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      currentSlide = parseInt(dot.dataset.index);
      updateCarousel();
      resetAutoPlay();
    });
  });

  const startAutoPlay = () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  };

  startAutoPlay();

  window.addEventListener('resize', () => {
    currentSlide = 0;
    updateCarousel();
  });


  // ============================================
  // SCROLL TO TOP BUTTON
  // ============================================
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  // ============================================
  // CONTACT FORM HANDLING
  // ============================================
  const enquiryForm = document.getElementById('enquiryForm');

  enquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(enquiryForm);
    const data = Object.fromEntries(formData);

    // FormSubmit limitation check
    if (window.location.protocol === 'file:') {
      showFormMessage('Note: The email feature requires a web server (like Live Server or Vercel). It does not work on local file:// paths.', 'error');
      return;
    }

    // Validation
    if (!data.parentName || !data.parentPhone || !data.childName || !data.childAge || !data.program) {
      showFormMessage('Please fill in all required fields.', 'error');
      return;
    }

    // Network request to Formsubmit via AJAX
    const submitBtn = enquiryForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    fetch('https://formsubmit.co/ajax/c0e2576bfda2f1e48e09bd5f73635b5a', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        showFormMessage('Thank you for your enquiry! Our admissions team will contact you shortly.', 'success');
        enquiryForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      })
      .catch(error => {
        showFormMessage('Oops! Something went wrong. Please try again.', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
  });

  function showFormMessage(message, type) {
    // Remove any existing message
    const existing = enquiryForm.querySelector('.form-message');
    if (existing) existing.remove();

    const msgEl = document.createElement('div');
    msgEl.className = `form-message form-message-${type}`;
    msgEl.style.cssText = `
      padding: 12px 20px;
      margin-top: 12px;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 500;
      text-align: center;
      animation: fadeInUp 0.4s ease;
      ${type === 'success'
        ? 'background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7;'
        : 'background: #fbe9e7; color: #c62828; border: 1px solid #ef9a9a;'
      }
    `;
    msgEl.textContent = message;
    enquiryForm.appendChild(msgEl);

    // Auto-remove after 6 seconds
    setTimeout(() => {
      msgEl.style.opacity = '0';
      msgEl.style.transform = 'translateY(-10px)';
      msgEl.style.transition = 'all 0.3s ease';
      setTimeout(() => msgEl.remove(), 300);
    }, 6000);
  }


  // ============================================
  // COUNTER ANIMATION FOR STATS
  // ============================================
  const animateCounter = (element, target, suffix = '') => {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + suffix;
    }, 16);
  };

  const statElements = document.querySelectorAll('.hero-stat-value');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statElements.forEach(stat => {
          const text = stat.textContent;
          if (text.includes('13')) {
            animateCounter(stat, 13, '+');
          } else if (text.includes('4.9')) {
            let current = 0;
            const timer = setInterval(() => {
              current += 0.1;
              if (current >= 4.9) {
                current = 4.9;
                clearInterval(timer);
              }
              stat.textContent = current.toFixed(1) + '★';
            }, 30);
          } else if (text.includes('100')) {
            animateCounter(stat, 100, '+');
          }
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    statsObserver.observe(heroStats);
  }

});
