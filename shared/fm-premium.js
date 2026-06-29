/**
 * FOODME Premium — motion, skeleton, toast, boot helpers
 */
(function (global) {
  var LOGIN_BTN = '登入 · 开始做生意 →';

  global.FMPremium = global.FMPremium || {};

  global.FMPremium.loginBtnText = LOGIN_BTN;

  global.FMPremium.haptic = function (ms) {
    try { if (navigator.vibrate) navigator.vibrate(ms || 12); } catch (e) {}
  };

  global.FMPremium.skeleton = function (kind) {
    var bar = function (w, h) {
      return '<div class="fm-skeleton" style="width:' + w + ';height:' + (h || '14px') + '"></div>';
    };
    if (kind === 'kpi2') {
      return '<div class="fm-skel-row">' + bar('100%', '48px') + bar('100%', '48px') + '</div>';
    }
    if (kind === 'orders') {
      var s = '';
      for (var i = 0; i < 3; i++) {
        s += '<div class="fm-skel-card">' + bar('55%', '16px') + bar('90%', '12px') + bar('70%', '12px') + bar('40%', '20px') + '</div>';
      }
      return s;
    }
    if (kind === 'menu') {
      var m = '';
      for (var j = 0; j < 4; j++) {
        m += '<div class="fm-skel-dish"><div class="fm-skeleton fm-skel-pic"></div><div class="fm-skel-dish-info">' + bar('72%', '16px') + bar('45%', '12px') + bar('30%', '18px') + '</div></div>';
      }
      return m;
    }
    if (kind === 'dash') {
      return '<div class="fm-skel-dash">' + bar('100%', '72px') + '<div class="fm-skel-row">' + bar('48%', '64px') + bar('48%', '64px') + '</div></div>';
    }
    if (kind === 'panel-kpi') {
      var p = '';
      for (var k = 0; k < 4; k++) {
        p += '<div class="fm-skel-kpi">' + bar('60%', '11px') + bar('80%', '28px') + bar('50%', '10px') + '</div>';
      }
      return '<div class="fm-skel-kpi-grid">' + p + '</div>';
    }
    return bar('100%', '20px');
  };

  global.FMPremium.emptyState = function (icon, title, desc, actionHtml) {
    return '<div class="fm-empty">' +
      '<span class="fm-empty-ic">' + (icon || '📭') + '</span>' +
      '<b class="fm-empty-t">' + title + '</b>' +
      (desc ? '<p class="fm-empty-d">' + desc + '</p>' : '') +
      (actionHtml || '') +
      '</div>';
  };

  global.FMPremium.animateMoney = function (selector, duration) {
    duration = duration || 900;
    document.querySelectorAll(selector || '.hero-net .big, .io-card .v, .kpi .v').forEach(function (el) {
      if (document.documentElement.classList.contains('fm-reduced-motion')) return;
      var raw = (el.textContent || '').replace(/[^\d.-]/g, '');
      var target = parseFloat(raw);
      if (isNaN(target) || target === 0) return;
      var isRM = (el.textContent || '').indexOf('RM') >= 0;
      var t0 = performance.now();
      function step(t) {
        var p = Math.min((t - t0) / duration, 1);
        p = 1 - Math.pow(1 - p, 3);
        var v = target * p;
        if (isRM) {
          el.textContent = 'RM ' + (target % 1 ? v.toFixed(2) : Math.round(v).toLocaleString());
        } else {
          el.textContent = Math.round(v).toLocaleString();
        }
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  };

  global.FMPremium.stagger = function (root, sel, delayStep) {
    if (document.documentElement.classList.contains('fm-reduced-motion')) return;
    var box = typeof root === 'string' ? document.querySelector(root) : root;
    if (!box) return;
    var items = box.querySelectorAll(sel || ':scope > *');
    delayStep = delayStep == null ? 0.06 : delayStep;
    items.forEach(function (el, i) {
      el.classList.remove('fm-stagger-in');
      void el.offsetWidth;
      el.style.animationDelay = (i * delayStep) + 's';
      el.classList.add('fm-stagger-in');
    });
  };

  global.FMPremium.cartBounce = function () {
    var cc = document.getElementById('c-cart-count');
    var cb = document.getElementById('cartbar');
    var ccb = document.getElementById('c-cartbar');
    [cc, cb, ccb].forEach(function (el) {
      if (!el) return;
      el.classList.remove('fm-cart-bounce');
      void el.offsetWidth;
      el.classList.add('fm-cart-bounce');
    });
    global.FMPremium.haptic(8);
  };

  global.FMPremium.flashSuccess = function (el) {
    if (!el) return;
    el.classList.remove('fm-flash-ok');
    void el.offsetWidth;
    el.classList.add('fm-flash-ok');
    global.FMPremium.haptic(10);
  };

  global.FMPremium.toast = function (msg, type) {
    var t = document.getElementById('toast');
    if (!t) return;
    var icon = type === 'err' ? '!' : '✓';
    var iconBg = type === 'err' ? 'var(--fm-red,#EF5350)' : 'var(--fm-green,#16B88A)';
    if (document.documentElement.classList.contains('fm-premium')) {
      t.innerHTML = '<span class="fm-toast-ic" style="background:' + iconBg + '">' + icon + '</span><span class="fm-toast-txt">' + msg + '</span>';
    } else {
      t.textContent = msg;
    }
    t.classList.remove('show', 'fm-toast-err');
    void t.offsetWidth;
    if (type === 'err') t.classList.add('fm-toast-err');
    t.classList.add('show');
    clearTimeout(t._t);
    t._t = setTimeout(function () { t.classList.remove('show', 'fm-toast-err'); }, 2400);
  };

  global.FMPremium.bindLoginEnter = function (passId, fn) {
    var p = document.getElementById(passId);
    if (!p || p._fmEnter) return;
    p._fmEnter = true;
    p.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); fn(); }
    });
  };

  global.FMPremium.restoreLoginBtn = function (sel) {
    var btn = document.querySelector(sel || '#cloud-login button');
    if (btn) {
      btn.disabled = false;
      btn.textContent = LOGIN_BTN;
      btn.style.opacity = '1';
    }
  };

  global.FMPremium.boot = function () {
    global.FMPremium.bindLoginEnter('cl-pass', function () {
      if (typeof cloudLogin === 'function') cloudLogin();
    });
    global.FMPremium.bindLoginEnter('ad-pass', function () {
      if (typeof loginAdmin === 'function') loginAdmin();
    });
    global.FMPremium.bindLoginEnter('tm-pass', function () {
      if (typeof loginTeam === 'function') loginTeam();
    });
    var cart = document.getElementById('cartbar');
    if (cart && !cart._fmKey) {
      cart._fmKey = true;
      cart.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (typeof openReview === 'function') openReview(); }
      });
    }
    var cCart = document.getElementById('c-cartbar');
    if (cCart && !cCart._fmKey) {
      cCart._fmKey = true;
      cCart.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (typeof openReview === 'function') openReview(); }
      });
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('fm-reduced-motion');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', global.FMPremium.boot);
  } else {
    global.FMPremium.boot();
  }
})(window);
