FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_API_BASE_URL

RUN if [ -n "$VITE_API_BASE_URL" ]; then export VITE_API_BASE_URL; fi; \
    node -e "const fs = require('fs'); const hasEnv = Boolean(process.env.VITE_API_BASE_URL); const hasFile = fs.existsSync('.env.production') && /^VITE_API_BASE_URL=\\S+/m.test(fs.readFileSync('.env.production', 'utf8')); console.log('VITE_API_BASE_URL build input:', hasEnv || hasFile ? 'configured' : 'missing'); if (!hasEnv && !hasFile) process.exit(1);" && \
    npm run build


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
