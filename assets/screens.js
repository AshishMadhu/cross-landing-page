/* RailwayCross landing: the phone screens, rebuilt from the real app (react_app).
   Home, Explore, Timetable > Trains and Timetable > Planner, with the same layout, words,
   colours and motion. Sample data only. Loaded after common.js. */
(function () {
  var RC = window.RC;
  var CLOCK = '10:42';

  /* the three states the demo cycles through; same words as the app */
  RC.states = {
    open:    { pill: 'OPEN',         big: '18',  unit: 'min', cap: 'until train 12625 crosses', sub: 'Kerala Express · on time',                          tpill: 'Open',         tmin: '18 min', label: 'Open',    say: 'Safe to cross' },
    closing: { pill: 'CLOSING SOON', big: '3',   unit: 'min', cap: 'until train 12625 crosses', sub: 'Kerala Express · +4 min · expect a ~4 min wait', tpill: 'Closing soon', tmin: '3 min',  label: 'Closing', say: 'Get ready to stop' },
    closed:  { pill: 'CLOSED',       big: '4',   unit: 'min', cap: 'until the gates reopen',    sub: 'Kerala Express · +4 min',                           tpill: 'Closed',       tmin: '4 min',  label: 'Closed',  say: 'Wait for the gate' }
  };

  function mi(name, o) { return '<span class="mi' + (o ? ' o' : '') + '">' + name + '</span>'; }
  function d(ms) { return ' style="--d:' + ms + 'ms"'; }

  /* ---- shared pieces ---- */
  function pill(label, s, active, bind) {
    return '<span class="pill' + (active ? ' act' : '') + '"><u><i></i></u><span' + (bind ? ' data-bind="' + bind + '"' : '') + '>' + label + '</span></span>';
  }
  function dpill(min) { return '<span class="dpill ' + (min <= 0 ? 'ok' : min < 15 ? 'warn' : 'bad') + '">' + (min > 0 ? '+' + min + ' min' : 'On time') + '</span>'; }
  function bnav(on) {
    var t = [['home', 'Home'], ['explore', 'Explore'], ['calendar_month', 'Timetable'], ['tune', 'Settings']];
    return '<div class="bnav"><div class="bar"><span class="loz" style="--p:' + on + '"></span><div class="bt4">' +
      t.map(function (x, i) { return '<span class="tab' + (i === on ? ' on' : '') + '">' + mi(x[0], i !== on && i !== 3) + x[1] + '</span>'; }).join('') +
      '</div></div></div>';
  }
  function head(title, sub, trail) {
    return '<div class="shead"><div class="grow"><h4>' + title + '</h4><p>' + sub + '</p></div>' + (trail || '') + '</div>';
  }
  function strip(cap, name, s, label, min, picker) {
    return '<div class="strip" data-s="' + s + '"><div class="grow"><div class="cp nw">' + cap + ' · ' + label + '</div><div class="nm"><span class="nw">' + name + '</span>' + (picker ? mi('unfold_more') : '') + '</div></div>' +
      '<div class="mn"><b>' + min + '</b><span>min</span></div></div>';
  }
  var ICON = { open: 'check_circle', closing: 'warning', closed: 'block' };
  var LABEL = { open: 'Open', closing: 'Closing soon', closed: 'Closed' };
  function row(name, km, s, min, cap, star, delay) {
    return '<div class="card crow fsi" data-s="' + s + '"' + d(delay) + '><span class="tile">' + mi(ICON[s]) + '</span><div style="width:14px"></div>' +
      '<div class="grow"><div class="row"><div class="grow nm nw">' + name + '</div>' + (star ? mi(star === 2 ? 'star' : 'star_border') .replace('class="mi', 'class="star mi') : '') + '</div>' +
      '<div class="ln2">' + pill(LABEL[s], s, s !== 'open') + mi('near_me') + '<em>' + km + ' km</em></div></div>' +
      '<div class="rt"><div><b>' + min + ' <small>min</small></b></div><span>' + cap + '</span></div></div>';
  }
  function tcard(name, km, train, s, label, min, sel, follow) {
    return '<div class="tcard' + (sel ? ' sel' : '') + (follow ? ' follow' : '') + '" data-s="' + (follow ? '' : s) + '"><div class="row"><i class="sdot"></i><span class="n nw grow">' + name + '</span></div>' +
      '<div class="d nw">' + km + ' km · ' + train + '</div><div class="bt">' + pill(label, s, s !== 'open', follow ? 'tpill' : '') + '<span style="flex:1"></span><b' + (follow ? ' data-bind="tmin"' : '') + '>' + min + '</b></div></div>';
  }

  /* ---- Home ---- */
  function home() {
    var S = RC.states.open;
    return '<div class="app">' +
      '<div class="page home"><div class="vhero"><div class="vhero-scene"><div data-scene></div></div><div class="vhero-in">' +
        '<div class="row rv"' + d(120) + '><div class="chip place">' + mi('location_on', 1) + '<span class="nw">Gate 14 · Aroor · 1.2 km</span></div>' +
          '<div class="chip clock"><span class="pdot on"><i></i></span><span style="margin-left:4px">' + CLOCK + '</span></div></div>' +
        '<div class="st rv"' + d(210) + '><span class="pdot big on"><i></i></span><span class="t" data-bind="pill">' + S.pill + '</span></div>' +
        '<div class="num rv"' + d(390) + '><b data-bind="big">' + S.big + '</b><i data-bind="unit">' + S.unit + '</i></div>' +
        '<div class="cap rv" data-bind="cap"' + d(450) + '>' + S.cap + '</div>' +
        '<div class="sub rv" data-bind="sub"' + d(480) + '>' + S.sub + '</div>' +
        '<div class="acts rv"' + d(510) + '><div class="nav-btn">' + mi('navigation', 1) + 'Navigate here</div><div class="fav">' + mi('star_border') + '</div></div>' +
        '</div><div class="sheen"></div></div>' +
        '<div class="tray"><div class="tray-h fsi"><span class="t">Nearby · tap to switch</span><i class="on"></i><i></i><i></i><i></i><i></i></div>' +
        '<div class="tray-row fsi" style="--d:60ms">' +
          tcard('Gate 14 · Aroor', '1.2', 'Kerala Express', 'open', S.tpill, S.tmin, true, true) +
          tcard('Gate 9 · Mavelikara', '4.8', 'Parasuram Express', 'open', 'Open', '22 min', false) +
          tcard('Gate 21 · Thiruvalla', '9.3', 'Venad Express', 'closing', 'Closing soon', '6 min', false) +
        '</div></div></div>' + bnav(0) + '</div>';
  }

  /* ---- Explore ---- */
  function nearby() {
    return '<div class="app"><div class="page"><div class="pad">' +
      head('Explore', '6 crossings within 20 km', '<div class="vt"><span class="th"></span><span class="on">' + mi('view_agenda') + '</span><span>' + mi('map') + '</span></div>') +
      '<div class="fsi">' + strip('NEAREST', 'Gate 14 · Aroor', 'closing', 'CLOSING SOON', 3, 0) + '</div><div style="height:14px"></div>' +
      '<div class="search">' + mi('search') + '<span>Search crossings</span></div><div style="height:14px"></div>' +
      '<div class="chips"><span class="fchip on">All 6</span><span class="fchip">Open</span><span class="fchip">Closing soon</span><span class="fchip">Closed</span></div><div style="height:14px"></div>' +
      row('Gate 14 · Aroor', '1.2', 'closing', 3, 'to close', 2, 60) +
      row('Gate 9 · Mavelikara', '4.8', 'open', 22, 'to closure', 1, 120) +
      row('Gate 21 · Thiruvalla', '9.3', 'closed', 4, 'to reopen', 1, 180) +
      row('Gate 7 · Kayamkulam', '12.6', 'open', 41, 'to closure', 1, 240) +
      '</div></div>' + bnav(1) + '</div>';
  }

  /* ---- Timetable > Trains ---- */
  function trainRow(time, was, name, num, a, b, delay, i) {
    return '<div class="card trow fsi"' + d(60 + i * 60) + '><div class="tm"><b>' + time + '</b>' + (was ? '<s>' + was + '</s>' : '') + '</div><span class="vr"></span>' +
      '<div class="grow"><div class="nm nw">' + name + '</div><div class="rt2 nw">' + num + ' · ' + a + ' → ' + b + '</div></div><div style="width:8px"></div>' + dpill(delay) + '</div>';
  }
  function tt(view) {
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], nums = [15, 16, 17, 18, 19, 20, 21];
    return head('Timetable', 'Every train through a crossing') +
      '<div class="vs" style="--i:' + view + '"><div class="in"><span class="th"></span><span class="' + (view === 0 ? 'on' : '') + '">Trains</span><span class="' + (view === 1 ? 'on' : '') + '">Planner</span></div></div><div style="height:12px"></div>' +
      strip('CROSSING', 'Gate 14 · Aroor', 'closing', 'CLOSING SOON', 3, 1) + '<div style="height:16px"></div>';
  }
  function trains() {
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], n = [15, 16, 17, 18, 19, 20, 21];
    var strp = '<div class="days">' + days.map(function (x, i) { return '<div class="day' + (i === 4 ? ' on td' : '') + '"><s>' + x + '</s><b>' + n[i] + '</b><i></i></div>'; }).join('') + '</div>';
    return '<div class="app"><div class="page"><div class="pad">' + tt(0) + strp + '<div style="height:14px"></div>' +
      '<div class="search">' + mi('search') + '<span>Search train name or number</span></div><div style="height:16px"></div>' +
      trainRow('10:46', '10:42', 'Kerala Express', '12625', 'TVC', 'NDLS', 4, 0) +
      trainRow('11:05', '', 'Parasuram Express', '16649', 'MAQ', 'NCJ', 0, 1) +
      trainRow('11:52', '11:30', 'Mangala Lakshadweep', '12618', 'ERS', 'NZM', 22, 2) +
      trainRow('12:20', '', 'Venad Express', '16302', 'TVC', 'SRR', 0, 3) +
      '</div></div>' + bnav(2) + '</div>';
  }

  /* ---- Timetable > Planner ---- */
  function planner() {
    function tl(time, rc, kind, body, cls) {
      return '<div class="tl fsi"' + d(cls) + '><div class="tt" style="' + (kind === 'now' ? 'color:var(--ac)' : '') + (kind === 'closed' ? ';padding-top:12px' : '') + '">' + time + '</div>' +
        '<div class="rail' + (kind === 'now' ? ' now' : '') + '" style="--rc:' + rc + '">' + (kind === 'now' ? '<span class="nd"></span>' : '') + (kind === 'closed' ? '<span class="cd"></span>' : '') + '</div><div class="bd">' + body + '</div></div>';
    }
    return '<div class="app"><div class="page"><div class="pad">' + tt(1) +
      '<div class="card sum fsi"><div style="flex:2;min-width:0"><div class="cap2">OPEN FOR</div><div class="big" style="color:var(--oktx)">3 min</div></div>' +
      '<div style="width:14px"></div><div style="width:1px;background:var(--ln)"></div><div style="width:18px"></div>' +
      '<div style="flex:3;min-width:0"><div class="cap2">NEXT LONG GAP</div><div style="margin-top:5px;font-size:20px;font-weight:800;letter-spacing:-.4px;color:var(--acd);white-space:nowrap">11:15 – 11:48</div></div></div>' +
      '<div style="height:22px"></div><div class="row fsi" style="--d:60ms"><div class="grow t17">Today’s gate timeline</div><span style="font-size:12px;font-weight:600;color:var(--mut)">Thu, 19 Nov</span></div><div style="height:10px"></div>' +
      tl('10:42', 'var(--ok)', 'now', '<span class="gpill">NOW</span>', 120) +
      tl('', 'var(--ok)', 'open', '<div style="padding:6px 0 12px;font-size:12.5px;font-weight:700;color:var(--oktx)">Open · 3 min more</div>', 160) +
      tl('10:46', 'var(--bad)', 'closed', '<div class="card ccard" style="box-shadow:var(--sh)"><div class="row"><div class="grow nm nw">Kerala Express</div><span class="cp3">Closed ~5 min</span></div><div class="sm">Gates down ≈ 10:45 – 10:50 · running +4 min late</div></div>', 200) +
      tl('', 'var(--ok)', 'open', '<div style="padding:6px 0 4px;font-size:12.5px;font-weight:700;color:var(--oktx)">Open · 33 min</div><span class="gpill" style="margin-bottom:10px">Good time to cross</span>', 240) +
      '</div></div>' + bnav(2) + '</div>';
  }

  var SCREENS = { home: home, nearby: nearby, trains: trains, planner: planner };
  RC.screen = function (n) { return (SCREENS[n] || home)(); };

  /* The count-up when Home first appears: the number runs from 0 to its value (0.3 s to 0.93 s). */
  RC.afterMount = function (el, name) {
    if (name !== 'home' && el.getAttribute('data-screen') !== 'home') return;
    var b = el.querySelector('.num b'); if (!b) return;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var target = parseInt(b.textContent, 10) || 0, t0 = performance.now() + 300, ease = function (t) { return 1 - Math.pow(1 - t, 3); };
    b.textContent = '0';
    (function tick(now) {
      var p = Math.min(1, Math.max(0, (now - t0) / 630));
      b.textContent = Math.round(target * ease(p));
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  };
})();
