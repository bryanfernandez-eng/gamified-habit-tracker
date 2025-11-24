import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ParticleSystem({ particles }) {
    return (
        <AnimatePresence>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{
                        x: p.x,
                        y: p.y,
                        scale: 0,
                        opacity: 1,
                        rotate: Math.random() * 360
                    }}
                    animate={{
                        x: p.x + (Math.random() * 100 - 50),
                        y: p.y + (Math.random() * 100 - 50),
                        scale: Math.random() * 1.5,
                        opacity: 0,
                        rotate: Math.random() * 360 + 360
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute pointer-events-none z-50"
                    style={{
                        width: p.size || 10,
                        height: p.size || 10,
                        backgroundColor: p.color,
                        borderRadius: p.shape === 'circle' ? '50%' : '0%',
                        boxShadow: `0 0 10px ${p.color}`
                    }}
                />
            ))}
        </AnimatePresence>
    );
}

export function FlashEffect({ active }) {
    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="absolute inset-0 bg-white z-50 pointer-events-none mix-blend-overlay"
                />
            )}
        </AnimatePresence>
    );
}
