
// This script runs in the page's own context.
// It uses modern JS (ESM) to import the MediaPipe library from a CDN.

import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.js";

class GestureController {
    constructor() {
        this.handLandmarker = null;
        this.video = null;
        this.cursor = null;
        this.instructionPanel = null;
        this.animationFrameId = null;

        this.lastVideoTime = -1;
        this.isClicking = false;
        this.scrollVelocity = 0;
        this.smoothedCursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.sensitivity = 1.5;
        this.isEnabled = false;
    }

    // --- SETUP & TEARDOWN ---

    async initialize() {
        if (this.isEnabled) return;
        console.log("Initializing Gesture Controller...");
        this.createUI();

        try {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
            );
            this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                    delegate: "GPU",
                },
                runningMode: "VIDEO",
                numHands: 1,
            });

            await this.setupWebcam();
            this.startDetectionLoop();
            this.showToast("Gesture Control Active!");
            this.isEnabled = true;
        } catch (error) {
            console.error("Initialization failed:", error);
            this.showToast("Error: Could not start gesture control.", true);
            this.destroy();
        }
    }

    async setupWebcam() {
        this.video = document.createElement('video');
        this.video.style.cssText = 'position: absolute; top: -9999px; left: -9999px;';
        document.body.appendChild(this.video);

        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        this.video.srcObject = stream;
        return new Promise((resolve) => {
            this.video.onloadeddata = () => {
                this.video.play();
                resolve();
            };
        });
    }
    
    createUI() {
        this.cursor = document.createElement('div');
        this.cursor.id = 'gesture-cursor';
        document.body.appendChild(this.cursor);

        this.instructionPanel = document.createElement('div');
        this.instructionPanel.id = 'gesture-instructions';
        this.instructionPanel.innerHTML = `
          <div class="panel-header">
            <h3>Gesture Controls</h3>
            <button id="close-gesture-panel">&times;</button>
          </div>
          <div class="panel-content">
            <p><b>Move Cursor:</b> Use your index finger.</p>
            <p><b>Click:</b> Pinch thumb and index finger.</p>
            <p><b>Scroll:</b> Extend index & middle finger. Move up/down.</p>
          </div>
          <div class="panel-footer">
            <label for="sensitivity-slider">Sensitivity</label>
            <input type="range" id="sensitivity-slider" min="0.5" max="2.5" step="0.1" value="1.5">
          </div>
        `;
        document.body.appendChild(this.instructionPanel);

        document.getElementById('close-gesture-panel').onclick = () => this.instructionPanel.style.display = 'none';
        document.getElementById('sensitivity-slider').oninput = (e) => this.sensitivity = parseFloat(e.target.value);
    }
    
    destroy() {
        console.log("Destroying Gesture Controller...");
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        
        if (this.video && this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
        }
        if (this.video) this.video.remove();
        if (this.cursor) this.cursor.remove();
        if (this.instructionPanel) this.instructionPanel.remove();
        
        this.isEnabled = false;
        window.gestureController = null;
        this.showToast("Gesture Control Deactivated.");
    }

    // --- DETECTION & PROCESSING LOOP ---

    startDetectionLoop() {
        const detect = () => {
            if (!this.isEnabled) return;
            if (this.video.readyState >= 3 && this.video.currentTime !== this.lastVideoTime) {
                this.lastVideoTime = this.video.currentTime;
                const results = this.handLandmarker.detectForVideo(this.video, Date.now());
                if (results.landmarks && results.landmarks.length > 0) {
                    this.processLandmarks(results.landmarks[0]);
                } else {
                    this.resetGestureState();
                }
            }
            this.animationFrameId = requestAnimationFrame(detect);
        };
        detect();

        const scrollLoop = () => {
            if (this.scrollVelocity !== 0) {
                window.scrollBy(0, this.scrollVelocity);
            }
            requestAnimationFrame(scrollLoop);
        };
        requestAnimationFrame(scrollLoop);
    }

    processLandmarks(landmarks) {
        // --- 1. Cursor Movement ---
        // The cursor follows the index fingertip.
        const indexFingertip = landmarks[8];
        const targetX = window.innerWidth * (1 - indexFingertip.x);
        const targetY = window.innerHeight * indexFingertip.y;
        
        // Exponential smoothing for fluid cursor movement
        const smoothingFactor = 0.2;
        this.smoothedCursorPos.x += (targetX - this.smoothedCursorPos.x) * smoothingFactor * this.sensitivity;
        this.smoothedCursorPos.y += (targetY - this.smoothedCursorPos.y) * smoothingFactor * this.sensitivity;
        this.cursor.style.transform = `translate(calc(${this.smoothedCursorPos.x}px - 50%), calc(${this.smoothedCursorPos.y}px - 50%))`;

        // --- 2. Gesture Detection ---
        const thumbTip = landmarks[4];
        const middleFingertip = landmarks[12];
        const middleFingerPip = landmarks[10];

        const clickDistance = Math.hypot(indexFingertip.x - thumbTip.x, indexFingertip.y - thumbTip.y);
        const scrollGestureActive = Math.hypot(indexFingertip.x - middleFingertip.x, indexFingertip.y - middleFingertip.y) < 0.07;
        
        const CLICK_THRESHOLD = 0.04;

        // --- 3. Handle Gestures ---
        // Scroll takes priority
        if (scrollGestureActive) {
            this.handleContinuousScroll(landmarks);
        } else if (clickDistance < CLICK_THRESHOLD) {
            this.handlePinchClick();
        } else {
            this.resetGestureState();
        }
    }

    // --- GESTURE ACTIONS ---

    handlePinchClick() {
        this.scrollVelocity = 0; // Stop scrolling
        this.cursor.classList.remove('scrolling');
        
        if (!this.isClicking) {
            this.isClicking = true;
            this.cursor.classList.add('clicking');
            
            // Hide cursor to click element underneath
            this.cursor.style.display = 'none';
            const element = document.elementFromPoint(this.smoothedCursorPos.x, this.smoothedCursorPos.y);
            this.cursor.style.display = '';

            if (element) {
                element.click();
            }
        }
    }
  
    handleContinuousScroll(landmarks) {
        this.isClicking = false;
        this.cursor.classList.remove('clicking');
        this.cursor.classList.add('scrolling');
        
        const currentY = (landmarks[8].y + landmarks[10].y) / 2; // Average of index tip and middle pip
        
        // Set neutral point on first detection
        if (this.scrollNeutralY === null) {
            this.scrollNeutralY = currentY;
        }
        
        const deltaY = currentY - this.scrollNeutralY;
        const SCROLL_DEAD_ZONE = 0.03;
        const MAX_VELOCITY = 15;
        
        if (Math.abs(deltaY) > SCROLL_DEAD_ZONE) {
            const speed = (Math.abs(deltaY) - SCROLL_DEAD_ZONE) * 150 * this.sensitivity;
            this.scrollVelocity = Math.sign(deltaY) * Math.min(speed, MAX_VELOCITY);
        } else {
            this.scrollVelocity = 0;
        }
    }
  
    resetGestureState() {
        if (this.isClicking) {
            this.isClicking = false;
            this.cursor.classList.remove('clicking');
        }
        if (this.scrollNeutralY !== null) {
            this.scrollNeutralY = null;
            this.scrollVelocity = 0;
            this.cursor.classList.remove('scrolling');
        }
    }

    // --- UTILITIES ---

    showToast(message, isError = false) {
        let toast = document.querySelector('.gesture-toast');
        if (toast) toast.remove();
        
        toast = document.createElement('div');
        toast.className = `gesture-toast ${isError ? 'error' : ''}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => document.body.removeChild(toast), 500);
            }, 3000);
        }, 100);
    }
}

// --- GLOBAL INSTANCE MANAGEMENT ---

function handleToggle() {
    if (!window.gestureController) {
        window.gestureController = new GestureController();
        window.gestureController.initialize();
    } else {
        window.gestureController.destroy();
        window.gestureController = null;
    }
}

// Listen for message from content script to toggle on/off
window.addEventListener("message", (event) => {
    if (event.source === window && event.data.type === "TOGGLE_GESTURE_CONTROL") {
        handleToggle();
    }
});

// Initial toggle if this is the first injection
handleToggle();
