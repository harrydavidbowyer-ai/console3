console.log("SCRIPT LOADED");

/* ========================= */
/*       SOUND ENGINE        */
/* ========================= */

const SoundEngine = (() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = AudioContext ? new AudioContext() : null;
    if (!ctx) return { play: () => {} };

    function tone(freq, duration = 0.12, type = "sine", volume = 0.2) {
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
        ui: () => tone(520, 0.08, "triangle", 0.18),
        panel: () => tone(640, 0.10, "sine", 0.22),
        chamber: () => {
            tone(340, 0.18, "sine", 0.22);
            setTimeout(() => tone(260, 0.22, "sine", 0.18), 120);
        },
        overlay: () => {
            tone(420, 0.14, "triangle", 0.22);
            setTimeout(() => tone(580, 0.18, "sine", 0.16), 90);
        },
        identity: () => {
            tone(500, 0.12, "sine", 0.22);
            setTimeout(() => tone(420, 0.12, "sine", 0.20), 90);
            setTimeout(() => tone(360, 0.16, "sine", 0.18), 180);
        },
        memory: () => {
            tone(300, 0.14, "sine", 0.2);
            setTimeout(() => tone(380, 0.18, "sine", 0.16), 120);
        }
    };

    return {
        play(name) {
            const v = voices[name];
            if (!v) return;
            if (ctx.state === "suspended") ctx.resume().then(v);
            else v();
        }
    };
})();

/* ========================= */
/*     GENERIC OVERLAY       */
/* ========================= */

const overlay = document.getElementById("overlay");
const overlayContent = document.querySelector(".overlay-content");

function showOverlay(content) {
    overlayContent.innerHTML = content;
    overlay.classList.add("showing");
    SoundEngine.play("overlay");
}

overlay.addEventListener("click", () => {
    overlay.classList.remove("showing");
});

/* ========================= */
/*        CONSOLE UI         */
/* ========================= */

const consoleToggle = document.getElementById("console-toggle");
const consoleEl = document.getElementById("console");
const navItems = document.querySelectorAll(".console-nav li");
const panels = document.querySelectorAll(".console-panel");

consoleToggle.addEventListener("click", () => {
    consoleEl.classList.toggle("visible");
    SoundEngine.play("ui");
});

navItems.forEach(item => {
    item.addEventListener("click", () => {
        const target = item.dataset.panel;

        navItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        panels.forEach(p => p.classList.remove("visible"));
        document.getElementById(target).classList.add("visible");

        SoundEngine.play("panel");

        if (target === "identity") {
            setTimeout(() => SoundEngine.play("identity"), 200);
        }
    });
});

/* ========================= */
/*   IDENTITY DRIFT ENGINE   */
/* ========================= */

function triggerIdentityDrift() {
    const drift = document.getElementById("identity-drift");
    drift.classList.add("showing");
    SoundEngine.play("identity");

    setTimeout(() => drift.classList.remove("showing"), 2500);

    setTimeout(() => addMemory("Identity drift event completed."), 2600);

    setTimeout(() => {
        triggerRitual({
            title: "Post‑Drift Alignment",
            description: "Stabilizing the new self‑state."
        });
    }, 2600);
}

/* ========================= */
/*       RITUAL ENGINE       */
/* ========================= */

function triggerRitual({ title = "Ritual", description = "Ignition sequence initializing…" } = {}) {
    const overlayR = document.getElementById("ritual-overlay");
    const titleEl = document.getElementById("ritual-title");
    const descEl = document.getElementById("ritual-description");

    titleEl.textContent = title;
    descEl.textContent = description;

    overlayR.classList.add("showing");
    SoundEngine.play("overlay");

    setTimeout(() => overlayR.classList.remove("showing"), 3000);

    setTimeout(() => addMemory(`Ritual completed: ${title}`), 3200);
}

/* ========================= */
/*       MEMORY ENGINE       */
/* ========================= */

const MemoryStore = [];

function renderMemoryPanel() {
    const panel = document.querySelector("#memory .memory-list");
    if (!panel) return;

    panel.innerHTML = MemoryStore.map(m => `
        <div class="memory-entry">
            <div class="memory-entry-glyph">⧉</div>
            <div>
                <strong>${m.timestamp}</strong><br>
                ${m.text}
            </div>
        </div>
    `).join("");

    const memoryChamberGlyph = document.querySelector('[data-chamber="memory"] .glyph');
    if (memoryChamberGlyph) {
        memoryChamberGlyph.style.transform = "scale(1.15)";
        memoryChamberGlyph.style.transition = "transform 0.6s ease";
        setTimeout(() => memoryChamberGlyph.style.transform = "scale(1)", 600);
    }
}

function addMemory(text = "A cycle was recorded.") {
    MemoryStore.push({
        text,
        timestamp: new Date().toLocaleTimeString()
    });

    document.getElementById("memory-text").textContent = text;

    const memOverlay = document.getElementById("memory-overlay");
    memOverlay.classList.add("showing");
    SoundEngine.play("memory");

    setTimeout(() => memOverlay.classList.remove("showing"), 2500);

    renderMemoryPanel();
}

/* ========================= */
/*       CHAMBER ENGINE      */
/* ========================= */

document.querySelectorAll(".chamber").forEach(chamber => {
    chamber.addEventListener("click", () => {
        const id = chamber.dataset.chamber;
        SoundEngine.play("chamber");

        const nav = document.querySelector(`.console-nav li[data-panel="${id}"]`);
        if (nav) {
            navItems.forEach(i => i.classList.remove("active"));
            nav.classList.add("active");
            panels.forEach(p => p.classList.remove("visible"));
            document.getElementById(id).classList.add("visible");
            SoundEngine.play("panel");
        }

        if (id === "identity") return triggerIdentityDrift();
        if (id === "ritual") return triggerRitual({
            title: "Ritual Ignition",
            description: "Cycle ignition sequence engaged."
        });
        if (id === "memory") return addMemory("Memory chamber accessed.");
        if (id === "core") return showOverlay("<h2>Core Chamber</h2><p>Primary locus of the organism.</p>");
    });
});

/* ========================= */
/*        BOOT ENGINE        */
/* ========================= */

function runBootSequence() {
    const boot = document.getElementById("boot-overlay");
    SoundEngine.play("overlay");

    setTimeout(() => SoundEngine.play("identity"), 1800);

    setTimeout(() => boot.classList.add("hidden"), 2800);

    const chambers = document.querySelector(".chamber-grid");
    chambers.style.opacity = "0";
    chambers.style.transition = "opacity 1.2s ease";

    setTimeout(() => chambers.style.opacity = "1", 3000);

    const consoleEl = document.getElementById("console");
    consoleEl.style.boxShadow = "none";

    setTimeout(() => {
        consoleEl.style.transition = "box-shadow 1.4s ease";
        consoleEl.style.boxShadow = "-12px 0 28px rgba(255, 140, 0, 0.28)";
    }, 3200);
}

window.addEventListener("load", runBootSequence);
