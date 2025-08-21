
"use client";

import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

// --- Constants ---
const CLICK_THRESHOLD_FRAMES = 5; // Number of consecutive frames to confirm a click
const INDEX_FINGER_TIP = 8;
const MIDDLE_FINGER_TIP = 12;
const CLICK_DISTANCE_THRESHOLD = 0.05; // Normalized distance threshold for click gesture

export const GestureController = () => {
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const handLandmarkerRef = useRef<HandLandmarker | null>(null);
    const lastVideoTimeRef = useRef(-1);
    const cursorRef = useRef<HTMLDivElement | null>(null);
    const clickCounterRef = useRef(0);
    const animationFrameId = useRef<number>();

    // --- Initialization ---
    useEffect(() => {
        const initialize = async () => {
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
        };

        initialize();

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
            if (cursorRef.current) {
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
    
    // --- Cursor Element ---
    useEffect(() => {
        // Create a custom cursor element and append it to the body
        const customCursor = document.createElement('div');
        customCursor.style.position = 'fixed';
        customCursor.style.width = '20px';
        customCursor.style.height = '20px';
        customCursor.style.border = '2px solid #00FFFF';
        customCursor.style.borderRadius = '50%';
        customCursor.style.pointerEvents = 'none';
        customCursor.style.zIndex = '9999';
        customCursor.style.transform = 'translate(-50%, -50%)';
        customCursor.style.transition = 'transform 0.1s ease-out';
        customCursor.style.boxShadow = '0 0 10px #00FFFF, 0 0 20px #00FFFF';
        document.body.appendChild(customCursor);
        cursorRef.current = customCursor;
    }, []);

    // --- Real-time Detection Loop ---
    const startDetection = () => {
        const detect = async () => {
            if (videoRef.current && handLandmarkerRef.current && videoRef.current.readyState >= 3) {
                const video = videoRef.current;
                const currentTime = video.currentTime;
                
                if(currentTime > lastVideoTimeRef.current) {
                    lastVideoTimeRef.current = currentTime;
                    const results = await handLandmarkerRef.current.detectForVideo(video, Date.now());
                    
                    if (results.landmarks && results.landmarks.length > 0) {
                        processLandmarks(results.landmarks[0]);
                    }
                }
            }
            animationFrameId.current = requestAnimationFrame(detect);
        };
        detect();
    };

    // --- Landmark Processing & Actions ---
    const processLandmarks = (landmarks: handPoseDetection.Keypoint[]) => {
        // --- Cursor Movement ---
        const indexTip = landmarks[INDEX_FINGER_TIP]; // Landmark for the tip of the index finger
        if (indexTip && cursorRef.current) {
            // Flip the x-coordinate to make it a mirror image
            const cursorX = window.innerWidth - (indexTip.x * window.innerWidth);
            const cursorY = indexTip.y * window.innerHeight;
            
            cursorRef.current.style.left = `${cursorX}px`;
            cursorRef.current.style.top = `${cursorY}px`;
        }

        // --- Click Gesture ---
        const middleTip = landmarks[MIDDLE_FINGER_TIP];
        if (indexTip && middleTip) {
            const distance = Math.sqrt(
                Math.pow(indexTip.x - middleTip.x, 2) +
                Math.pow(indexTip.y - middleTip.y, 2) +
                Math.pow((indexTip.z || 0) - (middleTip.z || 0), 2)
            );

            if (distance < CLICK_DISTANCE_THRESHOLD) {
                clickCounterRef.current++;
            } else {
                clickCounterRef.current = 0; // Reset if the gesture is broken
            }

            if (clickCounterRef.current === CLICK_THRESHOLD_FRAMES) {
                performClick(indexTip.x, indexTip.y);
                clickCounterRef.current = 0; // Reset after click
            }
        }
    };

    const performClick = (x: number, y: number) => {
        if (!cursorRef.current) return;
        
        // Hide the custom cursor briefly to allow the native click to go through
        cursorRef.current.style.display = 'none';

        const clickX = window.innerWidth - (x * window.innerWidth);
        const clickY = y * window.innerHeight;
        
        // Find the element at the cursor's position
        const element = document.elementFromPoint(clickX, clickY);

        // Re-show the custom cursor
        cursorRef.current.style.display = 'block';

        if (element instanceof HTMLElement) {
             // Animate the click
            cursorRef.current.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorRef.current.style.backgroundColor = 'rgba(0, 255, 255, 0.5)';
            setTimeout(() => {
                if (cursorRef.current) {
                    cursorRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
                    cursorRef.current.style.backgroundColor = 'transparent';
                }
            }, 150);

            // Dispatch a click event
            element.click();
            toast({ title: "Gesture Click!", description: `Clicked on a ${element.tagName} element.` });
        }
    };

    // The video element is only for processing, not for display to the user
    return <video ref={videoRef} autoPlay playsInline style={{ display: 'none' }} />;
};
