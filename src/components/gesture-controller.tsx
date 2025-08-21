
"use client";

import { useEffect, useRef, useState } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { useToast } from '@/hooks/use-toast';

// Enum for hand landmarks to make code more readable
enum HandLandmark {
  WRIST = 0,
  THUMB_CMC = 1,
  THUMB_MCP = 2,
  THUMB_IP = 3,
  THUMB_TIP = 4,
  INDEX_FINGER_MCP = 5,
  INDEX_FINGER_PIP = 6,
  INDEX_FINGER_DIP = 7,
  INDEX_FINGER_TIP = 8,
  MIDDLE_FINGER_MCP = 9,
  MIDDLE_FINGER_PIP = 10,
  MIDDLE_FINGER_DIP = 11,
  MIDDLE_FINGER_TIP = 12,
  RING_FINGER_MCP = 13,
  RING_FINGER_PIP = 14,
  RING_FINGER_DIP = 15,
  RING_FINGER_TIP = 16,
  PINKY_FINGER_MCP = 17,
  PINKY_FINGER_PIP = 18,
  PINKY_FINGER_DIP = 19,
  PINKY_FINGER_TIP = 20,
}

export const GestureController = () => {
  // --- STATE AND REFS ---
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameId = useRef<number>();
  const lastVideoTimeRef = useRef(-1);

  // State to track gesture detection
  const isClickGestureRef = useRef(false);
  const lastScrollYRef = useRef<number | null>(null);
  
  // Smoothing state for cursor
  const smoothedCursorPos = useRef({ x: 0, y: 0 });

  // --- INITIALIZATION ---
  useEffect(() => {
    // This function initializes the component, sets up the webcam, and loads the model.
    const initialize = async () => {
      try {
        // --- 1. Load the HandLandmarker model ---
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1, // Only track one hand
        });
        handLandmarkerRef.current = landmarker;
        toast({ title: "Gesture Control Active", description: "Hand tracking model loaded." });

        // --- 2. Get webcam access ---
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", startDetection);
        }
      } catch (error) {
        console.error("Initialization failed:", error);
        toast({ variant: "destructive", title: "Gesture Control Error", description: "Could not access webcam or load model. Please grant permissions and reload." });
      }
    };

    initialize();

    // --- Cleanup function ---
    return () => {
      // Stop the animation frame loop
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      // Stop the webcam stream
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      // Clean up event listeners
       if (videoRef.current) {
           videoRef.current.removeEventListener("loadeddata", startDetection);
       }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- DETECTION LOOP ---
  const startDetection = () => {
    // This function starts the real-time hand detection loop.
    if (!handLandmarkerRef.current || !videoRef.current || !videoRef.current.srcObject) {
      return;
    }
    videoRef.current.play().catch(e => console.error("Video play failed:", e));
    detectHands();
  };

  const detectHands = () => {
    // This is the main loop that runs on every animation frame.
    const video = videoRef.current;
    const landmarker = handLandmarkerRef.current;

    if (video && landmarker && video.readyState >= 3 && video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      const results = landmarker.detectForVideo(video, Date.now());

      // Process the detection results
      if (results.landmarks && results.landmarks.length > 0) {
        processLandmarks(results.landmarks[0]);
      } else {
        // If no hand is detected, reset gesture states
        lastScrollYRef.current = null;
        if (cursorRef.current) {
          cursorRef.current.style.backgroundColor = 'hsl(var(--primary) / 0.7)';
        }
      }
    }
    // Request the next frame
    animationFrameId.current = requestAnimationFrame(detectHands);
  };

  // --- GESTURE PROCESSING ---
  const processLandmarks = (landmarks: any[]) => {
    // This function takes the detected hand landmarks and translates them into actions.
    if (!cursorRef.current) return;

    // --- 1. Cursor Movement (Single Finger) ---
    // Use the index fingertip to control the cursor.
    const indexFingertip = landmarks[HandLandmark.INDEX_FINGER_TIP];
    const targetX = window.innerWidth * (1 - indexFingertip.x);
    const targetY = window.innerHeight * indexFingertip.y;
    
    // Apply smoothing for less jerky movement (low-pass filter)
    const smoothingFactor = 0.2;
    smoothedCursorPos.current.x += (targetX - smoothedCursorPos.current.x) * smoothingFactor;
    smoothedCursorPos.current.y += (targetY - smoothedCursorPos.current.y) * smoothingFactor;

    cursorRef.current.style.transform = `translate(calc(${smoothedCursorPos.current.x}px - 50%), calc(${smoothedCursorPos.current.y}px - 50%))`;

    // --- 2. Gesture Detection ---
    const thumbTip = landmarks[HandLandmark.THUMB_TIP];
    const middleFingertip = landmarks[HandLandmark.MIDDLE_FINGER_TIP];

    const clickDistance = Math.hypot(indexFingertip.x - thumbTip.x, indexFingertip.y - thumbTip.y);
    const scrollDistance = Math.hypot(indexFingertip.x - middleFingertip.x, indexFingertip.y - middleFingertip.y);
    
    const clickThreshold = 0.05;
    const scrollThreshold = 0.06;

    // --- 3. Scroll Gesture Logic (Index + Middle finger up/down) ---
    if (scrollDistance < scrollThreshold) {
      cursorRef.current.style.backgroundColor = 'hsl(var(--ring))'; // Visual feedback for scroll
      const currentY = indexFingertip.y;
      
      if (lastScrollYRef.current !== null) {
        const deltaY = currentY - lastScrollYRef.current;
        // The y-coordinate from MediaPipe is inverted (0 is top), so a positive delta means moving down
        window.scrollBy(0, deltaY * 1000); // Multiplier for scroll speed
      }
      lastScrollYRef.current = currentY;

    } else {
       lastScrollYRef.current = null; // Reset scroll tracking when gesture stops
       cursorRef.current.style.backgroundColor = 'hsl(var(--primary) / 0.7)';
    }

    // --- 4. Click Gesture Logic (Thumb + Index finger pinch) ---
    if (clickDistance < clickThreshold) {
      if (!isClickGestureRef.current) {
        isClickGestureRef.current = true; // Prevent multiple clicks for one pinch
        performClick(smoothedCursorPos.current.x, smoothedCursorPos.current.y);
        
        // Visual feedback for click
        if(cursorRef.current) {
            cursorRef.current.style.transform += ' scale(0.7)';
            setTimeout(() => {
                if(cursorRef.current) {
                     cursorRef.current.style.transform = cursorRef.current.style.transform.replace(' scale(0.7)', '');
                }
            }, 150);
        }
      }
    } else {
      isClickGestureRef.current = false; // Reset click ref when fingers are apart
    }
  };

  // --- ACTION SIMULATION ---
  const performClick = (x: number, y: number) => {
    // This function simulates a click at the cursor's position.
    if (cursorRef.current) {
      // Temporarily hide the custom cursor to find the element underneath
      cursorRef.current.style.display = 'none';
      const element = document.elementFromPoint(x, y);
      cursorRef.current.style.display = '';

      if (element instanceof HTMLElement) {
        element.click(); // Simulate the click
        toast({ title: "Gesture Click", description: `Clicked on <${element.tagName.toLowerCase()}>` });
      }
    }
  };

  // --- RENDER ---
  return (
    <>
      {/* The custom cursor element */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-6 h-6 rounded-full bg-primary/70 border-2 border-primary-foreground shadow-lg pointer-events-none z-[9999] transition-all duration-100 ease-out"
      />
      
      {/* The video element is hidden but required for processing */}
      <video ref={videoRef} className="fixed -z-10 w-px h-px left-0 top-0 opacity-0" playsInline />
    </>
  );
};
