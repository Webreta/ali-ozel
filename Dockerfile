# --- Bağımlılıklar ---
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Build ---
# NOT: Tüm sayfalar `force-dynamic` — build sırasında DB'ye HİÇ gidilmez.
# DATABASE_URL burada gerekmez; sadece bağlantı string'i undefined olmasın diye
# zararsız bir placeholder veriyoruz. Gerçek DB runtime'da okunur.
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL="postgres://build:build@localhost:5432/build?sslmode=disable"
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Çalışma ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# su-exec: entrypoint root başlar (volume sahipliğini düzeltmek için), sonra
# ayrıcalığı bırakıp uygulamayı nextjs kullanıcısıyla çalıştırır.
RUN apk add --no-cache su-exec
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Yüklenen görsellerin "tohum" kopyası. Runtime'da entrypoint bunu UPLOAD_DIR'e
# (varsa mount edilmiş volume) kopyalar; böylece mevcut görseller gelir ve
# panelden yeni yüklenenler volume'da kalıcı olur.
COPY --from=builder --chown=nextjs:nodejs /app/.uploads /app/.uploads-seed
# migrate/seed için gerekli dosyalar
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/db ./db
COPY --from=builder /app/node_modules/drizzle-kit ./node_modules/drizzle-kit
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# USER satırı yok: entrypoint root başlayıp su-exec ile nextjs'e düşer.
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
