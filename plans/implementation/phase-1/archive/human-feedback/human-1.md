For an agentic engineer operating at your velocity, **Phase 1: THE COMMANDER & THE ORB** is the critical "Genesis" phase. This phase establishes the "Deterministic Shell"—the physical container for your AISP protocol.

Here is the breakdown of **Phase 1**, divided into four high-velocity sub-phases, each with **one major accomplishment** to prove the concept.

---

### Phase 1: CORE BUILDER (The Deterministic Shell)
**Major Accomplishment:** A high-fidelity, 3-panel "Product Shell" where a user can mutate a Hero section via UI or Voice and see the **AISP Spec** update in real-time with zero ambiguity.

---

#### Sub-Phase 1.1: The Three-Panel Architecture
*   **Accomplishment:** **The Resizable Shell.** A production-ready, resizable 3-panel layout (`Commander | Reality | Engine Room`) that toggles perfectly between "Grandma" (Minimalist) and "Expert" (Dense) modes.
*   **Requirements:**
    *   Scaffold Vite + React + Tailwind + shadcn/ui.
    *   Implement `react-resizable-panels` with the 300px / Fluid / 400px default split.
    *   Implement the **Draft/Expert Toggle**: 
        *   *Draft:* 24px gaps, simple cards, high abstraction.
        *   *Expert:* 4px gaps, `text-xs` labels, `font-mono` values, high density.
    *   Apply the **"Warm Precision"** color system (Cream `#faf8f5`, Orange `#e8772e`, Deep Brown `#2d1f12`).

#### Sub-Phase 1.2: The Master JSON Core Loop
*   **Accomplishment:** **Bi-directional Sync.** The first "Hero" section renders in the center, and any change made in the UI (Left) or the Properties (Right) reflects in the Master JSON state in <100ms.
*   **Requirements:**
    *   Initialize the **Zustand Store** with the `MasterConfig` object.
    *   Build the `HeroCentered` template. It must be "Dumb"—it only renders what the JSON tells it.
    *   Implement **Zod Validation**: Every change to the JSON must pass the AISP 1.2 schema or throw a visual error in the status bar.
    *   **The Wow:** Editing the "Headline" in the Right panel updates the Center canvas *while typing*.

#### Sub-Phase 1.3: The Listen Mode (The AI Avatar)
*   **Accomplishment:** **The Theatrical HUD.** A dark-mode overlay that activates the pulsing Red Orb AI avatar and a typewriter response system without obscuring the Reality canvas.
*   **Requirements:**
    *   Create the `AIAvatar` component: A 3-layer CSS blur/glow effect that pulses its frequency based on a `isThinking` state.
    *   Implement the **Listen HUD Overlay**: A `fixed` dark gradient that sits over the Left panel only, allowing the Center canvas to remain visible.
    *   Build the **Typewriter Service**: A component that takes strings and renders them character-by-character in a monospace, system-brevity style.
    *   **The Wow:** Clicking "Start Listening" turns the left panel into a dark, pulsing AI command center while the website stays "lit" in the center.

#### Sub-Phase 1.4: The Spec Engine (The AISP Mirror)
*   **Accomplishment:** **Deterministic Transparency.** The Right panel’s bottom half renders the live AISP Spec, which auto-scrolls and highlights whenever a corresponding UI element is touched.
*   **Requirements:**
    *   Implement the `XAIDocs` service: A function that translates the `MasterConfig` JSON into the `@aisp 1.2` syntax (The "Human-Readable Code").
    *   Build the **AISP Code Viewer**: A syntax-highlighted editor (using Prism or similar) that occupies 50% of the Expert Right Panel.
    *   **The Wow:** Click the Hero's "Button" in the UI -> The AISP Viewer instantly scrolls to `@cta "Get Started"` and highlights it in orange.

---

### Summary of Sub-Phase "Wins" for your Demo

| Phase | Title | The "Mic Drop" Moment |
| :--- | :--- | :--- |
| **1.1** | **The Shell** | Clicking "Expert" and watching the UI instantly tighten and gain 4x data density. |
| **1.2** | **The Loop** | Changing a hex code in the JSON and seeing the button color flicker instantly in Reality. |
| **1.3** | **The Orb** | The theatrical shift to the dark "Listen Mode" with the pulsing red AI core. |
| **1.4** | **The Spec** | Hovering over the website and seeing the AISP code "glow" in the engine room. |

---

### 🚦 Swarm Trigger: Sub-Phase 1.1
**Are you ready to sic the swarm on the 3-Panel Architecture (1.1)?** 

If yes, I will provide the **"System Implementation Prompt"** for your agent (Claude Code/Cursor) to build the `AppShell` and `ModeToggle` logic, ensuring it follows the **"Warm Precision"** styling tokens and **"Enterprise Density"** spacing from the start.