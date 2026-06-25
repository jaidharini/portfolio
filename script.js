/* ============================================================
   SCRIPT.JS — Portfolio by Jai Dharini C S
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // 1. LOADER
  // ============================================================
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('hidden');
    }, 2000);
  });

  // ============================================================
  // 2. CUSTOM CURSOR
  // ============================================================
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0, followX = 0, followY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) {
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    }
  });

  function animateCursorFollower() {
    followX += (mouseX - followX) * 0.12;
    followY += (mouseY - followY) * 0.12;
    if (cursorFollower) {
      cursorFollower.style.left = followX + 'px';
      cursorFollower.style.top = followY + 'px';
    }
    requestAnimationFrame(animateCursorFollower);
  }
  animateCursorFollower();

  const interactiveEls = document.querySelectorAll('a, button, .skill-pill, .project-card, .stat-card, .contact-item');
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor && cursor.classList.add('active');
      cursorFollower && cursorFollower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursor && cursor.classList.remove('active');
      cursorFollower && cursorFollower.classList.remove('active');
    });
  });

  // ============================================================
  // 3. PARTICLE CANVAS BACKGROUND
  // ============================================================
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '99,120,255' : '168,85,247';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
        ctx.fill();
      }
    }

    function connectParticles() {
      const maxDist = 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,120,255,${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 90);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      connectParticles();
      animFrame = requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      initParticles();
    });
    resizeObserver.observe(canvas.parentElement);
  }

  // ============================================================
  // 4. TYPEWRITER EFFECT
  // ============================================================
  const typewriterEl = document.getElementById('typewriterText');
  if (typewriterEl) {
    const phrases = [
      'Software Developer',
      'Web Developer',
      'Python Enthusiast',
      'Problem Solver',
      'CSE Student',
      'Open Source Contributor'
    ];
    let phrIndex = 0, charIndex = 0, isDeleting = false;

    function typeWrite() {
      const current = phrases[phrIndex];
      if (isDeleting) {
        typewriterEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 60 : 110;

      if (!isDeleting && charIndex === current.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phrIndex = (phrIndex + 1) % phrases.length;
        delay = 500;
      }

      setTimeout(typeWrite, delay);
    }

    setTimeout(typeWrite, 2400);
  }

  // ============================================================
  // 5. NAVBAR SCROLL BEHAVIOUR + ACTIVE LINKS
  // ============================================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    const scrollY = window.scrollY;

    // Sticky style
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 50);
    }

    // Active link
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-section="${section.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });

    // Back to top
    const btt = document.getElementById('backToTop');
    if (btt) btt.classList.toggle('visible', scrollY > 400);
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ============================================================
  // 6. MOBILE NAV TOGGLE
  // ============================================================
  const navToggle = document.getElementById('navToggle');
  const navLinksMenu = document.getElementById('navLinks');

  if (navToggle && navLinksMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinksMenu.classList.toggle('open');
    });

    navLinksMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinksMenu.classList.remove('open');
      });
    });
  }

  // ============================================================
  // 7. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  // ============================================================
  function createRevealObserver() {
    const options = { threshold: 0.12, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.style.getPropertyValue('--delay') || '0s';
          const delayMs = parseFloat(delay) * 1000;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delayMs);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
      observer.observe(el);
    });
  }

  createRevealObserver();

  // ============================================================
  // 8. ANIMATED STAT COUNTERS
  // ============================================================
  function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + (target === 10 ? '+' : target === 3 && el.closest('.stat-card')?.id === 'statYear' ? 'rd' : '');
    };
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.stat-number[data-count]');
        nums.forEach(n => animateCounter(n, parseInt(n.dataset.count)));
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  const aboutVisual = document.querySelector('.about-visual');
  if (aboutVisual) statsObserver.observe(aboutVisual);

  // ============================================================
  // 9. EMAILJS INITIALISATION
  // ============================================================
  // Public key is safe to expose in front-end code.
  emailjs.init({ publicKey: 'Ylr1yMC6iQPeJGX0O' });

  // ============================================================
  // TOAST NOTIFICATION SYSTEM
  // ============================================================
  const TOAST_DURATION = 5000; // ms before auto-dismiss

  // Inject toast styles once so style.css stays untouched
  const toastStyle = document.createElement('style');
  toastStyle.textContent = `
    /* ---- Toast Container ---- */
    .toast-container {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      pointer-events: none;
      width: 100%;
      max-width: 420px;
      padding: 0 1rem;
    }
    /* ---- Individual Toast ---- */
    .toast {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.95rem 1.25rem;
      background: rgba(15, 20, 40, 0.97);
      border: 1px solid rgba(99, 120, 255, 0.25);
      border-radius: 14px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      color: #f0f4ff;
      font-family: 'Inter', sans-serif;
      font-size: 0.88rem;
      font-weight: 500;
      pointer-events: all;
      cursor: default;
      /* Entry animation */
      animation: toastSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
      position: relative;
      overflow: hidden;
    }
    .toast.toast-exit {
      animation: toastSlideOut 0.35s cubic-bezier(0.4,0,0.2,1) forwards;
    }
    /* Progress bar across the bottom */
    .toast::before {
      content: '';
      position: absolute;
      bottom: 0; left: 0;
      height: 3px;
      border-radius: 0 0 14px 14px;
      background: currentColor;
      opacity: 0.35;
      animation: toastProgress linear forwards;
      animation-duration: var(--toast-duration, 5s);
    }
    /* Icon circle */
    .toast-icon {
      flex-shrink: 0;
      width: 36px; height: 36px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem;
    }
    .toast-body { flex: 1; }
    .toast-title {
      font-weight: 700;
      font-size: 0.9rem;
      margin-bottom: 1px;
      display: block;
    }
    .toast-msg {
      color: #9aa5c4;
      font-size: 0.82rem;
      display: block;
    }
    .toast-close {
      background: none; border: none;
      color: #5a6585; font-size: 0.9rem;
      cursor: pointer;
      padding: 4px; border-radius: 6px;
      transition: color 0.2s ease, background 0.2s ease;
      flex-shrink: 0;
      pointer-events: all;
    }
    .toast-close:hover { color: #f0f4ff; background: rgba(255,255,255,0.08); }
    /* Variants */
    .toast-success { border-color: rgba(16,185,129,0.4); }
    .toast-success .toast-icon { background: rgba(16,185,129,0.15); color: #10b981; }
    .toast-success { color: #10b981; }
    .toast-error   { border-color: rgba(239,68,68,0.4); }
    .toast-error   .toast-icon { background: rgba(239,68,68,0.15); color: #ef4444; }
    .toast-error   { color: #ef4444; }
    .toast-info    { border-color: rgba(99,120,255,0.4); }
    .toast-info    .toast-icon { background: rgba(99,120,255,0.15); color: #6378ff; }
    .toast-info    { color: #6378ff; }
    /* Reset text colours to white after icon colour inheritance */
    .toast-title, .toast-msg { color: inherit; }
    .toast-success .toast-title, .toast-error .toast-title, .toast-info .toast-title { filter: brightness(1.25); }
    .toast-success .toast-msg, .toast-error .toast-msg, .toast-info .toast-msg { color: #9aa5c4; }
    /* Keyframes */
    @keyframes toastSlideIn {
      from { opacity: 0; transform: translateY(20px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0)   scale(1); }
    }
    @keyframes toastSlideOut {
      to   { opacity: 0; transform: translateY(16px) scale(0.95); }
    }
    @keyframes toastProgress {
      from { width: 100%; }
      to   { width: 0%; }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX(5px); }
    }
    @media (max-width: 480px) {
      .toast-container { bottom: 1rem; }
    }
  `;
  document.head.appendChild(toastStyle);

  /**
   * showToast({ type, title, message, duration })
   * type: 'success' | 'error' | 'info'
   */
  function showToast({ type = 'info', title, message, duration = TOAST_DURATION }) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = {
      success: 'fas fa-check-circle',
      error:   'fas fa-times-circle',
      info:    'fas fa-info-circle',
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.setProperty('--toast-duration', duration + 'ms');
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="toast-icon"><i class="${icons[type]}"></i></div>
      <div class="toast-body">
        ${title ? `<span class="toast-title">${title}</span>` : ''}
        ${message ? `<span class="toast-msg">${message}</span>` : ''}
      </div>
      <button class="toast-close" aria-label="Dismiss notification">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Dismiss on close button
    toast.querySelector('.toast-close').addEventListener('click', () => dismissToast(toast));

    container.appendChild(toast);

    // Auto-dismiss
    const timer = setTimeout(() => dismissToast(toast), duration);
    toast._timer = timer;
  }

  function dismissToast(toast) {
    clearTimeout(toast._timer);
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }

  // ============================================================
  // 10. CONTACT FORM — EmailJS INTEGRATION
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // prevent page refresh

      const btn         = document.getElementById('contactSubmitBtn');
      const nameEl      = document.getElementById('contactName');
      const emailEl     = document.getElementById('contactEmail');
      const subjectEl   = document.getElementById('contactSubject');
      const messageEl   = document.getElementById('contactMessage');

      // ---- Field validation ----
      const name    = nameEl.value.trim();
      const email   = emailEl.value.trim();
      const subject = subjectEl.value.trim();
      const message = messageEl.value.trim();

      if (!name) {
        shakeField(nameEl.parentElement);
        nameEl.focus();
        showToast({ type: 'error', title: 'Name required', message: 'Please enter your full name.' });
        return;
      }
      if (!email) {
        shakeField(emailEl.parentElement);
        emailEl.focus();
        showToast({ type: 'error', title: 'Email required', message: 'Please enter your email address.' });
        return;
      }
      if (!isValidEmail(email)) {
        shakeField(emailEl.parentElement);
        emailEl.focus();
        showToast({ type: 'error', title: 'Invalid email', message: 'Please enter a valid email address.' });
        return;
      }
      if (!message) {
        shakeField(messageEl.parentElement);
        messageEl.focus();
        showToast({ type: 'error', title: 'Message required', message: 'Please write a message before sending.' });
        return;
      }

      // ---- Loading state ----
      const originalBtnHTML = btn.innerHTML;
      btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
      btn.disabled   = true;
      btn.style.opacity = '0.8';

      try {
        // emailjs.sendForm reads the <form> inputs by their `name` attributes:
        //   name="name"     → {{name}}
        //   name="email"    → {{email}}
        //   name="subject"  → {{subject}}
        //   name="message"  → {{message}}
        await emailjs.sendForm(
          'service_y671db9',   // Service ID
          'template_v5lgufr',  // Template ID
          contactForm          // the <form> element itself
        );

        // ---- Success ----
        btn.innerHTML = '<i class="fas fa-check"></i> <span>Sent!</span>';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        btn.style.opacity = '1';

        showToast({
          type: 'success',
          title: 'Message sent! 🎉',
          message: "Thanks for reaching out. I'll get back to you within 24 hours.",
          duration: 6000,
        });

        contactForm.reset(); // clear all fields

        // Restore button after 4 seconds
        setTimeout(() => {
          btn.innerHTML        = originalBtnHTML;
          btn.style.background = '';
          btn.style.opacity    = '1';
          btn.disabled         = false;
        }, 4000);

      } catch (err) {
        // ---- Error ----
        console.error('EmailJS error:', err);

        btn.innerHTML     = originalBtnHTML;
        btn.style.opacity = '1';
        btn.disabled      = false;

        showToast({
          type: 'error',
          title: 'Failed to send',
          message: 'Something went wrong. Please try emailing directly at jaidharini2006@gmail.com',
          duration: 7000,
        });
      }
    });
  }

  // ---- Helpers (shared with validation above) ----
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeField(field) {
    field.style.animation = 'none';
    field.offsetHeight; // force reflow
    field.style.animation = 'shake 0.4s ease';
    setTimeout(() => { field.style.animation = ''; }, 450);
  }

  // ============================================================
  // 10. BACK TO TOP
  // ============================================================
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // 11. SMOOTH SCROLL FOR IN-PAGE ANCHORS
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================================
  // 12. SKILL PILL RIPPLE EFFECT
  // ============================================================
  document.querySelectorAll('.skill-pill').forEach(pill => {
    pill.addEventListener('click', function (e) {
      const rect = pill.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        background:rgba(99,120,255,0.3);
        transform:scale(0); animation:rippleAnim 0.6s ease;
        width:${Math.max(pill.offsetWidth, pill.offsetHeight) * 2}px;
        height:${Math.max(pill.offsetWidth, pill.offsetHeight) * 2}px;
        left:${e.clientX - rect.left - pill.offsetWidth}px;
        top:${e.clientY - rect.top - pill.offsetHeight}px;
        pointer-events:none; z-index:0;
      `;
      pill.style.position = 'relative';
      pill.style.overflow = 'hidden';
      pill.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);

  // ============================================================
  // 13. SCROLL PROGRESS INDICATOR (top bar)
  // ============================================================
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px;
    background: linear-gradient(90deg, #6378ff, #a855f7);
    z-index: 9999; width: 0%; transition: width 0.1s linear;
    box-shadow: 0 0 10px rgba(99,120,255,0.6);
  `;
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }, { passive: true });

  // ============================================================
  // 14. TILT EFFECT FOR PROJECT CARDS
  // ============================================================
  function addTilt(selector) {
    document.querySelectorAll(selector).forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `perspective(800px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  addTilt('.project-card:not(.project-card-placeholder)');
  addTilt('.skill-category');

  // ============================================================
  // 15. GRADIENT ORBS MOUSE TRACKING
  // ============================================================
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  document.addEventListener('mousemove', (e) => {
    const nx = e.clientX / window.innerWidth;
    const ny = e.clientY / window.innerHeight;
    if (orb1) {
      orb1.style.transform = `translate(${nx * 30}px, ${ny * 30}px)`;
    }
    if (orb2) {
      orb2.style.transform = `translate(${-nx * 25}px, ${-ny * 25}px)`;
    }
  }, { passive: true });

  // ============================================================
  // 16. ABOUT SECTION - INFO ITEMS STAGGER
  // ============================================================
  const infoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.info-item');
        items.forEach((item, i) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, i * 100);
        });
        infoObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const aboutInfoGrid = document.querySelector('.about-info-grid');
  if (aboutInfoGrid) {
    const items = aboutInfoGrid.querySelectorAll('.info-item');
    items.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    infoObserver.observe(aboutInfoGrid);
  }

  // ============================================================
  // 17. EDUCATION CARD ENTRANCE
  // ============================================================
  const eduObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
        eduObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const eduContent = document.querySelector('.education-content');
  if (eduContent) {
    eduContent.style.opacity = '0';
    eduContent.style.transform = 'translateX(30px)';
    eduContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    eduObserver.observe(eduContent);
  }

  // ============================================================
  // 18. FOOTER APPEAR ANIMATION
  // ============================================================
  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cols = entry.target.querySelectorAll('.footer-brand, .footer-links, .footer-contact');
        cols.forEach((col, i) => {
          col.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
          col.style.opacity = '1';
          col.style.transform = 'translateY(0)';
        });
        footerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const footerContent = document.querySelector('.footer-content');
  if (footerContent) {
    const cols = footerContent.querySelectorAll('.footer-brand, .footer-links, .footer-contact');
    cols.forEach(col => {
      col.style.opacity = '0';
      col.style.transform = 'translateY(30px)';
    });
    footerObserver.observe(footerContent);
  }

  // ============================================================
  // 19. CONTACT ITEMS STAGGER
  // ============================================================
  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.contact-item');
        items.forEach((item, i) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, i * 120);
        });
        contactObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const contactItems = document.querySelector('.contact-items');
  if (contactItems) {
    contactItems.querySelectorAll('.contact-item').forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    contactObserver.observe(contactItems);
  }

  // ============================================================
  // 20. ACTIVE SECTION HIGHLIGHT — glowing underline in nav
  // ============================================================
  // Already handled in updateNavbar() above.

  console.log('%c🚀 Portfolio by Jai Dharini C S', 'color:#6378ff;font-size:16px;font-weight:bold;');
  console.log('%cBuilt with ❤️ using HTML, CSS & JavaScript', 'color:#a855f7;font-size:12px;');

})();
