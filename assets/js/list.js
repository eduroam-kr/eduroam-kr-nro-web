// 기관 목록의 검색과 쪽 나누기.
//
// 서버가 없으니 이미 그려진 항목을 감추는 방식이다. 120곳을 한 번에 펼치면
// 화면이 끝없이 길어져 지도 아래가 안 보인다. 10곳씩 끊는다.
// live.js 가 목록을 갈아 끼우면 refresh 로 다시 잡는다.
(function () {
  var PER = 10;
  var list = document.getElementById('tb');
  if (!list) return;
  var q = document.getElementById('q');
  var pager = document.getElementById('pager');
  var hit = document.getElementById('hit');
  var en = document.documentElement.lang === 'en';

  var items = [], hits = [], page = 1;

  function pages() { return Math.max(1, Math.ceil(hits.length / PER)); }

  // 로고는 그 쪽을 펼칠 때 받는다. 120곳 것을 한꺼번에 받으면 로고만 1.7MB 라
  // 지도와 타일을 다 합친 것보다 열 배 넘게 무겁다.
  function show(el) {
    var img = el.querySelector('img[data-src]');
    if (!img) return;
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  }

  function render() {
    if (page > pages()) page = pages();
    var from = (page - 1) * PER;
    items.forEach(function (el) { el.hidden = true; });
    hits.slice(from, from + PER).forEach(function (el) {
      el.hidden = false;
      show(el);
    });
    if (hit) {
      hit.textContent = hits.length === 0
        ? (en ? 'No matches.' : '찾는 기관이 없습니다.')
        : (en ? (from + 1) + '–' + Math.min(from + PER, hits.length) + ' of ' + hits.length
              : hits.length + '곳 중 ' + (from + 1) + '–' + Math.min(from + PER, hits.length));
    }
    drawPager();
  }

  function search() {
    var v = q ? q.value.trim().toLowerCase() : '';
    hits = v === '' ? items : items.filter(function (el) {
      return (el.dataset.k || '').toLowerCase().indexOf(v) !== -1;
    });
    page = 1;
    render();
  }

  function li(label, to, state) {
    var el = document.createElement('li');
    el.className = 'page-item' + (state ? ' ' + state : '');
    var a = document.createElement(to ? 'a' : 'span');
    a.className = 'page-link';
    a.textContent = label;
    if (to) {
      a.href = '#list';
      a.addEventListener('click', function (e) {
        e.preventDefault();
        page = to;
        render();
        var top = document.getElementById('list');
        if (top) top.scrollIntoView();
      });
    }
    el.appendChild(a);
    pager.appendChild(el);
  }

  // 쪽이 많아지면 번호를 다 늘어놓지 않고 앞뒤와 지금 자리 둘레만 남긴다.
  function drawPager() {
    if (!pager) return;
    pager.innerHTML = '';
    var n = pages();
    if (n < 2) return;
    li('‹', page > 1 ? page - 1 : 0, page > 1 ? '' : 'disabled');
    var prev = 0;
    for (var i = 1; i <= n; i++) {
      if (i !== 1 && i !== n && Math.abs(i - page) > 2) continue;
      if (prev && i - prev > 1) li('…', 0, 'disabled');
      li(String(i), i === page ? 0 : i, i === page ? 'active' : '');
      prev = i;
    }
    li('›', page < n ? page + 1 : 0, page < n ? '' : 'disabled');
  }

  function collect() {
    items = Array.prototype.slice.call(list.children);
    search();
  }

  if (q) q.addEventListener('input', search);
  collect();

  window.eduroamList = { refresh: collect };
})();
