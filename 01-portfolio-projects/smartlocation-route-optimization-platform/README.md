# SmartLocation

SmartLocation es una aplicacion de rutas para Lima Metropolitana. La interfaz esta construida en Angular y el motor algoritmico principal esta implementado en Python.

## Arquitectura del proyecto

SmartLocation separa la interfaz grafica del motor algoritmico:

- `src/app`: GUI en Angular para mapa, seleccion de puntos y visualizacion de rutas.
- `python_engine`: motor de rutas en Python con Dijkstra, A\* y BFS sobre un grafo vial construido desde OpenStreetMap.
- `src/app/route-planning/infrastructure/resources/map-layers`: limites locales de Lima Metropolitana y sus 43 distritos.

Esta separacion permite cumplir el requisito academico de implementar la logica principal en Python, manteniendo Angular solo como interfaz grafica.

## Requisitos locales

- Node.js 22+
- Python 3.11+

## Motor Python

Inicia el motor local:

```bash
npm run engine:python
```

El motor queda disponible en:

```bash
http://127.0.0.1:8010
```

La GUI consulta primero este motor. Si no esta encendido, usa el servicio vial externo como respaldo para no bloquear la demostracion visual.

## Desarrollo local

Instala dependencias:

```bash
npm install
```

En una terminal inicia el motor Python:

```bash
npm run engine:python
```

En otra terminal inicia Angular:

```bash
npm start
```

Abre `http://localhost:4200/`.

## Build

```bash
npm run build
```

El build se genera en `dist/SmartLocation/browser`.

## Docker para Render

```bash
docker build -t smart-location .
docker run --rm -p 10000:10000 -e PORT=10000 smart-location
```

En Render crea un Web Service desde el repositorio y selecciona despliegue con Dockerfile. El contenedor escucha el puerto indicado por la variable `PORT` de Render y expone:

- `/`: aplicacion Angular compilada.
- `/route`: motor Python de rutas.
- `/health`: estado del servicio.

## Fuente de datos

Los limites distritales y la red vial se basan en OpenStreetMap. Los limites administrativos se guardan localmente para que la seleccion territorial no dependa de cargar contornos en vivo durante una demostracion.

La carpeta `Dataset` documenta la fuente de datos del proyecto, los contornos administrativos usados por la aplicacion y las consultas Overpass necesarias para reproducir el conteo de la red vial de Lima Metropolitana.
