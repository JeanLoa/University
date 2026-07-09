from __future__ import annotations

import heapq
import json
import math
import mimetypes
import os
import time
import urllib.parse
import urllib.request
from dataclasses import dataclass
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Callable


OVERPASS_URL = "https://overpass-api.de/api/interpreter"
DEFAULT_PORT = 8010
MAX_EXPANSION_DEGREES = 0.07
DEFAULT_STATIC_DIR = Path(__file__).resolve().parent.parent / "dist" / "SmartLocation" / "browser"
STATIC_DIR = Path(os.getenv("STATIC_DIR", str(DEFAULT_STATIC_DIR))).resolve()


@dataclass(frozen=True)
class Point:
    latitude: float
    longitude: float


@dataclass(frozen=True)
class Edge:
    target: int
    distance_meters: float


Graph = dict[int, list[Edge]]
NodeMap = dict[int, Point]


def haversine(first: Point, second: Point) -> float:
    radius = 6_371_000
    lat1 = math.radians(first.latitude)
    lat2 = math.radians(second.latitude)
    delta_lat = math.radians(second.latitude - first.latitude)
    delta_lon = math.radians(second.longitude - first.longitude)
    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1) * math.cos(lat2) * math.sin(delta_lon / 2) ** 2
    )
    return radius * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def bounds_for(origin: Point, destination: Point) -> tuple[float, float, float, float]:
    south = min(origin.latitude, destination.latitude) - 0.018
    north = max(origin.latitude, destination.latitude) + 0.018
    west = min(origin.longitude, destination.longitude) - 0.018
    east = max(origin.longitude, destination.longitude) + 0.018
    height = north - south
    width = east - west

    if height < 0.03:
        padding = (0.03 - height) / 2
        south -= padding
        north += padding

    if width < 0.03:
        padding = (0.03 - width) / 2
        west -= padding
        east += padding

    south = max(south, min(origin.latitude, destination.latitude) - MAX_EXPANSION_DEGREES)
    north = min(north, max(origin.latitude, destination.latitude) + MAX_EXPANSION_DEGREES)
    west = max(west, min(origin.longitude, destination.longitude) - MAX_EXPANSION_DEGREES)
    east = min(east, max(origin.longitude, destination.longitude) + MAX_EXPANSION_DEGREES)

    return south, west, north, east


def overpass_query(origin: Point, destination: Point) -> str:
    south, west, north, east = bounds_for(origin, destination)
    bbox = f"{south:.7f},{west:.7f},{north:.7f},{east:.7f}"

    return f"""
    [out:json][timeout:25];
    (
      way["highway"]["highway"!~"footway|path|cycleway|steps|pedestrian|corridor|bridleway|construction"]({bbox});
    );
    (._;>;);
    out body;
    """


def fetch_osm(origin: Point, destination: Point) -> dict[str, Any]:
    encoded = urllib.parse.urlencode({"data": overpass_query(origin, destination)}).encode()
    request = urllib.request.Request(
        OVERPASS_URL,
        data=encoded,
        headers={
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "User-Agent": "SmartLocationPythonRouteEngine/1.0",
        },
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=35) as response:
        return json.loads(response.read().decode("utf-8"))


def is_oneway(tags: dict[str, str]) -> bool:
    value = tags.get("oneway", "").lower()
    junction = tags.get("junction", "").lower()
    return value in {"yes", "true", "1"} or junction == "roundabout"


def build_graph(payload: dict[str, Any]) -> tuple[NodeMap, Graph]:
    nodes: NodeMap = {}
    ways: list[dict[str, Any]] = []

    for element in payload.get("elements", []):
        element_type = element.get("type")

        if element_type == "node":
            nodes[int(element["id"])] = Point(float(element["lat"]), float(element["lon"]))
        elif element_type == "way":
            ways.append(element)

    graph: Graph = {node_id: [] for node_id in nodes}

    for way in ways:
        way_nodes = [int(node_id) for node_id in way.get("nodes", []) if int(node_id) in nodes]
        tags = way.get("tags", {})
        directed = is_oneway(tags)

        for current_id, next_id in zip(way_nodes, way_nodes[1:]):
            distance = haversine(nodes[current_id], nodes[next_id])
            graph[current_id].append(Edge(next_id, distance))

            if not directed:
                graph[next_id].append(Edge(current_id, distance))

    graph = {node_id: edges for node_id, edges in graph.items() if edges}
    nodes = {node_id: point for node_id, point in nodes.items() if node_id in graph}

    return nodes, graph


def nearest_node(nodes: NodeMap, point: Point) -> int:
    return min(nodes.keys(), key=lambda node_id: haversine(nodes[node_id], point))


def reconstruct_path(previous: dict[int, int], start: int, goal: int) -> list[int]:
    if start == goal:
        return [start]

    if goal not in previous:
        return []

    path = [goal]
    current = goal

    while current != start:
        current = previous[current]
        path.append(current)

    path.reverse()
    return path


def dijkstra(graph: Graph, start: int, goal: int, heuristic: Callable[[int], float] | None = None) -> list[int]:
    previous: dict[int, int] = {}
    distances: dict[int, float] = {start: 0}
    queue: list[tuple[float, int]] = [(0, start)]

    while queue:
        _, current = heapq.heappop(queue)

        if current == goal:
            break

        current_distance = distances[current]

        for edge in graph.get(current, []):
            candidate = current_distance + edge.distance_meters

            if candidate < distances.get(edge.target, math.inf):
                distances[edge.target] = candidate
                previous[edge.target] = current
                priority = candidate + (heuristic(edge.target) if heuristic else 0)
                heapq.heappush(queue, (priority, edge.target))

    return reconstruct_path(previous, start, goal)


def bfs(graph: Graph, start: int, goal: int) -> list[int]:
    previous: dict[int, int] = {}
    visited = {start}
    queue = [start]
    index = 0

    while index < len(queue):
        current = queue[index]
        index += 1

        if current == goal:
            break

        for edge in graph.get(current, []):
            if edge.target in visited:
                continue

            visited.add(edge.target)
            previous[edge.target] = current
            queue.append(edge.target)

    return reconstruct_path(previous, start, goal)


def route_path(algorithm: str, nodes: NodeMap, graph: Graph, start: int, goal: int) -> list[int]:
    if algorithm == "bfs":
        return bfs(graph, start, goal)

    if algorithm == "astar":
        goal_point = nodes[goal]
        return dijkstra(graph, start, goal, lambda node_id: haversine(nodes[node_id], goal_point))

    return dijkstra(graph, start, goal)


def path_distance(nodes: NodeMap, path: list[int]) -> float:
    return sum(haversine(nodes[current], nodes[next_node]) for current, next_node in zip(path, path[1:]))


def calculate_route(origin: Point, destination: Point, algorithm: str) -> dict[str, Any]:
    payload = fetch_osm(origin, destination)
    nodes, graph = build_graph(payload)

    if not nodes or not graph:
        raise ValueError("No se encontraron vias para construir el grafo.")

    start = nearest_node(nodes, origin)
    goal = nearest_node(nodes, destination)
    path = route_path(algorithm, nodes, graph, start, goal)

    if len(path) < 2:
        raise ValueError("No se encontro una ruta conectada para esos puntos.")

    geometry = [nodes[node_id] for node_id in path]
    distance = path_distance(nodes, path)

    return {
        "provider": "python-osm",
        "algorithm": algorithm,
        "distanceMeters": distance,
        "durationSeconds": distance / (28_000 / 3600),
        "geometry": [point.__dict__ for point in geometry],
        "snappedOrigin": {"label": "Origen", "point": nodes[start].__dict__},
        "snappedDestination": {"label": "Destino", "point": nodes[goal].__dict__},
        "steps": [
            {
                "name": "Tramo vial",
                "distanceMeters": distance,
                "durationSeconds": distance / (28_000 / 3600),
            }
        ],
        "graphStats": {
            "nodes": len(nodes),
            "edges": sum(len(edges) for edges in graph.values()),
            "pathNodes": len(path),
        },
    }


class RouteHandler(BaseHTTPRequestHandler):
    server_version = "SmartLocationRouteEngine/1.0"

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == "/health":
            self.send_json({"status": "ready", "engine": "python"})
            return

        if parsed.path == "/route":
            self.handle_route_request(parsed)
            return

        self.serve_static(parsed.path)

    def handle_route_request(self, parsed: urllib.parse.ParseResult) -> None:
        try:
            query = urllib.parse.parse_qs(parsed.query)
            origin = Point(float(query["originLat"][0]), float(query["originLon"][0]))
            destination = Point(float(query["destinationLat"][0]), float(query["destinationLon"][0]))
            algorithm = query.get("algorithm", ["astar"])[0]

            if algorithm not in {"astar", "dijkstra", "bfs"}:
                raise ValueError("Algoritmo no soportado.")

            started_at = time.perf_counter()
            route = calculate_route(origin, destination, algorithm)
            route["engineTimeMs"] = round((time.perf_counter() - started_at) * 1000)
            self.send_json(route)
        except Exception as error:
            self.send_json({"error": str(error)}, status=400)

    def serve_static(self, request_path: str) -> None:
        if not STATIC_DIR.exists():
            self.send_error(404, "Static build not found. Run npm run build first.")
            return

        safe_path = urllib.parse.unquote(request_path).lstrip("/")
        target = (STATIC_DIR / safe_path).resolve() if safe_path else STATIC_DIR / "index.html"

        if not self.is_inside_static_dir(target) or not target.is_file():
            target = STATIC_DIR / "index.html"

        if not target.is_file():
            self.send_error(404)
            return

        body = target.read_bytes()
        content_type = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def is_inside_static_dir(self, target: Path) -> bool:
        try:
            target.relative_to(STATIC_DIR)
            return True
        except ValueError:
            return False

    def send_json(self, payload: dict[str, Any], status: int = 200) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_cors_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")


def main() -> None:
    port = int(os.getenv("PORT", str(DEFAULT_PORT)))
    server = ThreadingHTTPServer(("0.0.0.0", port), RouteHandler)
    print(f"SmartLocation running on http://0.0.0.0:{port}")
    print(f"Serving static files from {STATIC_DIR}")
    server.serve_forever()


if __name__ == "__main__":
    main()
