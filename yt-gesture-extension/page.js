
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
        this.isScrollMode = false;
        this.scrollVelocity = 0;
        this.scrollNeutralY = 0;
        
        // Smoothing and sensitivity
        this.smoothedCursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.sensitivity = 1.5; // Default sensitivity
    }

    // --- SETUP & TEARDOWN ---

    async initialize() {
        if (this.isEnabled) return;
        this.isEnabled = true;
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
        } catch (error) {
            console.error("Initialization failed:", error);
            this.showToast("Error: Could not start gesture control.", true);
            this.destroy(); // Clean up if initialization fails
        }
    }

    async setupWebcam() {
        this.video = document.createElement('video');
        this.video.style.cssText = 'position: absolute; top: -9999px; left: -9999px; transform: scaleX(-1);';
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

        this.panel = document.createElement('div');
        this.panel.id = 'gesture-panel';
        this.panel.innerHTML = `
          <div class="panel-header">
            <h3>Gesture Controls</h3>
            <button id="close-gesture-panel">&times;</button>
          </div>
          <div class="panel-content">
            <p><b>Move Cursor:</b> Single index finger.</p>
            <p><b>Click:</b> Pinch thumb & index finger.</p>
            <p><b>Scroll:</b> Index & middle finger up/down.</p>
          </div>
          <div class="panel-footer">
            <label for="sensitivity-slider">Sensitivity</label>
            <input type="range" id="sensitivity-slider" min="0.5" max="3.0" step="0.1" value="1.5">
          </div>
        `;
        document.body.appendChild(this.panel);

        document.getElementById('close-gesture-panel').onclick = () => this.panel.classList.add('hidden');
        document.getElementById('sensitivity-slider').oninput = (e) => this.sensitivity = parseFloat(e.target.value);
    }
    
    destroy() {
        console.log("Destroying Gesture Controller...");
        this.isEnabled = false;
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        
        if (this.video && this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
        }
        if (this.video) this.video.remove();
        if (this.cursor) this.cursor.remove();
        if (this.panel) this.panel.remove();
        
        window.gestureController = null; 
        this.showToast("Gesture Control Deactivated.");
    }

    // --- DETECTION & PROCESSING LOOP ---

    startDetectionLoop() {
        const detectionLoop = () => {
            if (!this.isEnabled) return;
            
            if (this.video && this.video.readyState >= 3 && this.video.currentTime !== this.lastVideoTime) {
                this.lastVideoTime = this.video.currentTime;
                const results = this.handLandmarker.detectForVideo(this.video, Date.now());
                if (results.landmarks && results.landmarks.length > 0) {
                    this.processLandmarks(results.landmarks[0]);
                } else {
                    this.resetGestureState();
                }
            }
            
            if(this.scrollVelocity !== 0) {
                window.scrollBy(0, this.scrollVelocity);
            }

            this.animationFrameId = requestAnimationFrame(detectionLoop);
        };
        detectionLoop();
    }

    processLandmarks(landmarks) {
        const indexFingertip = landmarks[LANDMARK.INDEX_FINGER_TIP];
        const targetX = window.innerWidth * (1 - indexFingertip.x);
        const targetY = window.innerHeight * indexFingertip.y;
        
        const smoothingFactor = 0.2;
        this.smoothedCursorPos.x += (targetX - this.smoothedCursorPos.x) * smoothingFactor;
        this.smoothedCursorPos.y += (targetY - this.smoothedCursorPos.y) * smoothingFactor;
        this.cursor.style.transform = `translate(${this.smoothedCursorPos.x}px, ${this.smoothedCursorPos.y}px)`;

        const thumbTip = landmarks[LANDMARK.THUMB_TIP];
        const middleFingertip = landmarks[LANDMARK.MIDDLE_FINGER_TIP];

        const clickDistance = Math.hypot(indexFingertip.x - thumbTip.x, indexFingertip.y - thumbTip.y);
        const scrollGestureActive = Math.hypot(indexFingertip.x - middleFingertip.x, indexFingertip.y - middleFingertip.y) < 0.07;
        
        if (scrollGestureActive) {
            this.handleContinuousScroll(indexFingertip);
            if (this.isClicking) {
                this.isClicking = false;
                this.cursor.classList.remove('clicking');
            }
        } else {
            this.handlePinchClick(clickDistance);
            if(this.isScrollMode) {
                this.isScrollMode = false;
                this.scrollVelocity = 0;
                this.cursor.classList.remove('scrolling');
            }
        }
    }

    // --- GESTURE ACTIONS ---

    handlePinchClick(distance) {
        const CLICK_THRESHOLD = 0.04;
        
        if (distance < CLICK_THRESHOLD) {
            if (!this.isClicking) {
                this.isClicking = true;
                this.cursor.classList.add('clicking');
                
                this.cursor.style.display = 'none';
                const element = document.elementFromPoint(this.smoothedCursorPos.x, this.smoothedCursorPos.y);
                this.cursor.style.display = '';

                if (element) {
                    (element).click();
                }
            }
        } else {
             if (this.isClicking) {
                this.isClicking = false;
                this.cursor.classList.remove('clicking');
            }
        }
    }
  
    handleContinuousScroll(indexTip) {
        this.cursor.classList.add('scrolling');
        
        if (!this.isScrollMode) {
            this.isScrollMode = true;
            this.scrollNeutralY = indexTip.y;
        } else {
            const deltaY = indexTip.y - this.scrollNeutralY;
            const SCROLL_DEAD_ZONE = 0.03; 
            const MAX_VELOCITY = 20;
            
            if (Math.abs(deltaY) > SCROLL_DEAD_ZONE) {
                const speed = (Math.abs(deltaY) - SCROLL_DEAD_ZONE) * 150 * this.sensitivity;
                this.scrollVelocity = Math.sign(deltaY) * Math.min(speed, MAX_VELOCITY);
            } else {
                this.scrollVelocity = 0;
            }
        }
    }
  
    resetGestureState() {
        if (this.isClicking) {
            this.isClicking = false;
            this.cursor.classList.remove('clicking');
        }
        if (this.isScrollMode) {
            this.isScrollMode = false;
            this.scrollVelocity = 0;
            this.cursor.classList.remove('scrolling');
        }
    }

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
    }
}

window.addEventListener("message", (event) => {
    if (event.source === window && event.data.type === "TOGGLE_GESTURE_CONTROL") {
        handleToggle();
    }
});

// Automatically start the first time.
if (!window.gestureController) {
    handleToggle();
}
