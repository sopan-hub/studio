
"use client";

import { useEffect, useRef, useState } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Fingerprint, Move, MousePointerClick, ArrowDownUp } from 'lucide-react';
import { Slider } from './ui/slider';
import { Label } from './ui/label';

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

const GestureInstructions = () => (
    <Card className="fixed bottom-4 left-4 z-[9999] w-80 bg-background/80 backdrop-blur-sm">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
                <Fingerprint />
                Gesture Control Instructions
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
                <Move className="h-6 w-6 text-muted-foreground" />
                <span><span className="font-bold">Move Cursor:</span> Use your index finger.</span>
            </div>
            <div className="flex items-center gap-3">
                <MousePointerClick className="h-6 w-6 text-muted-foreground" />
                <span><span className="font-bold">Click:</span> Pinch thumb and index finger.</span>
            </div>
             <div className="flex items-center gap-3">
                <ArrowDownUp className="h-6 w-6 text-muted-foreground" />
                <span><span className="font-bold">Scroll:</span> Move index and middle finger up or down.</span>
            </div>
        </CardContent>
    </Card>
);

export const GestureController = () => {
  // --- STATE AND REFS ---
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameId = useRef<number>();
  const lastVideoTimeRef = useRef(-1);

  // State for gesture detection
  const isClickGestureRef = useRef(false);
  const lastScrollYRef = useRef<number | null>(null);
  
  // Smoothing state for cursor
  const smoothedCursorPos = useRef({ x: 0, y: 0 });
  const [sensitivity, setSensitivity] = useState(1); // 0.5 to 1.5

  // --- INITIALIZATION ---
  useEffect(() => {
    const initialize = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
        });
        handLandmarkerRef.current = landmarker;
        toast({ title: "Gesture Control Active", description: "Point your index finger at the screen to start." });

        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", startDetection);
        }
      } catch (error) {
        console.error("Initialization failed:", error);
        toast({ variant: "destructive", title: "Gesture Control Error", description: "Could not access webcam or load model." });
      }
    };

    initialize();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
       if (videoRef.current) videoRef.current.removeEventListener("loadeddata", startDetection);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- DETECTION LOOP ---
  const startDetection = () => {
    if (!handLandmarkerRef.current || !videoRef.current || !videoRef.current.srcObject) return;
    videoRef.current.play().catch(e => console.error("Video play failed:", e));
    detectHands();
  };

  const detectHands = () => {
    const video = videoRef.current;
    const landmarker = handLandmarkerRef.current;

    if (video && landmarker && video.readyState >= 3 && video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      const results = landmarker.detectForVideo(video, Date.now());

      if (results.landmarks && results.landmarks.length > 0) {
        processLandmarks(results.landmarks[0]);
      } else {
        lastScrollYRef.current = null;
        if (cursorRef.current) cursorRef.current.style.backgroundColor = 'hsl(var(--primary) / 0.7)';
      }
    }
    animationFrameId.current = requestAnimationFrame(detectHands);
  };

  // --- GESTURE PROCESSING ---
  const processLandmarks = (landmarks: any[]) => {
    if (!cursorRef.current) return;

    // --- 1. Cursor Movement (Single Finger) ---
    const indexFingertip = landmarks[HandLandmark.INDEX_FINGER_TIP];
    const targetX = window.innerWidth * (1 - indexFingertip.x);
    const targetY = window.innerHeight * indexFingertip.y;
    
    const smoothingFactor = 0.3; // Make cursor smoother
    smoothedCursorPos.current.x += (targetX - smoothedCursorPos.current.x) * smoothingFactor;
    smoothedCursorPos.current.y += (targetY - smoothedCursorPos.current.y) * smoothingFactor;

    cursorRef.current.style.transform = `translate(calc(${smoothedCursorPos.current.x}px - 50%), calc(${smoothedCursorPos.current.y}px - 50%))`;

    // --- 2. Gesture Detection ---
    const thumbTip = landmarks[HandLandmark.THUMB_TIP];
    const middleFingertip = landmarks[HandLandmark.MIDDLE_FINGER_TIP];
    const indexFingerPip = landmarks[HandLandmark.INDEX_FINGER_PIP];

    const clickDistance = Math.hypot(indexFingertip.x - thumbTip.x, indexFingertip.y - thumbTip.y);
    const scrollGestureActive = Math.hypot(indexFingertip.x - middleFingertip.x, indexFingertip.y - middleFingertip.y) < 0.07;
    
    const clickThreshold = 0.04;

    // --- 3. Scroll Gesture Logic ---
    if (scrollGestureActive) {
      cursorRef.current.style.backgroundColor = 'hsl(var(--ring))';
      const currentY = (indexFingertip.y + middleFingertip.y) / 2;
      
      if (lastScrollYRef.current !== null) {
        const deltaY = currentY - lastScrollYRef.current;
        window.scrollBy(0, deltaY * 1500 * sensitivity); // Scroll speed affected by sensitivity
      }
      lastScrollYRef.current = currentY;
    } 
    // --- 4. Click Gesture Logic ---
    else if (clickDistance < clickThreshold) {
      cursorRef.current.style.backgroundColor = 'hsl(var(--destructive))';
      if (!isClickGestureRef.current) {
        isClickGestureRef.current = true;
        performClick(smoothedCursorPos.current.x, smoothedCursorPos.current.y);
        
        if(cursorRef.current) {
            cursorRef.current.style.transform += ' scale(0.7)';
            setTimeout(() => {
                if(cursorRef.current) cursorRef.current.style.transform = cursorRef.current.style.transform.replace(' scale(0.7)', '');
            }, 150);
        }
      }
    } else {
      // Reset states if no gesture is active
      isClickGestureRef.current = false;
      lastScrollYRef.current = null;
      cursorRef.current.style.backgroundColor = 'hsl(var(--primary) / 0.7)';
    }
  };

  // --- ACTION SIMULATION ---
  const performClick = (x: number, y: number) => {
    if (cursorRef.current) {
      cursorRef.current.style.display = 'none';
      const element = document.elementFromPoint(x, y);
      cursorRef.current.style.display = '';

      if (element instanceof HTMLElement) {
        element.click();
        toast({ title: "Gesture Click", description: `Clicked on <${element.tagName.toLowerCase()}>` });
      }
    }
  };

  // --- RENDER ---
  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-6 h-6 rounded-full bg-primary/70 border-2 border-primary-foreground shadow-lg pointer-events-none z-[9999] transition-all duration-100 ease-out"
      />
      
      <video ref={videoRef} className="fixed -z-10 w-px h-px left-0 top-0 opacity-0" playsInline />
      
      <GestureInstructions />

      <Card className="fixed bottom-4 right-4 z-[9999] w-72 bg-background/80 backdrop-blur-sm p-4">
        <Label htmlFor="sensitivity-slider" className="mb-2 block text-sm font-medium">Cursor Sensitivity</Label>
        <Slider
            id="sensitivity-slider"
            min={0.5}
            max={1.5}
            step={0.1}
            value={[sensitivity]}
            onValueChange={(value) => setSensitivity(value[0])}
        />
      </Card>
    </>
  );
};
