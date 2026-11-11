/**
 * QUANTAM GAMING - CLIENT APPLICATION LOGIC
 * High-performance interactions, canvas particle physics, contact form dispatch & modal state
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCanvasParticles();
  initStatsCounter();
  initArenaFilters();
  initContactForm();
  initModal();
  initFaqAccordion();
});

/* -------------------------------------------------------------------------
   1. NAVIGATION & SCROLL STATE
   ------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.getElementById('main-header');
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-item');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky header background transition
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu drawer toggle
  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      toggleBtn.classList.toggle('active', isOpen);
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // Active section link highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, { passive: true });
}

/* -------------------------------------------------------------------------
   2. QUANTUM PARTICLE CANVAS BACKGROUND
   ------------------------------------------------------------------------- */
function initCanvasParticles() {
  const canvas = document.getElementById('quantum-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;
  const maxDistance = 140;

  let mouse = { x: null, y: null };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(0, 240, 255, ' : 'rgba(168, 85, 247, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse influence
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x -= dx * 0.02;
          this.y -= dy * 0.02;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* -------------------------------------------------------------------------
   3. ANIMATED METRICS COUNTER
   ------------------------------------------------------------------------- */
function initStatsCounter() {
  const metricNumbers = document.querySelectorAll('.metric-number');
  let started = false;

  function runCounter() {
    metricNumbers.forEach(elem => {
      const target = parseFloat(elem.getAttribute('data-target'));
      const duration = 1800; // ms
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      let count = 0;

      const timer = setInterval(() => {
        count++;
        current += increment;
        if (count >= steps) {
          elem.innerText = Number.isInteger(target) ? target : target.toFixed(1);
          clearInterval(timer);
        } else {
          elem.innerText = Number.isInteger(target) ? Math.floor(current) : current.toFixed(1);
        }
      }, duration / steps);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        runCounter();
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.querySelector('.hero-metrics');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

/* -------------------------------------------------------------------------
   4. ARENA & GAME FILTERING
   ------------------------------------------------------------------------- */
function initArenaFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const gameCards = document.querySelectorAll('.game-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      gameCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------------------
   5. INTERACTIVE CONTACT TRANSMISSION FORM
   ------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');
  if (!form || !statusDiv) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    // Name Validation
    const nameInput = document.getElementById('form-name');
    const nameGroup = nameInput.closest('.form-group');
    if (!nameInput.value.trim()) {
      nameGroup.classList.add('has-error');
      hasError = true;
    } else {
      nameGroup.classList.remove('has-error');
    }

    // Email Validation
    const emailInput = document.getElementById('form-email');
    const emailGroup = emailInput.closest('.form-group');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      emailGroup.classList.add('has-error');
      hasError = true;
    } else {
      emailGroup.classList.remove('has-error');
    }

    // Message Validation
    const messageInput = document.getElementById('form-message');
    const messageGroup = messageInput.closest('.form-group');
    if (!messageInput.value.trim() || messageInput.value.trim().length < 5) {
      messageGroup.classList.add('has-error');
      hasError = true;
    } else {
      messageGroup.classList.remove('has-error');
    }

    if (hasError) {
      statusDiv.className = 'form-status error';
      statusDiv.innerText = 'Transmission blocked: Please correct the highlighted fields before transmitting.';
      return;
    }

    // Submit Simulation
    const submitBtn = document.getElementById('btn-submit-form');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Transmitting to Quantam Hub...</span>';

    setTimeout(() => {
      const routingOption = document.getElementById('form-routing').value;
      let targetInbox = 'hello@quantamgaming.com (Primary Hub)';
      if (routingOption === 'escalation') {
        targetInbox = 'support@quantamgaming.com (24/7 Live Desk)';
      } else if (routingOption === 'phone') {
        targetInbox = 'Voice Callback Queue (+1 800-482-9011)';
      } else if (routingOption === 'discord') {
        targetInbox = 'Discord Operations Bot';
      }

      statusDiv.className = 'form-status success';
      statusDiv.innerHTML = `✓ <strong>Transmission Received!</strong> Your ticket has been logged and routed to <strong>${targetInbox}</strong>. A coordinator will connect with you shortly.`;
      
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 9000);
    }, 1200);
  });
}

/* -------------------------------------------------------------------------
   6. TOURNAMENT REGISTRATION MODAL
   ------------------------------------------------------------------------- */
function initModal() {
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close');
  const regForm = document.getElementById('modal-reg-form');

  if (!backdrop) return;

  window.openRegisterModal = function(tournamentName) {
    const desc = document.getElementById('modal-tournament-name');
    if (desc) desc.innerText = `Selected Tournament: ${tournamentName}`;
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
  };

  function closeModal() {
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closeModal();
    }
  });

  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const team = document.getElementById('reg-team').value;
      alert(`Registration verified! Team "${team}" has been entered into the official qualification bracket. Confirmation sent to your Discord.`);
      regForm.reset();
      closeModal();
    });
  }
}

/* -------------------------------------------------------------------------
   7. FAQ ACCORDION COLLAPSE/EXPAND
   ------------------------------------------------------------------------- */
function initFaqAccordion() {
  const questions = document.querySelectorAll('.faq-question');

  questions.forEach(q => {
    q.addEventListener('click', () => {
      const isExpanded = q.getAttribute('aria-expanded') === 'true';
      const answer = q.nextElementSibling;

      // Close other open questions
      questions.forEach(otherQ => {
        if (otherQ !== q) {
          otherQ.setAttribute('aria-expanded', 'false');
          if (otherQ.nextElementSibling) {
            otherQ.nextElementSibling.classList.remove('open');
          }
        }
      });

      q.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
      if (answer) {
        answer.classList.toggle('open', !isExpanded);
      }
    });
  });
}
