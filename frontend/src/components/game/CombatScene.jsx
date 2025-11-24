import React, { useState, useEffect, useRef } from 'react';
import { Heart, Shield, Zap, Sword, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DefaultImg from '/src/assets/default.png';
import ZoroImg from '/src/assets/zoro.png';
import { soundManager } from '../../services/soundManager';
import { ParticleSystem, FlashEffect } from './ParticleSystem';

export function CombatScene({ playerStats, enemy, onVictory, onDefeat }) {
    const [playerHP, setPlayerHP] = useState(playerStats.current_hp);
    const [enemyHP, setEnemyHP] = useState(enemy.base_hp);
    const [turn, setTurn] = useState('player'); // 'player' or 'enemy'
    const [combatLog, setCombatLog] = useState([]);
    const [animating, setAnimating] = useState(false);
    const [damageFloating, setDamageFloating] = useState(null); // { target: 'player'|'enemy', amount: 10, type: 'crit'|'normal'|'miss' }
    const [particles, setParticles] = useState([]);
    const [flash, setFlash] = useState(false);
    const [screenShake, setScreenShake] = useState(false);

    // Combat Constants
    const TURN_DELAY = 1500; // ms between turns

    useEffect(() => {
        // Initialize Audio Context on first interaction
        soundManager.init();
    }, []);

    useEffect(() => {
        if (playerHP <= 0) {
            soundManager.playDefeat();
            setTimeout(() => onDefeat(), 1000);
            return;
        }
        if (enemyHP <= 0) {
            soundManager.playVictory();
            setTimeout(() => onVictory(), 1000);
            return;
        }

        if (!animating) {
            const timer = setTimeout(() => {
                executeTurn();
            }, TURN_DELAY);
            return () => clearTimeout(timer);
        }
    }, [turn, animating, playerHP, enemyHP]);

    const getCharacterImage = () => {
        const characterMap = {
            'default': DefaultImg,
            'zoro': ZoroImg
        }
        return characterMap[playerStats.selected_character] || DefaultImg
    }

    const spawnParticles = (x, y, color, count = 10) => {
        const newParticles = Array.from({ length: count }).map((_, i) => ({
            id: Date.now() + i,
            x,
            y,
            color,
            size: Math.random() * 8 + 4,
            shape: Math.random() > 0.5 ? 'circle' : 'square'
        }));
        setParticles(prev => [...prev, ...newParticles]);

        // Cleanup particles
        setTimeout(() => {
            setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 1000);
    };

    const triggerScreenShake = () => {
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 300);
    };

    const executeTurn = () => {
        setAnimating(true);

        if (turn === 'player') {
            // Player attacks Enemy
            const performPlayerAttack = (isDouble = false) => {
                const hitChance = 0.9;
                const dodgeChance = 0.05;

                let damage = (playerStats.strength * 5) + 5;
                let isCrit = Math.random() < (playerStats.intelligence * 0.01);
                let isMiss = Math.random() < dodgeChance;

                if (isCrit) damage = Math.floor(damage * 1.5);
                if (isMiss) damage = 0;

                // Attack Sound
                soundManager.playAttack();

                // Animation Sequence
                setTimeout(() => {
                    // Impact Moment
                    if (!isMiss) {
                        setEnemyHP(prev => {
                            const newHP = Math.max(0, prev - damage);
                            return newHP;
                        });

                        if (isCrit) {
                            soundManager.playCrit();
                            setFlash(true);
                            setTimeout(() => setFlash(false), 100);
                            triggerScreenShake();
                            spawnParticles(600, 200, '#FFD700', 20); // Gold sparks
                        } else {
                            soundManager.playHit();
                            spawnParticles(600, 200, '#FFFFFF', 10); // White sparks
                        }
                    } else {
                        soundManager.playMiss();
                    }

                    setDamageFloating({
                        target: 'enemy',
                        amount: damage,
                        type: isMiss ? 'miss' : (isCrit ? 'crit' : 'normal'),
                        text: isDouble ? "DOUBLE HIT!" : null
                    });

                    const logMsg = isMiss
                        ? `You missed ${enemy.name}!`
                        : `You hit ${enemy.name} for ${damage} damage!${isCrit ? ' (CRITICAL!)' : ''}${isDouble ? ' (DOUBLE HIT!)' : ''}`;

                    setCombatLog(prev => [logMsg, ...prev].slice(0, 5));

                    // Check for Double Hit (Creativity) ONLY on first hit
                    if (!isDouble && !isMiss && Math.random() < (playerStats.creativity * 0.02)) { // 2% per creativity level
                        setTimeout(() => {
                            performPlayerAttack(true);
                        }, 500);
                    } else if (!isDouble) {
                        setTimeout(() => {
                            setDamageFloating(null);
                            setTurn('enemy');
                            setAnimating(false);
                        }, 800);
                    } else {
                        // End turn after double hit
                        setTimeout(() => {
                            setDamageFloating(null);
                            setTurn('enemy');
                            setAnimating(false);
                        }, 800);
                    }
                }, 400); // Sync with lunge animation
            };

            performPlayerAttack();

        } else {
            // Enemy attacks Player
            const dodgeChance = playerStats.social * 0.005;

            let damage = enemy.base_damage;
            let isMiss = Math.random() < dodgeChance;

            if (isMiss) damage = 0;

            soundManager.playAttack();

            setTimeout(() => {
                if (!isMiss) {
                    setPlayerHP(prev => Math.max(0, prev - damage));
                    soundManager.playHit();
                    triggerScreenShake();
                    spawnParticles(200, 200, '#FF0000', 15); // Blood/Red sparks
                } else {
                    soundManager.playMiss();
                }

                setDamageFloating({ target: 'player', amount: damage, type: isMiss ? 'miss' : 'normal' });

                const logMsg = isMiss
                    ? `${enemy.name} missed you!`
                    : `${enemy.name} hit you for ${damage} damage!`;

                setCombatLog(prev => [logMsg, ...prev].slice(0, 5));

                setTimeout(() => {
                    setDamageFloating(null);
                    setTurn('player');
                    setAnimating(false);
                }, 800);
            }, 400);
        }
    };

    return (
        <div className="w-full h-full p-4 flex flex-col justify-between">
            {/* Battle Arena */}
            <motion.div
                animate={screenShake ? { x: [-5, 5, -5, 5, 0], y: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.3 }}
                className="relative flex-1 flex justify-between items-end min-h-[400px]"
            >
                {/* Effects Layer */}
                <FlashEffect active={flash} />
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                    <ParticleSystem particles={particles} />
                </div>

                {/* Player Side */}
                <div className="relative w-1/3 flex flex-col items-center z-10 mb-8">
                    <motion.div
                        animate={
                            turn === 'player' && animating
                                ? { x: [0, -50, 400, 0], scale: [1, 0.9, 1.2, 1] } // Windup -> Lunge -> Return
                                : {}
                        }
                        transition={{ duration: 0.8, times: [0, 0.2, 0.5, 1] }}
                        className="w-48 h-48 relative"
                    >
                        {/* Character Frame - Retro Style */}
                        <div className="absolute inset-0 border-4 border-rulebook-ink bg-rulebook-paper/20 rounded-full shadow-lg"></div>

                        <img
                            src={getCharacterImage()}
                            alt="Hero"
                            className="w-full h-full object-contain relative z-10 drop-shadow-md"
                        />
                    </motion.div>

                    {/* Player Stats */}
                    <div className="w-full max-w-[200px] mt-4 bg-rulebook-paper border-2 border-rulebook-ink p-2 shadow-md">
                        <div className="flex justify-between text-xs font-bold mb-1 text-rulebook-ink font-serif tracking-widest">
                            <span>HERO</span>
                            <span>{playerHP}/{playerStats.max_hp} HP</span>
                        </div>
                        {/* Retro HP Bar */}
                        <div className="w-full h-4 bg-rulebook-ink/20 border border-rulebook-ink relative">
                            <motion.div
                                initial={{ width: '100%' }}
                                animate={{ width: `${(playerHP / playerStats.max_hp) * 100}%` }}
                                transition={{ type: 'spring', stiffness: 100 }}
                                className="h-full bg-rulebook-crimson relative"
                            >
                            </motion.div>
                        </div>
                    </div>

                    {/* Floating Damage */}
                    <AnimatePresence>
                        {damageFloating?.target === 'player' && (
                            <motion.div
                                initial={{ y: -50, opacity: 0, scale: 0.5 }}
                                animate={{ y: -100, opacity: 1, scale: 1.5 }}
                                exit={{ opacity: 0 }}
                                className="absolute top-0 left-1/2 -translate-x-1/2 text-5xl font-black text-rulebook-crimson drop-shadow-[2px_2px_0_#fff] stroke-black z-30 font-serif"
                            >
                                {damageFloating.type === 'miss' ? 'MISS' : `-${damageFloating.amount}`}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* VS Indicator */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 pointer-events-none">
                    <div className="text-8xl font-black text-white/20 font-serif mb-4 drop-shadow-lg select-none">VS</div>
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`px-8 py-3 rounded-sm text-sm font-bold uppercase tracking-[0.2em] shadow-lg border-2 ${turn === 'player' ? 'bg-rulebook-paper text-rulebook-ink border-rulebook-ink' : 'bg-rulebook-crimson text-rulebook-paper border-rulebook-ink'}`}
                    >
                        {turn === 'player' ? "Your Turn" : "Enemy Turn"}
                    </motion.div>
                </div>

                {/* Enemy Side */}
                <div className="relative w-1/3 flex flex-col items-center z-10 mb-8">
                    <motion.div
                        animate={
                            turn === 'enemy' && animating
                                ? { x: [0, 50, -400, 0], scale: [1, 0.9, 1.2, 1] }
                                : {}
                        }
                        transition={{ duration: 0.8, times: [0, 0.2, 0.5, 1] }}
                        className="w-48 h-48 relative"
                    >
                        {/* Enemy Frame - Retro Style */}
                        <div className="absolute inset-0 border-4 border-rulebook-crimson bg-rulebook-paper/20 rounded-full shadow-lg"></div>

                        {enemy.sprite_path ? (
                            <img src={enemy.sprite_path} alt={enemy.name} className="w-full h-full object-contain transform scale-x-[-1] relative z-10 drop-shadow-md" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center relative z-10">
                                <Skull size={80} className="text-gray-300" />
                            </div>
                        )}
                    </motion.div>

                    {/* Enemy Stats */}
                    <div className="w-full max-w-[200px] mt-4 bg-rulebook-paper border-2 border-rulebook-ink p-2 shadow-md">
                        <div className="flex justify-between text-xs font-bold mb-1 text-rulebook-ink font-serif tracking-widest">
                            <span>{enemy.name}</span>
                            <span>{enemyHP}/{enemy.base_hp} HP</span>
                        </div>
                        {/* Retro HP Bar */}
                        <div className="w-full h-4 bg-rulebook-ink/20 border border-rulebook-ink relative">
                            <motion.div
                                initial={{ width: '100%' }}
                                animate={{ width: `${(enemyHP / enemy.base_hp) * 100}%` }}
                                transition={{ type: 'spring', stiffness: 100 }}
                                className="h-full bg-purple-600 relative"
                            >
                            </motion.div>
                        </div>
                    </div>

                    {/* Floating Damage */}
                    <AnimatePresence>
                        {damageFloating?.target === 'enemy' && (
                            <motion.div
                                initial={{ y: -50, opacity: 0, scale: 0.5 }}
                                animate={{ y: -100, opacity: 1, scale: damageFloating.type === 'crit' ? 2 : 1.5 }}
                                exit={{ opacity: 0 }}
                                className="absolute top-0 left-1/2 -translate-x-1/2 text-5xl font-black text-white drop-shadow-[2px_2px_0_#000] z-30 font-serif"
                            >
                                {damageFloating.type === 'miss' ? 'MISS' : (
                                    <span className={damageFloating.type === 'crit' ? 'text-yellow-400' : 'text-white'}>
                                        {damageFloating.amount}{damageFloating.type === 'crit' ? '!' : ''}
                                    </span>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Combat Log - Retro Panel */}
            <div className="mt-4 bg-rulebook-paper border-2 border-rulebook-ink p-4 rounded-sm h-32 overflow-y-auto font-mono text-sm shadow-inner text-rulebook-ink">
                <AnimatePresence initial={false}>
                    {combatLog.map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-1 border-b border-rulebook-ink/10 pb-1 last:border-0"
                        >
                            <span className="text-rulebook-ink/50 mr-2">[{i + 1}]</span>
                            {log}
                        </motion.div>
                    ))}
                </AnimatePresence>
                {combatLog.length === 0 && (
                    <div className="text-rulebook-ink/40 italic text-center mt-8">Battle starting...</div>
                )}
            </div>
        </div>
    );
}
