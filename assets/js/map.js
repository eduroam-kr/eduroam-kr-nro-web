// Leaflet + OpenStreetMap 타일. 키가 필요 없고 도메인 등록도 없다.
(function () {
  var el = document.getElementById('map');
  if (!el || typeof L === 'undefined' || typeof GEO === 'undefined') return;

  var map = L.map(el, { scrollWheelZoom: false });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var en = document.documentElement.lang === 'en';

  function draw(geo) {
    return L.geoJSON(geo, {
      pointToLayer: function (f, latlng) {
        return L.circleMarker(latlng, { radius: 6, weight: 2 });
      },
      onEachFeature: function (f, l) {
        var p = f.properties;
        var img = p.logo ? '<img src="' + DB + '/logo/' + p.logo + '" alt=""><br>' : '';
        var name = en && p.name_en ? p.name_en : p.name;
        var loc = p.loc && p.loc !== p.name ? '<div>' + p.loc + '</div>' : '';
        var url = p.info_url
          ? '<div><a href="' + p.info_url + '" rel="noopener">' + (en ? 'Guide' : '기관 안내') + '</a></div>'
          : '';
        l.bindPopup(img + '<strong>' + name + '</strong>' + loc + url);
      }
    }).addTo(map);
  }

  var layer = draw(GEO);

  map.fitBounds(layer.getBounds(), { padding: [20, 20] });
  map.once('focus', function () { map.scrollWheelZoom.enable(); });

  // live.js 가 더 새로운 데이터를 받으면 표식만 갈아 끼운다.
  window.eduroamMap = {
    replace: function (geo) {
      map.removeLayer(layer);
      layer = draw(geo);
      map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    }
  };
})();
