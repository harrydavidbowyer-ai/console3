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

const SoundEngine = {
    sounds: {
        console: new Audio("https://assets.mixkit.co/sfx/preview/mixkit-interface-click-1126.mp3"),
        panel: new Audio("https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3"),
        chamber: new Audio("https://assets.mixkit.co/sfx/preview/mixkit-soft-quick-swoosh-1464.mp3"),
        overlay: new Audio("https://assets.mixkit.co/sfx/preview/mixkit-air-woosh-1489.mp3"),
        memory: new Audio("https://assets.mixkit.co/sfx/preview/mixkit-small-win-2020.mp3"),
        ritual: new Audio("https://assets.mixkit.co/sfx/preview/mixkit-mystery-alert-234.mp3"),
        identity: new Audio("https://assets.mixkit.co/sfx/preview/mixkit-arcade-retro-game-over-213.mp3")
    },
    play(name) {
        const sound = this.sounds[name];
        if (sound) {
            sound.currentTime = 0;
            sound.play();
        }
    }
};
