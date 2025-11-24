// frontend/src/services/soundManager.js

class SoundManager {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.3; // Default volume
            this.masterGain.connect(this.ctx.destination);
            this.initialized = true;
        } catch (e) {
            console.error('Web Audio API not supported', e);
        }
    }

    playTone(freq, type, duration, startTime = 0) {
        if (!this.initialized) this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

        gain.gain.setValueAtTime(1, this.ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(this.ctx.currentTime + startTime);
        osc.stop(this.ctx.currentTime + startTime + duration);
    }

    playNoise(duration) {
        if (!this.initialized) this.init();
        if (!this.ctx) return;

        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        noise.connect(gain);
        gain.connect(this.masterGain);

        noise.start();
    }

    // --- SFX Presets ---

    playAttack() {
        // Swoosh sound
        this.playTone(600, 'triangle', 0.1);
        this.playTone(300, 'sine', 0.15, 0.05);
    }

    playHit() {
        // Impact noise
        this.playNoise(0.1);
        this.playTone(100, 'square', 0.1);
    }

    playCrit() {
        // High pitched impact
        this.playNoise(0.2);
        this.playTone(800, 'sawtooth', 0.1);
        this.playTone(1200, 'square', 0.2, 0.05);
    }

    playMiss() {
        // Whiff sound
        this.playTone(200, 'sine', 0.1);
    }

    playVictory() {
        // Fanfare
        const now = 0;
        this.playTone(440, 'square', 0.2, now);
        this.playTone(554, 'square', 0.2, now + 0.2);
        this.playTone(659, 'square', 0.4, now + 0.4);
    }

    playDefeat() {
        // Sad trombone
        const now = 0;
        this.playTone(300, 'sawtooth', 0.4, now);
        this.playTone(280, 'sawtooth', 0.4, now + 0.4);
        this.playTone(200, 'sawtooth', 0.8, now + 0.8);
    }
}

export const soundManager = new SoundManager();
