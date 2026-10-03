#!/bin/sh
# eduroam-kr-db 가 낸 JSON 을 _data/ 로 받는다. 사이트는 빌드 시점 값으로 굳는다.
#
# 브라우저에서 직접 fetch 하지 않는 이유: JS 가 막힌 환경이나 크롤러에서 기관
# 목록이 통째로 비어 보인다. 대신 하루 한 번 자동으로 다시 빌드한다.
set -eu
DB="${DB_URL:-https://db.eduroam.kreonet.net}"
mkdir -p _data

for f in institutions.json locations.geojson; do
  out="_data/$(echo "$f" | sed 's/\.geojson$/.json/')"
  tmp="$(mktemp)"
  if curl -fsSL -m 30 "$DB/site/$f" -o "$tmp"; then
    python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$tmp"
    mv "$tmp" "$out"
    echo "  $out  $(wc -c < "$out" | tr -d ' ') bytes"
  else
    rm -f "$tmp"
    # 원본이 죽었을 때 이전 값으로 빌드한다. 목록이 빈 사이트를 내보내지 않는다.
    [ -f "$out" ] || { echo "$f 를 받지 못했고 이전 값도 없다" >&2; exit 1; }
    echo "  $out  받지 못해 이전 값을 쓴다" >&2
  fi
done
