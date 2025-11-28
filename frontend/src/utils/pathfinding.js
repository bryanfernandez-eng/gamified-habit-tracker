
export class Pathfinding {
    constructor(grid) {
        this.grid = grid; // 2D array: 0 = walkable, 1 = wall
        this.rows = grid.length;
        this.cols = grid[0].length;
    }

    findPath(startX, startY, endX, endY) {
        // Simple A* Implementation
        const startNode = { x: startX, y: startY, g: 0, h: 0, f: 0, parent: null };
        const endNode = { x: endX, y: endY };

        let openList = [startNode];
        let closedList = [];

        // Safety break
        let iterations = 0;
        const maxIterations = 1000;

        while (openList.length > 0) {
            iterations++;
            if (iterations > maxIterations) return []; // Path too long or stuck

            // Get node with lowest f
            let currentNode = openList[0];
            let currentIndex = 0;
            for (let i = 1; i < openList.length; i++) {
                if (openList[i].f < currentNode.f) {
                    currentNode = openList[i];
                    currentIndex = i;
                }
            }

            // Remove current from open, add to closed
            openList.splice(currentIndex, 1);
            closedList.push(currentNode);

            // Found goal?
            if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
                let path = [];
                let curr = currentNode;
                while (curr !== null) {
                    path.push({ x: curr.x, y: curr.y });
                    curr = curr.parent;
                }
                return path.reverse(); // Return path from start to end
            }

            // Generate children
            const neighbors = [
                { x: 0, y: -1 }, // Up
                { x: 0, y: 1 },  // Down
                { x: -1, y: 0 }, // Left
                { x: 1, y: 0 }   // Right
            ];

            for (let i = 0; i < neighbors.length; i++) {
                const neighborPos = { x: currentNode.x + neighbors[i].x, y: currentNode.y + neighbors[i].y };

                // Check bounds
                if (neighborPos.x < 0 || neighborPos.x >= this.cols || neighborPos.y < 0 || neighborPos.y >= this.rows) continue;

                // Check wall
                if (this.grid[neighborPos.y][neighborPos.x] === 1) continue;

                // Check closed list
                if (closedList.find(n => n.x === neighborPos.x && n.y === neighborPos.y)) continue;

                // Create neighbor node
                const gScore = currentNode.g + 1;
                let neighborNode = openList.find(n => n.x === neighborPos.x && n.y === neighborPos.y);

                if (!neighborNode) {
                    neighborNode = {
                        x: neighborPos.x,
                        y: neighborPos.y,
                        g: gScore,
                        h: Math.abs(neighborPos.x - endNode.x) + Math.abs(neighborPos.y - endNode.y), // Manhattan distance
                        f: 0,
                        parent: currentNode
                    };
                    neighborNode.f = neighborNode.g + neighborNode.h;
                    openList.push(neighborNode);
                } else if (gScore < neighborNode.g) {
                    neighborNode.g = gScore;
                    neighborNode.f = neighborNode.g + neighborNode.h;
                    neighborNode.parent = currentNode;
                }
            }
        }

        return []; // No path found
    }
}
