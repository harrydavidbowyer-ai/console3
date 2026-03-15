/* ========================= */
/*       EVENT BUS           */
/* ========================= */

const EventBus = {
    events: {},
    on(event, handler) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(handler);
    },
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(h => h(data));
        }
    }
};

/* ========================= */
/*       STATE MACHINE       */
/* ========================= */

const State = {
    currentPanel: null,
    currentChamber: null
};

/* ========================= */
/*       CONSOLE ENGINE      */
/* ========================= */

const consoleToggle = document.getElementById("console-toggle");
const consoleEl = document.getElementById("console");
const navItems = document.querySelectorAll(".console-nav li");
const panels = document.querySelectorAll(".console-panel");

consoleToggle.addEventListener("click", () => {
    consoleEl.classList.toggle("visible");
    SoundEngine.play("console");
});

navItems.forEach(item => {
    item.addEventListener("click", () => {
        const target = item.dataset.panel;

        panels.forEach(p => p.classList.remove("visible"));
        document.getElementById(target).classList.add("visible");

        State.currentPanel = target;
        SoundEngine.play("panel");
    });
});

/* ========================= */
/*       CHAMBER ENGINE      */
/* ========================= */

const chambers = document.querySelectorAll(".chamber");

chambers.forEach(chamber => {
    chamber.addEventListener("click", () => {
        State.currentChamber = chamber.id;
        SoundEngine.play("chamber");
    });
});

/* ========================= */
/*       OVERLAY ENGINE      */
/* ========================= */

const overlay = document.getElementById("overlay");
const overlayContent = document.querySelector(".overlay-content");

EventBus.on("overlay", content => {
    overlayContent.innerHTML = content;
    overlay.classList.remove("hidden");
    SoundEngine.play("overlay");
});

overlay.addEventListener("click", () => {
    overlay.classList.add("hidden");
});

/* ========================= */
/*       MEMORY ENGINE       */
/* ========================= */

const MemoryEngine = {
    store: [],
    add(entry) {
        this.store.push(entry);
        SoundEngine.play("memory");
    }
};

/* ========================= */
/*       RITUAL ENGINE       */
/* ========================= */

const RitualEngine = {
    run(name) {
        EventBus.emit("overlay", `<h2>Ritual: ${name}</h2>`);
        SoundEngine.play("ritual");
    }
};

/* ========================= */
/*   IDENTITY DRIFT ENGINE   */
/* ========================= */

const IdentityEngine = {
    drift() {
        EventBus.emit("overlay", `<h2>Identity Drift Initiated</h2>`);
        SoundEngine.play("identity");
    }
};

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
            if (ctx.state === "suspended") {
                ctx.resume().then(v);
            } else {
                v();
            }
        }
    };
})();
