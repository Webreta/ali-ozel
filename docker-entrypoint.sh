#!/bin/sh
set -e

# Yüklenen görsellerin kalıcı dizini. Easypanel'de buraya bir volume mount
# edilir (örn. UPLOAD_DIR=/data/uploads). Volume mount edilmese bile aşağıdaki
# seed sayesinde image'a gömülü mevcut görseller yerine gelir.
UPLOAD_DIR="${UPLOAD_DIR:-/app/.uploads}"

mkdir -p "$UPLOAD_DIR/images"

# Image'a gömülü tohum görselleri kalıcı dizine kopyala.
# Yalnızca EKSİK olan dosyaları ekler; var olanı (kullanıcının panelden
# yüklediğini) asla ezmez. Böylece boş volume tamamen dolar, kısmen dolu
# volume'da sadece eksikler tamamlanır.
if [ -d /app/.uploads-seed ]; then
  seeded=0
  find /app/.uploads-seed -type f | while IFS= read -r src; do
    rel="${src#/app/.uploads-seed/}"
    dest="$UPLOAD_DIR/$rel"
    if [ ! -e "$dest" ]; then
      mkdir -p "$(dirname "$dest")"
      cp "$src" "$dest"
      seeded=$((seeded + 1))
    fi
  done
  echo "[entrypoint] tohum kontrolü tamam -> $UPLOAD_DIR"
fi

# Mount edilen volume genelde root'a ait olur; çalışma kullanıcısına devret.
chown -R nextjs:nodejs "$UPLOAD_DIR" 2>/dev/null || true

# root olarak başladık; ayrıcalığı bırakıp uygulamayı nextjs olarak çalıştır.
exec su-exec nextjs:nodejs node server.js
