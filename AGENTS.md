# nro-site 작업 규약

대한민국 eduroam NRO 안내 사이트. 무엇을 하는지는 [README.md](README.md) 에 있고, 이 파일은 어떻게 작업할지만 다룬다.

## 기관 데이터는 여기서 만들지 않는다

정본은 [eduroam-kr-db](https://github.com/eduroam-kr/eduroam-kr-db) 다. 이 저장소에 기관 이름·주소·연락처를 적어 넣지 않는다. `_data/` 는 `bin/fetch-data.sh` 가 받아 오는 자리이고 커밋하지 않는다.

화면은 브라우저가 db 에서 직접 받아 최신으로 덮어쓴다(`assets/js/live.js`). 빌드에 박히는 값은 JS 가 꺼졌을 때와 db 가 죽었을 때를 위한 대비책이다. 둘 중 하나만 두지 않는다 — 빌드만 두면 데이터가 늦고, XHR 만 두면 크롤러와 JS 꺼진 환경에서 목록이 빈다.

화면의 캠퍼스 수는 `institutions.json` 의 `locations` 합계에서 읽는다. 지도용 geojson 은 좌표가 있는 것만 담아서, 캠퍼스를 적지 않은 기관이 합계에서 통째로 빠진다.

기관 정보가 틀렸으면 그쪽을 고친다. 여기서 임시로 덮어쓰면 두 곳이 갈라지고, 제출 XML 과도 어긋난다.

## 색을 직접 정하지 않는다

Bootstrap 5.3 의 기본 팔레트를 그대로 쓴다. `assets/css/site.css` 에 hex 값을 넣지 않는다. 다크 모드는 Bootstrap 의 `[data-bs-theme=dark]` 가 알아서 바꾸므로, 다크용 색을 따로 만들지 않는다.

첫 화면의 큰 그림(`.hero`)은 예외다. 사진 위 글자는 테마와 무관하게 흰색이어야 읽히고, 사진에 밝은 데가 있어 어두운 막을 한 겹 깐다. 이 블록 밖으로 색 값을 퍼뜨리지 않는다.

eduroam 로고는 다크 배경에 묻힌다. `filter` 로 뒤집지 않고 `assets/eduroam-logo-white.svg` 를 따로 두고 CSS 로 바꿔 끼운다. 필터를 쓰면 상표 색까지 같이 뒤집힌다.

## 페이지를 늘리기 전에

이 사이트의 방문자는 셋이다 — 가입하려는 기관 담당자, 접속이 안 되는 이용자, 데이터를 확인하는 GÉANT·해외 NRO. 새 페이지가 이 셋 중 누구의 무엇을 해결하는지 말할 수 없으면 만들지 않는다.

실시간 통계, 게시판, 로그인, 사이트 검색, 챗봇은 의도적으로 두지 않는다. 운영 부담만 늘고 위 셋을 돕지 않는다.

## 국문과 영문

`/` 와 `/en/` 두 벌이다. 한쪽을 고치면 다른 쪽도 같은 커밋에서 고친다. 언어 전환은 링크 두 개로 하고 스크립트를 쓰지 않는다.

공지는 예외다. 파일 하나에 국·영문 제목을 두고 본문은 한국어 하나만 쓴다. 운영 안내라 본문까지 번역할 일이 아니고, 번역본이 원본과 갈라지는 쪽이 더 나쁘다.

front matter 의 `description` 값은 따옴표로 감싼다. 값 안에 콜론이 하나만 들어가도 YAML 이 깨지는데, Jekyll 은 이때 오류를 내지 않고 레이아웃 없이 본문만 내놓는다. 빌드 확인 단계가 `<!doctype html>` 로 시작하지 않는 페이지를 잡는다.

공지 날짜는 KST 기준이다. `_config.yml` 의 `timezone` 을 빼면 UTC 인 CI 에서 오늘 날짜가 미래가 되어, 목록에는 제목이 뜨는데 페이지는 만들어지지 않는다.

## 연락처

메일 주소와 전화번호는 난독화한 값만 화면에 둔다 (`_config.yml` 의 `nro.email`, `nro.tel`). `mailto:`, `tel:` 링크도 걸지 않는다 — 수집 로봇이 그 둘을 함께 긁어 간다. 기계가 읽어야 하는 정본은 eduroam-kr-db 의 `ro.yml` 에 있다.

## 권리 고지 문구

`_includes/footer.html` 의 `BEGIN/END eduroam-KR notice` 사이는 NRO 가 정한 공통 문구다. 한 글자도 바꾸지 않는다. 기관 템플릿(`onepage-html-site-theme`)의 같은 문구와 글자까지 같아야 한다 — 고칠 일이 생기면 두 저장소를 같이 고치고, 바뀐 문구를 참여기관에 알린다.

## 공유 카드 그림

`assets/og-image.png`(국문), `assets/og-image-en.png`(영문). 1200×630 이고 흰 바탕 가운데에 eduroam 로고를 600px 폭으로 둔다. 링크 미리보기는 배경이 어두운 앱이 많아 투명 배경을 쓰지 않고, 정사각으로 잘려도 로고가 안 잘리도록 폭을 절반으로 둔다. 로고 색은 바꾸지 않는다.

## 껍데기는 테마가 맡는다

레이아웃·머리글·바닥글·제목 크기·로고·테마 스크립트는 [multipage-jekyll-site-theme](https://github.com/eduroam-kr/multipage-jekyll-site-theme) 이 들고 있다. `_config.yml` 의 `remote_theme` 이 태그로 고정한다. 위키도 같은 테마를 쓰므로 **여기서 고칠 일인지 테마에서 고칠 일인지 먼저 따진다.**

메뉴는 `_data/nav.yml` 이 정한다. 국·영문 두 벌은 `bilingual: true` 가 켠다. `assets/css/site.css` 에는 이 사이트에만 있는 것만 둔다 — 첫 화면 큰 그림, 지도, 기관 목록, 접속 정보 표.

## 페이지 스크립트

레이아웃이 라이브러리를 본문 뒤에 불러오므로, 본문 안에 `<script src>` 를 두면 라이브러리보다 먼저 돈다. 페이지가 쓰는 스크립트는 front matter 로 켜고 `_includes/body-end.html` 이 순서대로 불러온다 (`map: true`, `notice_js: true`). 지도 쪽 Leaflet CSS 는 `_includes/head-extra.html` 이 맡는다.

기관 목록의 로고는 펼친 쪽의 것만 받는다. Jekyll 은 첫 10곳에만 `src` 를 넣고 나머지는 `data-src` 로 두며, `list.js` 가 쪽을 넘길 때 채운다. 120곳 것을 한꺼번에 받으면 로고만 1.7MB 로, 지도와 타일을 다 합친 것보다 열 배 넘게 무겁다.

기관 목록 위의 설명 줄(`.inst-legend`)은 카드와 같은 flex 구조다. 카드 모양을 바꾸면 설명 줄도 같이 바꾼다 — 자리가 어긋나면 설명이 방해가 된다. 설명 줄은 `#tb` 밖에 둔다. 안에 두면 목록 개수와 쪽 번호가 하나씩 밀린다.

기관 목록은 `assets/js/list.js` 가 10곳씩 끊어 보여 준다. `live.js` 가 목록을 갈아 끼우면 `window.eduroamList.refresh()` 로 다시 잡는다 — 이걸 빠뜨리면 검색과 쪽 번호가 옛 항목을 가리킨다.

## 사용자 도메인

`CNAME` 은 저장소 루트가 아니라 **빌드 결과물 안에** 있어야 한다. GitHub Pages 가 artifact 를 보기 때문이다. Jekyll 이 확장자 없는 파일을 그대로 복사하므로 루트에 두면 `_site/CNAME` 으로 따라 들어간다. `exclude` 에 넣지 않는다.

도메인이 붙으면 `baseurl` 은 비어야 한다. workflow 가 `configure-pages` 의 `base_path` 를 그대로 넘기므로 따로 손대지 않는다.

## 연결어미 뒤 쉼표는 지우지 않는다

`-고,` `-며,` `-면서,` 뒤의 쉼표는 한국어에서 가독성을 올린다. AI 글 판별 규칙(im-not-ai 의 C-11)이 이걸 "쉼표 과다"로 잡지만 여기서는 따르지 않는다. 절이 긴 기술 문장에서 쉼표를 빼면 어디서 끊어 읽을지 보이지 않는다.

윤문 도구를 돌릴 때 C-11 은 끈다.

## 커밋

```text
<type>: <무엇을 왜 했는지>
```

`feat` 새 페이지·기능 · `fix` 고침 · `docs` 문구 · `chore` 설정·도구.

- 제목에는 무엇을 왜 했는지 쓴다. "파일을 바꿈" 은 제목이 못 된다.
- `Claude-Session` 은 기재하지 않는다 (public 저장소).

## 로컬

```sh
bundle install
./bin/fetch-data.sh
bundle exec jekyll build      # 경고가 하나도 없어야 한다
```

`_site/` 는 산출물이라 커밋하지 않는다.

## 문서

하드 랩 금지 — 문단·목록 항목을 각각 한 줄로 쓰고 줄바꿈은 렌더러에 맡긴다.
