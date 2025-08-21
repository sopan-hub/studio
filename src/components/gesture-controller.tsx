
"use client";

import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

// --- Constants for Gesture Recognition ---
const CLICK_THRESHOLD_FRAMES = 4;    // Consecutive frames to confirm a click
const SCROLL_THRESHOLD_FRAMES = 10;   // Consecutive frames to activate scroll mode
const GESTURE_RESET_FRAMES = 15;     // Frames of no gesture to reset state

// Landmark indices from MediaPipe
const INDEX_FINGER_TIP = 8;
const MIDDLE_FINGER_TIP = 12;
const RING_FINGER_TIP = 16;
const THUMB_TIP = 4;

// Distance thresholds for gestures (normalized)
const CLICK_DISTANCE_THRESHOLD = 0.06;
const SCROLL_DISTANCE_THRESHOLD = 0.05;

type GestureState = 'none' | 'clicking' | 'scrolling';

export const GestureController = () => {
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const handLandmarkerRef = useRef<HandLandmarker | null>(null);
    const lastVideoTimeRef = useRef(-1);
    const cursorRef = useRef<HTMLDivElement | null>(null);
    
    // Refs for gesture detection state
    const clickCounterRef = useRef(0);
    const scrollCounterRef = useRef(0);
    const noGestureCounterRef = useRef(0);
    const lastHandPosRef = useRef<{ x: number, y: number } | null>(null);
    const activeGestureRef = useRef<GestureState>('none');
    
    const animationFrameId = useRef<number>();

    // --- Initialization ---
    useEffect(() => {
        const initialize = async () => {
            try {
                await tf.setBackend('webgl');
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
                );
                handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 1
                });
                toast({ title: "Gesture Control Ready", description: "The hand tracking model has loaded." });
                setupCamera();
            } catch (error) {
                console.error("Initialization failed:", error);
                toast({ variant: 'destructive', title: "Gesture Control Failed", description: "Could not load the hand tracking model." });
            }
        };

        initialize();

        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
            if (cursorRef.current && document.body.contains(cursorRef.current)) {
                document.body.removeChild(cursorRef.current);
            }
        };
    }, [toast]);

    const setupCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.addEventListener('loadeddata', startDetection);
            }
        } catch (error) {
            console.error("Camera access denied:", error);
            toast({
                variant: 'destructive',
                title: "Camera Access Denied",
                description: "Please enable camera permissions to use gesture control."
            });
        }
    };
    
    // --- Create Custom Cursor ---
    useEffect(() => {
        // Ensure this runs only once
        if (cursorRef.current) return;

        const customCursor = document.createElement('div');
        customCursor.style.position = 'fixed';
        customCursor.style.width = '24px';
        customCursor.style.height = '24px';
        customCursor.style.border = '3px solid #00FFFF';
        customCursor.style.borderRadius = '50%';
        customCursor.style.pointerEvents = 'none';
        customCursor.style.zIndex = '99999';
        customCursor.style.transform = 'translate(-50%, -50%)';
        customCursor.style.transition = 'transform 0.1s ease-out, background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, border-radius 0.2s ease';
        customCursor.style.boxShadow = '0 0 12px #00FFFF, 0 0 20px #00FFFF';
        customCursor.style.backdropFilter = 'blur(2px)';
        customCursor.style.opacity = '0'; // Start hidden
        document.body.appendChild(customCursor);
        cursorRef.current = customCursor;
    }, []);

    // --- Detection Loop ---
    const startDetection = () => {
        const detect = async () => {
            if (videoRef.current && handLandmarkerRef.current && videoRef.current.readyState >= 3) {
                const video = videoRef.current;
                const currentTime = video.currentTime;
                
                if(currentTime > lastVideoTimeRef.current) {
                    lastVideoTimeRef.current = currentTime;
                    const results = await handLandmarkerRef.current.detectForVideo(video, Date.now());
                    
                    if (results.landmarks && results.landmarks.length > 0) {
                        if (cursorRef.current) cursorRef.current.style.opacity = '1';
                        processLandmarks(results.landmarks[0]);
                    } else {
                        // If no hand is detected, reset gesture state and hide cursor
                         if (cursorRef.current) cursorRef.current.style.opacity = '0';
                         activeGestureRef.current = 'none';
                         updateCursorAppearance('none');
                    }
                }
            }
            animationFrameId.current = requestAnimationFrame(detect);
        };
        detect();
    };

    // --- Landmark & Gesture Processing ---
    const processLandmarks = (landmarks: handPoseDetection.Keypoint[]) => {
        if (!landmarks || landmarks.length === 0) return;

        const indexTip = landmarks[INDEX_FINGER_TIP];
        const middleTip = landmarks[MIDDLE_FINGER_TIP];
        const ringTip = landmarks[RING_FINGER_TIP];
        const thumbTip = landmarks[THUMB_TIP];

        if (!indexTip || !middleTip || !ringTip || !thumbTip) return;
        
        // --- 1. Cursor Movement (Always active) ---
        if (cursorRef.current) {
            // Invert the x-coordinate to match screen direction
            const cursorX = window.innerWidth - (indexTip.x * window.innerWidth);
            const cursorY = indexTip.y * window.innerHeight;
            cursorRef.current.style.left = `${cursorX}px`;
            cursorRef.current.style.top = `${cursorY}px`;
        }

        // --- 2. Gesture Detection ---
        const isClickGesture = getDistance(thumbTip, indexTip) < CLICK_DISTANCE_THRESHOLD;
        const isScrollGesture = getDistance(indexTip, middleTip) < SCROLL_DISTANCE_THRESHOLD && getDistance(middleTip, ringTip) < SCROLL_DISTANCE_THRESHOLD;

        // --- 3. State Machine for Gestures ---
        if (activeGestureRef.current === 'scrolling') {
            if (isScrollGesture) {
                performScroll(indexTip);
                noGestureCounterRef.current = 0; // Reset no-gesture counter
            } else {
                noGestureCounterRef.current++;
                if (noGestureCounterRef.current > GESTURE_RESET_FRAMES) {
                    resetGestureState();
                }
            }
            return; // Don't check for other gestures while scrolling
        }

        // --- Check for new gestures if not currently scrolling ---
        if (isClickGesture) {
            clickCounterRef.current++;
            scrollCounterRef.current = 0;
            updateCursorAppearance('clicking');
            if (clickCounterRef.current >= CLICK_THRESHOLD_FRAMES) {
                performClick();
                resetGestureState(); // Reset after a successful click
            }
        } else if (isScrollGesture) {
            scrollCounterRef.current++;
            clickCounterRef.current = 0;
            updateCursorAppearance('scrolling');
            if (scrollCounterRef.current >= SCROLL_THRESHOLD_FRAMES) {
                activeGestureRef.current = 'scrolling';
                lastHandPosRef.current = { x: indexTip.x, y: indexTip.y };
            }
        } else {
            // No gesture detected, reset everything gradually
            noGestureCounterRef.current++;
            if (noGestureCounterRef.current > GESTURE_RESET_FRAMES) {
                resetGestureState();
            }
        }
    };
    
    // --- Helper Functions ---
    
    const getDistance = (p1: handPoseDetection.Keypoint, p2: handPoseDetection.Keypoint) => {
       return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow((p1.z || 0) - (p2.z || 0), 2));
    };

    const resetGestureState = () => {
        clickCounterRef.current = 0;
        scrollCounterRef.current = 0;
        noGestureCounterRef.current = 0;
        activeGestureRef.current = 'none';
        lastHandPosRef.current = null;
        updateCursorAppearance('none');
    };

    const updateCursorAppearance = (state: GestureState) => {
        if (!cursorRef.current) return;
        switch (state) {
            case 'clicking':
                cursorRef.current.style.borderColor = '#FF00FF'; // Magenta for click
                cursorRef.current.style.boxShadow = '0 0 15px #FF00FF, 0 0 25px #FF00FF';
                cursorRef.current.style.transform = 'translate(-50%, -50%) scale(1.4)';
                break;
            case 'scrolling':
                cursorRef.current.style.borderColor = '#FFFF00'; // Yellow for scroll
                cursorRef.current.style.boxShadow = '0 0 15px #FFFF00, 0 0 25px #FFFF00';
                cursorRef.current.style.transform = 'translate(-50%, -50%) scale(1.2)';
                cursorRef.current.style.borderRadius = '20%';
                break;
            case 'none':
            default:
                cursorRef.current.style.borderColor = '#00FFFF'; // Cyan default
                cursorRef.current.style.boxShadow = '0 0 12px #00FFFF, 0 0 20px #00FFFF';
                cursorRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorRef.current.style.borderRadius = '50%';
                break;
        }
    }
    
    // --- Action Functions ---

    const performClick = () => {
        if (!cursorRef.current) return;
        
        const cursor = cursorRef.current;
        cursor.style.display = 'none'; // Hide cursor to not interfere with elementFromPoint
        const clickX = parseFloat(cursor.style.left);
        const clickY = parseFloat(cursor.style.top);
        const element = document.elementFromPoint(clickX, clickY);
        cursor.style.display = 'block'; // Show it again

        if (element instanceof HTMLElement) {
            element.click();
            toast({ title: "Gesture Click!", description: `Clicked a ${element.tagName} element.` });
        }
    };
    
    const performScroll = (currentHandPos: handPoseDetection.Keypoint) => {
        if (!lastHandPosRef.current) {
            lastHandPosRef.current = { x: currentHandPos.x, y: currentHandPos.y };
            return;
        }

        const dy = currentHandPos.y - lastHandPosRef.current.y;
        
        // Simple smoothing and scaling for scroll speed
        const scrollAmount = dy * window.innerHeight * 1.5;

        window.scrollBy(0, scrollAmount);

        // Update last position for next frame's calculation
        lastHandPosRef.current = { x: currentHandPos.x, y: currentHandPos.y };
    };


    // The video element is only for processing, not for display
    return <video ref={videoRef} autoPlay playsInline muted style={{ 
        position: 'fixed',
        top: 10,
        right: 10,
        width: '120px',
        height: '90px',
        border: '2px solid #00FFFF',
        borderRadius: '8px',
        boxShadow: '0 0 10px #00FFFF',
        zIndex: 10000,
        transform: 'scaleX(-1)', // Mirror the video feed
        display: 'block' // Set to 'none' to hide it
    }} />;
};

    