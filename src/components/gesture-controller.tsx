
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
  const isScrollGestureRef = useRef(false);
  const lastScrollYRef = useRef(0);

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
        toast({ title: "Gesture Control", description: "Hand tracking model loaded." });

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
    // Ensure the video is playing before we start
    videoRef.current.play();
    detectHands();
  };

  const detectHands = () => {
    // This is the main loop that runs on every animation frame.
    const video = videoRef.current;
    const landmarker = handLandmarkerRef.current;

    if (video && landmarker && video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      const results = landmarker.detectForVideo(video, Date.now());

      // Process the detection results
      if (results.landmarks && results.landmarks.length > 0) {
        processLandmarks(results.landmarks[0]);
      }
    }
    // Request the next frame
    animationFrameId.current = requestAnimationFrame(detectHands);
  };


  // --- GESTURE PROCESSING ---
  const processLandmarks = (landmarks: any[]) => {
    // This function takes the detected hand landmarks and translates them into actions.
    if (!cursorRef.current) return;

    // --- 1. Cursor Movement ---
    // We'll use the index fingertip to control the cursor.
    const indexFingertip = landmarks[HandLandmark.INDEX_FINGER_TIP];
    // Invert the coordinates because the webcam is a mirror image
    const cursorX = window.innerWidth * (1 - indexFingertip.x);
    const cursorY = window.innerHeight * indexFingertip.y;
    // Apply smoothing for less jerky movement
    cursorRef.current.style.transform = `translate(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%))`;


    // --- 2. Gesture Detection ---
    const thumbTip = landmarks[HandLandmark.THUMB_TIP];
    const middleFingertip = landmarks[HandLandmark.MIDDLE_FINGER_TIP];
    const ringFingertip = landmarks[HandLandmark.RING_FINGER_TIP];
    
    // Calculate distances between fingertips
    const indexMiddleDistance = Math.hypot(indexFingertip.x - middleFingertip.x, indexFingertip.y - middleFingertip.y);
    const middleRingDistance = Math.hypot(middleFingertip.x - ringFingertip.x, middleFingertip.y - ringFingertip.y);

    // --- 3. Click Gesture Logic ---
    // A "click" is when the index and middle fingers are very close together.
    const clickThreshold = 0.03; 
    if (indexMiddleDistance < clickThreshold) {
      if (!isClickGestureRef.current) {
        // We only trigger the click once when the gesture is first detected
        isClickGestureRef.current = true;
        performClick(cursorX, cursorY);
        // Visual feedback for the click
        cursorRef.current.style.backgroundColor = 'hsl(var(--destructive))';
      }
    } else {
      isClickGestureRef.current = false;
      cursorRef.current.style.backgroundColor = 'hsl(var(--primary))';
    }
    
    // --- 4. Scroll Gesture Logic ---
    // A "scroll" is when the index, middle, and ring fingers are close together and extended.
    const scrollThreshold = 0.04; 
    if (indexMiddleDistance < scrollThreshold && middleRingDistance < scrollThreshold) {
        if (!isScrollGestureRef.current) {
            // First time detecting the gesture, just record the starting Y position.
            isScrollGestureRef.current = true;
            lastScrollYRef.current = cursorY;
             if (cursorRef.current) cursorRef.current.style.borderWidth = '5px'; // Visual feedback for scroll
        } else {
            // Gesture is active, calculate scroll amount.
            const deltaY = cursorY - lastScrollYRef.current;
            window.scrollBy(0, deltaY * 1.5); // Multiplier for faster scrolling
            lastScrollYRef.current = cursorY;
        }
    } else {
        if (isScrollGestureRef.current) {
           // Gesture ended
           isScrollGestureRef.current = false;
           if (cursorRef.current) cursorRef.current.style.borderWidth = '2px';
        }
    }
  };

  // --- ACTION SIMULATION ---
  const performClick = (x: number, y: number) => {
    // This function simulates a click at the cursor's position.
    if (cursorRef.current) {
      // We temporarily hide the custom cursor to find the element underneath
      cursorRef.current.style.display = 'none';
      const element = document.elementFromPoint(x, y);
      cursorRef.current.style.display = '';

      if (element instanceof HTMLElement) {
        element.click(); // Simulate the click
        toast({ title: "Gesture Click", description: `Clicked on <${element.tagName}>` });
      }
    }
  };


  // --- RENDER ---
  return (
    <>
      {/* The custom cursor element */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-6 h-6 rounded-full bg-primary/70 border-2 border-primary-foreground shadow-lg pointer-events-none z-[9999] transition-transform duration-100 ease-out"
      />
      
      {/* The video element is hidden but required for processing */}
      <video ref={videoRef} className="hidden" />
    </>
  );
};
