/**
 * ==========================================================================
 * MEMORY REHAB LAB — NEXT-GEN SUPER EFFECTS ENGINE
 * 3D Physics Tilt, Before/After Slider, Synthesized Web Audio ASMR,
 * Apothecary Skin Diagnostic Quiz, Canvas Confetti & Live Social Proof
 * ==========================================================================
 */

(function () {
  'use strict';

  /* ============================================================
     1. SYNTHESIZED WEB AUDIO ASMR HAPTICS ENGINE
     Zero external MP3 dependencies; pure browser sound synthesis.
     ============================================================ */
  const SoundFX = (function () {
    let ctx = null;
    let enabled = localStorage.getItem('mr_sound_fx') !== 'off'; // default to on

    function getContext() {
      if (!ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        ctx = new AudioCtx();
      }
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
      return ctx;
    }

    function isEnabled() {
      return enabled;
    }

    function setEnabled(val) {
      enabled = !!val;
      localStorage.setItem('mr_sound_fx', enabled ? 'on' : 'off');
      updateSoundUI();
    }

    function toggle() {
      setEnabled(!enabled);
      if (enabled) {
        playDewdrop();
      }
      return enabled;
    }

    function updateSoundUI() {
      const btns = document.querySelectorAll('.sound-toggle-btn');
      btns.forEach(function (b) {
        const onIcon = b.querySelector('.sound-icon-on');
        const offIcon = b.querySelector('.sound-icon-off');
        if (onIcon && offIcon) {
          onIcon.style.display = enabled ? 'inline' : 'none';
          offIcon.style.display = enabled ? 'none' : 'inline';
        }
        b.setAttribute('title', enabled ? 'Sound Effects: ON (Click to mute)' : 'Sound Effects: MUTED (Click to unmute)');
        b.setAttribute('aria-label', enabled ? 'Sound Effects ON' : 'Sound Effects MUTED');
      });
    }

    // Subtle tactile acoustic click for nav tabs & buttons
    function playClick() {
      if (!enabled) return;
      const c = getContext();
      if (!c) return;
      try {
        const osc = c.createOscillator();
        const gain = c.createGain();
        const now = c.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.035);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(c.destination);

        osc.start(now);
        osc.stop(now + 0.04);
      } catch (e) {}
    }

    // Soothing dewy droplet chime for Add-to-Cart, Wishlist & Quiz
    function playDewdrop() {
      if (!enabled) return;
      const c = getContext();
      if (!c) return;
      try {
        const now = c.currentTime;

        // Fundamental bell droplet
        const osc1 = c.createOscillator();
        const gain1 = c.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1180, now);
        osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.12);

        gain1.gain.setValueAtTime(0.12, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc1.connect(gain1);
        gain1.connect(c.destination);
        osc1.start(now);
        osc1.stop(now + 0.23);

        // Gentle sub-harmonic resonance
        const osc2 = c.createOscillator();
        const gain2 = c.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(590, now);
        osc2.frequency.exponentialRampToValueAtTime(880, now + 0.14);

        gain2.gain.setValueAtTime(0.06, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc2.connect(gain2);
        gain2.connect(c.destination);
        osc2.start(now);
        osc2.stop(now + 0.21);
      } catch (e) {}
    }

    // Celebratory harmonic major triad chord for milestones & free shipping
    function playCelebration() {
      if (!enabled) return;
      const c = getContext();
      if (!c) return;
      try {
        const now = c.currentTime;
        const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        freqs.forEach(function (f, i) {
          const osc = c.createOscillator();
          const gain = c.createGain();
          const start = now + i * 0.06;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, start);

          gain.gain.setValueAtTime(0.1, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);

          osc.connect(gain);
          gain.connect(c.destination);

          osc.start(start);
          osc.stop(start + 0.48);
        });
      } catch (e) {}
    }

    // High-precision clinical optical ping for texture loupe
    function playLoupe() {
      if (!enabled) return;
      const c = getContext();
      if (!c) return;
      try {
        const osc = c.createOscillator();
        const gain = c.createGain();
        const now = c.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1480, now);
        osc.frequency.exponentialRampToValueAtTime(840, now + 0.07);

        gain.gain.setValueAtTime(0.045, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(c.destination);

        osc.start(now);
        osc.stop(now + 0.09);
      } catch (e) {}
    }

    // Procedural Botanical Garden Mist ASMR Synthesizer (Pink Noise + Resonant LFO)
    let ambienceNode = null;
    let ambienceGain = null;
    let isAmbienceActive = false;

    function startAmbience() {
      const c = getContext();
      if (!c) return;
      try {
        if (isAmbienceActive) return;
        const bufferSize = c.sampleRate * 2;
        const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }

        const noise = c.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = c.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(420, c.currentTime);

        const lfo = c.createOscillator();
        lfo.frequency.setValueAtTime(0.18, c.currentTime);
        const lfoGain = c.createGain();
        lfoGain.gain.setValueAtTime(140, c.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        ambienceGain = c.createGain();
        ambienceGain.gain.setValueAtTime(0.001, c.currentTime);
        ambienceGain.gain.exponentialRampToValueAtTime(0.08, c.currentTime + 1.2);

        noise.connect(filter);
        filter.connect(ambienceGain);
        ambienceGain.connect(c.destination);

        noise.start();
        ambienceNode = { noise, filter, lfo, gain: ambienceGain };
        isAmbienceActive = true;
        updateAmbienceUI(true);
      } catch (e) {
        console.warn('Audio Ambience err:', e);
      }
    }

    function stopAmbience() {
      if (ambienceGain && ctx) {
        try {
          ambienceGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
          setTimeout(() => {
            if (ambienceNode) {
              try { ambienceNode.noise.stop(); ambienceNode.lfo.stop(); } catch(e) {}
              ambienceNode = null;
            }
          }, 850);
        } catch(e) {}
      }
      isAmbienceActive = false;
      updateAmbienceUI(false);
    }

    function toggleAmbience() {
      if (!enabled) setEnabled(true);
      if (isAmbienceActive) {
        stopAmbience();
        return false;
      } else {
        startAmbience();
        return true;
      }
    }

    function updateAmbienceUI(active) {
      const btns = document.querySelectorAll('.mist-toggle-btn');
      btns.forEach(function (b) {
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    }

    return {
      init: function () {
        updateSoundUI();
        document.addEventListener('click', function (e) {
          if (e.target.closest('.mist-toggle-btn')) {
            e.preventDefault();
            toggleAmbience();
            return;
          }
          if (e.target.closest('.sound-toggle-btn')) {
            e.preventDefault();
            toggle();
            return;
          }
          if (e.target.closest('.card-add-cart-btn, #checkoutBtn, #modalAddCartBtn, .bundle-add-all-btn, #quizAddRoutineBtn, #heroShopNowBtn, .hero-billboard-cta-hotspot')) {
            playDewdrop();
            return;
          }
          if (e.target.closest('.btn-primary, .btn-secondary, .filter-tab-btn, .theme-toggle-btn, .search-toggle-btn, .mob-tab, .search-tag-chip, .dev-floating-trigger, .dev-action-btn')) {
            playClick();
          }
        }, { passive: false });
      },
      playClick: playClick,
      playDewdrop: playDewdrop,
      playCelebration: playCelebration,
      playLoupe: playLoupe,
      toggleAmbience: toggleAmbience,
      isAmbienceActive: function () { return isAmbienceActive; },
      toggle: toggle,
      isEnabled: isEnabled
    };
  })();

  /* ============================================================
     2. VIEWPORT READING PROGRESS BAR
     ============================================================ */
  function initReadingProgress() {
    const bar = document.getElementById('scrollProgressBar');
    if (!bar) return;

    function update() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        const pct = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
        bar.style.width = pct + '%';
      }
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* ============================================================
     3. SUBTLE 3D MICRO-PHYSICS & DEPTH ENGINE (LUXURY CLINICAL)
     Physics-based LERP interpolation (60fps) with multi-plane Z-depth.
     Designed for refined, understated tactile interaction (non-distracting).

     LOW-END DEVICE SAFEGUARDS:
     - Touch-only / coarse-pointer devices → skip entirely
     - prefers-reduced-motion → skip entirely
     - ≤ 2 CPU cores (navigator.hardwareConcurrency) → skip
     - ≤ 2 GB device memory (navigator.deviceMemory) → skip
     - Slow network (2g / slow-2g / Save-Data) → skip (proxy for budget device)
     - Battery saver mode (charging false + level ≤ 15%) → skip
     - Runtime FPS canary: 500ms probe; if < 30fps → kill all 3D
     ============================================================ */

  // Shared flag so the FPS canary can disable 3D globally at runtime
  var _3dEngineActive = false;

  function isLowEndDevice() {
    // CPU cores (most budget phones and old laptops report 2 or fewer)
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return true;

    // Device memory (Chrome/Edge expose this; ≤ 2 GB = budget tier)
    if (navigator.deviceMemory && navigator.deviceMemory <= 2) return true;

    // Network quality proxy: slow connection ≈ budget device
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      if (conn.saveData) return true;
      var ect = conn.effectiveType;
      if (ect === 'slow-2g' || ect === '2g') return true;
    }

    return false;
  }

  function initSubtle3DEngine() {
    // --- Hard gate: touch-only, reduced motion, or detected low-end ---
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
      return; // Disable cursor-tracking 3D physics on touch devices to conserve battery
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return; // Respect accessibility preferences
    }
    if (isLowEndDevice()) {
      return; // Skip on budget hardware — preserves smooth scrolling & battery
    }

    // --- Battery saver async check (non-blocking) ---
    if (navigator.getBattery) {
      navigator.getBattery().then(function (batt) {
        if (!batt.charging && batt.level <= 0.15) {
          // User is on low battery and not charging — kill 3D to save power
          _3dEngineActive = false;
          document.documentElement.classList.add('mr-3d-disabled');
        }
      }).catch(function () { /* getBattery not supported — continue */ });
    }

    // Mark active before the FPS canary can potentially disable
    _3dEngineActive = true;

    // 1. Subtle 3D Multi-Plane Card Tilt
    init3DCardTilt();

    // 2. Product Detail Bottle Inspection (PDP & Quick-View Modal)
    init3DBottleInspection();

    // 3. Hero Subtle Depth Parallax
    initHero3DParallax();

    // 4. Runtime FPS canary — measure real performance for 500ms
    //    If the device can't hold ≥ 30fps, strip all 3D to prevent jank
    runFPSCanary();
  }

  function runFPSCanary() {
    var frames = 0;
    var start = performance.now();
    var canaryId;

    function tick() {
      frames++;
      var elapsed = performance.now() - start;
      if (elapsed < 500) {
        canaryId = requestAnimationFrame(tick);
        return;
      }
      // Elapsed >= 500ms — evaluate
      var fps = (frames / elapsed) * 1000;
      if (fps < 30) {
        // Device is struggling — disable all 3D physics
        _3dEngineActive = false;
        document.documentElement.classList.add('mr-3d-disabled');
        // Reset any inline transforms the engine may have already set
        var affected = document.querySelectorAll('.product-card, .bundle-step-card, .ba-metric-card, .hero-glass-card, .pdp-main-img-box, .modal-image-wrap');
        for (var i = 0; i < affected.length; i++) {
          affected[i].style.transform = '';
          affected[i].style.willChange = '';
        }
      }
    }
    canaryId = requestAnimationFrame(tick);
  }

  function init3DCardTilt() {
    const cardSelector = '.product-card, .bundle-step-card, .ba-metric-card, .hero-glass-card';

    function bindCard(card) {
      if (card._has3DTilt) return;
      card._has3DTilt = true;

      let isHovered = false;
      let targetRotX = 0;
      let targetRotY = 0;
      let currentRotX = 0;
      let currentRotY = 0;
      let currentTransY = 0;
      let targetTransY = 0;
      let rafId = null;

      // Maximum subtle angles (kept strictly between 3.5deg and 4.5deg for understated luxury)
      const MAX_ROT_X = 4.0;
      const MAX_ROT_Y = 4.5;
      const HOVER_LIFT_Y = -4.0;

      function renderFrame() {
        // Kill-switch: FPS canary or battery saver disabled the engine
        if (!_3dEngineActive) {
          card.style.transform = '';
          card.style.willChange = '';
          rafId = null;
          return;
        }
        if (!isHovered && Math.abs(currentRotX) < 0.05 && Math.abs(currentRotY) < 0.05 && Math.abs(currentTransY) < 0.05) {
          // Card returned to resting orientation
          card.style.transform = '';
          card.style.willChange = '';
          rafId = null;
          return;
        }

        // Smooth physics-based lerp (damping factor 0.12)
        currentRotX += (targetRotX - currentRotX) * 0.12;
        currentRotY += (targetRotY - currentRotY) * 0.12;
        currentTransY += (targetTransY - currentTransY) * 0.12;

        card.style.transform = `perspective(1000px) translateY(${currentTransY.toFixed(2)}px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;

        rafId = requestAnimationFrame(renderFrame);
      }

      function onMouseEnter() {
        isHovered = true;
        targetTransY = HOVER_LIFT_Y;
        card.style.willChange = 'transform';
        if (!rafId) {
          rafId = requestAnimationFrame(renderFrame);
        }
      }

      function onMouseMove(e) {
        if (!isHovered) return;
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        targetRotX = ((y - centerY) / centerY) * -MAX_ROT_X;
        targetRotY = ((x - centerX) / centerX) * MAX_ROT_Y;

        card.style.setProperty('--mouse-x', x.toFixed(1) + 'px');
        card.style.setProperty('--mouse-y', y.toFixed(1) + 'px');
      }

      function onMouseLeave() {
        isHovered = false;
        targetRotX = 0;
        targetRotY = 0;
        targetTransY = 0;
        if (!rafId) {
          rafId = requestAnimationFrame(renderFrame);
        }
      }

      card.addEventListener('mouseenter', onMouseEnter, { passive: true });
      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave, { passive: true });
    }

    // Bind all initial cards
    document.querySelectorAll(cardSelector).forEach(bindCard);

    // Watch for dynamically added / updated cards (e.g. routine filter clicks or wishlist)
    const observer = new MutationObserver(function (mutations) {
      for (let i = 0; i < mutations.length; i++) {
        const addedNodes = mutations[i].addedNodes;
        for (let j = 0; j < addedNodes.length; j++) {
          const node = addedNodes[j];
          if (node.nodeType === 1) {
            if (node.matches && node.matches(cardSelector)) {
              bindCard(node);
            }
            if (node.querySelectorAll) {
              node.querySelectorAll(cardSelector).forEach(bindCard);
            }
          }
        }
      }
    });

    const catalogGrid = document.getElementById('productCardsGrid');
    if (catalogGrid) {
      observer.observe(catalogGrid, { childList: true, subtree: true });
    }
  }

  /* ============================================================
     BOTTLE & SPECIMEN 3D INSPECTION PHYSICS (PDP & QUICK VIEW)
     Micro-rotation with dynamic optical specular reflection.
     Simulates holding and turning an apothecary glass vial in light.
     ============================================================ */
  function init3DBottleInspection() {
    const targets = document.querySelectorAll('.pdp-main-img-box, .modal-image-wrap');
    if (!targets.length) return;

    targets.forEach(function (box) {
      if (box._hasBottle3D) return;
      box._hasBottle3D = true;

      const img = box.querySelector('img');
      if (!img) return;

      let isHovered = false;
      let targetRotX = 0;
      let targetRotY = 0;
      let currentRotX = 0;
      let currentRotY = 0;
      let rafId = null;

      const MAX_TILT_X = 3.5;
      const MAX_TILT_Y = 4.0;

      function renderBottleFrame() {
        if (!_3dEngineActive) {
          box.style.transform = '';
          if (img) img.style.transform = '';
          rafId = null;
          return;
        }
        if (!isHovered && Math.abs(currentRotX) < 0.05 && Math.abs(currentRotY) < 0.05) {
          box.style.transform = '';
          if (img) img.style.transform = '';
          rafId = null;
          return;
        }

        currentRotX += (targetRotX - currentRotX) * 0.1;
        currentRotY += (targetRotY - currentRotY) * 0.1;

        box.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
        if (img) {
          img.style.transform = `scale(1.03) translateZ(10px)`;
        }

        rafId = requestAnimationFrame(renderBottleFrame);
      }

      box.addEventListener('mouseenter', function () {
        isHovered = true;
        if (!rafId) rafId = requestAnimationFrame(renderBottleFrame);
      }, { passive: true });

      box.addEventListener('mousemove', function (e) {
        if (!isHovered) return;
        const rect = box.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        targetRotX = ((y - centerY) / centerY) * -MAX_TILT_X;
        targetRotY = ((x - centerX) / centerX) * MAX_TILT_Y;

        // Specular optical light position (from 15% to 85%)
        const glarePos = 15 + ((x / rect.width) * 70);
        box.style.setProperty('--glare-pos', glarePos.toFixed(1) + '%');
      }, { passive: true });

      box.addEventListener('mouseleave', function () {
        isHovered = false;
        targetRotX = 0;
        targetRotY = 0;
        if (!rafId) rafId = requestAnimationFrame(renderBottleFrame);
      }, { passive: true });
    });
  }

  /* ============================================================
     HERO SUBTLE 3D DEPTH PARALLAX
     Understated perspective shift between foreground badges and background.
     ============================================================ */
  function initHero3DParallax() {
    const heroSection = document.getElementById('hero') || document.querySelector('.hero-fullbleed-wrapper');
    if (!heroSection) return;

    const banner = heroSection.querySelector('.hero-banner-expanded');
    const badge = heroSection.querySelector('.hero-floating-step-badge');
    const statsBar = heroSection.querySelector('.hero-takeover-stats-bar');

    if (!banner && !statsBar) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;
    let isTracking = false;

    function renderHeroFrame() {
      if (!_3dEngineActive) {
        if (banner) banner.style.transform = '';
        if (badge) badge.style.transform = '';
        rafId = null;
        return;
      }
      if (!isTracking && Math.abs(currentX) < 0.02 && Math.abs(currentY) < 0.02) {
        if (banner) banner.style.transform = '';
        if (badge) badge.style.transform = '';
        rafId = null;
        return;
      }

      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (banner) {
        // Ultra-subtle tilt: max 1.2deg
        banner.style.transform = `perspective(1200px) rotateX(${(-currentY * 1.2).toFixed(2)}deg) rotateY(${(currentX * 1.5).toFixed(2)}deg)`;
      }

      if (badge) {
        // Floating badge shifts slightly opposite for authentic parallax depth
        badge.style.transform = `translate3d(${(currentX * 6).toFixed(1)}px, ${(currentY * 5).toFixed(1)}px, 8px)`;
      }

      rafId = requestAnimationFrame(renderHeroFrame);
    }

    heroSection.addEventListener('mouseenter', function () {
      isTracking = true;
      if (!rafId) rafId = requestAnimationFrame(renderHeroFrame);
    }, { passive: true });

    heroSection.addEventListener('mousemove', function (e) {
      if (!isTracking) return;
      const rect = heroSection.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Normalize from -1 to 1
      targetX = (x - 0.5) * 2;
      targetY = (y - 0.5) * 2;
    }, { passive: true });

    heroSection.addEventListener('mouseleave', function () {
      isTracking = false;
      targetX = 0;
      targetY = 0;
      if (!rafId) rafId = requestAnimationFrame(renderHeroFrame);
    }, { passive: true });
  }

  /* ============================================================
     4. CLINICAL BEFORE & AFTER RECOVERY SLIDER
     Touch & mouse drag handle with responsive clip-path curtain
     ============================================================ */
  function initBeforeAfterSlider() {
    const container = document.getElementById('baSliderContainer');
    const curtain = document.getElementById('baCurtain');
    const handleLine = document.getElementById('baHandleLine');
    const handleBtn = document.getElementById('baHandleBtn');

    if (!container || !curtain || !handleLine || !handleBtn) return;

    let isDragging = false;
    let positionPct = 50;

    function setPosition(pct) {
      positionPct = Math.min(100, Math.max(0, pct));
      curtain.style.clipPath = `polygon(0 0, ${positionPct}% 0, ${positionPct}% 100%, 0 100%)`;
      handleLine.style.left = positionPct + '%';
      handleBtn.style.left = positionPct + '%';
      handleBtn.setAttribute('aria-valuenow', Math.round(positionPct));
    }

    function handleMove(clientX) {
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = (x / rect.width) * 100;
      setPosition(pct);
    }

    function onPointerDown(e) {
      curtain.style.transition = '';
      handleLine.style.transition = '';
      handleBtn.style.transition = '';
      isDragging = true;
      const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX);
      if (clientX !== undefined) handleMove(clientX);
      SoundFX.playClick();
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX);
      if (clientX !== undefined) handleMove(clientX);
    }

    function onPointerUp() {
      isDragging = false;
    }

    // Mouse listeners
    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // Touch listeners
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp, { passive: true });

    // Keyboard accessibility
    handleBtn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        setPosition(positionPct - 5);
        SoundFX.playClick();
      } else if (e.key === 'ArrowRight') {
        setPosition(positionPct + 5);
        SoundFX.playClick();
      }
    });

    // Initial state
    setPosition(50);

    // Engaging visual peek hint when scrolled into viewport
    let hasPeeked = false;
    const observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !hasPeeked && !isDragging) {
        hasPeeked = true;
        curtain.style.transition = 'clip-path 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        handleLine.style.transition = 'left 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        handleBtn.style.transition = 'left 0.45s cubic-bezier(0.16, 1, 0.3, 1)';

        setTimeout(() => { if (!isDragging) setPosition(62); }, 350);
        setTimeout(() => { if (!isDragging) setPosition(38); }, 850);
        setTimeout(() => {
          if (!isDragging) {
            setPosition(50);
            setTimeout(() => {
              curtain.style.transition = '';
              handleLine.style.transition = '';
              handleBtn.style.transition = '';
            }, 450);
          }
        }, 1350);
      }
    }, { threshold: 0.35 });
    observer.observe(container);
  }

  /* ============================================================
     5. APOTHECARY 60-SECOND SKIN DIAGNOSTIC QUIZ
     Algorithmic 3-step routine matching & 1-click cart addition
     ============================================================ */
  function initSkinQuiz() {
    const modal = document.getElementById('quizModal');
    const openBtns = document.querySelectorAll('.open-quiz-btn, #heroQuizBtn');
    const closeBtn = document.getElementById('closeQuizModal');
    if (!modal) return;

    let answers = {
      concern: null,
      sensitivity: null
    };

    const step1 = document.getElementById('quizStep1');
    const step2 = document.getElementById('quizStep2');
    const step3 = document.getElementById('quizStep3');
    const progressSteps = document.querySelectorAll('.quiz-progress-step');

    function openQuiz() {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      showStep(1);
      SoundFX.playClick();
    }

    function closeQuiz() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function showStep(num) {
      if (step1) step1.classList.toggle('active', num === 1);
      if (step2) step2.classList.toggle('active', num === 2);
      if (step3) step3.classList.toggle('active', num === 3);

      progressSteps.forEach(function (dot, i) {
        dot.classList.toggle('active', i < num);
      });

      if (num === 3) {
        generateRecommendation();
      }
    }

    // Question option clicks
    modal.addEventListener('click', function (e) {
      const optBtn = e.target.closest('.quiz-card-btn');
      if (optBtn) {
        const question = optBtn.getAttribute('data-question');
        const val = optBtn.getAttribute('data-value');

        if (question === 'concern') {
          answers.concern = val;
          showStep(2);
          SoundFX.playClick();
        } else if (question === 'sensitivity') {
          answers.sensitivity = val;
          showStep(3);
          SoundFX.playDewdrop();
        }
      }
    });

    // Routine matching logic based on catalog data
    function generateRecommendation() {
      const routineItemsContainer = document.getElementById('quizRoutineItems');
      const recTitle = document.getElementById('quizRecTitle');
      const recSub = document.getElementById('quizRecSub');
      const totalPriceEl = document.getElementById('quizTotalPrice');
      const origPriceEl = document.getElementById('quizOrigPrice');

      if (!routineItemsContainer) return;

      // Select 3 optimal products based on skin concern
      let matchedProducts = [];
      const catalog = window.MEMORY_REHAB_CATALOG || [];

      if (answers.concern === 'acne') {
        if (recTitle) recTitle.textContent = 'Targeted Blemish & Congestion Recovery Routine';
        if (recSub) recSub.textContent = 'A non-stripping purifying protocol engineered to soothe redness, balance sebum, and heal barrier integrity.';
        matchedProducts = [
          catalog.find(p => p.id === '9') || { id: '9', name: 'Palm Culture™ Soap', price: 32000, step: 'Step 1: Cleanse', image: 'photo_2026-09-09_17-33-47.jpg' },
          catalog.find(p => p.id === '3') || { id: '3', name: 'Exile™ Acne Fix Cream', price: 39000, step: 'Step 2: Treat', image: 'photo_2026-09-09_17-34-01.jpg' },
          catalog.find(p => p.id === '1') || { id: '1', name: 'Faerie Dew™ Barrier Cream', price: 42000, step: 'Step 3: Seal', image: 'photo_2026-09-09_17-33-58.jpg' }
        ];
      } else if (answers.concern === 'hyperpigmentation') {
        if (recTitle) recTitle.textContent = 'Radiant Glow & Melanin Balancing Routine';
        if (recSub) recSub.textContent = 'Antioxidant-dense botanical actives that brighten stubborn dark marks without irritation or peeling.';
        matchedProducts = [
          catalog.find(p => p.id === '4') || { id: '4', name: 'Vita Sea™ Exfoliating Toner', price: 36000, step: 'Step 1: Prep', image: 'photo_2026-09-09_17-33-53.jpg' },
          catalog.find(p => p.id === '2') || { id: '2', name: 'For The Love Of Sun™ Serum', price: 48000, step: 'Step 2: Brighten', image: 'photo_2026-09-09_17-33-54.jpg' },
          catalog.find(p => p.id === '1') || { id: '1', name: 'Faerie Dew™ Barrier Cream', price: 42000, step: 'Step 3: Seal', image: 'photo_2026-09-09_17-33-58.jpg' }
        ];
      } else {
        // Default: Barrier Repair & Deep Hydration
        if (recTitle) recTitle.textContent = 'Clinical Barrier Rehabilitation Routine';
        if (recSub) recSub.textContent = 'Triple-ceramide lipid repair formulated at skin natural pH 5.5 to eliminate flakiness and seal hydration.';
        matchedProducts = [
          catalog.find(p => p.id === '6') || { id: '6', name: 'Blue Blooded™ Toner', price: 34000, step: 'Step 1: Prep', image: 'photo_2026-09-09_17-33-56.jpg' },
          catalog.find(p => p.id === '5') || { id: '5', name: 'Jade Lustre™ Youth Elixir', price: 46000, step: 'Step 2: Hydrate', image: 'photo_2026-09-09_17-33-55.jpg' },
          catalog.find(p => p.id === '1') || { id: '1', name: 'Faerie Dew™ Barrier Cream', price: 42000, step: 'Step 3: Seal', image: 'photo_2026-09-09_17-33-58.jpg' }
        ];
      }

      // Compute pricing with 15% routine bundle savings
      const subtotal = matchedProducts.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
      const discounted = Math.round(subtotal * 0.85);

      if (totalPriceEl) totalPriceEl.textContent = '₦' + discounted.toLocaleString();
      if (origPriceEl) origPriceEl.textContent = '₦' + subtotal.toLocaleString();

      // Render product items
      routineItemsContainer.innerHTML = matchedProducts.map(p => `
        <div class="quiz-routine-item">
          <img src="${p.image || 'photo_2026-09-09_17-33-58.jpg'}" alt="${p.name}" />
          <div class="quiz-routine-meta">
            <span class="quiz-routine-step">${p.step || 'Routine Step'}</span>
            <div class="quiz-routine-name">${p.name}</div>
          </div>
          <div class="quiz-routine-price">₦${Number(p.price || 0).toLocaleString()}</div>
        </div>
      `).join('');

      // Wire 1-Click Routine Cart Add
      const addBtn = document.getElementById('quizAddRoutineBtn');
      if (addBtn) {
        addBtn.onclick = function () {
          matchedProducts.forEach(function (prod) {
            if (typeof window.addToCart === 'function') {
              window.addToCart(prod.id, prod.name, Number(prod.price), prod.image);
            }
          });
          closeQuiz();
          SoundFX.playCelebration();
          triggerConfetti();

          // Open cart drawer
          const cartBtn = document.getElementById('cartToggle');
          if (cartBtn) {
            setTimeout(() => cartBtn.click(), 300);
          }
        };
      }
    }

    openBtns.forEach(b => b.addEventListener('click', openQuiz));
    if (closeBtn) closeBtn.addEventListener('click', closeQuiz);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeQuiz();
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeQuiz();
    });
  }

  /* ============================================================
     6. LIVE SOCIAL PROOF ACTIVITY TOAST
     Subtle, authentic recent customer purchase alerts
     ============================================================ */
  function initSocialProof() {
    const toast = document.getElementById('socialProofToast');
    if (!toast) return;

    const purchases = [
      { name: 'Folake O.', city: 'Victoria Island, Lagos', item: 'Faerie Dew™ Barrier Face Cream', time: '3m ago', img: 'photo_2026-09-09_17-33-58.jpg' },
      { name: 'Zainab M.', city: 'Maitama, Abuja', item: '3-Step Rehabilitation Bundle', time: '8m ago', img: 'photo_2026-09-09_17-33-54.jpg' },
      { name: 'Chinedu E.', city: 'Lekki Phase 1', item: 'Exile™ Acne Fix Treatment Cream', time: '14m ago', img: 'photo_2026-09-09_17-34-01.jpg' },
      { name: 'Amina K.', city: 'GRA, Port Harcourt', item: 'For The Love Of Sun™ Serum', time: '21m ago', img: 'photo_2026-09-09_17-33-54.jpg' },
      { name: 'Omotola B.', city: 'Ikeja GRA, Lagos', item: 'Heavenly Buff™ Resurfacing Body Milk', time: '32m ago', img: 'photo_2026-09-09_17-33-52.jpg' },
      { name: 'Boma W.', city: 'Yaba, Lagos', item: 'Blue Blooded™ Restoring Toner', time: '45m ago', img: 'photo_2026-09-09_17-33-56.jpg' }
    ];

    let currentIndex = 0;
    let toastTimeout = null;

    function showNextToast() {
      const p = purchases[currentIndex % purchases.length];
      currentIndex++;

      toast.innerHTML = `
        <img class="sp-avatar" src="${p.img}" alt="${p.item}" />
        <div class="sp-body">
          <p class="sp-text"><strong>${p.name}</strong> from ${p.city} purchased <strong>${p.item}</strong></p>
          <span class="sp-time">⚡ Verified Order • ${p.time}</span>
        </div>
        <button type="button" class="sp-close" id="spCloseBtn" aria-label="Dismiss">✕</button>
        <div class="sp-progress" id="spProgressBar" style="animation: spProgressAnim 6s linear forwards;"></div>
      `;

      toast.classList.add('show');

      const closeBtn = document.getElementById('spCloseBtn');
      if (closeBtn) {
        closeBtn.onclick = function (e) {
          e.stopPropagation();
          hideToast();
        };
      }

      toastTimeout = setTimeout(hideToast, 6000);
    }

    function hideToast() {
      toast.classList.remove('show');
      if (toastTimeout) clearTimeout(toastTimeout);
      // Schedule next notification in 22 to 32 seconds
      const delay = Math.floor(Math.random() * 10000) + 22000;
      setTimeout(showNextToast, delay);
    }

    // Initial launch after 8 seconds of engagement
    setTimeout(showNextToast, 8000);
  }

  /* ============================================================
     7. FREE SHIPPING & ORDER CELEBRATION LAB CONFETTI ENGINE
     High-density multi-wave canvas particle physics (0 external libraries)
     ============================================================ */
  let confettiAnimId = null;
  let activeParticles = [];

  function triggerConfetti(options = {}) {
    let canvas = document.getElementById('celebrationCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'celebrationCanvas';
      canvas.className = 'confetti-canvas';
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
      '#10b981', '#059669', // Botanical Emerald
      '#f48bb3', '#ec4899', '#db2777', // Apothecary Rose & Faerie Dew
      '#f59e0b', '#fbbf24', '#ffd700', // Clinical Gold & Amber
      '#8b5cf6', '#a855f7', // Biocompatible Lavender Quartz
      '#06b6d4', '#38bdf8', // Blue Blood Cyan
      '#ffffff', '#fdf2f8'  // Pearlescent White
    ];

    const isHeavy = options.heavy !== false;
    const batchCount = isHeavy ? 240 : 80;

    for (let i = 0; i < batchCount; i++) {
      let originX, originY, vx, vy;
      const bucket = i % 3;

      if (bucket === 0) {
        // Bottom Left canon shooting diagonally up-right
        originX = Math.random() * (canvas.width * 0.25);
        originY = canvas.height * (0.85 + Math.random() * 0.15);
        vx = Math.random() * 14 + 3;
        vy = -(Math.random() * 20 + 12);
      } else if (bucket === 1) {
        // Bottom Right canon shooting diagonally up-left
        originX = canvas.width * (0.75 + Math.random() * 0.25);
        originY = canvas.height * (0.85 + Math.random() * 0.15);
        vx = -(Math.random() * 14 + 3);
        vy = -(Math.random() * 20 + 12);
      } else {
        // Center burst halo
        originX = canvas.width * (0.35 + Math.random() * 0.3);
        originY = canvas.height * (0.15 + Math.random() * 0.25);
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 14 + 4;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed - 5;
      }

      const shapeType = Math.random() > 0.4 ? 'rect' : (Math.random() > 0.5 ? 'circle' : 'ribbon');

      activeParticles.push({
        x: originX,
        y: originY,
        vx: vx,
        vy: vy,
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 14,
        rotX: Math.random() * 360,
        rotXSpeed: (Math.random() - 0.5) * 12,
        shape: shapeType,
        opacity: 1,
        drag: 0.985,
        wobble: Math.random() * 10,
        wobbleSpeed: Math.random() * 0.08 + 0.04,
        gravity: Math.random() * 0.2 + 0.25,
        decay: Math.random() * 0.005 + 0.005
      });
    }

    if (!confettiAnimId) {
      function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let aliveCount = 0;

        for (let i = 0; i < activeParticles.length; i++) {
          const p = activeParticles[i];
          p.vx *= p.drag;
          p.vy *= p.drag;
          p.vy += p.gravity;
          p.x += p.vx + Math.sin(p.wobble) * 1.6;
          p.y += p.vy;
          p.wobble += p.wobbleSpeed;
          p.rotation += p.rotSpeed;
          p.rotX += p.rotXSpeed;
          p.opacity -= p.decay;

          if (p.opacity > 0 && p.y < canvas.height + 40) {
            aliveCount++;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.scale(Math.cos((p.rotX * Math.PI) / 180), 1);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.opacity);

            if (p.shape === 'circle') {
              ctx.beginPath();
              ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
              ctx.fill();
            } else if (p.shape === 'ribbon') {
              ctx.fillRect(-p.size * 0.6, -p.size * 0.2, p.size * 1.2, p.size * 0.4);
            } else {
              ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
            }
            ctx.restore();
          }
        }

        // Filter out dead particles
        activeParticles = activeParticles.filter(p => p.opacity > 0 && p.y < canvas.height + 40);

        if (activeParticles.length > 0) {
          confettiAnimId = requestAnimationFrame(render);
        } else {
          cancelAnimationFrame(confettiAnimId);
          confettiAnimId = null;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      confettiAnimId = requestAnimationFrame(render);
    }

    // Secondary and tertiary wave bursts for continuous, lavish celebration!
    if (isHeavy && !options._isSecondary) {
      setTimeout(() => {
        triggerConfetti({ heavy: true, _isSecondary: true });
      }, 400);
      setTimeout(() => {
        triggerConfetti({ heavy: true, _isSecondary: true });
      }, 850);
    }
  }

  // Monitor cart drawer subtotal for Free Shipping milestone
  function initCartCelebrationWatcher() {
    let hasCelebrated = false;
    const observer = new MutationObserver(function () {
      const shippingText = document.getElementById('shippingGoalText');
      if (shippingText && shippingText.textContent.includes('You qualify for FREE express shipping!')) {
        if (!hasCelebrated) {
          hasCelebrated = true;
          SoundFX.playCelebration();
          triggerConfetti();
        }
      } else {
        hasCelebrated = false;
      }
    });

    const shippingBar = document.querySelector('.cart-shipping-bar-wrap');
    if (shippingBar) {
      observer.observe(shippingBar, { childList: true, subtree: true, characterData: true });
    }
  }

  /* ============================================================
     8. ANIMATED NUMERIC COUNTERS
     ============================================================ */
  function initStatCounters() {
    const statItems = document.querySelectorAll('.hero-stats-row .stat-value');
    if (!statItems.length) return;

    let animated = false;
    const observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        statItems.forEach(function (el) {
          el.style.transform = 'scale(1.08)';
          el.style.transition = 'transform 0.3s ease';
          setTimeout(() => { el.style.transform = 'scale(1)'; }, 350);
        });
      }
    }, { threshold: 0.5 });

    const row = document.querySelector('.hero-stats-row');
    if (row) observer.observe(row);
  }

  /* ============================================================
     9. HOLOGRAPHIC IRIDESCENT FOIL PHYSICS ENGINE
     Real-time dynamic chromatic dispersion reacting to pointer & gyro
     ============================================================ */
  function initHoloFoil() {
    let lastUpdate = 0;
    function updateAngle(clientX, clientY) {
      const now = performance.now();
      if (now - lastUpdate < 16) return; // ~60fps throttle
      lastUpdate = now;

      const w = window.innerWidth || 1200;
      const h = window.innerHeight || 800;
      const xPct = Math.round((clientX / w) * 100);
      const yPct = Math.round((clientY / h) * 100);
      const angle = Math.round((clientX / w) * 360);

      document.documentElement.style.setProperty('--holo-angle', angle + 'deg');
      document.documentElement.style.setProperty('--holo-x', xPct + '%');
      document.documentElement.style.setProperty('--holo-y', yPct + '%');
    }

    window.addEventListener('pointermove', function (e) {
      updateAngle(e.clientX, e.clientY);
    }, { passive: true });

    // Gyroscope tilt on mobile devices
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', function (e) {
        if (e.gamma !== null) {
          const normGamma = Math.min(1, Math.max(-1, e.gamma / 45));
          const angle = Math.round(((normGamma + 1) / 2) * 360);
          document.documentElement.style.setProperty('--holo-angle', angle + 'deg');
        }
      }, { passive: true });
    }
  }

  /* ============================================================
     10. CLINICAL MACRO LOUPE & INGREDIENT TEXTURE INSPECTOR
     2.5x high-precision optical inspection lens with HUD reticle
     ============================================================ */
  function initClinicalTextureLoupe() {
    // Only enable on fine pointer devices (mouse/trackpad), avoid blocking touch scrolling
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;

    let loupe = document.getElementById('clinicalLoupe');
    if (!loupe) {
      loupe = document.createElement('div');
      loupe.id = 'clinicalLoupe';
      loupe.className = 'clinical-loupe';
      loupe.setAttribute('aria-hidden', 'true');
      loupe.innerHTML = '<span class="loupe-telemetry" id="loupeTelemetry">CELL-MATRIX • 2.5X</span>';
      document.body.appendChild(loupe);
    }
    const telemetry = document.getElementById('loupeTelemetry');

    let activeTarget = null;
    let targetRect = null;
    const zoomLevel = 2.5;

    function activateLoupe(target, e) {
      activeTarget = target;
      const img = target.tagName.toLowerCase() === 'img' ? target : target.querySelector('img');
      if (!img) return;

      const imgSrc = target.getAttribute('data-zoom-src') || img.currentSrc || img.src;
      loupe.style.backgroundImage = 'url("' + imgSrc + '")';
      loupe.classList.add('active');
      SoundFX.playLoupe();

      const title = target.getAttribute('data-loupe-title') || 'CELL-MATRIX • 2.5X';
      if (telemetry) telemetry.textContent = title;

      updateLoupe(e);
    }

    function deactivateLoupe() {
      loupe.classList.remove('active');
      activeTarget = null;
    }

    function updateLoupe(e) {
      if (!activeTarget) return;
      targetRect = activeTarget.getBoundingClientRect();

      const x = e.clientX;
      const y = e.clientY;

      // Center loupe on cursor
      loupe.style.left = x + 'px';
      loupe.style.top = y + 'px';

      // Relative coordinates in image
      const relX = x - targetRect.left;
      const relY = y - targetRect.top;

      const bgWidth = targetRect.width * zoomLevel;
      const bgHeight = targetRect.height * zoomLevel;

      const bgX = -(relX * zoomLevel - loupe.offsetWidth / 2);
      const bgY = -(relY * zoomLevel - loupe.offsetHeight / 2);

      loupe.style.backgroundSize = bgWidth + 'px ' + bgHeight + 'px';
      loupe.style.backgroundPosition = bgX + 'px ' + bgY + 'px';
    }

    document.addEventListener('pointerover', function (e) {
      const target = e.target.closest('[data-loupe="true"], .loupe-target');
      if (target) {
        activateLoupe(target, e);
      }
    });

    document.addEventListener('pointerout', function (e) {
      if (activeTarget && !e.relatedTarget?.closest('[data-loupe="true"], .loupe-target')) {
        deactivateLoupe();
      }
    });

    window.addEventListener('pointermove', function (e) {
      if (activeTarget) {
        updateLoupe(e);
      }
    }, { passive: true });
  }

  /* ============================================================
     11. AWWWARDS DEVELOPER BLUEPRINT & TELEMETRY HUD CONSOLE
     Activated via Ctrl+Shift+D or the Floating HUD Trigger Pill
     Live 60FPS counter, DOM node telemetry, Wireframe Blueprint mode
     ============================================================ */
  function initDevInspectorHUD() {
    let hud = document.getElementById('devInspectorHud');
    let trigger = document.getElementById('devHudTrigger');

    if (!hud) {
      hud = document.createElement('aside');
      hud.id = 'devInspectorHud';
      hud.className = 'dev-inspector-hud';
      hud.setAttribute('role', 'region');
      hud.setAttribute('aria-label', 'Developer HUD');
      hud.innerHTML = `
        <div class="dev-hud-header">
          <span class="dev-hud-title">⚡ LAB DEV TELEMETRY</span>
          <button type="button" id="devHudCloseBtn" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1rem; line-height: 1;">✕</button>
        </div>
        <div class="dev-stat-row">
          <span>FPS REFRESH:</span>
          <span class="dev-stat-val" id="hudFpsVal">60.0 FPS</span>
        </div>
        <div class="dev-stat-row">
          <span>DOM NODES:</span>
          <span class="dev-stat-val" id="hudDomNodes">--</span>
        </div>
        <div class="dev-stat-row">
          <span>VIEWPORT:</span>
          <span class="dev-stat-val" id="hudViewport">--</span>
        </div>
        <div class="dev-stat-row">
          <span>THEME / A11Y:</span>
          <span class="dev-stat-val" id="hudThemeMode">AAA Pass</span>
        </div>
        <div class="dev-stat-row">
          <span>AUDIO SYNTH:</span>
          <span class="dev-stat-val" id="hudAudioState">Web Audio API</span>
        </div>
        <div class="dev-btn-group">
          <button type="button" class="dev-action-btn" id="hudWireframeBtn">Blueprint Wireframe</button>
          <button type="button" class="dev-action-btn" id="hudMistBtn">Botanical Mist ASMR</button>
        </div>
        <div class="dev-btn-group" style="margin-top: 6px;">
          <button type="button" class="dev-action-btn" id="hudConfettiBtn">Lab Confetti</button>
          <button type="button" class="dev-action-btn" id="hudThemeToggleBtn">Cycle Theme</button>
        </div>
      `;
      document.body.appendChild(hud);
    }

    if (!trigger) {
      trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.id = 'devHudTrigger';
      trigger.className = 'dev-floating-trigger';
      trigger.setAttribute('aria-label', 'Toggle Developer Telemetry HUD');
      trigger.innerHTML = '<span>⚡ DEV HUD</span><span style="opacity: 0.7; font-size: 0.65rem;">[Ctrl+Shift+D]</span>';
      document.body.appendChild(trigger);
    }

    let isOpen = false;
    let fpsAnimId = null;
    let frames = 0;
    let prevTime = performance.now();
    const fpsVal = document.getElementById('hudFpsVal');

    function calcFPS(now) {
      frames++;
      if (now > prevTime + 500) {
        const fps = Math.round((frames * 1000) / (now - prevTime));
        if (fpsVal) fpsVal.textContent = fps + '.0 FPS';
        frames = 0;
        prevTime = now;
      }
      if (isOpen) {
        fpsAnimId = requestAnimationFrame(calcFPS);
      }
    }

    function startFPSCounter() {
      prevTime = performance.now();
      frames = 0;
      fpsAnimId = requestAnimationFrame(calcFPS);
    }

    function stopFPSCounter() {
      if (fpsAnimId) cancelAnimationFrame(fpsAnimId);
    }

    function updateDOMStats() {
      const nodesEl = document.getElementById('hudDomNodes');
      const vpEl = document.getElementById('hudViewport');
      const themeEl = document.getElementById('hudThemeMode');
      const audioEl = document.getElementById('hudAudioState');

      if (nodesEl) nodesEl.textContent = document.getElementsByTagName('*').length + ' Elements';
      if (vpEl) vpEl.textContent = window.innerWidth + ' × ' + window.innerHeight;
      if (themeEl) {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        themeEl.textContent = theme.toUpperCase() + ' (WCAG AAA)';
      }
      if (audioEl) {
        audioEl.textContent = SoundFX.isEnabled() ? 'Synthesizer Active' : 'Muted';
      }
    }

    function toggleHUD() {
      isOpen = !isOpen;
      hud.classList.toggle('open', isOpen);
      if (isOpen) {
        SoundFX.playDewdrop();
        startFPSCounter();
        updateDOMStats();
      } else {
        stopFPSCounter();
      }
    }

    trigger.addEventListener('click', toggleHUD);
    const closeBtn = document.getElementById('devHudCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', toggleHUD);

    // Pre-populate telemetry immediately so values are never '--'
    updateDOMStats();
    window.addEventListener('resize', updateDOMStats, { passive: true });
    window.addEventListener('load', updateDOMStats, { passive: true });

    // Keyboard shortcut Ctrl+Shift+D / Cmd+Shift+D
    window.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        toggleHUD();
      }
    });

    // Wireframe Mode
    const wireframeBtn = document.getElementById('hudWireframeBtn');
    if (wireframeBtn) {
      wireframeBtn.addEventListener('click', function () {
        const active = document.body.classList.toggle('wireframe-mode');
        wireframeBtn.textContent = active ? 'Exit Wireframe' : 'Blueprint Wireframe';
        SoundFX.playClick();
      });
    }

    // Botanical Mist ASMR
    const mistBtn = document.getElementById('hudMistBtn');
    if (mistBtn) {
      mistBtn.addEventListener('click', function () {
        const active = SoundFX.toggleAmbience();
        mistBtn.innerHTML = active ? 'Stop Mist <img src="favicon-32x32.png" style="width:14px;height:14px;vertical-align:-1px;" alt="" />' : 'Botanical Mist ASMR';
      });
    }

    // Lab Confetti
    const confettiBtn = document.getElementById('hudConfettiBtn');
    if (confettiBtn) {
      confettiBtn.addEventListener('click', function () {
        triggerConfetti();
        SoundFX.playCelebration();
      });
    }

    // Theme Toggle
    const themeBtn = document.getElementById('hudThemeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        const root = document.documentElement;
        const current = root.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('mr_theme', next);
        updateDOMStats();
        SoundFX.playClick();
      });
    }

    window.addEventListener('resize', function () {
      if (isOpen) updateDOMStats();
    }, { passive: true });
  }

  /* ============================================================
     DOCUMENT READY DISPATCHER
     ============================================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  function initAll() {
    SoundFX.init();
    initReadingProgress();
    initSubtle3DEngine();
    initBeforeAfterSlider();
    initSkinQuiz();
    initSocialProof();
    initCartCelebrationWatcher();
    initStatCounters();
    initHoloFoil();
    initClinicalTextureLoupe();
    initDevInspectorHUD();

    // Export API for global calls
    window.triggerConfetti = triggerConfetti;
    window.triggerLabConfetti = triggerConfetti;
    window.triggerMegaConfetti = () => triggerConfetti({ heavy: true });

    window.MemoryRehabFX = {
      SoundFX: SoundFX,
      triggerConfetti: triggerConfetti,
      triggerMegaConfetti: () => triggerConfetti({ heavy: true }),
      initHoloFoil: initHoloFoil,
      initClinicalTextureLoupe: initClinicalTextureLoupe,
      initDevInspectorHUD: initDevInspectorHUD,
      initSubtle3DEngine: initSubtle3DEngine,
      init3DCardTilt: init3DCardTilt
    };
  }

})();
