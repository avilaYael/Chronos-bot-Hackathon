/**
 * Biblioteca de utilidad para el cálculo de rutas mediante el algoritmo A*
 * Desarrollado para la validación del enjambre de agentes de EINNOVACION MX.
 */

interface Node {
  x: number;
  y: number;
  g: number; // Costo acumulado desde el inicio
  h: number; // Heurística (distancia Manhattan al objetivo)
  f: number; // Costo total g + h
  parent: Node | null;
}

/**
 * Calcula la ruta óptima desde una posición inicial a una meta utilizando el algoritmo A*.
 *
 * @param start Posición de inicio [x, y]
 * @param goal Posición objetivo [x, y]
 * @param obstacles Arreglo de coordenadas de obstáculos [[x1, y1], [x2, y2], ...]
 * @param gridSize Tamaño de la grilla (por defecto 10)
 * @returns Un arreglo de coordenadas que representan la ruta óptima, o un arreglo vacío si no hay ruta.
 */
export function calculateAStarPath(
  start: [number, number],
  goal: [number, number],
  obstacles: [number, number][],
  gridSize: number = 10
): [number, number][] {
  const [startX, startY] = start;
  const [goalX, goalY] = goal;

  // Si el inicio y el objetivo son el mismo, retornar la meta
  if (startX === goalX && startY === goalY) {
    return [start];
  }

  // Set de obstáculos para búsqueda rápida O(1)
  const obstacleSet = new Set(obstacles.map(([x, y]) => `${x},${y}`));

  // Listas de nodos del algoritmo A*
  const openList: Node[] = [];
  const closedSet = new Set<string>();

  const startNode: Node = {
    x: startX,
    y: startY,
    g: 0,
    h: Math.abs(startX - goalX) + Math.abs(startY - goalY),
    f: Math.abs(startX - goalX) + Math.abs(startY - goalY),
    parent: null,
  };

  openList.push(startNode);

  while (openList.length > 0) {
    // Buscar el nodo con el menor costo F
    openList.sort((a, b) => a.f - b.f);
    const current = openList.shift()!;
    const currentKey = `${current.x},${current.y}`;
    closedSet.add(currentKey);

    // Si llegamos al objetivo, reconstruir el camino
    if (current.x === goalX && current.y === goalY) {
      const path: [number, number][] = [];
      let temp: Node | null = current;
      while (temp !== null) {
        path.push([temp.x, temp.y]);
        temp = temp.parent;
      }
      return path.reverse(); // Retornar de inicio a fin
    }

    // Movimientos ortogonales permitidos (Norte, Sur, Oeste, Este)
    const directions = [
      { dx: 0, dy: -1 }, // UP
      { dx: 0, dy: 1 },  // DOWN
      { dx: -1, dy: 0 }, // LEFT
      { dx: 1, dy: 0 },  // RIGHT
    ];

    for (const dir of directions) {
      const nextX = current.x + dir.dx;
      const nextY = current.y + dir.dy;
      const nextKey = `${nextX},${nextY}`;

      // Validar límites de la grilla
      if (nextX < 0 || nextX >= gridSize || nextY < 0 || nextY >= gridSize) {
        continue;
      }

      // Validar que no sea un obstáculo o ya esté evaluado
      if (obstacleSet.has(nextKey) || closedSet.has(nextKey)) {
        continue;
      }

      const gScore = current.g + 1;
      const hScore = Math.abs(nextX - goalX) + Math.abs(nextY - goalY);
      const fScore = gScore + hScore;

      // Buscar si el vecino ya está en la lista abierta con mejor o igual costo G
      const existingOpen = openList.find((n) => n.x === nextX && n.y === nextY);

      if (existingOpen) {
        if (gScore < existingOpen.g) {
          existingOpen.g = gScore;
          existingOpen.f = fScore;
          existingOpen.parent = current;
        }
      } else {
        openList.push({
          x: nextX,
          y: nextY,
          g: gScore,
          h: hScore,
          f: fScore,
          parent: current,
        });
      }
    }
  }

  // Si no se encuentra ruta, retornar arreglo vacío
  return [];
}

/**
 * Traduce el primer movimiento de una trayectoria de coordenadas a una instrucción de dirección.
 *
 * @param current Posición actual del robot [x, y]
 * @param nextTarget Siguiente coordenada en el camino [x, y]
 * @returns Dirección ("UP", "DOWN", "LEFT", "RIGHT") o null si son iguales
 */
export function getDirectionFromCoords(
  current: [number, number],
  nextTarget: [number, number]
): 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null {
  const [cx, cy] = current;
  const [nx, ny] = nextTarget;

  if (nx === cx && ny === cy - 1) return 'UP';
  if (nx === cx && ny === cy + 1) return 'DOWN';
  if (nx === cx - 1 && ny === cy) return 'LEFT';
  if (nx === cx + 1 && ny === cy) return 'RIGHT';

  return null;
}
