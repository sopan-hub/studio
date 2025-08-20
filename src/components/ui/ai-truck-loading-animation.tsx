
"use client";

import React, { useEffect, useRef } from 'react';

export const AiTruckLoadingAnimation = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const button = buttonRef.current;
        if (button) {
            // Start the animation loop
            const startAnimation = () => {
                if (!buttonRef.current) return;
                buttonRef.current.classList.add('animate');
                setTimeout(() => {
                    if (buttonRef.current) {
                        buttonRef.current.classList.remove('animate');
                        // Loop the animation
                        setTimeout(startAnimation, 100);
                    }
                }, 10000); // Animation duration is 10s
            };
            startAnimation();
        }
    }, []);

    return (
        <div className="truck-animation-container">
            <button ref={buttonRef} className="order-truck-button" aria-label="Loading animation">
                <span className="default">Generating</span>
                <span className="success">
                    Done
                    <svg viewBox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                    </svg>
                </span>
                <div className="box"></div>
                <div className="truck">
                    <div className="back"></div>
                    <div className="front">
                        <div className="window"></div>
                    </div>
                    <div className="light top"></div>
                    <div className="light bottom"></div>
                </div>
                <div className="lines"></div>
            </button>
        </div>
    );
};
