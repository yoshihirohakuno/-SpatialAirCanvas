import { useEffect, useRef } from 'react';
import { Hands, type Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import * as THREE from 'three';
import { useStore } from '../store';

export const HandTracker = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const previousPositionRef = useRef<THREE.Vector3 | null>(null);
    const { setCursor, setIsDrawing, addPointToStroke, viewMode } = useStore();

    useEffect(() => {
        if (!videoRef.current) return;

        const hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            },
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        hands.onResults(onResults);

        const camera = new Camera(videoRef.current, {
            onFrame: async () => {
                if (videoRef.current) {
                    await hands.send({ image: videoRef.current });
                }
            },
            width: 1280,
            height: 720,
        });

        camera.start();

        return () => {
            camera.stop();
            // hands.close(); // Cleanup if needed
        };
    }, []);

    const onResults = (results: Results) => {
        if (viewMode) return; // Don't track/draw in view mode

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            const indexTip = landmarks[8];
            const thumbTip = landmarks[4];

            // 1. Calculate Pinch (Distance between index and thumb)
            const distance = Math.sqrt(
                Math.pow(indexTip.x - thumbTip.x, 2) +
                Math.pow(indexTip.y - thumbTip.y, 2) +
                Math.pow(indexTip.z - thumbTip.z, 2)
            );

            // Threshold for pinch (Relaxed to allow looser pinch for continuous smooth drawing)
            const PINCH_THRESHOLD = 0.08;
            const isPinching = distance < PINCH_THRESHOLD;

            setIsDrawing(isPinching);

            // 2. Map Coordinates to 3D Space
            // MediaPipe: x [0, 1] (left-right), y [0, 1] (top-bottom), z (relative depth)
            // Three.js: x [-w, w], y [-h, h], z [-d, d]

            // We'll map x/y to a virtual plane at z=0 initially, but modify z based on hand depth.
            // Inverting X because webcam is mirrored usually, but MediaPipe might already handle it.
            // Let's assume standard webcam mirror: moving right hand to right side of screen = x increases.
            // In 3D, x positive is right.

            // Apply smoothing for significantly better line precision
            // We use a ref to store the previous smoothed position
            const targetX = (1 - indexTip.x) * 10 - 5;
            const targetY = (1 - indexTip.y) * 6 - 3;
            const targetZ = -indexTip.z * 5;

            // Normal smoothing factor (balances speed and denoising)
            const SMOOTHING_FACTOR = 0.5;

            if (!previousPositionRef.current) {
                previousPositionRef.current = new THREE.Vector3(targetX, targetY, targetZ);
            }

            const smoothedX = previousPositionRef.current.x + (targetX - previousPositionRef.current.x) * SMOOTHING_FACTOR;
            const smoothedY = previousPositionRef.current.y + (targetY - previousPositionRef.current.y) * SMOOTHING_FACTOR;
            const smoothedZ = previousPositionRef.current.z + (targetZ - previousPositionRef.current.z) * SMOOTHING_FACTOR;

            const position = new THREE.Vector3(smoothedX, smoothedY, smoothedZ);
            previousPositionRef.current.copy(position);

            setCursor(position.clone(), true);

            if (isPinching) {
                // Ensure we don't start a stroke repeatedly when already drawing
                addPointToStroke(position.clone());
            }

        } else {
            previousPositionRef.current = null; // Reset smoothing when hand is lost
            setCursor(new THREE.Vector3(0, 0, 0), false);
            setIsDrawing(false);
        }
    };

    return (
        <video
            ref={videoRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)', // Mirror the video
                opacity: 0.2, // Make it subtle so we see the 3D content more
                zIndex: 0,
                pointerEvents: 'none',
            }}
            playsInline
        />
    );
};
