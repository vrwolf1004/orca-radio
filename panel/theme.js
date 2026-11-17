// 디자인 전환 버튼. A(기본)는 테마 CSS 를 끈다. B/C 는 themes/*.css 를 media 로 켠다.
(function () {
  var THEMES = [
    { id: 'a', href: '' },
    { id: 'b', href: 'themes/b.css' },
    { id: 'c', href: 'themes/c.css' }
  ];
  var link = document.getElementById('theme-css');
  var button = document.getElementById('theme-toggle');
  var index = 0;
  try {
    var saved = localStorage.getItem('orca-radio-theme');
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === saved) index = i;
  } catch (e) { /* 저장소를 못 쓰면 기본 A */ }

  function apply() {
    var theme = THEMES[index];
    if (theme.href) {
      link.setAttribute('href', theme.href);
      link.media = 'all';
    } else {
      link.media = 'not all';
    }
    button.title = '디자인 ' + theme.id.toUpperCase();
    try { localStorage.setItem('orca-radio-theme', theme.id); } catch (e) { /* 무시 */ }
  }

  button.addEventListener('click', function () {
    index = (index + 1) % THEMES.length;
    apply();
  });
  apply();
})();
