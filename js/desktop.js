// ============================================================
//  Win98 Portfolio Desktop — Renato Campos
// ============================================================

var zTop = 100;
var screensaverTimer = null;
var screensaverActive = false;
var SCREENSAVER_DELAY = 30000;
var dialogCallback = null;
var maximizedState = {};

// ── Sounds ───────────────────────────────────────────────────
function playSound(type) {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();

    function beep(freq, start, dur, vol) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol || 0.08, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    }

    switch (type) {
      case 'startup':
        beep(523, 0.0, 0.15);
        beep(659, 0.1, 0.15);
        beep(784, 0.2, 0.15);
        beep(1047, 0.3, 0.5, 0.12);
        break;
      case 'open':
        beep(523, 0, 0.08);
        beep(784, 0.07, 0.15);
        break;
      case 'close':
        beep(784, 0, 0.08);
        beep(523, 0.07, 0.15);
        break;
      case 'minimize':
        beep(659, 0, 0.08);
        beep(440, 0.07, 0.1);
        break;
      case 'error':
        beep(300, 0.0, 0.12, 0.15);
        beep(300, 0.15, 0.12, 0.15);
        break;
      case 'click':
        beep(880, 0, 0.04, 0.04);
        break;
    }
  } catch (e) { /* AudioContext not available */ }
}

// ── Clock ─────────────────────────────────────────────────────
function updateClock() {
  var el = document.getElementById('taskbar-clock');
  if (!el) return;
  var d = new Date();
  el.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

// ── Boot Screen ───────────────────────────────────────────────
function runBoot() {
  var boot = document.getElementById('boot-screen');
  var bar = document.getElementById('boot-bar');
  var progress = 0;

  var interval = setInterval(function () {
    progress += Math.random() * 14 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      bar.style.width = '100%';
      setTimeout(function () {
        boot.style.transition = 'opacity 0.6s';
        boot.style.opacity = '0';
        setTimeout(function () {
          boot.style.display = 'none';
          initDesktop();
          playSound('startup');
        }, 600);
      }, 500);
    }
    bar.style.width = Math.min(progress, 100) + '%';
  }, 220);
}

// ── Dialog ────────────────────────────────────────────────────
function showDialog(message, onYes) {
  var overlay = document.getElementById('dialog-overlay');
  document.getElementById('dialog-message').textContent = message;
  dialogCallback = onYes;
  overlay.removeAttribute('hidden');
}

function closeDialog(confirm) {
  document.getElementById('dialog-overlay').setAttribute('hidden', '');
  if (confirm && dialogCallback) dialogCallback();
  dialogCallback = null;
}

// ── Window Management ─────────────────────────────────────────
function focusWindow(id) {
  var win = document.getElementById(id);
  if (!win) return;
  zTop++;
  win.style.zIndex = zTop;
  document.querySelectorAll('.taskbar-programs button').forEach(function (btn) {
    btn.classList.remove('active-page');
  });
  var btn = document.querySelector('[data-taskbar="' + id + '"]');
  if (btn) btn.classList.add('active-page');
}

function openWindow(id) {
  var win = document.getElementById(id);
  if (!win) return;
  win.removeAttribute('hidden');
  win.style.display = '';
  delete win.dataset.minimized;
  focusWindow(id);
  addToTaskbar(id);
  playSound('open');
  // Close start menu if open
  document.getElementById('start-menu').setAttribute('hidden', '');
}

function closeWindowConfirm(id) {
  var win = document.getElementById(id);
  if (!win) return;
  win.setAttribute('hidden', '');
  delete win.dataset.minimized;
  removeFromTaskbar(id);
  playSound('close');
}

function minimizeWindow(id) {
  var win = document.getElementById(id);
  if (!win) return;
  win.style.display = 'none';
  win.dataset.minimized = 'true';
  var btn = document.querySelector('[data-taskbar="' + id + '"]');
  if (btn) {
    btn.classList.remove('active-page');
    btn.classList.add('minimized');
  }
  playSound('minimize');
}

function maximizeWindow(id) {
  var win = document.getElementById(id);
  if (!win) return;
  var maxBtn = win.querySelector('[aria-label="Maximize"],[aria-label="Restore"]');

  if (win.dataset.maximized === 'true') {
    var prev = maximizedState[id];
    if (prev) {
      win.style.left = prev.left;
      win.style.top = prev.top;
      win.style.width = prev.width;
      win.style.height = '';
      win.style.maxWidth = prev.maxWidth;
    }
    win.dataset.maximized = 'false';
    if (maxBtn) maxBtn.setAttribute('aria-label', 'Maximize');
  } else {
    maximizedState[id] = {
      left: win.style.left,
      top: win.style.top,
      width: win.style.width,
      maxWidth: win.style.maxWidth || ''
    };
    win.style.left = '0';
    win.style.top = '0';
    win.style.width = '100vw';
    win.style.maxWidth = '100vw';
    win.style.height = 'calc(100vh - 38px)';
    win.dataset.maximized = 'true';
    if (maxBtn) maxBtn.setAttribute('aria-label', 'Restore');
    focusWindow(id);
  }
}

// ── Taskbar ───────────────────────────────────────────────────
function addToTaskbar(id) {
  if (document.querySelector('[data-taskbar="' + id + '"]')) return;
  var win = document.getElementById(id);
  var title = win ? win.querySelector('.title-bar-text').textContent.trim() : id;

  var btn = document.createElement('button');
  btn.dataset.taskbar = id;
  btn.textContent = title;
  btn.addEventListener('click', function () {
    var w = document.getElementById(id);
    if (w.dataset.minimized === 'true') {
      w.style.display = '';
      delete w.dataset.minimized;
      btn.classList.remove('minimized');
      focusWindow(id);
    } else if (parseInt(w.style.zIndex) === zTop) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  });
  document.getElementById('taskbar-programs').appendChild(btn);
}

function removeFromTaskbar(id) {
  var btn = document.querySelector('[data-taskbar="' + id + '"]');
  if (btn) btn.remove();
}

// ── Resize Windows ────────────────────────────────────────────
function makeResizable(win) {
  ['n','ne','e','se','s','sw','w','nw'].forEach(function (dir) {
    var h = document.createElement('div');
    h.className = 'resize-handle resize-' + dir;
    win.appendChild(h);

    h.addEventListener('mousedown', function (e) {
      if (win.dataset.maximized === 'true') return;
      e.preventDefault();
      e.stopPropagation();

      var startX = e.clientX, startY = e.clientY;
      var startW = win.offsetWidth, startH = win.offsetHeight;
      var startL = win.offsetLeft, startT = win.offsetTop;
      var MIN_W = 220, MIN_H = 120;

      function onMove(e) {
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        var w = startW, h = startH, l = startL, t = startT;

        if (dir.includes('e')) w = Math.max(MIN_W, startW + dx);
        if (dir.includes('s')) h = Math.max(MIN_H, startH + dy);
        if (dir.includes('w')) { w = Math.max(MIN_W, startW - dx); l = startL + startW - w; }
        if (dir.includes('n')) { h = Math.max(MIN_H, startH - dy); t = startT + startH - h; }

        win.style.width    = w + 'px';
        win.style.maxWidth = w + 'px';
        win.style.height   = h + 'px';
        win.style.left     = l + 'px';
        win.style.top      = Math.max(0, t) + 'px';
      }

      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  });
}

// ── Drag Windows ──────────────────────────────────────────────
function makeDraggable(win) {
  var titleBar = win.querySelector('.title-bar');
  if (!titleBar) return;

  var isDragging = false;
  var startX, startY, startLeft, startTop;

  titleBar.addEventListener('mousedown', function (e) {
    if (e.target.closest('.title-bar-controls')) return;
    if (win.dataset.maximized === 'true') return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = win.offsetLeft;
    startTop = win.offsetTop;
    focusWindow(win.id);
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    win.style.left = (startLeft + (e.clientX - startX)) + 'px';
    win.style.top = Math.max(0, startTop + (e.clientY - startY)) + 'px';
  });

  document.addEventListener('mouseup', function () { isDragging = false; });

  win.addEventListener('mousedown', function () { focusWindow(win.id); });
}

// ── Desktop Icons ─────────────────────────────────────────────
function makeIconDraggable(icon) {
  var isDragging = false;
  var hasMoved = false;
  var startX, startY, startLeft, startTop;

  icon.addEventListener('mousedown', function (e) {
    isDragging = true;
    hasMoved = false;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = icon.offsetLeft;
    startTop = icon.offsetTop;
    document.querySelectorAll('.desktop-icon').forEach(function (i) { i.classList.remove('selected'); });
    icon.classList.add('selected');
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    var dx = e.clientX - startX;
    var dy = e.clientY - startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasMoved = true;
    if (hasMoved) {
      icon.style.left = (startLeft + dx) + 'px';
      icon.style.top = (startTop + dy) + 'px';
    }
  });

  document.addEventListener('mouseup', function () { isDragging = false; });
}

// ── Start Menu ────────────────────────────────────────────────
function toggleStartMenu() {
  var menu = document.getElementById('start-menu');
  if (menu.hasAttribute('hidden')) {
    menu.removeAttribute('hidden');
    playSound('click');
    setTimeout(function () {
      document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target) && e.target.id !== 'start-btn') {
          menu.setAttribute('hidden', '');
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 0);
  } else {
    menu.setAttribute('hidden', '');
  }
}

function shutDown() {
  document.getElementById('start-menu').setAttribute('hidden', '');
  showDialog('¿Desea apagar el equipo?', function () {
    var sd = document.getElementById('shutdown-screen');
    sd.removeAttribute('hidden');
    setTimeout(function () {
      sd.querySelector('.shutdown-title').textContent = 'Ahora puede apagar el equipo con seguridad.';
      sd.querySelector('.shutdown-sub').textContent = '...o recarga la página para volver 😉';
    }, 1500);
  });
}

// ── Screensaver ───────────────────────────────────────────────
function resetScreensaverTimer() {
  clearTimeout(screensaverTimer);
  screensaverTimer = setTimeout(startScreensaver, SCREENSAVER_DELAY);
}

function startScreensaver() {
  screensaverActive = true;
  var ss = document.getElementById('screensaver');
  ss.removeAttribute('hidden');

  var canvas = document.getElementById('screensaver-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext('2d');

  var text = 'Renato Campos';
  ctx.font = 'bold 30px Mononoki, monospace';
  var tw = ctx.measureText(text).width;
  var th = 30;

  var x = Math.random() * (canvas.width - tw);
  var y = th + Math.random() * (canvas.height - th * 2);
  var vx = 2.2, vy = 1.6;
  var colors = ['#ff4444', '#44ff44', '#4488ff', '#ffff44', '#ff44ff', '#44ffff', '#ffffff'];
  var ci = 0;
  var frame;

  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colors[ci];
    ctx.font = 'bold 30px Mononoki, monospace';
    ctx.fillText(text, x, y);
    x += vx; y += vy;
    if (x + tw >= canvas.width || x <= 0) { vx = -vx; ci = (ci + 1) % colors.length; }
    if (y >= canvas.height || y - th <= 0) { vy = -vy; ci = (ci + 1) % colors.length; }
    frame = requestAnimationFrame(draw);
  }
  draw();
  canvas._frame = frame;
}

function stopScreensaver() {
  screensaverActive = false;
  var ss = document.getElementById('screensaver');
  ss.setAttribute('hidden', '');
  var canvas = document.getElementById('screensaver-canvas');
  if (canvas._frame) cancelAnimationFrame(canvas._frame);
  resetScreensaverTimer();
}

// ── Tabs (blog) ───────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('[role="tab"]').forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      var list = tab.closest('[role="tablist"]');
      if (!list) return;
      list.querySelectorAll('[role="tab"]').forEach(function (t) { t.removeAttribute('aria-selected'); });
      document.querySelectorAll('[role="tabpanel"]').forEach(function (p) { p.setAttribute('hidden', ''); });
      tab.setAttribute('aria-selected', 'true');
      var panelId = tab.querySelector('a').getAttribute('href').slice(1);
      document.getElementById(panelId).removeAttribute('hidden');
    });
  });
}

// ── Init ──────────────────────────────────────────────────────
function initDesktop() {
  var windows = document.querySelectorAll('.main-window');
  var offset = 0;

  windows.forEach(function (win) {
    // Initial centered position with cascade
    var w = Math.min(parseInt(win.style.maxWidth) || 880, window.innerWidth * 0.9);
    var left = Math.max(90, (window.innerWidth - w) / 2) + offset;
    win.style.left = left + 'px';
    win.style.top = (20 + offset) + 'px';
    win.style.zIndex = zTop - offset;
    offset += 24;

    makeDraggable(win);
    makeResizable(win);

    // Title bar controls
    var closeBtn = win.querySelector('[aria-label="Close"]');
    var minBtn   = win.querySelector('[aria-label="Minimize"]');
    var maxBtn   = win.querySelector('[aria-label="Maximize"]');
    if (closeBtn) closeBtn.addEventListener('click', function (e) { e.stopPropagation(); closeWindowConfirm(win.id); });
    if (minBtn)   minBtn.addEventListener('click',   function (e) { e.stopPropagation(); minimizeWindow(win.id); });
    if (maxBtn)   maxBtn.addEventListener('click',   function (e) { e.stopPropagation(); maximizeWindow(win.id); });

    if (!win.hasAttribute('hidden')) addToTaskbar(win.id);
  });

  if (windows.length > 0) focusWindow(windows[0].id);

  // Desktop icons
  document.querySelectorAll('.desktop-icon[data-window]').forEach(function (icon) {
    makeIconDraggable(icon);
    var clicks = 0;
    icon.addEventListener('click', function () {
      clicks++;
      setTimeout(function () {
        if (clicks >= 2) {
          var winId = icon.dataset.window;
          var win = document.getElementById(winId);
          if (win) {
            if (win.hasAttribute('hidden') || win.dataset.minimized === 'true') openWindow(winId);
            else focusWindow(winId);
          }
        }
        clicks = 0;
      }, 260);
    });
  });

  // Trash icon
  var trash = document.getElementById('icon-trash');
  if (trash) {
    makeIconDraggable(trash);
    var trashClicks = 0;
    trash.addEventListener('click', function () {
      trashClicks++;
      setTimeout(function () {
        if (trashClicks >= 2) {
          showDialog('La Papelera de reciclaje está vacía.', null);
          document.getElementById('dialog-yes').textContent = 'OK';
          document.getElementById('dialog-no').style.display = 'none';
        }
        trashClicks = 0;
      }, 260);
    });
  }

  // Deselect icons on desktop click
  document.getElementById('desktop').addEventListener('click', function (e) {
    if (e.target === this) {
      document.querySelectorAll('.desktop-icon').forEach(function (i) { i.classList.remove('selected'); });
    }
  });

  // Start menu
  document.getElementById('start-btn').addEventListener('click', function (e) {
    e.stopPropagation();
    toggleStartMenu();
  });

  // Dialog buttons
  document.getElementById('dialog-yes').addEventListener('click', function () { closeDialog(true); });
  document.getElementById('dialog-no').addEventListener('click', function () { closeDialog(false); });

  // Screensaver
  document.addEventListener('mousemove', resetScreensaverTimer);
  document.addEventListener('keydown', resetScreensaverTimer);
  document.addEventListener('click', resetScreensaverTimer);
  document.getElementById('screensaver').addEventListener('click', stopScreensaver);
  resetScreensaverTimer();

  // Clock
  updateClock();
  setInterval(updateClock, 30000);

  // Tabs
  initTabs();
}

document.addEventListener('DOMContentLoaded', runBoot);
