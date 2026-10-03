// db.eduroam.kreonet.net 의 최신 값으로 화면을 덮어쓴다.
//
// 페이지에는 빌드 시점 값이 이미 그려져 있다. 그래서 JS 가 꺼져 있거나 db 가
// 죽어도 목록이 비지 않고, 켜져 있으면 늘 최신을 본다. 받은 built 가 페이지에
// 박힌 값보다 새로울 때만 손댄다 — 같은 값이면 화면이 한 번 깜빡일 이유가 없다.
(function () {
  var root = document.querySelector('[data-db]');
  if (!root || !window.fetch) return;
  var DB = root.dataset.db;
  var built = root.dataset.built || '';
  var en = document.documentElement.lang === 'en';

  function num(sel, v) {
    var el = document.querySelector(sel);
    if (el && v != null) el.textContent = v;
  }

  fetch(DB + '/site/institutions.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (d) {
      if (!d.built || d.built <= built) return;
      num('[data-live="count"]', d.count);
      num('[data-live="locations"]', d.locations);
      var tb = document.getElementById('tb');
      if (tb) {
        tb.innerHTML = d.institutions.map(row).join('');
        if (window.eduroamList) window.eduroamList.refresh();
      }
    })
    .catch(function () {});

  fetch(DB + '/site/locations.geojson', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (g) {
      if (!g.built || g.built <= built) return;
      if (window.eduroamMap) window.eduroamMap.replace(g);
    })
    .catch(function () {});

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function row(i) {
    var name = esc(en ? (i.name.en || i.name.ko) : i.name.ko);
    var campus = i.campus && i.campus.length > 1
      ? '<div class="small text-body-secondary">' + esc(i.campus.join(' · ')) + '</div>' : '';
    var realms = (i.realms || []).map(function (r) {
      return '<code>' + esc(r) + '</code>';
    }).join('');
    var year = i.year_joined
      ? '<span class="d-none d-md-inline text-body-secondary">' + esc(i.year_joined) + '</span>' : '';
    var guide = '<span class="inst-guide">' + (i.info_url
      ? '<a href="' + esc(i.info_url) + '" rel="noopener">' + (en ? 'Guide' : '안내') + '</a>' : '') + '</span>';
    return '<div class="list-group-item inst" data-k="'
      + esc(i.name.ko + ' ' + (i.name.en || '') + ' ' + (i.realms || []).join(' ')) + '">'
      + '<img class="inst-logo" data-src="' + DB + '/logo/' + esc(i.logo) + '" alt="" loading="lazy">'
      + '<div class="inst-main"><div class="inst-name">' + name + '</div>' + campus
      + '<div class="inst-realms">' + realms + '</div></div>'
      + '<div class="inst-side">' + year + guide + '</div></div>';
  }
})();
