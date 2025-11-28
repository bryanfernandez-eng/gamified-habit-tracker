
export const TILE_SIZE = 64;
export const MAP_WIDTH = 800;
export const MAP_HEIGHT = 600;

class Container {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.center = { x: x + w / 2, y: y + h / 2 };
    }
}

class Tree {
    constructor(leaf) {
        this.leaf = leaf;
        this.lchild = null;
        this.rchild = null;
        this.room = null; // { x, y, w, h }
        this.halls = []; // Array of rects
    }

    getLeafs() {
        if (this.lchild === null && this.rchild === null) {
            return [this.leaf];
        } else {
            return [].concat(this.lchild.getLeafs(), this.rchild.getLeafs());
        }
    }
}

export function generateBSPMap(enemyCount = 1) {
    const cols = Math.floor(MAP_WIDTH / TILE_SIZE);
    const rows = Math.floor(MAP_HEIGHT / TILE_SIZE);

    // 1. Initialize Grid (1 = Wall, 0 = Floor)
    // Start full of walls
    let grid = Array(rows).fill().map(() => Array(cols).fill(1));

    // 2. BSP Tree
    const mainContainer = new Container(0, 0, cols, rows);
    const tree = splitContainer(mainContainer, 4); // 4 Iterations

    // 3. Create Rooms
    createRooms(tree);

    // 4. Create Halls
    createHalls(tree);

    // 5. Paint Grid
    paintTree(tree, grid);

    // 6. Convert to Obstacles & Points
    const obstacles = [];
    const floors = []; // Track floor tiles for spawning

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 1) {
                obstacles.push({
                    x: c * TILE_SIZE,
                    y: r * TILE_SIZE,
                    w: TILE_SIZE,
                    h: TILE_SIZE,
                    type: 'wall'
                });
            } else {
                floors.push({ c, r });
            }
        }
    }

    // 7. Set Spawn Points
    // Get all leaf rooms
    const leaves = tree.getLeafs();
    // Sort leaves by position to make it deterministic-ish (e.g. top-left to bottom-right)
    // Actually, tree traversal order is fine.

    // Find rooms from the tree structure
    const rooms = getAllRooms(tree);

    // Player: First Room
    const startRoom = rooms[0];
    const playerSpawn = {
        x: (startRoom.x + Math.floor(startRoom.w / 2)) * TILE_SIZE,
        y: (startRoom.y + Math.floor(startRoom.h / 2)) * TILE_SIZE
    };

    // Enemies: Spawn in the last few rooms to ensure space
    const enemySpawns = [];
    let potentialSpawns = [];
    const endRoom = rooms[rooms.length - 1];

    // Collect valid floor tiles from the last 3 rooms (in reverse order)
    // This ensures enemies are deep in the dungeon but have space
    for (let i = rooms.length - 1; i >= Math.max(0, rooms.length - 3); i--) {
        const r = rooms[i];
        // Add all tiles in this room (excluding 1-tile border to avoid walls)
        for (let y = r.y + 1; y < r.y + r.h - 1; y++) {
            for (let x = r.x + 1; x < r.x + r.w - 1; x++) {
                potentialSpawns.push({ x: x * TILE_SIZE, y: y * TILE_SIZE });
            }
        }
    }

    // Shuffle potential spawns
    for (let i = potentialSpawns.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [potentialSpawns[i], potentialSpawns[j]] = [potentialSpawns[j], potentialSpawns[i]];
    }

    // Pick unique spawns
    for (let i = 0; i < enemyCount; i++) {
        if (potentialSpawns.length > 0) {
            enemySpawns.push(potentialSpawns.pop());
        } else {
            // Fallback if somehow no space (shouldn't happen with 3 rooms)
            enemySpawns.push({
                x: (endRoom.x + 1) * TILE_SIZE,
                y: (endRoom.y + 1) * TILE_SIZE
            });
        }
    }

    // Door: Also in Last Room (or random wall in last room)
    // For simplicity, put door at center of last room for now, 
    // OR put it at the "back" wall of the last room.
    const doorSpawn = {
        x: (endRoom.x + Math.floor(endRoom.w / 2)) * TILE_SIZE,
        y: (endRoom.y) * TILE_SIZE // Top of the room
    };

    return {
        grid, // Return the 2D grid (0=floor, 1=wall)
        obstacles,
        player: playerSpawn,
        enemies: enemySpawns,
        door: doorSpawn
    };
}

function splitContainer(container, iter) {
    const root = new Tree(container);
    if (iter !== 0) {
        const sr = randomSplit(container);
        root.lchild = splitContainer(sr[0], iter - 1);
        root.rchild = splitContainer(sr[1], iter - 1);
    }
    return root;
}

function randomSplit(c) {
    let r1, r2;
    // Determine split direction (random or based on ratio)
    // If width > height * 1.5, split vertically.
    // If height > width * 1.5, split horizontally.
    // Else random.
    let splitVert = Math.random() > 0.5;
    if (c.w > c.h && c.w / c.h >= 1.25) splitVert = true;
    else if (c.h > c.w && c.h / c.w >= 1.25) splitVert = false;

    if (splitVert) {
        // Split Vertically (Left/Right)
        const splitSize = Math.floor(Math.random() * (c.w * 0.6 - c.w * 0.4) + c.w * 0.4); // 40%-60%
        r1 = new Container(c.x, c.y, splitSize, c.h);
        r2 = new Container(c.x + splitSize, c.y, c.w - splitSize, c.h);
    } else {
        // Split Horizontally (Top/Bottom)
        const splitSize = Math.floor(Math.random() * (c.h * 0.6 - c.h * 0.4) + c.h * 0.4);
        r1 = new Container(c.x, c.y, c.w, splitSize);
        r2 = new Container(c.x, c.y + splitSize, c.w, c.h - splitSize);
    }
    return [r1, r2];
}

function createRooms(tree) {
    if (tree.lchild !== null || tree.rchild !== null) {
        if (tree.lchild) createRooms(tree.lchild);
        if (tree.rchild) createRooms(tree.rchild);

        // After children create rooms, we can connect them? 
        // Actually, halls are created in a separate pass or here.
    } else {
        // Leaf Node: Create a Room
        // Room size must be smaller than container
        const c = tree.leaf;
        const w = Math.floor(Math.random() * (c.w - 4)) + 3; // Min width 3
        const h = Math.floor(Math.random() * (c.h - 4)) + 3; // Min height 3
        const x = Math.floor(c.x + Math.random() * (c.w - w - 1)) + 1; // Padding
        const y = Math.floor(c.y + Math.random() * (c.h - h - 1)) + 1;

        tree.room = { x, y, w, h };
    }
}

function createHalls(tree) {
    if (tree.lchild !== null && tree.rchild !== null) {
        createHalls(tree.lchild);
        createHalls(tree.rchild);

        // Connect Left and Right Children
        // We need to find a point in Left and a point in Right to connect.
        // Ideally, connect their rooms.
        // If they are branches, pick a random room from their subtree.

        const roomL = getRandomRoom(tree.lchild);
        const roomR = getRandomRoom(tree.rchild);

        if (roomL && roomR) {
            // Connect centers
            const p1 = { x: Math.floor(roomL.x + roomL.w / 2), y: Math.floor(roomL.y + roomL.h / 2) };
            const p2 = { x: Math.floor(roomR.x + roomR.w / 2), y: Math.floor(roomR.y + roomR.h / 2) };

            // L-Shaped Corridor (Wider: 2 Tiles)
            // Horizontal then Vertical OR Vertical then Horizontal
            if (Math.random() > 0.5) {
                tree.halls.push({ x: Math.min(p1.x, p2.x), y: p1.y, w: Math.abs(p2.x - p1.x) + 2, h: 2 }); // H
                tree.halls.push({ x: p2.x, y: Math.min(p1.y, p2.y), w: 2, h: Math.abs(p2.y - p1.y) + 2 }); // V
            } else {
                tree.halls.push({ x: p1.x, y: Math.min(p1.y, p2.y), w: 2, h: Math.abs(p2.y - p1.y) + 2 }); // V
                tree.halls.push({ x: Math.min(p1.x, p2.x), y: p2.y, w: Math.abs(p2.x - p1.x) + 2, h: 2 }); // H
            }
        }
    }
}

function getRandomRoom(tree) {
    if (tree.room) return tree.room;
    if (tree.lchild && tree.rchild) {
        return Math.random() > 0.5 ? getRandomRoom(tree.lchild) : getRandomRoom(tree.rchild);
    }
    if (tree.lchild) return getRandomRoom(tree.lchild);
    if (tree.rchild) return getRandomRoom(tree.rchild);
    return null;
}

function getAllRooms(tree) {
    if (tree.room) return [tree.room];
    let rooms = [];
    if (tree.lchild) rooms = rooms.concat(getAllRooms(tree.lchild));
    if (tree.rchild) rooms = rooms.concat(getAllRooms(tree.rchild));
    return rooms;
}

function paintTree(tree, grid) {
    if (tree.lchild) paintTree(tree.lchild, grid);
    if (tree.rchild) paintTree(tree.rchild, grid);

    // Paint Room
    if (tree.room) {
        for (let r = tree.room.y; r < tree.room.y + tree.room.h; r++) {
            for (let c = tree.room.x; c < tree.room.x + tree.room.w; c++) {
                if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
                    grid[r][c] = 0; // Floor
                }
            }
        }
    }

    // Paint Halls
    if (tree.halls) {
        tree.halls.forEach(h => {
            for (let r = h.y; r < h.y + h.h; r++) {
                for (let c = h.x; c < h.x + h.w; c++) {
                    if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
                        grid[r][c] = 0; // Floor
                    }
                }
            }
        });
    }
}
