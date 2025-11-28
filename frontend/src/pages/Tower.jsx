import React, { useState, useEffect } from 'react';
import { Layout } from '../components/game/Layout';
import { RealTimeCombatScene } from '../components/game/RealTimeCombatScene';
import { gameApi } from '../services/gameApi';
import Loader from '../components/Loader';
import { Sword, Skull, Trophy, ArrowRight, Flame, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PixelForestBg from '/src/assets/themes/forest-pixel.jpg';

export function Tower() {
    const [gameState, setGameState] = useState('loading'); // loading, lobby, combat, victory, defeat
    const [userStats, setUserStats] = useState(null);
    const [floorData, setFloorData] = useState(null); // { floor: 1, waves: [] }
    const [currentWaveIndex, setCurrentWaveIndex] = useState(0);
    const [rewards, setRewards] = useState(null);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            const stats = await gameApi.getUserStats();
            setUserStats(stats);
            setGameState('lobby');
        } catch (error) {
            console.error('Failed to load tower data:', error);
        }
    };

    const handleStartFloor = async () => {
        try {
            setGameState('loading');
            const data = await gameApi.startTowerFloor();
            setFloorData(data);
            setCurrentWaveIndex(0);
            setGameState('combat');
        } catch (error) {
            console.error('Failed to start floor:', error);
            setGameState('lobby');
        }
    };

    const handleWaveVictory = () => {
        if (currentWaveIndex < floorData.waves.length - 1) {
            // Next Wave
            setCurrentWaveIndex(prev => prev + 1);
        } else {
            // Floor Complete
            completeFloor();
        }
    };

    const completeFloor = async () => {
        try {
            const result = await gameApi.completeTowerFloor();
            setRewards(result);
            setGameState('victory');
            // Update local stats with new stats from server
            if (result.user_stats) {
                setUserStats(result.user_stats);
            }
        } catch (error) {
            console.error('Failed to complete floor:', error);
        }
    };

    const handleDefeat = () => {
        setGameState('defeat');
    };

    const handleReturnToLobby = () => {
        setGameState('lobby');
        setFloorData(null);
        setRewards(null);
    };

    if (gameState === 'loading') {
        return (
            <Layout title="The Tower">
                <div className="flex justify-center items-center h-64">
                    <Loader />
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="The Tower">
            <div className="max-w-4xl mx-auto relative min-h-[600px] overflow-hidden rounded-xl border-4 border-rulebook-charcoal shadow-2xl bg-rulebook-paper">

                {/* Background Image - Visible in all states, dimmed in lobby/menus */}
                <div
                    className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${gameState === 'defeat' ? 'grayscale sepia contrast-125' : ''}`}
                    style={{ backgroundImage: `url(${PixelForestBg})` }}
                >
                    {/* Overlay to ensure text readability but keep BG visible */}
                    <div className={`absolute inset-0 bg-rulebook-paper/40 backdrop-sepia-[.3] ${gameState !== 'combat' ? 'bg-rulebook-paper/80' : ''}`}></div>
                </div>

                <div className={`relative z-10 h-full flex flex-col items-center justify-center min-h-[600px] ${gameState === 'combat' ? 'p-0' : 'p-8'}`}>

                    {/* LOBBY STATE - "The Campfire" */}
                    {gameState === 'lobby' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center w-full max-w-md"
                        >
                            <div className="mb-8 flex flex-col items-center">
                                <div className="w-24 h-24 bg-rulebook-paper rounded-full flex items-center justify-center mb-4 border-4 border-rulebook-ink shadow-lg">
                                    <Flame size={48} className="text-orange-600" />
                                </div>
                                <h2 className="text-4xl font-serif font-black text-rulebook-ink mb-2 tracking-widest uppercase border-b-4 border-rulebook-ink pb-2">
                                    The Campfire
                                </h2>
                                <p className="text-rulebook-ink/80 font-serif italic text-lg">
                                    Rest here, hero. The tower looms above.
                                </p>
                            </div>

                            {/* Mission Briefing Scroll */}
                            <div className="bg-[#f4e4bc] text-rulebook-ink p-8 rounded-sm shadow-xl border-2 border-rulebook-ink relative mb-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-rulebook-crimson rounded-full border-2 border-rulebook-ink"></div>
                                <h3 className="font-serif font-bold text-2xl mb-4 border-b-2 border-rulebook-ink/20 pb-2 uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Map size={20} /> Mission Briefing
                                </h3>

                                <div className="space-y-4 font-mono text-sm">
                                    <div className="flex justify-between items-center border-b border-rulebook-ink/10 pb-2">
                                        <span className="font-bold text-rulebook-ink/70">Objective</span>
                                        <span className="font-black text-rulebook-crimson">Clear 5 Waves</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-rulebook-ink/10 pb-2">
                                        <span className="font-bold text-rulebook-ink/70">Difficulty</span>
                                        <span className="font-black text-rulebook-ink">Normal</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-rulebook-ink/70">Rewards</span>
                                        <span className="font-black text-rulebook-royal">EXP & Glory</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleStartFloor}
                                className="w-full py-4 bg-rulebook-crimson text-rulebook-paper font-serif font-black text-xl uppercase tracking-[0.2em] hover:bg-rulebook-ink transition-colors shadow-lg border-2 border-rulebook-ink rounded-sm flex items-center justify-center gap-3 group"
                            >
                                <Sword size={24} className="group-hover:rotate-45 transition-transform" />
                                Begin Ascent
                            </button>
                        </motion.div>
                    )}

                    {/* COMBAT STATE */}
                    {gameState === 'combat' && floorData && (
                        <div className="w-full h-full flex flex-col">
                            <div className="flex-1 w-full h-full">
                                <RealTimeCombatScene
                                    key={currentWaveIndex}
                                    playerStats={userStats}
                                    enemy={floorData.waves[currentWaveIndex]}
                                    onVictory={handleWaveVictory}
                                    onDefeat={handleDefeat}
                                    floor={floorData.floor}
                                    wave={currentWaveIndex + 1}
                                />
                            </div>
                        </div>
                    )}

                    {/* VICTORY STATE */}
                    {gameState === 'victory' && rewards && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center relative bg-rulebook-paper p-12 border-4 border-double border-rulebook-ink shadow-2xl max-w-lg"
                        >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-rulebook-royal rotate-45 border-4 border-rulebook-ink z-0"></div>

                            <motion.div
                                initial={{ y: -20 }}
                                animate={{ y: 0 }}
                                className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-rulebook-ink shadow-md relative z-10"
                            >
                                <Trophy size={48} className="text-yellow-600" />
                            </motion.div>

                            <h2 className="text-5xl font-serif font-black text-rulebook-ink mb-4 uppercase tracking-widest border-b-4 border-rulebook-ink pb-4">
                                Victory!
                            </h2>
                            <p className="text-xl font-serif text-rulebook-ink/80 mb-8 italic">
                                The floor is cleared.
                            </p>

                            <div className="bg-rulebook-ink/5 border-2 border-rulebook-ink p-6 rounded-sm mb-8">
                                <h3 className="font-mono font-bold text-sm text-rulebook-ink/50 uppercase mb-4 tracking-widest">Rewards Acquired</h3>
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-center p-3 bg-white border border-rulebook-ink/20 shadow-sm">
                                        <span className="font-serif font-bold text-rulebook-ink text-lg">Experience</span>
                                        <span className="font-mono font-black text-rulebook-royal text-xl">+{rewards.xp_earned} XP</span>
                                    </div>

                                    {rewards.item_reward && (
                                        <div className="flex flex-col p-3 bg-white border-2 border-rulebook-royal/50 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 bg-rulebook-royal text-white text-xs px-2 py-1 font-bold uppercase tracking-wider">
                                                New Item
                                            </div>
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className="w-12 h-12 bg-rulebook-ink/10 rounded-sm flex items-center justify-center border border-rulebook-ink/20">
                                                    {/* Placeholder Icon if sprite fails */}
                                                    <Sword size={24} className="text-rulebook-ink/50" />
                                                </div>
                                                <div>
                                                    <div className="font-serif font-black text-rulebook-ink text-lg leading-none">
                                                        {rewards.item_reward.name}
                                                    </div>
                                                    <div className="text-xs font-mono text-rulebook-ink/60 uppercase">
                                                        {rewards.item_reward.equipment_slot}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                {Object.entries(rewards.item_reward.stat_bonus || {}).map(([stat, val]) => (
                                                    <div key={stat} className="flex justify-between items-center text-sm bg-rulebook-ink/5 px-2 py-1 rounded-sm">
                                                        <span className="capitalize font-serif text-rulebook-ink/80">{stat}</span>
                                                        <span className="font-mono font-bold text-green-600">+{val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleReturnToLobby}
                                className="px-10 py-3 bg-rulebook-ink text-rulebook-paper font-serif font-black text-lg uppercase tracking-widest hover:bg-rulebook-crimson transition-colors shadow-lg border-2 border-transparent hover:border-rulebook-ink"
                            >
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {/* DEFEAT STATE */}
                    {gameState === 'defeat' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center bg-rulebook-charcoal p-12 border-4 border-rulebook-ink shadow-2xl max-w-lg"
                        >
                            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-gray-600">
                                <Skull size={48} className="text-gray-400" />
                            </div>

                            <h2 className="text-5xl font-serif font-black text-gray-200 mb-4 uppercase tracking-widest border-b-4 border-gray-600 pb-4">
                                You Died
                            </h2>
                            <p className="text-xl font-serif text-gray-400 mb-8 italic">
                                Your journey ends here... for now.
                            </p>

                            <button
                                onClick={handleReturnToLobby}
                                className="px-10 py-3 bg-transparent border-2 border-gray-400 text-gray-300 font-serif font-bold text-lg uppercase tracking-widest hover:bg-gray-200 hover:text-rulebook-ink transition-all"
                            >
                                Return to Campfire
                            </button>
                        </motion.div>
                    )}

                </div>
            </div>
        </Layout>
    );
}

