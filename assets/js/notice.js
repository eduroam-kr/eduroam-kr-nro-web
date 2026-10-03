// 홈의 공지 블록은 정해진 기간이 지나면 화면에서 감춘다. HTML 에는 남아 있어
// 페이지 소스와 크롤러에서는 보이고, 화면만 깨끗해진다. 오래된 공지가 첫
// 화면에 남아 있으면 사이트가 방치된 것처럼 읽히기 때문이다.
// 상단 메뉴의 공지 링크는 그대로 둔다.
(function () {
  var el = document.querySelector('[data-notice-fresh]');
  if (!el) return;
  var days = parseInt(el.dataset.noticeFresh, 10);
  var date = el.dataset.noticeDate;
  if (!days || !date) return;
  var age = (Date.now() - Date.parse(date)) / 86400000;
  if (age > days) el.hidden = true;
})();
