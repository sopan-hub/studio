
"use client";

import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Enum for hand landmarks to make code more readable
const Landmark = {
  WRIST: 0,
  THUMB_TIP: 4,
  INDEX_FINGER_TIP: 8,
  MIDDLE_FINGER_TIP: 12,
  RING_FINGER_TIP: 16,
  PINKY_TIP: 20
};

interface GestureControllerProps {
    showInstructions: boolean;
    onCloseInstructions: () => void;
}

export const GestureController = ({ showInstructions, onCloseInstructions }: GestureControllerProps) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const animationFrameIdRef = useRef<number | null>(null);

  // State for gesture detection and control
  const [isClicking, setIsClicking] = useState(false);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [sensitivity, setSensitivity] = useState(1.5);
  const [isScrollMode, setIsScrollMode] = useState(false);
  const [scrollNeutralY, setScrollNeutralY] = useState(0);

  // State for smoothing cursor movement
  const smoothedCursorPosRef = useRef({ x: 0, y: 0 });

  // --- 1. INITIALIZATION & CLEANUP ---
  useEffect(() => {
    let isMounted = true;

    // Async function to initialize hand tracking
    const initializeHandTracking = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );
        handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1, // Track only one hand for simplicity
        });
        toast({ title: 'Gesture Control Ready!', description: 'Webcam starting...' });
        setupWebcam();
      } catch (error) {
        console.error("Error initializing HandLandmarker:", error);
        toast({ variant: 'destructive', title: 'Initialization Failed', description: 'Could not load the AI model.' });
      }
    };

    // Setup webcam stream
    const setupWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener('loadeddata', startDetection);
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
        toast({ variant: 'destructive', title: 'Webcam Access Denied', description: 'Please enable camera permissions.' });
      }
    };
    
    // Start the detection loop
    const startDetection = () => {
      if (videoRef.current && videoRef.current.readyState >= 3) {
         if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
        }
        animationFrameIdRef.current = requestAnimationFrame(detectionLoop);
      }
    };

    if (isMounted) {
      initializeHandTracking();
    }

    // Cleanup function
    return () => {
      isMounted = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // --- 2. DETECTION & ANIMATION LOOP ---
  const detectionLoop = async () => {
    if (!videoRef.current || !handLandmarkerRef.current || !videoRef.current.srcObject) {
        animationFrameIdRef.current = requestAnimationFrame(detectionLoop);
        return;
    };

    const video = videoRef.current;
    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      const results = handLandmarkerRef.current.detectForVideo(video, Date.now());
      if (results.landmarks && results.landmarks.length > 0) {
        processLandmarks(results.landmarks[0]);
      } else {
        // No hand detected, reset gesture states
        if (isScrollMode) setIsScrollMode(false);
        if (scrollVelocity !== 0) setScrollVelocity(0);
        if (isClicking) setIsClicking(false);
      }
    }
    
    // Continuous scroll animation
    if(scrollVelocity !== 0) {
        window.scrollBy(0, scrollVelocity);
    }

    animationFrameIdRef.current = requestAnimationFrame(detectionLoop);
  };


  // --- 3. GESTURE PROCESSING ---
  const processLandmarks = (landmarks: any[]) => {
    if (!cursorRef.current) return;
    
    // Get key landmark positions
    const indexTip = landmarks[Landmark.INDEX_FINGER_TIP];
    const thumbTip = landmarks[Landmark.THUMB_TIP];
    const middleTip = landmarks[Landmark.MIDDLE_FINGER_TIP];

    // --- Cursor Movement ---
    // Use exponential smoothing for fluid cursor motion
    const targetX = window.innerWidth - (indexTip.x * window.innerWidth); // Invert X-axis
    const targetY = indexTip.y * window.innerHeight;
    const smoothingFactor = 0.2;
    smoothedCursorPosRef.current.x += (targetX - smoothedCursorPosRef.current.x) * smoothingFactor;
    smoothedCursorPosRef.current.y += (targetY - smoothedCursorPosRef.current.y) * smoothingFactor;
    cursorRef.current.style.transform = `translate(${smoothedCursorPosRef.current.x}px, ${smoothedCursorPosRef.current.y}px)`;

    // --- Gesture Detection ---
    const clickDistance = Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y);
    const scrollGestureActive = Math.hypot(indexTip.x - middleTip.x, indexTip.y - middleTip.y) < 0.07; 

    // Scroll takes priority over click
    if (scrollGestureActive) {
      handleScroll(indexTip);
      // Ensure click state is reset if scroll is active
      if (isClicking) {
        setIsClicking(false);
        cursorRef.current.classList.remove('clicking');
      }
    } else {
      handlePinchClick(clickDistance);
      // Reset scroll state when not in scroll gesture
      if (isScrollMode) setIsScrollMode(false);
      if (scrollVelocity !== 0) setScrollVelocity(0);
      cursorRef.current.classList.remove('scrolling');
    }
  };

  // --- 4. GESTURE ACTIONS ---

  // Handle pinch gesture for clicking
  const handlePinchClick = (distance: number) => {
    const CLICK_THRESHOLD = 0.04;
    
    if (distance < CLICK_THRESHOLD) {
      if (!isClicking) {
        setIsClicking(true);
        if (cursorRef.current) {
          cursorRef.current.classList.add('clicking');
          // Hide cursor, get element, then click
          cursorRef.current.style.display = 'none';
          const elem = document.elementFromPoint(smoothedCursorPosRef.current.x, smoothedCursorPosRef.current.y);
          cursorRef.current.style.display = '';

          if (elem) {
            (elem as HTMLElement).click();
          }
        }
      }
    } else {
      if (isClicking) {
        setIsClicking(false);
        if (cursorRef.current) {
          cursorRef.current.classList.remove('clicking');
        }
      }
    }
  };
  
  // Handle two-finger gesture for continuous scrolling
  const handleScroll = (indexTip: { y: number }) => {
    if (cursorRef.current) {
      cursorRef.current.classList.add('scrolling');
    }

    if (!isScrollMode) {
      setIsScrollMode(true);
      setScrollNeutralY(indexTip.y); // Set the neutral Y position on gesture start
    } else {
      const deltaY = indexTip.y - scrollNeutralY;
      const SCROLL_DEAD_ZONE = 0.03; 
      const MAX_VELOCITY = 20;

      if (Math.abs(deltaY) > SCROLL_DEAD_ZONE) {
        const speed = (Math.abs(deltaY) - SCROLL_DEAD_ZONE) * 150 * sensitivity;
        setScrollVelocity(Math.sign(deltaY) * Math.min(speed, MAX_VELOCITY));
      } else {
        setScrollVelocity(0); // Stop scrolling if hand is in the neutral zone
      }
    }
  };


  return (
    <>
      {/* Hidden video element for webcam feed */}
      <video ref={videoRef} className="hidden" autoPlay playsInline />

      {/* Custom cursor that follows the hand */}
      <div ref={cursorRef} id="gesture-cursor" />

      {/* Instructions and Settings Panel */}
      <div className={cn(
        "fixed bottom-5 left-5 z-[100] w-72 rounded-lg border bg-background/80 p-4 shadow-lg backdrop-blur-sm transition-all duration-300",
        showInstructions ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"
      )}>
        <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-lg text-primary">Gesture Controls</h4>
            <Button variant="ghost" size="icon" onClick={onCloseInstructions} className='h-7 w-7'>
                <X className="h-4 w-4"/>
            </Button>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground list-none p-0">
            <li className="flex items-center gap-2"><span className="font-mono text-primary font-bold w-20">Move:</span> <span>Single index finger</span></li>
            <li className="flex items-center gap-2"><span className="font-mono text-primary font-bold w-20">Click:</span> <span>Pinch thumb & index</span></li>
            <li className="flex items-center gap-2"><span className="font-mono text-primary font-bold w-20">Scroll:</span> <span>Index & middle finger</span></li>
        </ul>
         <div className="mt-4 pt-3 border-t">
            <label htmlFor="sensitivity" className="block text-sm font-medium mb-1">Sensitivity</label>
            <input 
                type="range" 
                id="sensitivity" 
                min="0.5" 
                max="3" 
                step="0.1" 
                value={sensitivity} 
                onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
        </div>
      </div>
    </>
  );
};


// Custom CSS for the cursor and panels
const styles = `
  #gesture-cursor {
    position: fixed;
    top: -12px;
    left: -12px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: hsla(var(--primary), 0.5);
    border: 2px solid hsl(var(--primary-foreground));
    box-shadow: 0 0 15px hsl(var(--primary));
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease-out, background-color 0.2s ease, width 0.2s ease, height 0.2s ease;
    transform-origin: center center;
    will-change: transform;
  }
  #gesture-cursor.clicking {
    background-color: hsla(var(--destructive), 0.7);
    transform: scale(0.7) !important;
    transition-duration: 0.1s;
  }
   #gesture-cursor.scrolling {
    background-color: hsla(120, 60%, 50%, 0.7);
    width: 15px;
    height: 40px;
  }
`;

// Inject styles into the document head
if (typeof window !== 'undefined') {
  const existingStyle = document.getElementById('gesture-control-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'gesture-control-styles';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }
}
