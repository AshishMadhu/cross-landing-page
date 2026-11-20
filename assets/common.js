/* RailwayCross landing pages: shared behaviour.
   - theme toggle (light / dark / system, remembered)
   - icon + logo injection
   - the crossing scene and the phone screen mocks
   - the Open -> Closing -> Closed demo cycle that drives every [data-demo] root
   Illustrative content only; crossing and train names are samples, not live data. */
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var KEY = 'rc-theme';

  /* ---------- theme ---------- */
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  var q = (location.search.match(/[?&]theme=(light|dark)/) || [])[1];
  var pref = q || stored();
  if (pref === 'light' || pref === 'dark') doc.setAttribute('data-theme', pref);
  else if (doc.getAttribute('data-default-theme')) doc.setAttribute('data-theme', doc.getAttribute('data-default-theme'));
  function effective() {
    var t = doc.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  var RC = (window.RC = {});

  /* ---------- icons ---------- */
  var I = {
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    train: '<path d="M7 3h10a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z"/><path d="M4 11h16M8 21l2-3M16 21l-2-3"/><circle cx="8.5" cy="14.5" r=".6"/><circle cx="15.5" cy="14.5" r=".6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    map: '<path d="M9 4 3 6.5v13L9 17l6 3 6-2.5v-13L15 7z"/><path d="M9 4v13M15 7v13"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    nav: '<path d="M3 11l18-8-8 18-2-8z"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    bell: '<path d="M6 16v-5a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
    home: '<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v17H6a2 2 0 0 0-2 2z"/><path d="M4 5v17"/>',
    code: '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    download: '<path d="M12 4v12M7 11l5 5 5-5M5 20h14"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    signal: '<circle cx="12" cy="6" r="2.4"/><circle cx="12" cy="12" r="2.4"/><circle cx="12" cy="18" r="2.4"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
    layers: '<path d="M12 3 3 8l9 5 9-5z"/><path d="M3 13l9 5 9-5"/>',
    wifi: '<path d="M3 9a14 14 0 0 1 18 0M6 12.5a9 9 0 0 1 12 0M9 16a4.5 4.5 0 0 1 6 0"/><circle cx="12" cy="19" r=".8"/>',
    hand: '<path d="M7 11V6a1.6 1.6 0 0 1 3.2 0v4M10.2 10V4.6a1.6 1.6 0 0 1 3.2 0V10M13.4 10V5.8a1.6 1.6 0 0 1 3.2 0V12M16.6 9.6a1.6 1.6 0 0 1 3.2 0V14a7 7 0 0 1-7 7h-1.2A6 6 0 0 1 6 17.5L4 13.5a1.6 1.6 0 0 1 2.7-1.7L7 12.2"/>'
  };
  RC.icon = function (n, s) {
    s = s || 20;
    return '<svg class="ic" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (I[n] || '') + '</svg>';
  };

  /* The real app icon (same artwork as the web app favicon). */
  RC.logo = function (s) {
    return '<img src="assets/logo.png" width="' + s + '" height="' + s + '" alt="" style="border-radius:' + Math.round(s * 0.28) + 'px;display:block">';
  };

  /* ---------- crossing scene ---------- */
  RC.scene = function () {
    var s = '';
    for (var x = 4; x < 360; x += 18) s += '<rect class="sc-sleeper" x="' + x + '" y="98" width="9" height="5" rx="1"/>';
    return '<svg class="scene" viewBox="0 0 360 130" aria-hidden="true">' +
      '<rect class="sc-ballast" x="-20" y="97" width="400" height="7"/>' + s +
      '<rect class="sc-rail" x="-20" y="94" width="400" height="3" rx="1.5"/>' +
      '<rect class="sc-road" x="-20" y="108" width="400" height="22"/>' +
      '<g>' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(function (i) { return '<rect class="sc-dash" x="' + (i * 22 - 8) + '" y="118" width="11" height="2" rx="1"/>'; }).join('') + '</g>' +
      /* train, drawn right-to-left so the engine leads */
      '<g class="sc-train">' +
        coach(0) + coach(74) +
        '<g transform="translate(150 0)"><rect x="0" y="66" width="62" height="28" rx="6" fill="#fff"/><rect x="40" y="58" width="22" height="36" rx="5" fill="#fff"/><rect x="46" y="64" width="11" height="10" rx="2.5" fill="rgba(0,0,0,.3)"/><rect x="6" y="72" width="9" height="9" rx="2" fill="rgba(0,0,0,.28)"/><rect x="20" y="72" width="9" height="9" rx="2" fill="rgba(0,0,0,.28)"/><rect x="0" y="86" width="62" height="3" fill="#FFB020"/><circle cx="12" cy="95" r="4" fill="#1B2236"/><circle cx="48" cy="95" r="4" fill="#1B2236"/></g>' +
      '</g>' +
      /* waiting / passing car */
      '<g class="sc-car"><rect x="0" y="108" width="40" height="12" rx="4" fill="#fff" opacity=".95"/><path d="M9 108l5-8h14l5 8z" fill="#fff" opacity=".95"/><path d="M14 108l3-6h4v6zM23 108v-6h4l3 6z" fill="rgba(0,0,0,.3)"/><circle cx="10" cy="121" r="4" fill="#1B2236"/><circle cx="30" cy="121" r="4" fill="#1B2236"/><rect x="38" y="111" width="3" height="3" rx="1" fill="#FFD25A"/></g>' +
      /* gate mast + barrier arm, and a separate signal mast so a raised arm never overlaps the lamps */
      '<rect class="sc-mast" x="259" y="78" width="6" height="31" rx="2"/>' +
      '<rect class="sc-mast" x="299" y="46" width="4" height="63"/><rect class="sc-head" x="289" y="22" width="24" height="26" rx="6"/>' +
      '<circle class="sc-lamp a" cx="296" cy="35" r="4.6"/><circle class="sc-lamp b" cx="306" cy="35" r="4.6"/>' +
      '<g class="sc-arm"><rect class="sc-armbody" x="192" y="75" width="70" height="6" rx="3"/>' +
        [0, 1, 2].map(function (i) { return '<rect class="sc-stripe" x="' + (198 + i * 20) + '" y="75" width="10" height="6"/>'; }).join('') + '</g>' +
      '</svg>';
    function coach(dx) {
      return '<g transform="translate(' + dx + ' 0)"><rect x="0" y="66" width="68" height="28" rx="5" fill="rgba(255,255,255,.88)"/>' +
        [8, 24, 40, 54].map(function (x) { return '<rect x="' + x + '" y="72" width="9" height="9" rx="2" fill="rgba(0,0,0,.26)"/>'; }).join('') +
        '<rect x="0" y="86" width="68" height="3" fill="rgba(0,0,0,.18)"/><circle cx="12" cy="95" r="4" fill="#1B2236"/><circle cx="56" cy="95" r="4" fill="#1B2236"/></g>';
    }
  };

  /* ---------- phone screens ---------- */
  function nav(on) {
    var ic = ['home', 'pin', 'train', 'calendar', 'sliders'];
    return '<div class="m-nav">' + ic.map(function (n, i) { return i === on ? '<span class="on">' + RC.icon(n, 17) + '</span>' : RC.icon(n, 18); }).join('') + '</div>';
  }
  var SCREENS = {
    home: function () {
      return '<div class="m-hero vbg"><div class="m-top"><span>' + RC.icon('pin', 11) + ' Near you · 1.2 km</span><span class="m-chip" data-bind="pill">Open</span></div>' +
        '<div class="m-name">Gate 14 · Chengannur</div>' +
        '<div class="m-big"><b data-bind="big">18</b><i data-bind="unit">min</i></div>' +
        '<div class="m-sub" data-bind="sub">Next: 12625 Kerala Express</div>' +
        '<div class="m-scene" data-scene></div>' +
        '<div class="m-actions"><span>Navigate</span><span>Save</span></div></div>' +
        '<div class="m-tray"><div class="m-h">Nearby <small>20 km radius</small></div>' +
        '<div class="m-card"><i class="m-dot ok"></i><div><b>Gate 9 · Mavelikara</b><small>4.8 km</small></div><div class="r">22 min</div></div>' +
        '<div class="m-card"><i class="m-dot warn"></i><div><b>Gate 21 · Thiruvalla</b><small>9.3 km</small></div><div class="r">6 min</div></div></div>' + nav(0);
    },
    nearby: function () {
      return '<div class="m-pg"><div class="m-title">Nearby</div><div class="m-search">' + RC.icon('search', 13) + ' Search crossings</div>' +
        '<div class="m-map"><span class="m-pin ok" style="left:22%;top:26%"></span><span class="m-pin warn" style="left:60%;top:34%"></span><span class="m-pin bad" style="left:74%;top:66%"></span><span class="m-pin ok" style="left:36%;top:70%"></span><span class="m-me" style="left:46%;top:50%"></span></div>' +
        '<div class="m-card"><i class="m-dot bad"></i><div><b>Gate 21 · Thiruvalla</b><small>9.3 km · Kerala Express</small></div><span class="px bad r">Closed</span></div>' +
        '<div class="m-card"><i class="m-dot warn"></i><div><b>Gate 14 · Chengannur</b><small>1.2 km · Venad Express</small></div><span class="px warn r">3 min</span></div>' +
        '<div class="m-card"><i class="m-dot ok"></i><div><b>Gate 9 · Mavelikara</b><small>4.8 km · Parasuram</small></div><span class="px ok r">Open</span></div>' + '</div>' + nav(1);
    },
    trains: function () {
      var rows = [['12625', 'Kerala Express', 'Near Chengannur', '+12m', 'warn'], ['16649', 'Parasuram Express', 'At Kayamkulam', 'On time', 'ok'], ['12618', 'Mangala Lakshadweep', 'Near Alappuzha', '+34m', 'bad'], ['16305', 'Kannur Express', 'Near Kottayam', '+3m', 'ok'], ['12695', 'Chennai Express', 'Departed Kollam', '+9m', 'warn']];
      return '<div class="m-pg"><div class="m-title">Live trains</div><div class="m-seg"><span class="on">Delay</span><span>State</span><span>Number</span></div>' +
        rows.map(function (r) { return '<div class="m-card"><div><b>' + r[1] + '</b><small>' + r[0] + ' · ' + r[2] + '</small></div><span class="px ' + r[4] + ' r">' + r[3] + '</span></div>'; }).join('') +
        '<div class="m-note">Refreshes every 60 seconds</div></div>' + nav(2);
    },
    planner: function () {
      var h = ''; var v = [1, 2, 4, 6, 7, 6, 5, 4, 5, 7, 5, 3, 1, 2, 3, 5, 6, 5, 4, 3, 2, 1, 2, 3, 2, 3, 4, 5, 4, 3, 2, 1, 1, 2, 3, 2];
      v.forEach(function (n) { h += '<i style="opacity:' + (0.12 + n * 0.12).toFixed(2) + '"></i>'; });
      return '<div class="m-pg"><div class="m-title">Timetable</div><div class="m-seg"><span>Trains</span><span class="on">Planner</span></div>' +
        '<div class="m-h">Today <small>≈ gate-down estimates</small></div>' +
        '<div class="m-bar"><i style="left:21%;width:5%"></i><i style="left:32%;width:5%"></i><i style="left:44%;width:5%"></i><i style="left:58%;width:5%"></i><i style="left:70%;width:5%"></i><u style="left:36%"></u></div>' +
        '<div class="m-axis"><span>6</span><span>9</span><span>12</span><span>15</span><span>18</span><span>21</span></div>' +
        '<div class="m-card"><i class="m-dot ok"></i><div><b>If you arrive at 08:40</b><small>Gate open · 11 min gap</small></div></div>' +
        '<div class="m-h" style="margin-top:12px">Busiest hours <small>this week</small></div><div class="m-heat">' + h + '</div></div>' + nav(3);
    }
  };
  RC.screen = function (n) { return (SCREENS[n] || SCREENS.home)(); };

  RC.mountPhone = function (el, name) {
    name = name || el.getAttribute('data-phone');
    el.classList.add('phone');
    el.innerHTML = '<div class="ph-notch"></div><div class="ph-screen">' + RC.screen(name) + '</div>';
    el.setAttribute('data-screen', name);
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', 'Illustrative RailwayCross ' + name + ' screen');
    mountScenes(el);
    var demo = el.closest('[data-demo]');
    if (demo) applyState(demo);
    if (RC.initScenes) RC.initScenes(el);
    if (RC.afterMount) RC.afterMount(el, name);
  };

  function mountScenes(root) {
    (root || document).querySelectorAll('[data-scene]:not([data-ready])').forEach(function (n) {
      n.innerHTML = RC.scene(); n.setAttribute('data-ready', '1');
    });
  }

  /* ---------- demo state cycle ---------- */
  var STATES = {
    open: { pill: 'Gate open', big: '18', unit: 'min', sub: 'Next: 12625 Kerala Express', label: 'Open', say: 'Safe to cross' },
    closing: { pill: 'Closing soon', big: '3', unit: 'min', sub: 'Kerala Express is approaching', label: 'Closing', say: 'Get ready to stop' },
    closed: { pill: 'Gate closed', big: 'Now', unit: '', sub: 'Train passing · wait ≈ 4 min', label: 'Closed', say: 'Wait for the gate' }
  };
  RC.states = STATES;
  function applyState(root) {
    var s = (RC.states || STATES)[root.getAttribute('data-state') || 'open'];
    root.querySelectorAll('[data-bind]').forEach(function (n) {
      var k = n.getAttribute('data-bind'); var v = s[k];
      if (v !== undefined && n.textContent !== v) { n.textContent = v; n.classList.remove('tick'); void n.offsetWidth; n.classList.add('tick'); }
    });
  }
  RC.setState = function (root, state) {
    root.setAttribute('data-state', state);
    applyState(root);
    document.querySelectorAll('[data-set-state]').forEach(function (b) {
      var on = b.getAttribute('data-set-state') === state;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    root.dispatchEvent(new CustomEvent('rc:state', { detail: state, bubbles: true }));
  };
  function initDemo() {
    var roots = document.querySelectorAll('[data-demo]');
    if (!roots.length) return;
    var order = ['open', 'closing', 'closed'], i = 0, timer = null;
    var paused = false;
    function step() { if (paused || document.hidden) return; i = (i + 1) % 3; roots.forEach(function (r) { RC.setState(r, order[i]); }); }
    roots.forEach(function (r) { RC.setState(r, 'open'); });
    timer = setInterval(step, 4200);
    document.querySelectorAll('[data-set-state]').forEach(function (b) {
      b.addEventListener('click', function () {
        paused = true; var st = b.getAttribute('data-set-state'); i = order.indexOf(st);
        roots.forEach(function (r) { RC.setState(r, st); });
      });
    });
  }

  /* ---------- misc ---------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }
  function initTheme() {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
      function paint() { var d = effective() === 'dark'; b.innerHTML = RC.icon(d ? 'sun' : 'moon', 19); b.setAttribute('aria-label', d ? 'Switch to light theme' : 'Switch to dark theme'); }
      paint();
      b.addEventListener('click', function () { var n = effective() === 'dark' ? 'light' : 'dark'; doc.setAttribute('data-theme', n); save(n); paint(); });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-icon]').forEach(function (n) { n.insertAdjacentHTML('afterbegin', RC.icon(n.getAttribute('data-icon'), +n.getAttribute('data-size') || 20)); });
    document.querySelectorAll('[data-logo]').forEach(function (n) { n.innerHTML = RC.logo(+n.getAttribute('data-logo') || 32); });
    document.querySelectorAll('[data-phone]').forEach(function (n) { RC.mountPhone(n); });
    mountScenes();
    initTheme();
    initDemo();
    initReveal();
    var y = document.querySelector('[data-year]'); if (y) y.textContent = new Date().getFullYear();
  });
})();
