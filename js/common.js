function updateClock() {
  var el = document.getElementById('taskbar-clock');
  if (!el) return;
  var d = new Date();
  var h = String(d.getHours()).padStart(2, '0');
  var m = String(d.getMinutes()).padStart(2, '0');
  el.textContent = h + ':' + m;
}

updateClock();
setInterval(updateClock, 30000);

function makeDraggable(win) {
  var titleBar = win.querySelector('.title-bar');
  if (!titleBar) return;

  var isDragging = false;
  var startX, startY, startLeft, startTop;

  titleBar.addEventListener('mousedown', function (e) {
    if (e.target.closest('.title-bar-controls')) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = win.offsetLeft;
    startTop = win.offsetTop;
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    win.style.left = (startLeft + (e.clientX - startX)) + 'px';
    win.style.top = (startTop + (e.clientY - startY)) + 'px';
  });

  document.addEventListener('mouseup', function () {
    isDragging = false;
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.main-window').forEach(function (win) {
    var left = Math.max(10, (window.innerWidth - win.offsetWidth) / 2);
    win.style.left = left + 'px';
    win.style.top = '20px';
    makeDraggable(win);
  });
});
