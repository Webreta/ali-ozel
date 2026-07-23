#!/bin/sh
set -e

# Yüklenen görsellerin kalıcı dizini. Easypanel'de buraya bir volume mount
# edilirse panelden yüklenenler redeploy'larda korunur. Volume mount edilmese
# bile aşağıdaki seed sayesinde mevcut görseller her açılışta yerine gelir.
UPLOAD_DIR="${UPLOAD_DIR:-/app/.uploads}"

mkdir -p "$UPLOAD_DIR/images"

# Volume ilk kez mount edildiğinde (images boşsa) image'a gömülü tohum
# dosyalarıyla doldur. Doluysa dokunma — kullanıcının yüklediklerini ezme.
if [ -d /app/.uploads-seed/images ] && [ -z "$(ls -A "$UPLOAD_DIR/images" 2>/dev/null)" ]; then
  echo "[entrypoint] .uploads boş, tohum görseller kopyalanıyor..."
  cp -R /app/.uploads-seed/. "$UPLOAD_DIR/"
  echo "[entrypoint] tohum kopyalandı: $(ls -1 "$UPLOAD_DIR/images" | wc -l) dosya"
fi

# Mount edilen volume genelde root'a ait olur; çalışma kullanıcısına devret.
chown -R nextjs:nodejs "$UPLOAD_DIR" 2>/dev/null || true

# root olarak başladık; ayrıcalığı bırakıp uygulamayı nextjs olarak çalıştır.
exec su-exec nextjs:nodejs node server.js
