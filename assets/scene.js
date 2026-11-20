/* RailwayCross landing: the crossing animation, ported 1:1 from the app
   (react_app/src/scenes/classic.ts + widgets/ui/CrossingScene.tsx).
   Draws to a canvas in white over whatever gradient sits behind it.
   Open  = calm: gate up, green signals.
   Closing / Closed = one 13 s story on a loop: amber warning, a train rolls in from the right,
   signals flash red, the gate comes down, the train passes, the gate lifts. */
(function () {
  var RC = (window.RC = window.RC || {});

  var CYCLE = 13, DRIFT = 90;
  var AMBER_START = 0.1, RED_START = 0.16, TRAIN_IN = 0.18, TRAIN_OUT = 0.74, GREEN_AGAIN = 0.77;

  /* ----- maths (motion.ts) ----- */
  function cubicBezier(x1, y1, x2, y2) {
    var cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    var cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    function sx(t) { return ((ax * t + bx) * t + cx) * t; }
    function sy(t) { return ((ay * t + by) * t + cy) * t; }
    function dx(t) { return (3 * ax * t + 2 * bx) * t + cx; }
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      var t = x, i, e, d;
      for (i = 0; i < 8; i++) { e = sx(t) - x; if (Math.abs(e) < 1e-6) return sy(t); d = dx(t); if (Math.abs(d) < 1e-6) break; t -= e / d; }
      var lo = 0, hi = 1; t = x;
      for (i = 0; i < 40; i++) { var v = sx(t); if (Math.abs(v - x) < 1e-6) break; if (x > v) lo = t; else hi = t; t = (hi - lo) / 2 + lo; }
      return sy(t);
    };
  }
  var easeInOut = cubicBezier(0.42, 0, 0.58, 1);
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function mod(a, n) { return ((a % n) + n) % n; }
  function seg(u, a, b) { return easeInOut(clamp((u - a) / (b - a), 0, 1)); }
  function white(a) { return 'rgba(255,255,255,' + a + ')'; }
  function rgba(hex, a) {
    var h = hex.replace('#', '');
    return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4, 6), 16) + ',' + clamp(a, 0, 1) + ')';
  }

  /* ----- drawing helpers (common.ts) ----- */
  function rrect(ctx, x, y, w, h, r, color) {
    ctx.fillStyle = color; ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
    ctx.fill();
  }
  function rect(ctx, x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); }
  function circle(ctx, x, y, r, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
  function line(ctx, x1, y1, x2, y2, color, w, cap) {
    ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = cap || 'butt';
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }
  function glow(ctx, cx, cy, r, hex, a) {
    if (r <= 0) return;
    var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, rgba(hex, a)); g.addColorStop(1, rgba(hex, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  }
  function signalColor(l) { return l === 'green' ? '#B9F6D2' : l === 'amber' ? '#FFE08A' : '#FFB4AB'; }

  /* ----- the picture (classic.ts) ----- */
  function hills(ctx, w, ground) {
    ctx.fillStyle = white(0.1); ctx.beginPath(); ctx.moveTo(0, ground);
    ctx.bezierCurveTo(w * 0.15, ground - 38, w * 0.3, ground - 44, w * 0.46, ground - 18);
    ctx.bezierCurveTo(w * 0.6, ground - 2, w * 0.74, ground - 46, w, ground - 20);
    ctx.lineTo(w, ground); ctx.closePath(); ctx.fill();
    ctx.fillStyle = white(0.12); ctx.beginPath(); ctx.moveTo(0, ground);
    ctx.bezierCurveTo(w * 0.2, ground - 14, w * 0.38, ground - 24, w * 0.58, ground - 8);
    ctx.bezierCurveTo(w * 0.78, ground + 4, w * 0.9, ground - 20, w, ground - 12);
    ctx.lineTo(w, ground); ctx.closePath(); ctx.fill();
  }
  var CLOUDS = [[1, 0.1, 0.2, 1.0, 0.3], [2, 0.55, 0.4, 0.7, 0.2], [1, 0.8, 0.3, 0.55, 0.16]];
  function cloudPath(ctx, cx, cy, s) {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(cx - 28 * s, cy - 6.5 * s, 56 * s, 13 * s, 6.5 * s); else ctx.rect(cx - 28 * s, cy - 6.5 * s, 56 * s, 13 * s);
    [[-13, -5, 9], [1, -9, 12], [15, -4, 8]].forEach(function (p) {
      ctx.moveTo(cx + p[0] * s + p[2] * s, cy + p[1] * s);
      ctx.arc(cx + p[0] * s, cy + p[1] * s, p[2] * s, 0, Math.PI * 2);
    });
  }
  function clouds(ctx, w, h, drift) {
    var margin = 70, span = w + margin * 2;
    CLOUDS.forEach(function (c) {
      var p = mod(drift * c[0] + c[1], 1), x = p * span - margin;
      var edge = clamp(p < 0.18 ? p / 0.18 : p > 0.82 ? (1 - p) / 0.18 : 1, 0, 1), a = c[4] * edge;
      if (a <= 0) return;
      var y = h * c[2], s = c[3];
      var g = ctx.createLinearGradient(0, y - 21 * s, 0, y + 6.5 * s);
      g.addColorStop(0, white(Math.min(1, a * 1.25))); g.addColorStop(1, white(a * 0.7));
      ctx.fillStyle = g; cloudPath(ctx, x, y, s); ctx.fill();
    });
  }
  function train(ctx, w, ground, story, u) {
    if (!story || u < TRAIN_IN || u > TRAIN_OUT) return;
    var carH = 30, carW = Math.max(54, w * 0.2), gap = 4, cars = 4, len = cars * carW + (cars - 1) * gap;
    var progress = (u - TRAIN_IN) / (TRAIN_OUT - TRAIN_IN);
    var noseX = w * 1.05 - progress * (w * 1.05 + len + 20);
    var top = ground - 2 - carH + Math.sin(noseX * 0.55) * 0.45, dark = 'rgba(0,0,0,0.26)';
    for (var i = 0; i < cars; i++) {
      var x = noseX + i * (carW + gap);
      if (x > w + 4 || x + carW < -4) continue;
      rrect(ctx, x, top, carW, carH, [i === 0 ? 16 : 5, 5, 3, 3], white(0.96));
      rect(ctx, x + (i === 0 ? 6 : 0), top + carH - 9, carW - (i === 0 ? 6 : 0), 3, dark);
      var wc = i === 0 ? 2 : 4, ww = (carW - (i === 0 ? 26 : 12)) / wc - 3;
      for (var k = 0; k < wc; k++) rrect(ctx, x + (i === 0 ? 20 : 6) + k * (ww + 3), top + 6, ww, 10, 3, dark);
      [0.22, 0.78].forEach(function (f) {
        var cx = x + carW * f, cy = ground - 3.4, ang = noseX / 3.6;
        circle(ctx, cx, cy, 3.6, dark);
        line(ctx, cx, cy, cx + Math.cos(ang) * 2.8, cy + Math.sin(ang) * 2.8, white(0.75), 1.2, 'round');
      });
    }
    glow(ctx, noseX + 3, top + 17, 16, '#FFF3B0', 0.9);
  }
  function gate(ctx, x, ground, arm, lamp, flashOn) {
    var py = ground - 44;
    rrect(ctx, x - 5, py, 10, 44, 3, white(0.95));
    ctx.save(); ctx.translate(x, py); ctx.rotate((-Math.PI / 2) * (1 - arm));
    var len = 92, th = 7;
    ctx.save(); ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-10, -th / 2, len, th, 3.5); else ctx.rect(-10, -th / 2, len, th);
    ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(-10, -th / 2, len, th);
    ctx.fillStyle = 'rgba(229,57,53,0.9)';
    for (var sx = -10; sx < len; sx += 18) ctx.fillRect(sx + 9, -th / 2, 9, th);
    ctx.restore();
    if (lamp !== 'green') {
      var col = signalColor(lamp);
      if (flashOn) glow(ctx, len - 14, 0, 10, col, 0.8);
      circle(ctx, len - 14, 0, flashOn ? 4.5 : 3.2, rgba(col, flashOn ? 1 : 0.5));
    }
    ctx.restore();
    circle(ctx, x, py, 6, '#fff'); circle(ctx, x, py, 2.4, 'rgba(0,0,0,0.25)');
  }
  function signal(ctx, x, ground, lamp, flashOn) {
    var metal = white(0.95), poleH = 74;
    rrect(ctx, x - 2.5, ground - poleH, 5, poleH, 2, metal);
    [Math.PI / 5.2, -Math.PI / 5.2].forEach(function (a) {
      ctx.save(); ctx.translate(x, ground - poleH + 8); ctx.rotate(a); rrect(ctx, -21, -3.5, 42, 7, 2, metal); ctx.restore();
    });
    var col = signalColor(lamp);
    for (var i = 0; i < 2; i++) {
      var cx = x + (i === 0 ? -10 : 10), cy = ground - poleH + 28;
      var lit = lamp === 'green' ? true : (i === 0) === flashOn;
      circle(ctx, cx, cy, 7.5, 'rgba(0,0,0,0.22)');
      if (lit) glow(ctx, cx, cy, 17, col, 0.75);
      circle(ctx, cx, cy, 5.2, lit ? col : white(0.28));
    }
  }
  function drawClassic(ctx, w, h, p) {
    var story = p.story, u = p.u, ground = h * 0.8;
    var arm = story ? seg(u, 0.15, 0.25) - seg(u, 0.66, 0.76) : 0;
    var lamp = !story ? 'green' : u >= AMBER_START && u < RED_START ? 'amber' : u >= RED_START && u < GREEN_AGAIN ? 'red' : 'green';
    var flashOn = mod(p.blink, 1) < 0.5;
    hills(ctx, w, ground); clouds(ctx, w, h, p.drift);
    rect(ctx, 0, ground, w, h - ground, white(0.13));
    for (var x = -4; x < w; x += 15) rrect(ctx, x, ground + 5, 9, 4, 1.5, white(0.32));
    rect(ctx, 0, ground - 1, w, 3.2, white(0.95));
    train(ctx, w, ground, story, u);
    gate(ctx, w * 0.27, ground, arm, lamp, flashOn);
    signal(ctx, w * 0.74, ground, lamp, flashOn);
  }

  /* ----- the loop (CrossingScene.tsx) ----- */
  var HEIGHT = 124;
  var startOffset = function (s) { return s === 'closed' ? 0.3 : 0.06; };
  var t0 = performance.now();
  var live = []; // {canvas, ctx, status, offset, loop, width}
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function statusOf(el) {
    var r = el.closest('[data-state]');
    return r ? r.getAttribute('data-state') : 'open';
  }
  function resize(L) {
    var dpr = window.devicePixelRatio || 1;
    var cw = L.canvas.clientWidth; if (!cw) return;
    L.width = cw;
    L.canvas.width = Math.round(cw * dpr); L.canvas.height = Math.round(HEIGHT * dpr);
    L.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function frame(now) {
    for (var i = live.length - 1; i >= 0; i--) {
      var L = live[i];
      if (!L.canvas.isConnected) { live.splice(i, 1); continue; }
      if (!L.width || L.width !== L.canvas.clientWidth) resize(L);
      if (!L.width) continue;
      var status = statusOf(L.canvas);
      if (status !== L.status) { L.offset = mod(startOffset(status) - L.loop, 1); L.status = status; }
      var story = status === 'closing' || status === 'closed', closed = status === 'closed';
      var elapsed = (now - t0) / 1000;
      var loop = reduce ? 0 : mod(elapsed / CYCLE, 1); L.loop = loop;
      var drift = reduce ? 0.2 : mod(elapsed / DRIFT, 1);
      var u = !story ? 0 : reduce ? (closed ? 0.45 : 0.13) : mod(loop + L.offset, 1);
      L.ctx.clearRect(0, 0, L.width, HEIGHT);
      drawClassic(L.ctx, L.width, HEIGHT, { story: story, u: u, blink: reduce ? 0.2 : loop * CYCLE, drift: drift });
    }
    requestAnimationFrame(frame);
  }
  function mount(canvas) {
    if (canvas.__rc) return; canvas.__rc = 1;
    var L = { canvas: canvas, ctx: canvas.getContext('2d'), status: statusOf(canvas), offset: 0, loop: 0, width: 0 };
    L.offset = startOffset(L.status);
    live.push(L);
  }
  var started = false;
  function scan(root) {
    (root || document).querySelectorAll('canvas[data-cv]').forEach(mount);
    if (!started && live.length) { started = true; requestAnimationFrame(frame); }
  }
  RC.scene = function () { return '<canvas data-cv aria-hidden="true" style="display:block;width:100%;height:' + HEIGHT + 'px"></canvas>'; };
  RC.initScenes = scan;
  document.addEventListener('DOMContentLoaded', function () {
    scan();
    new MutationObserver(function () { scan(); }).observe(document.body, { childList: true, subtree: true });
  });
})();
