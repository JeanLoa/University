export type RouteAlgorithm = 'dijkstra' | 'astar' | 'bfs';

export type RoutePointRole = 'origin' | 'destination';

export type RouteMapScope = 'global' | 'territory';

export interface AlgorithmOption {
  readonly id: RouteAlgorithm;
  readonly label: string;
  readonly description: string;
}
