/* ========================= */
/*       SOUND ENGINE        */
/* ========================= */

const SoundEngine = (() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = AudioContext ? new AudioContext() : null;

    if (!ctx) {
        return { play: () => {} };
    }

    function beep({ freq = 440, duration = 0.12, type = "sine", volume = 0.2 } = {}) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = volume;

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    }

    const voices = {
        console: () => beep({ freq: 520, type: "square", duration: 0.08 }),
        panel: () => beep({ freq: 640, type: "triangle", duration: 0.07 }),
        chamber: () => beep({ freq: 420, type: "sine", duration: 0.14 }),
        overlay: () => beep({ freq: 360, type: "sine", duration: 0.18, volume: 0.25 }),
        memory: () => {
            beep({ freq: 700, type: "triangle", duration: 0.06 });
            setTimeout(() => beep({ freq: 880, type: "triangle", duration: 0.06 }), 70);
        },
        ritual: () => {
            beep({ freq: 320, type: "sine", duration: 0.18 });
            setTimeout(() => beep({ freq: 260, type: "sine", duration: 0.22 }), 120);
        },
        identity: () => {
            beep({ freq: 500, type: "sine", duration: 0.12 });
            setTimeout(() => beep({ freq: 420, type: "sine", duration: 0.12 }), 90);
            setTimeout(() => beep({ freq: 360, type: "sine", duration: 0.16 }), 180);
        }
    };

    return {
        play(name) {
            const v = voices[name];
            if (!v) return;
            // resume context if needed (autoplay policies)
            if (ctx.state === "suspended") {
                ctx.resume().then(v);
            } else {
                v();
            }
        }
    };
})();
