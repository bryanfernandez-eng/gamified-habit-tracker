
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import DefaultImg from '/src/assets/default.png';
import ZoroImg from '/src/assets/zoro.png';
import GrassImg from '/src/assets/grass.png';
import RockImg from '/src/assets/rock.png';
import TreeImg from '/src/assets/tree.png';
import DungeonFloorImg from '/src/assets/dungeon_floor.png';
import DungeonWallImg from '/src/assets/dungeon_wall.png';
import DungeonDoorClosedImg from '/src/assets/dungeon_door_closed.png';
import DungeonDoorOpenImg from '/src/assets/dungeon_door_open.png';
import BlueSlimeImg from '/enemies/blue_slime.png';
import RedSlimeImg from '/enemies/red_slime.png';
import SkeletonWarriorImg from '/enemies/skeleton_warrior.png';
import SkeletonCaptainImg from '/enemies/skeleton_captain.png';
import { generateBSPMap } from '../../utils/dungeonGenerator';
import { Pathfinding } from '../../utils/pathfinding';

// --- Constants ---
const TILE_SIZE = 64;
const PLAYER_SIZE = 48;
const ENEMY_SIZE = 48;
const ATTACK_COOLDOWN = 400; // Faster attacks
const DAMAGE_COOLDOWN = 1000;
const SWORD_LENGTH = 60;
const SWORD_ARC = Math.PI / 2; // 90 degrees

export function RealTimeCombatScene({ playerStats, enemy, onVictory, onDefeat, floor = 1, wave }) {
    const canvasRef = useRef(null);
    const [playerHP, setPlayerHP] = useState(playerStats.current_hp);
    const [enemiesUI, setEnemiesUI] = useState([]); // Array of { id, hp, maxHp, type }
    const [dashCooldown, setDashCooldown] = useState(0); // 0-100 percentage

    // Game State Refs
    const gameState = useRef({
        running: true,
        keys: {},
        player: {
            x: 100,
            y: 300,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
            speed: 4,
            direction: 'down',
            isAttacking: false,
            attackProgress: 0,
            invulnerableUntil: 0,
            isDashing: false,
            dashUntil: 0,
            dashCooldownUntil: 0,
            dashDirection: { x: 0, y: 0 },
            sprite: null, // Keep sprite here, it's loaded later
            lastAttackTime: 0, // Keep lastAttackTime here
        },
        enemies: [], // Array of enemy objects
        particles: [],
        obstacles: [],
        mapWidth: 0,
        mapHeight: 0,
        grid: [], // 2D Grid for Pathfinding
        pathfinder: null, // Pathfinding instance
        assets: {
            grass: null,
            rock: null,
            tree: null,
            dungeonFloor: null,
            dungeonWall: null,
            doorClosed: null,
            doorOpen: null,
            blueSlime: null,
            redSlime: null,
            skeletonWarrior: null,
            skeletonCaptain: null
        },
        biome: floor >= 10 ? 'dungeon' : 'forest',
        door: {
            x: 0,
            y: 0,
            width: 64,
            height: 64,
            open: false
        }
    });

    // --- Initialization ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        console.log('RealTimeCombatScene: Floor:', floor, 'Wave:', wave);

        canvas.width = 800;
        canvas.height = 600;
        gameState.current.mapWidth = canvas.width;
        gameState.current.mapHeight = canvas.height;

        // Load Sprites
        const loadImg = (src) => {
            const img = new Image();
            img.src = src;
            return img;
        };

        gameState.current.player.sprite = loadImg(playerStats.selected_character === 'zoro' ? ZoroImg : DefaultImg);


        // Forest Assets
        gameState.current.assets.grass = loadImg(GrassImg);
        gameState.current.assets.rock = loadImg(RockImg);
        gameState.current.assets.tree = loadImg(TreeImg);

        // Dungeon Assets
        gameState.current.assets.dungeonFloor = loadImg(DungeonFloorImg);
        gameState.current.assets.dungeonWall = loadImg(DungeonWallImg);
        gameState.current.assets.doorClosed = loadImg(DungeonDoorClosedImg);
        gameState.current.assets.doorOpen = loadImg(DungeonDoorOpenImg);

        // Enemy Assets
        gameState.current.assets.blueSlime = loadImg(BlueSlimeImg);
        gameState.current.assets.redSlime = loadImg(RedSlimeImg);
        gameState.current.assets.skeletonWarrior = loadImg(SkeletonWarriorImg);
        gameState.current.assets.skeletonCaptain = loadImg(SkeletonCaptainImg);

        // --- Enemy Logic ---
        // 1. Determine Count based on Wave
        let enemyCount = 1;
        const waveNum = wave; // wave prop is likely 1-5
        const floorNum = Number(floor);
        const rand = Math.random();

        // Update Biome
        gameState.current.biome = floorNum >= 10 ? 'dungeon' : 'forest';

        if (waveNum === 1) {
            if (rand > 0.99) enemyCount = 3;
            else if (rand > 0.9) enemyCount = 2;
        } else if (waveNum >= 2 && waveNum <= 4) {
            if (rand > 0.4) enemyCount = 2;
            else if (rand > 0.8) enemyCount = 3; // Logic check: if > 0.8 it's also > 0.4. Fix:
            if (rand > 0.6) enemyCount = 3; // 40% chance for 3
            else if (rand > 0.1) enemyCount = 2; // 50% chance for 2
            // 10% chance for 1
        } else if (waveNum === 5) {
            enemyCount = 3;
        }



        if (gameState.current.biome === 'dungeon') {
            generateRoomMap(enemyCount);
        } else {
            generateForestMap(enemyCount); // Need to update this too
        }

        // Initialize Enemies
        // generateRoomMap/ForestMap should have populated gameState.current.enemies with {x, y}
        // We need to add stats and sprites to them.
        // Bag System for Fair Randomness
        let enemyBag = [];
        const enemyTypes = ['blueSlime', 'redSlime', 'skeletonWarrior', 'skeletonCaptain'];

        const fillBag = () => {
            enemyBag = [...enemyTypes];
            // Shuffle
            for (let i = enemyBag.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [enemyBag[i], enemyBag[j]] = [enemyBag[j], enemyBag[i]];
            }
        };

        gameState.current.enemies = gameState.current.enemies.map((e, index) => {
            // Determine Type per Enemy (Bag System)
            if (enemyBag.length === 0) fillBag();
            const type = enemyBag.pop();

            return {
                ...e,
                id: index, // Add ID for UI mapping
                width: ENEMY_SIZE,
                height: ENEMY_SIZE,
                color: '#ef4444',
                sprite: gameState.current.assets[type],
                hp: enemy.base_hp, // Base HP from prop
                maxHp: enemy.base_hp,
                speed: 1.5, // Slower
                stunnedUntil: 0,
                flashUntil: 0,
                type: type
            };
        });

        // Initialize UI State
        setEnemiesUI(gameState.current.enemies.map(e => ({
            id: e.id,
            hp: e.hp,
            maxHp: e.maxHp,
            type: e.type
        })));

        const handleKeyDown = (e) => {
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
            gameState.current.keys[e.code] = true;
        };
        const handleKeyUp = (e) => gameState.current.keys[e.code] = false;

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        let animationFrameId;
        const loop = (timestamp) => {
            if (gameState.current.running) {
                update(timestamp);
                draw(canvas.getContext('2d'));
                // Sync UI
                // We throttle UI updates to avoid React render spam, but for HP/Dash we need responsiveness
                if (timestamp % 5 < 1) { // Update every ~5 frames
                    const player = gameState.current.player;
                    const cooldownRemaining = Math.max(0, player.dashCooldownUntil - timestamp);
                    const cooldownPercent = (cooldownRemaining / 1000) * 100; // 1000ms total cooldown
                    setDashCooldown(cooldownPercent);
                }

                requestAnimationFrame(loop);
            }
        };
        animationFrameId = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // --- Map Generation ---
    const generateForestMap = () => {
        const obstacles = [];
        const cols = Math.ceil(800 / TILE_SIZE);
        const rows = Math.ceil(600 / TILE_SIZE);

        // REMOVED: Boundary trees (User found them ugly). 
        // We rely on the canvas boundary check in checkCollision to keep player inside.

        // Random rocks
        for (let i = 0; i < 6; i++) {
            const c = Math.floor(Math.random() * (cols - 4)) + 2;
            const r = Math.floor(Math.random() * (rows - 4)) + 2;
            const x = c * TILE_SIZE;
            const y = r * TILE_SIZE;

            // Check Player Distance
            if (Math.abs(x - gameState.current.player.x) < 150 && Math.abs(y - gameState.current.player.y) < 150) continue;

            // Check Enemy Distance (Fix: Prevent spawning on enemy)
            if (Math.abs(x - gameState.current.enemy.x) < 100 && Math.abs(y - gameState.current.enemy.y) < 100) continue;

            obstacles.push({ x, y, w: TILE_SIZE, h: TILE_SIZE, type: 'rock' });
        }
        gameState.current.obstacles = obstacles;
    };

    const generateDungeonMap = () => {
        const obstacles = [];
        const cols = Math.ceil(800 / TILE_SIZE);
        const rows = Math.ceil(600 / TILE_SIZE);

        // Initialize Grid with Random Walls
        let grid = [];
        for (let r = 0; r < rows; r++) {
            let row = [];
            for (let c = 0; c < cols; c++) {
                // Borders are always walls
                if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
                    row.push(1);
                } else {
                    // 40% chance to start as a wall
                    row.push(Math.random() < 0.4 ? 1 : 0);
                }
            }
            grid.push(row);
        }

        // Cellular Automata Smoothing (4 iterations)
        // Rules: 
        // - If a wall has < 4 wall neighbors, it becomes a floor.
        // - If a floor has > 4 wall neighbors, it becomes a wall.
        for (let i = 0; i < 4; i++) {
            let newGrid = JSON.parse(JSON.stringify(grid));
            for (let r = 1; r < rows - 1; r++) {
                for (let c = 1; c < cols - 1; c++) {
                    let neighbors = 0;
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            if (dr === 0 && dc === 0) continue;
                            if (grid[r + dr][c + dc] === 1) neighbors++;
                        }
                    }

                    if (grid[r][c] === 1) {
                        newGrid[r][c] = neighbors < 3 ? 0 : 1;
                    } else {
                        newGrid[r][c] = neighbors > 4 ? 1 : 0;
                    }
                }
            }
            grid = newGrid;
        }

        // Convert Grid to Obstacles
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid[r][c] === 1) {
                    const x = c * TILE_SIZE;
                    const y = r * TILE_SIZE;

                    // Clear Spawn Areas (Force floor)
                    if (Math.abs(x - gameState.current.player.x) < 150 && Math.abs(y - gameState.current.player.y) < 150) continue;
                    if (Math.abs(x - gameState.current.enemy.x) < 150 && Math.abs(y - gameState.current.enemy.y) < 150) continue;

                    obstacles.push({ x, y, w: TILE_SIZE, h: TILE_SIZE, type: 'wall' });
                }
            }
        }
        gameState.current.obstacles = obstacles;
    };



    const generateRoomMap = (enemyCount) => {
        // Use BSP Generator
        const mapData = generateBSPMap(enemyCount);

        gameState.current.obstacles = mapData.obstacles;
        gameState.current.grid = mapData.grid; // Store Grid
        gameState.current.pathfinder = new Pathfinding(mapData.grid); // Init Pathfinder
        gameState.current.player.x = mapData.player.x;
        gameState.current.player.y = mapData.player.y;
        gameState.current.enemies = mapData.enemies; // Array of {x, y}
        gameState.current.door.x = mapData.door.x;
        gameState.current.door.y = mapData.door.y;
    };

    const tryMove = (entity, dx, dy, obstacles) => {
        const nextX = entity.x + dx;
        const nextY = entity.y + dy;

        let movedX = false;
        let movedY = false;

        // Try X
        const hitboxX = { x: nextX + 10, y: entity.y + 10, w: entity.width - 20, h: entity.height - 20 };
        if (!checkCollision(hitboxX, obstacles)) {
            entity.x = nextX;
            movedX = true;
        }

        // Try Y
        const hitboxY = { x: entity.x + 10, y: nextY + 10, w: entity.width - 20, h: entity.height - 20 };
        if (!checkCollision(hitboxY, obstacles)) {
            entity.y = nextY;
            movedY = true;
        }

        return movedX || movedY;
    };

    // --- A* Pathfinding ---
    // Removed as per previous instruction, keeping the comment for context.
    // For this iteration, let's stick to direct chase with slide-collision which works well for Zelda-like
    // return null;

    // --- Update Logic ---
    const update = (timestamp) => {
        const state = gameState.current;
        const { player, enemies, keys, obstacles, biome } = state;

        // 1. Player Movement & Dash
        let dx = 0;
        let dy = 0;

        // Dash Trigger
        if ((keys['ShiftLeft'] || keys['ShiftRight']) && timestamp > player.dashCooldownUntil && (keys['KeyW'] || keys['ArrowUp'] || keys['KeyS'] || keys['ArrowDown'] || keys['KeyA'] || keys['ArrowLeft'] || keys['KeyD'] || keys['ArrowRight'])) {
            player.isDashing = true;
            player.dashUntil = timestamp + 200; // 200ms Dash

            // Intelligence Scaling: Reduce Cooldown
            // Base: 1000ms. -10ms per INT. Min: 200ms.
            const intStat = playerStats.intelligence || 1;
            const cooldownReduction = intStat * 10;
            const cooldownDuration = Math.max(200, 1000 - cooldownReduction);

            player.dashCooldownUntil = timestamp + cooldownDuration;

            // Determine Dash Direction based on input
            let ddx = 0;
            let ddy = 0;
            if (keys['KeyW'] || keys['ArrowUp']) ddy -= 1;
            if (keys['KeyS'] || keys['ArrowDown']) ddy += 1;
            if (keys['KeyA'] || keys['ArrowLeft']) ddx -= 1;
            if (keys['KeyD'] || keys['ArrowRight']) ddx += 1;

            // Normalize
            if (ddx !== 0 || ddy !== 0) {
                const len = Math.sqrt(ddx * ddx + ddy * ddy);
                player.dashDirection = { x: ddx / len, y: ddy / len };
            } else {
                // Fallback to current facing if no input (shouldn't happen due to check)
                player.dashDirection = { x: 0, y: 0 };
            }
        }

        // End Dash
        if (player.isDashing && timestamp > player.dashUntil) {
            player.isDashing = false;
        }

        if (player.isDashing) {
            // Dash Movement
            const moveX = player.dashDirection.x * player.speed * 3; // 3x Speed
            const moveY = player.dashDirection.y * player.speed * 3;
            tryMove(player, moveX, moveY, obstacles);

            // Invincibility during dash
            player.invulnerableUntil = Math.max(player.invulnerableUntil, timestamp + 50);
        } else if (!player.isAttacking) {
            // Normal Movement
            if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
            if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
            if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
            if (keys['KeyD'] || keys['ArrowRight']) dx += 1;

            if (dx !== 0 || dy !== 0) {
                // Normalize diagonal
                const len = Math.sqrt(dx * dx + dy * dy);
                dx /= len;
                dy /= len;

                // Direction
                if (Math.abs(dx) > Math.abs(dy)) {
                    player.direction = dx > 0 ? 'right' : 'left';
                } else {
                    player.direction = dy > 0 ? 'down' : 'up';
                }

                const moveX = dx * player.speed;
                const moveY = dy * player.speed;

                tryMove(player, moveX, moveY, obstacles);
            }
        }

        // 2. Player Attack
        if (keys['Space'] && !player.isAttacking && timestamp > player.lastAttackTime + 500) {
            player.isAttacking = true;
            player.lastAttackTime = timestamp;
            player.attackProgress = 0;

            // Small Lunge (Safe)
            const lungeSpeed = 5;
            let lungeX = 0, lungeY = 0;
            if (player.direction === 'up') lungeY -= lungeSpeed;
            if (player.direction === 'down') lungeY += lungeSpeed;
            if (player.direction === 'left') lungeX -= lungeSpeed;
            if (player.direction === 'right') lungeX += lungeSpeed;
            tryMove(player, lungeX, lungeY, obstacles);

            // Hit Detection
            let attackX = player.x;
            let attackY = player.y;
            let attackW = player.width;
            let attackH = player.height;
            const range = SWORD_LENGTH + 20;
            const width = 80; // Even wider

            // Center the hitbox better based on direction
            if (player.direction === 'up') {
                attackY -= range;
                attackH = range;
                attackX = player.x + (player.width - width) / 2;
                attackW = width;
            }
            if (player.direction === 'down') {
                attackY += player.height;
                attackH = range;
                attackX = player.x + (player.width - width) / 2;
                attackW = width;
            }
            if (player.direction === 'left') {
                attackX -= range;
                attackW = range;
                attackY = player.y + (player.height - width) / 2;
                attackH = width;
            }
            if (player.direction === 'right') {
                attackX += player.width;
                attackW = range;
                attackY = player.y + (player.height - width) / 2;
                attackH = width;
            }

            // Store debug hitbox
            gameState.current.debugHitbox = { x: attackX, y: attackY, w: attackW, h: attackH, time: timestamp + 200 };

            // Check Hit for ALL Enemies
            enemies.forEach(enemy => {
                if (enemy.hp <= 0) return; // Skip dead enemies

                const enemyRect = { x: enemy.x, y: enemy.y, w: enemy.width, h: enemy.height };
                if (checkRectOverlap({ x: attackX, y: attackY, w: attackW, h: attackH }, enemyRect)) {
                    // Strength Scaling: Increase Damage
                    // Base: 10. +0.5 per STR.
                    const strStat = playerStats.strength || 1;
                    const damage = Math.floor(10 + (strStat * 0.5));

                    enemy.hp -= damage;

                    // Sync UI
                    setEnemiesUI(prev => prev.map(e =>
                        e.id === enemy.id ? { ...e, hp: Math.max(0, enemy.hp) } : e
                    ));

                    enemy.stunnedUntil = timestamp + 400;
                    enemy.flashUntil = timestamp + 200;

                    // Knockback
                    const knockbackForce = 40;
                    let kx = 0, ky = 0;
                    if (player.direction === 'up') ky -= knockbackForce;
                    if (player.direction === 'down') ky += knockbackForce;
                    if (player.direction === 'left') kx -= knockbackForce;
                    if (player.direction === 'right') kx += knockbackForce;
                    tryMove(enemy, kx, ky, obstacles);

                    spawnParticles(enemy.x, enemy.y, '#fbbf24', 12);
                }
            });

            // Check Victory Condition (All enemies dead)
            const allDead = enemies.every(e => e.hp <= 0);
            if (allDead) {
                if (biome === 'dungeon') {
                    state.door.open = true;
                } else {
                    // Forest: Instant win
                    state.running = false;
                    onVictory();
                }
            }
        }

        // Animate Attack
        if (player.isAttacking) {
            // Creativity Scaling: Increase Attack Speed
            // Base: 0.15. +0.002 per CRE.
            const creStat = playerStats.creativity || 1;
            const attackSpeed = 0.15 + (creStat * 0.002);

            player.attackProgress += attackSpeed;
            if (player.attackProgress >= 1) {
                player.isAttacking = false;
                player.attackProgress = 0;
            }
        }

        // 3. Enemy AI (Loop)
        enemies.forEach(enemy => {
            if (timestamp > enemy.stunnedUntil && enemy.hp > 0) { // Check Ref HP
                const dxE = player.x - enemy.x;
                const dyE = player.y - enemy.y;
                const dist = Math.sqrt(dxE * dxE + dyE * dyE);

                if (dist > 10) {
                    // Pathfinding Logic
                    if (state.pathfinder && timestamp > (enemy.lastPathTime || 0) + 500) { // Recalculate path every 500ms
                        const startX = Math.floor((enemy.x + enemy.width / 2) / TILE_SIZE);
                        const startY = Math.floor((enemy.y + enemy.height / 2) / TILE_SIZE);
                        const endX = Math.floor((player.x + player.width / 2) / TILE_SIZE);
                        const endY = Math.floor((player.y + player.height / 2) / TILE_SIZE);

                        enemy.path = state.pathfinder.findPath(startX, startY, endX, endY);
                        enemy.lastPathTime = timestamp;
                    }

                    let moveX = 0;
                    let moveY = 0;

                    // Ability: Slime Lunge
                    if ((enemy.type === 'blueSlime' || enemy.type === 'redSlime') && dist < 200 && timestamp > (enemy.abilityCooldown || 0)) {
                        enemy.isLunging = true;
                        enemy.lungeUntil = timestamp + 300; // 300ms burst
                        enemy.abilityCooldown = timestamp + 3000; // 3s cooldown
                    }

                    let speed = enemy.speed;
                    if (enemy.isLunging) {
                        if (timestamp < enemy.lungeUntil) {
                            speed *= 4; // Lunge Speed
                        } else {
                            enemy.isLunging = false;
                        }
                    }

                    if (enemy.path && enemy.path.length > 0 && !enemy.isLunging) {
                        // Move towards next node (Normal Pathfinding)
                        const nextNode = enemy.path[0];
                        let targetNode = enemy.path[1];
                        if (!targetNode) targetNode = enemy.path[0];

                        const targetX = targetNode.x * TILE_SIZE + (TILE_SIZE - enemy.width) / 2;
                        const targetY = targetNode.y * TILE_SIZE + (TILE_SIZE - enemy.height) / 2;

                        const dx = targetX - enemy.x;
                        const dy = targetY - enemy.y;
                        const len = Math.sqrt(dx * dx + dy * dy);

                        if (len > 0) {
                            moveX = (dx / len) * speed;
                            moveY = (dy / len) * speed;
                        }
                    } else {
                        // Direct Chase (Fallback or Lunge)
                        moveX = (dxE / dist) * speed;
                        moveY = (dyE / dist) * speed;
                    }

                    // Separation Force (Prevent Stacking)
                    let sepX = 0;
                    let sepY = 0;
                    enemies.forEach(other => {
                        if (enemy === other || other.hp <= 0) return;
                        const dx = enemy.x - other.x;
                        const dy = enemy.y - other.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 40 && dist > 0) { // 40px personal space
                            sepX += (dx / dist) * 2; // Push away
                            sepY += (dy / dist) * 2;
                        }
                    });

                    // Apply Separation
                    moveX += sepX;
                    moveY += sepY;

                    tryMove(enemy, moveX, moveY, obstacles);
                }
            }
        });

        // 4. Enemy Damage (Loop)
        const pRect = { x: player.x + 10, y: player.y + 10, w: player.width - 20, h: player.height - 20 };

        enemies.forEach(enemy => {
            if (enemy.hp <= 0) return;

            const eRect = { x: enemy.x + 10, y: enemy.y + 10, w: enemy.width - 20, h: enemy.height - 20 };
            if (checkRectOverlap(pRect, eRect) && timestamp > player.invulnerableUntil && timestamp > enemy.stunnedUntil) {
                const damage = Math.max(1, Math.floor(enemy.base_damage || 10)); // base_damage might be missing on object, use default
                setPlayerHP(prev => {
                    const newHP = prev - damage;
                    if (newHP <= 0) {
                        state.running = false;
                        onDefeat();
                    }
                    return newHP;
                });
                player.invulnerableUntil = timestamp + DAMAGE_COOLDOWN;
                enemy.stunnedUntil = timestamp + 500;
                spawnParticles(player.x, player.y, '#ff0000', 15);

                // Knockback
                const dx = player.x - enemy.x;
                const dy = player.y - enemy.y;
                const dirX = dx > 0 ? 1 : -1;
                const dirY = dy > 0 ? 1 : -1;
                tryMove(player, dirX * 10, dirY * 10, obstacles);
            }
        });

        // 5. Dungeon Door Logic
        if (biome === 'dungeon' && state.door.open) {
            const doorRect = { x: state.door.x + 10, y: state.door.y + 10, w: state.door.width - 20, h: state.door.height - 20 };
            const playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };

            if (checkRectOverlap(playerRect, doorRect)) {
                state.running = false;
                onVictory(); // Trigger next wave
            }
        }

        // 6. Particles
        state.particles = state.particles.filter(p => p.life > 0);
        state.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
        });
    };

    // --- Helpers ---
    const checkCollision = (rect, obstacles) => {
        // Boundary checks
        if (rect.x < 0 || rect.x + rect.w > 800 || rect.y < 0 || rect.y + rect.h > 600) return true;

        for (const obs of obstacles) {
            if (checkRectOverlap(rect, obs)) return true;
        }
        return false;
    };

    const checkRectOverlap = (r1, r2) => {
        return r1.x < r2.x + r2.w &&
            r1.x + r1.w > r2.x &&
            r1.y < r2.y + r2.h &&
            r1.y + r1.h > r2.y;
    };

    const spawnParticles = (x, y, color, count) => {
        for (let i = 0; i < count; i++) {
            gameState.current.particles.push({
                x: x + 24,
                y: y + 24,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 20 + Math.random() * 10,
                color: color
            });
        }
    };

    // --- Rendering ---
    const draw = (ctx) => {
        const state = gameState.current;
        const { player, enemies, obstacles, particles, assets, biome } = state;

        // Background
        if (biome === 'dungeon' && assets.dungeonFloor && assets.dungeonFloor.complete) {
            const ptrn = ctx.createPattern(assets.dungeonFloor, 'repeat');
            ctx.fillStyle = ptrn;
            ctx.fillRect(0, 0, state.mapWidth, state.mapHeight);
        } else if (assets.grass && assets.grass.complete) {
            const ptrn = ctx.createPattern(assets.grass, 'repeat');
            ctx.fillStyle = ptrn;
            ctx.fillRect(0, 0, state.mapWidth, state.mapHeight);
        } else {
            ctx.fillStyle = '#2d3748';
            ctx.fillRect(0, 0, state.mapWidth, state.mapHeight);
        }

        // Obstacles
        obstacles.forEach(obs => {
            if (obs.type === 'wall' && assets.dungeonWall && assets.dungeonWall.complete) {
                ctx.drawImage(assets.dungeonWall, obs.x, obs.y, obs.w, obs.h);
            } else if (obs.type === 'rock' && assets.rock && assets.rock.complete) {
                ctx.drawImage(assets.rock, obs.x, obs.y, obs.w, obs.h);
            } else {
                ctx.fillStyle = '#4a5568';
                ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
            }
        });

        // Dungeon Door
        if (biome === 'dungeon' && state.door) {
            const doorImg = state.door.open ? assets.doorOpen : assets.doorClosed;
            if (doorImg && doorImg.complete) {
                ctx.drawImage(doorImg, state.door.x, state.door.y, state.door.width, state.door.height);
            }
        }

        // Player
        ctx.save();
        if (player.invulnerableUntil > performance.now() && Math.floor(performance.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        // Draw Player Sprite
        if (player.sprite && player.sprite.complete) {
            // Flip if facing left
            if (player.direction === 'left') {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(player.sprite, -player.x - player.width, player.y, player.width, player.height);
                ctx.restore();
            } else {
                ctx.drawImage(player.sprite, player.x, player.y, player.width, player.height);
            }
        } else {
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);
        }
        ctx.globalAlpha = 1.0;

        // Draw Sword Swing
        if (player.isAttacking) {
            ctx.save();
            ctx.translate(player.x + player.width / 2, player.y + player.height / 2);

            let rotation = 0;
            if (player.direction === 'up') rotation = -Math.PI / 2;
            if (player.direction === 'down') rotation = Math.PI / 2;
            if (player.direction === 'left') rotation = Math.PI;
            if (player.direction === 'right') rotation = 0;

            // Animate arc
            const swingOffset = (player.attackProgress - 0.5) * Math.PI; // -45 to +45 deg
            ctx.rotate(rotation + swingOffset);

            // Draw Sword Blade
            ctx.fillStyle = '#e2e8f0'; // Silver
            ctx.beginPath();
            ctx.moveTo(10, -5);
            ctx.lineTo(SWORD_LENGTH, 0);
            ctx.lineTo(10, 5);
            ctx.fill();

            // Draw Handle
            ctx.fillStyle = '#854d0e'; // Brown
            ctx.fillRect(0, -3, 10, 6);

            // Draw "Swoosh" effect
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, SWORD_LENGTH, -0.2, 0.2);
            ctx.stroke();

            ctx.restore();
        }
        ctx.restore();

        // Debug Hitbox
        if (state.debugHitbox && state.debugHitbox.time > performance.now()) {
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.lineWidth = 2;
            ctx.strokeRect(state.debugHitbox.x, state.debugHitbox.y, state.debugHitbox.w, state.debugHitbox.h);
        }

        // Enemies (Loop)
        enemies.forEach(enemy => {
            if (enemy.hp > 0) {
                ctx.save();
                if (enemy.flashUntil > performance.now()) {
                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.fillStyle = 'white';
                    ctx.globalAlpha = 0.7;
                }

                if (enemy.sprite && enemy.sprite.complete) {
                    if (player.x < enemy.x) {
                        ctx.scale(-1, 1);
                        ctx.drawImage(enemy.sprite, -enemy.x - enemy.width, enemy.y, enemy.width, enemy.height);
                    } else {
                        ctx.drawImage(enemy.sprite, enemy.x, enemy.y, enemy.width, enemy.height);
                    }
                } else {
                    ctx.fillStyle = enemy.color;
                    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                }
                ctx.restore();
            }
        });

        // Particles
        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 4, 4);
        });
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-2 gap-2 overflow-hidden">
            {/* Dash Indicator */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="relative w-12 h-12 bg-gray-800 rounded-full border-2 border-white flex items-center justify-center overflow-hidden">
                    <div
                        className="absolute bottom-0 left-0 w-full bg-blue-500 opacity-50 transition-all duration-100"
                        style={{ height: `${100 - dashCooldown}%` }}
                    />
                    <div className="z-10 text-white font-bold">
                        {dashCooldown > 0 ? Math.ceil(dashCooldown / 100) : 'SHIFT'}
                    </div>
                </div>
                <span className="text-white font-bold text-sm shadow-black drop-shadow-md">DASH</span>
            </div>

            {/* Enemy HP Bars */}
            <div className="w-full max-w-[800px] bg-black border-4 border-gray-600 p-2 flex items-center justify-between shadow-xl shrink-0">

                {/* Player Stats */}
                <div className="flex flex-col gap-1 w-1/3">
                    <div className="flex items-center justify-between text-white font-mono text-xs uppercase tracking-wider">
                        <span className="text-green-400">PLAYER</span>
                        <span>{playerHP}/{playerStats.max_hp}</span>
                    </div>
                    <div className="h-4 bg-gray-800 border-2 border-gray-600 relative">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-green-500"
                            initial={{ width: '100%' }}
                            animate={{ width: `${Math.max(0, (playerHP / playerStats.max_hp) * 100)}%` }}
                            transition={{ duration: 0.2 }}
                        />
                    </div>
                </div>

                {/* Center Info (Floor/Wave) */}
                <div className="flex flex-col items-center justify-center px-4">
                    <div className="text-gray-500 font-mono font-bold text-xs uppercase tracking-widest">
                        FLOOR {floor}
                    </div>
                    <div className="text-white font-mono font-bold text-sm">
                        WAVE {wave}
                    </div>
                </div>

                {/* Enemy Stats (Stacked) */}
                <div className="flex flex-col gap-1 w-1/3">
                    {enemiesUI.map((e) => (
                        <div key={e.id} className="flex flex-col gap-0.5">
                            <div className="flex items-center justify-between text-white font-mono text-[10px] uppercase tracking-wider leading-none">
                                <span className="text-red-400">{e.type.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span>{e.hp}</span>
                            </div>
                            <div className="h-2 bg-gray-800 border border-gray-600 relative">
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-red-500"
                                    initial={{ width: '100%' }}
                                    animate={{ width: `${Math.max(0, (e.hp / e.maxHp) * 100)}%` }}
                                    transition={{ duration: 0.2 }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Canvas Container with Retro Border - Responsive Scaling */}
            <div className="relative border-[4px] border-white shadow-2xl bg-black w-full max-w-[800px] aspect-[4/3] max-h-[65vh]">
                <canvas ref={canvasRef} className="block w-full h-full object-contain" />

                {/* Controls Hint - Subtle and at the bottom */}
                <div className="absolute -bottom-6 left-0 w-full text-center text-gray-500 text-[10px] font-mono uppercase tracking-widest">
                    [WASD] Move • [SPACE] Attack
                </div>
            </div>
        </div>
    );
}
