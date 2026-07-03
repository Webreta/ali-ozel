# VPS'e Kurulum ve Yayına Alma

## Gereksinimler
- Docker + Docker Compose
- nginx (TLS sonlandırma + statik upload servisi)
- Alan adı: aliozel.com.tr → VPS IP

## İlk kurulum

```bash
git clone <repo> /srv/aliozel && cd /srv/aliozel

# Ortam değişkenleri
cat > .env <<'EOF'
DB_PASSWORD=<güçlü-rastgele-şifre>
AUTH_SECRET=<node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))">
EOF

mkdir -p uploads/images uploads/materials

# 1) Önce veritabanı
docker compose -f docker-compose.prod.yml up -d db

# 2) Migration + seed (build DB'ye eriştiği için build'den ÖNCE)
docker compose -f docker-compose.prod.yml run --rm \
  -e SEED_ADMIN_EMAIL=admin@aliozel.com.tr \
  -e SEED_ADMIN_PASSWORD=<ilk-admin-şifresi> \
  app sh -c "npx drizzle-kit migrate && npx tsx db/seed.ts"
# (İlk kurulumda app imajı yoksa önce: docker compose -f docker-compose.prod.yml build app)

# 3) Uygulama
docker compose -f docker-compose.prod.yml up -d app
```

## Güncelleme (deploy)

```bash
cd /srv/aliozel && git pull

docker compose -f docker-compose.prod.yml build app          # build, ayakta olan db'yi kullanır
docker compose -f docker-compose.prod.yml run --rm app npx drizzle-kit migrate
docker compose -f docker-compose.prod.yml up -d app
```

> Sıra önemli: migrate → build → up. `generateStaticParams` build sırasında
> DB'den okur; migration uygulanmadan build almayın.

## nginx örneği

```nginx
server {
    listen 443 ssl http2;
    server_name aliozel.com.tr www.aliozel.com.tr;

    # certbot ile TLS...

    # Yüklenen görseller — Node'a uğramadan diskten
    location /uploads/images/ {
        alias /srv/aliozel/uploads/images/;
        expires 30d;
        add_header X-Content-Type-Options nosniff;
    }
    # /uploads/materials nginx'ten SERVİS EDİLMEZ — PDF'ler erişim kodu
    # kontrolü yapan /api/materials/[id] üzerinden iner.

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  # rate limit gerçek IP'yi bununla görür
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 20m;  # upload limiti (uygulama 15MB uygular)
}
```

## Yedekleme (cron)

```bash
# /etc/cron.d/aliozel-backup — her gece 03:15
15 3 * * * root docker compose -f /srv/aliozel/docker-compose.prod.yml exec -T db \
  pg_dump -U aliozel aliozel | gzip > /srv/backups/aliozel-$(date +\%F).sql.gz
# uploads klasörünü de düzenli olarak offsite kopyalayın (rsync/rclone).
```

## Notlar
- Admin paneli: `/admin` — ilk kullanıcı seed ile oluşur, panelden yenilerini ekleyin.
- `.env.example` dev ortamı içindir; dev DB için `docker compose up -d` yeter.
- Eğitim notu PDF'leri `uploads/materials/` altında durur ve yalnızca erişim
  kodu doğrulanmış ziyaretçilere stream edilir.
