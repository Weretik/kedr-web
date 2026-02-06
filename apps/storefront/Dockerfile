# === Build Stage ===
FROM node:20-alpine AS build
WORKDIR /src

# Копируем файлы зависимостей строго
COPY package.json package-lock.json ./

# Устанавливаем ВСЕ зависимости для сборки и очищаем кеш
RUN npm ci --ignore-scripts && npm cache clean --force

# Копируем все исходники
COPY . .

# Собираем storefront
RUN npx nx build storefront --configuration=production

# === Runtime Stage ===
FROM node:20-alpine AS final
WORKDIR /app

# Установка NODE_ENV
ENV NODE_ENV=production
# Настройки порта
ENV PORT=4000
EXPOSE 4000

# Создаем пользователя kedruser
RUN addgroup -S kedruser && adduser -S kedruser -G kedruser

# Копируем package.json для установки production dependencies
COPY package.json package-lock.json ./

# Устанавливаем только production зависимости и очищаем кеш
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Копируем собранное приложение
COPY --from=build --chown=kedruser:kedruser /src/dist/apps/storefront ./dist/apps/storefront

# Настройка прав доступа
RUN chown -R kedruser:kedruser /app

USER kedruser

# Запуск сервера через npm script
# Это позволяет менять путь к файлу в package.json без изменения Dockerfile
CMD ["npm", "run", "--silent", "storefront:start"]

# Примечание: В продакшене перед этим контейнером рекомендуется ставить Reverse Proxy (Nginx, Traefik и т.д.)
# для обработки HTTPS, кеширования статики и проксирования /api.
