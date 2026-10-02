/* =========================================================
   بانوراما الشرق — سكربت الموقع
   ========================================================= */
(() => {
  'use strict';

  /* =========================================================
     1) الهيدر — تغيير مظهره عند التمرير
     ========================================================= */
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* =========================================================
     2) قائمة الجوال — focus trap + Escape + scroll lock
     ========================================================= */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  const getFocusable = () =>
    mainNav.querySelectorAll('a[href], button:not([disabled])');

  const openMenu = () => {
    mainNav.classList.add('is-open');
    navToggle.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    const first = getFocusable()[0];
    first?.focus({ preventScroll: true });
  };

  const closeMenu = () => {
    mainNav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
  };

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (!mainNav.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        closeMenu();
        navToggle.focus();
        return;
      }

      if (e.key === 'Tab') {
        const focusables = Array.from(getFocusable());
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;

        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 760 && mainNav.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  /* =========================================================
     3) Reveal — إظهار العناصر عند التمرير
     ========================================================= */
  const revealItems = document.querySelectorAll('.reveal');
  if (revealItems.length) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach((el) => revealObserver.observe(el));
  }

  /* =========================================================
     4) أشرطة التقييم
     ========================================================= */
  const ratingBars = document.querySelectorAll('.rs-bar i');
  if (ratingBars.length) {
    const barObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    ratingBars.forEach((bar) => barObserver.observe(bar));
  }

  /* =========================================================
     5) رسم بياني لأوقات الازدحام
     ========================================================= */
  const popularData = [
    { label: '٦ص',  value: 8,  time: 6  },
    { label: '٧ص',  value: 12, time: 7  },
    { label: '٨ص',  value: 18, time: 8  },
    { label: '٩ص',  value: 22, time: 9  },
    { label: '١٠ص', value: 28, time: 10 },
    { label: '١١ص', value: 34, time: 11 },
    { label: '١٢م', value: 45, time: 12 },
    { label: '١ص',  value: 52, time: 13 },
    { label: '٢م',  value: 48, time: 14 },
    { label: '٣م',  value: 40, time: 15 },
    { label: '٤م',  value: 46, time: 16 },
    { label: '٥م',  value: 58, time: 17 },
    { label: '٦م',  value: 72, time: 18 },
    { label: '٧م',  value: 88, time: 19 },
    { label: '٨م',  value: 96, time: 20 },
    { label: '٩م',  value: 100, time: 21 },
    { label: '١٠م', value: 90, time: 22 },
    { label: '١١م', value: 65, time: 23 },
    { label: '١٢ص', value: 30, time: 0  }
  ];

  const chartEl = document.getElementById('popularChart');
  const axisEl  = document.getElementById('popularAxis');
  const tooltipEl = document.getElementById('popularTooltip');
  const liveDot = document.getElementById('liveDot');
  const liveStatus = document.getElementById('liveStatus');

  const densityLabel = (v) =>
    v < 35 ? 'هادئ' : v < 70 ? 'متوسط' : 'مزدحم نسبياً';

  if (chartEl) {
    popularData.forEach((point) => {
      const bar = document.createElement('div');
      bar.className = 'pc-bar';
      bar.style.height = `${point.value}%`;
      bar.dataset.label = point.label;
      bar.dataset.value = point.value;
      bar.setAttribute('aria-label', `${point.label}: ${densityLabel(point.value)}`);
      bar.setAttribute('tabindex', '0');

      const showTip = () => {
        if (!tooltipEl) return;
        tooltipEl.textContent = `${point.label} — ${densityLabel(point.value)}`;
        tooltipEl.classList.add('is-visible');
        bar.classList.add('is-active');
      };
      const hideTip = () => {
        tooltipEl?.classList.remove('is-visible');
        bar.classList.remove('is-active');
      };

      bar.addEventListener('mouseenter', showTip);
      bar.addEventListener('mouseleave', hideTip);
      bar.addEventListener('focus', showTip);
      bar.addEventListener('blur', hideTip);

      chartEl.appendChild(bar);
    });

    if (axisEl) {
      popularData.forEach((point, i) => {
        const span = document.createElement('span');
        span.textContent = i % 2 === 0 ? point.label : '';
        axisEl.appendChild(span);
      });
    }

    const chartObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          chartEl.querySelectorAll('.pc-bar').forEach((bar, i) => {
            setTimeout(() => bar.classList.add('is-visible'), i * 35);
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    chartObserver.observe(chartEl);
  }

  /* =========================================================
     6) حالة الازدحام الآن
     ========================================================= */
  function updateLiveStatus() {
    if (!liveStatus || !liveDot) return;
    const hour = new Date().getHours();
    const current = popularData.find((p) => p.time === hour) || popularData[0];

    liveStatus.textContent = densityLabel(current.value) + ' الآن';
    liveDot.classList.remove('is-busy', 'is-quiet');
    liveDot.classList.add(current.value < 35 ? 'is-quiet' : 'is-busy');
  }
  updateLiveStatus();
  setInterval(updateLiveStatus, 60 * 1000);

  /* =========================================================
     7) حالة "مفتوح الآن" (8ص - 1ص)
     ========================================================= */
  const openStatusEl = document.getElementById('openStatus');

  function updateOpenStatus() {
    if (!openStatusEl) return;
    const hour = new Date().getHours();
    const isOpen = hour >= 8 || hour < 1;
    const isClosingSoon = hour === 0;

    openStatusEl.dataset.status = !isOpen ? 'closed' : isClosingSoon ? 'closing' : 'open';
    openStatusEl.textContent = !isOpen
      ? 'مغلق الآن'
      : isClosingSoon
        ? 'يغلق قريباً'
        : 'مفتوح الآن';
  }
  updateOpenStatus();
  setInterval(updateOpenStatus, 60 * 1000);

  /* =========================================================
     8) عدّاد رقمي
     ========================================================= */
  const statNum = document.querySelector('.stat-num[data-count]');
  if (statNum) {
    const target = parseFloat(statNum.dataset.count);
    const statObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        let current = 0;
        const step = target / 30;
        const tick = () => {
          current += step;
          if (current >= target) {
            statNum.textContent = target.toFixed(1);
            return;
          }
          statNum.textContent = current.toFixed(1);
          requestAnimationFrame(tick);
        };
        tick();
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    statObserver.observe(statNum);
  }

  /* =========================================================
     9) نموذج الحجز
     ========================================================= */
  const reserveForm = document.getElementById('reserveForm');
  const formMsg = document.getElementById('formMsg');
  const dateInput = document.getElementById('reserveDate');

  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  if (reserveForm && formMsg) {
    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!reserveForm.reportValidity()) {
        formMsg.textContent = 'الرجاء تعبئة جميع الحقول المطلوبة بشكل صحيح.';
        formMsg.classList.remove('is-success');
        formMsg.classList.add('is-error');
        return;
      }

      const name = reserveForm.querySelector('[name="name"]').value.trim();
      formMsg.classList.remove('is-error');
      formMsg.classList.add('is-success');
      formMsg.textContent = `شكراً ${name}! تم استلام طلب الحجز وسنتواصل معك قريباً لتأكيد الموعد.`;
      reserveForm.reset();

      if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
      }
    });
  }

  /* =========================================================
     10) زر العودة للأعلى
     ========================================================= */
  const backTop = document.getElementById('backTop');
  if (backTop) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const toggleBackTop = () => {
      backTop.classList.toggle('is-visible', window.scrollY > 400);
    };
    toggleBackTop();
    window.addEventListener('scroll', toggleBackTop, { passive: true });

    backTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion.matches ? 'auto' : 'smooth'
      });
    });
  }

  /* =========================================================
     11) تحديث سنة الحقوق
     ========================================================= */
  const yearEl = document.querySelector('.footer-bottom span');
  if (yearEl) {
    const currentYear = new Date().getFullYear();
    yearEl.textContent = yearEl.textContent.replace(/\d{4}/, currentYear);
  }

  /* =========================================================
     12) ✅ تبديل الوضع الفاتح / الداكن
     ========================================================= */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  /**
   * تطبيق الوضع مع تحديث ميتا theme-color و aria-label
   */
  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) { /* ignore */ }

    // تحديث meta theme-color ليتناسب مع شريط المتصفح على الجوال
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#14110D' : '#1F5C55');
    }

    // تحديث الـ aria-label للوصولية
    if (themeToggle) {
      const label = theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن';
      themeToggle.setAttribute('aria-label', label);
      themeToggle.setAttribute('title', label);
      themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
  };

  if (themeToggle) {
    // ضبط الحالة الأولية بناء على الوضع الحالي
    const initialTheme = root.getAttribute('data-theme') || 'light';
    applyTheme(initialTheme);

    // الاستماع للنقر
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /**
   * مراقبة تغييرات تفضيل النظام (فقط إن لم يكن هناك تفضيل محفوظ)
   */
  const systemPref = window.matchMedia('(prefers-color-scheme: dark)');
  systemPref.addEventListener('change', (e) => {
    // إذا لم يختر المستخدم يدويًا، اتبع النظام
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (err) {}
    if (!saved) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

})();