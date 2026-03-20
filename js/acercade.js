document.addEventListener('DOMContentLoaded', function () {
  var tabs = document.querySelectorAll('[role="tab"]');
  var panels = document.querySelectorAll('[role="tabpanel"]');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      tabs.forEach(function (t) { t.removeAttribute('aria-selected'); });
      panels.forEach(function (p) { p.setAttribute('hidden', ''); });
      tab.setAttribute('aria-selected', 'true');
      var panelId = tab.querySelector('a').getAttribute('href').slice(1);
      document.getElementById(panelId).removeAttribute('hidden');
    });
  });
});
