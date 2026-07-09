FROM node:22-alpine AS frontend-build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY angular.json tsconfig*.json ./
COPY public ./public
COPY src ./src

RUN npm run build

FROM python:3.13-slim AS runtime

ENV PYTHONUNBUFFERED=1
ENV STATIC_DIR=/app/dist/browser

WORKDIR /app

COPY python_engine ./python_engine
COPY --from=frontend-build /app/dist/SmartLocation/browser ./dist/browser

EXPOSE 10000

CMD ["python", "python_engine/route_engine.py"]
