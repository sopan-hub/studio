
// This script runs in the page's own context.
// It loads the MediaPipe HandLandmarker model to detect hand gestures from the webcam
// and translates them into actions like cursor movement, clicking, and scrolling.

// Import necessary components from the MediaPipe Tasks Vision library via CDN.
import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.js";

// LANDMARK_indices for easy reference to specific points on the hand.
const LANDMARK = {
  WRIST: 0,
  THUMB_TIP: 4,
  INDEX_FINGER_TIP: 8,
  MIDDLE_FINGER_TIP: 12,
  RING_FINGER_TIP: 16,
  PINKY_TIP: 20,
};

class GestureController {
    constructor() {
        // Core MediaPipe and video elements
        this.handLandmarker = null;
        this.video = null;
        this.lastVideoTime = -1;
        this.animationFrameId = null;
        this.isEnabled = false;

        // UI Elements
        this.cursor = null;
        this.panel = null;

        // Gesture state
        this.isClicking = false;
        this.scrollMode = 'none'; // Can be 'up', 'down', or 'none'
        this.scrollVelocity = 0;
        
        // Smoothing and sensitivity
        this.smoothedCursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.sensitivity = 1.5; // Default sensitivity
    }

    // --- SETUP & TEARDOWN ---

    async initialize() {
        if (this.isEnabled) return;
        console.log("Initializing Gesture Controller...");
        this.createUI();

        try {
            // Initialize the MediaPipe HandLandmarker model.
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
            );
            this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                    delegate: "GPU", // Use GPU for better performance
                },
                runningMode: "VIDEO",
                numHands: 1, // Track only one hand
            });

            await this.setupWebcam();
            this.startDetectionLoop();
            this.showToast("Gesture Control Active!");
            this.isEnabled = true;
        } catch (error) {
            console.error("Initialization failed:", error);
            this.showToast("Error: Could not start gesture control.", true);
            this.destroy(); // Clean up if initialization fails
        }
    }

    async setupWebcam() {
        this.video = document.createElement('video');
        // The video element is hidden from view; it's only used for processing.
        this.video.style.cssText = 'position: absolute; top: -9999px; left: -9999px;';
        document.body.appendChild(this.video);

        // Get user's webcam stream.
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        this.video.srcObject = stream;
        
        // Wait for the video to be ready before starting detection.
        return new Promise((resolve) => {
            this.video.onloadeddata = () => {
                this.video.play();
                resolve();
            };
        });
    }
    
    createUI() {
        // Create the on-screen cursor element.
        this.cursor = document.createElement('div');
        this.cursor.id = 'gesture-cursor';
        document.body.appendChild(this.cursor);

        // Create the instructions and settings panel.
        this.panel = document.createElement('div');
        this.panel.id = 'gesture-panel';
        this.panel.innerHTML = `
          <div class="panel-header">
            <h3>Gesture Controls</h3>
            <button id="close-gesture-panel">&times;</button>
          </div>
          <div class="panel-content">
            <p><b>Move Cursor:</b> Extend index finger.</p>
            <p><b>Click:</b> Pinch thumb and index finger.</p>
            <p><b>Scroll:</b> Extend index & middle finger, move up/down.</p>
          </div>
          <div class="panel-footer">
            <label for="sensitivity-slider">Sensitivity</label>
            <input type="range" id="sensitivity-slider" min="0.5" max="3.0" step="0.1" value="1.5">
          </div>
        `;
        document.body.appendChild(this.panel);

        // Add event listeners to the panel controls.
        document.getElementById('close-gesture-panel').onclick = () => this.panel.style.display = 'none';
        document.getElementById('sensitivity-slider').oninput = (e) => this.sensitivity = parseFloat(e.target.value);
    }
    
    destroy() {
        console.log("Destroying Gesture Controller...");
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        
        // Stop webcam tracks and remove video element.
        if (this.video && this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
        }
        if (this.video) this.video.remove();
        
        // Remove UI elements.
        if (this.cursor) this.cursor.remove();
        if (this.panel) this.panel.remove();
        
        this.isEnabled = false;
        // Make the controller instance available for garbage collection.
        window.gestureController = null; 
        this.showToast("Gesture Control Deactivated.");
    }

    // --- DETECTION & PROCESSING LOOP ---

    startDetectionLoop() {
        // Main loop for detecting hands and processing gestures.
        const detect = () => {
            if (!this.isEnabled) return;
            // Process the video frame if it's ready.
            if (this.video.readyState >= 3 && this.video.currentTime !== this.lastVideoTime) {
                this.lastVideoTime = this.video.currentTime;
                const results = this.handLandmarker.detectForVideo(this.video, Date.now());
                if (results.landmarks && results.landmarks.length > 0) {
                    this.processLandmarks(results.landmarks[0]);
                } else {
                    this.resetGestureState(); // Reset if no hand is detected
                }
            }
            this.animationFrameId = requestAnimationFrame(detect);
        };
        detect();

        // Separate loop for smooth scrolling animation.
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
        const indexFingertip = landmarks[LANDMARK.INDEX_FINGER_TIP];
        // Invert the X-axis so the cursor mirrors hand movement.
        const targetX = window.innerWidth * (1 - indexFingertip.x);
        const targetY = window.innerHeight * indexFingertip.y;
        
        // Apply exponential smoothing for fluid cursor movement.
        const smoothingFactor = 0.2;
        this.smoothedCursorPos.x += (targetX - this.smoothedCursorPos.x) * smoothingFactor * this.sensitivity;
        this.smoothedCursorPos.y += (targetY - this.smoothedCursorPos.y) * smoothingFactor * this.sensitivity;
        this.cursor.style.transform = `translate(calc(${this.smoothedCursorPos.x}px - 50%), calc(${this.smoothedCursorPos.y}px - 50%))`;

        // --- 2. Gesture Detection ---
        const thumbTip = landmarks[LANDMARK.THUMB_TIP];
        const middleFingertip = landmarks[LANDMARK.MIDDLE_FINGER_TIP];

        // Calculate distances between key landmarks.
        const clickDistance = Math.hypot(indexFingertip.x - thumbTip.x, indexFingertip.y - thumbTip.y);
        const scrollGestureActive = Math.hypot(indexFingertip.x - middleFingertip.x, indexFingertip.y - middleFingertip.y) < 0.07;
        
        const CLICK_THRESHOLD = 0.04;

        // --- 3. Handle Gestures (Scroll takes priority) ---
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
        this.scrollVelocity = 0; // Stop any scrolling
        this.cursor.classList.remove('scrolling');
        
        if (!this.isClicking) {
            this.isClicking = true;
            this.cursor.classList.add('clicking');
            
            // Hide cursor momentarily to click the element directly underneath.
            this.cursor.style.display = 'none';
            const element = document.elementFromPoint(this.smoothedCursorPos.x, this.smoothedCursorPos.y);
            this.cursor.style.display = '';

            if (element) {
                element.click();
            }
        }
    }
  
    handleContinuousScroll(landmarks) {
        this.isClicking = false; // A scroll gesture cannot also be a click.
        this.cursor.classList.remove('clicking');
        this.cursor.classList.add('scrolling');
        
        // Use the midpoint between index and middle finger for stability.
        const currentY = (landmarks[LANDMARK.INDEX_FINGER_TIP].y + landmarks[LANDMARK.MIDDLE_FINGER_TIP].y) / 2;
        
        // Establish a neutral vertical zone on first detection.
        if (this.scrollNeutralY === undefined) {
            this.scrollNeutralY = currentY;
        }
        
        const deltaY = currentY - this.scrollNeutralY;
        const SCROLL_DEAD_ZONE = 0.03; // A small dead zone to prevent accidental scrolling.
        const MAX_VELOCITY = 15;
        
        if (Math.abs(deltaY) > SCROLL_DEAD_ZONE) {
            const speed = (Math.abs(deltaY) - SCROLL_DEAD_ZONE) * 150 * this.sensitivity;
            this.scrollVelocity = Math.sign(deltaY) * Math.min(speed, MAX_VELOCITY);
        } else {
            this.scrollVelocity = 0; // Stop scrolling if hand is in the neutral zone.
        }
    }
  
    resetGestureState() {
        // Reset clicking state.
        if (this.isClicking) {
            this.isClicking = false;
            this.cursor.classList.remove('clicking');
        }
        // Reset scrolling state.
        if (this.scrollNeutralY !== undefined) {
            this.scrollNeutralY = undefined;
            this.scrollVelocity = 0;
            this.cursor.classList.remove('scrolling');
        }
    }

    // --- UTILITIES ---

    showToast(message, isError = false) {
        // Remove any existing toast to prevent duplicates.
        let toast = document.querySelector('.gesture-toast');
        if (toast) toast.remove();
        
        toast = document.createElement('div');
        toast.className = `gesture-toast ${isError ? 'error' : ''}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Animate the toast in and out.
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                // Remove the element from the DOM after the fade-out animation.
                setTimeout(() => document.body.removeChild(toast), 500);
            }, 3000);
        }, 100);
    }
}

// --- GLOBAL INSTANCE MANAGEMENT ---

function handleToggle() {
    // If no controller exists, create one and initialize it.
    if (!window.gestureController) {
        window.gestureController = new GestureController();
        window.gestureController.initialize();
    } else {
        // If one exists, destroy it.
        window.gestureController.destroy();
        window.gestureController = null;
    }
}

// Listen for the message from the content script to toggle the controller on/off.
window.addEventListener("message", (event) => {
    if (event.source === window && event.data.type === "TOGGLE_GESTURE_CONTROL") {
        handleToggle();
    }
});

// Automatically start the controller the first time this script is injected.
handleToggle();
