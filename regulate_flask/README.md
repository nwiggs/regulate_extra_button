# Regulate  
### A One-Touch Nervous System Reset

An interactive prototype demonstrating a simple, hardware-inspired intervention designed to help users regulate stress in real time through guided box breathing.

---

##  Concept

**Regulate** is a single-button device concept that delivers a structured breathing exercise using visual cues. The goal is to provide a fast, accessible way to reset focus and reduce stress during high-demand moments—without requiring apps, screens, or cognitive effort.

This prototype simulates that experience using a web interface powered by Flask.

---

##  Features

- **One-touch activation**
  - Starts a guided 4-4-4-4 breathing cycle

- **Quick Reset Mode (3 minutes)**
  - Secondary side button triggers a full 3-minute session

- **Real-time visual guidance**
  - Expanding/contracting ring simulates breath pacing  
  - LED-style color changes indicate inhale, hold, exhale, pause  

- **Dual feedback system**
  - Text prompts (Breathe In, Hold, Breathe Out, Pause)  
  - Visual cues (scale, color, glow)

- **Session tracking**
  - Counts completed breathing sessions

---

##  How It Works

1. User presses the main button  
2. System initiates a timed breathing cycle  
3. Visual cues guide inhale → hold → exhale → hold  
4. Cycle repeats based on session duration  
5. User reaches a “reset state”  

---

##  Device Mapping (Concept → Prototype)

| Device Component       | Prototype Representation        |
|----------------------|--------------------------------|
| GPIO Button          | Start + Quick Reset buttons     |
| Microcontroller      | JavaScript timing logic         |
| NeoPixel LED         | Color-changing UI element       |
| Breathing feedback   | Animated ring + text prompts    |
| USB power            | Browser-based interface         |

---

##  Intended Impact

This concept is designed to support:

- Faster recovery from stress  
- Improved focus and cognitive clarity  
- Increased use of short, intentional resets  
- Reduced cognitive overload in high-demand environments  

---

##  Running the App (Codespaces or Local)

### 1. Install Flask
```bash
pip install flask