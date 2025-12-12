import { useEffect, useRef } from 'react';
import { Hands, type Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import * as THREE from 'three';
import { useStore } from '../store';

export const HandTracker = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
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

            // Threshold for pinch (tune this value)
            const PINCH_THRESHOLD = 0.05;
            const isPinching = distance < PINCH_THRESHOLD;

            setIsDrawing(isPinching);

            // 2. Map Coordinates to 3D Space
            // MediaPipe: x [0, 1] (left-right), y [0, 1] (top-bottom), z (relative depth)
            // Three.js: x [-w, w], y [-h, h], z [-d, d]

            // We'll map x/y to a virtual plane at z=0 initially, but modify z based on hand depth.
            // Inverting X because webcam is mirrored usually, but MediaPipe might already handle it.
            // Let's assume standard webcam mirror: moving right hand to right side of screen = x increases.
            // In 3D, x positive is right.

            const x = (1 - indexTip.x) * 10 - 5; // Map 0..1 to -5..5
            const y = (1 - indexTip.y) * 6 - 3;  // Map 0..1 to -3..3 (approx 16:9 aspect)

            // Z estimation. indexTip.z is relative to wrist. 
            // We might want absolute depth. MediaPipe doesn't give absolute metric depth easily without depth sensor.
            // However, we can use the size of the hand or just the raw Z if it's consistent enough.
            // Let's try to use a multiplier on the raw Z for now.
            // const z = -indexTip.z * 10;
            // Actually MediaPipe Z: "The z coordinate represents the landmark depth with the depth at the wrist being the origin, and the smaller the value the closer the landmark is to the camera."
            // So negative Z = closer to camera.
            // In Three.js, positive Z is towards the viewer.
            // So we can map MediaPipe Z directly-ish.

            const position = new THREE.Vector3(x, y, 0); // Start with 0 Z for safety, refine later.

            // Let's use a simpler mapping for Z for now: just fixed plane or simple depth
            // For "Air Canvas", we want Z control.
            // Let's try to use the Z value from landmarks but scaled.
            // Or better: Use the "World Landmarks" if available? 
            // results.multiHandWorldLandmarks gives real world coordinates (meters).

            if (results.multiHandWorldLandmarks) {
                // World landmarks are centered at the hip usually? No, for hands it's relative to wrist.
                // Let's stick to normalized landmarks for screen mapping + Z scaling.
            }

            // Refined Z:
            // We want to be able to reach "in" and "out".
            // Let's just use the normalized Z * scale.
            position.z = -indexTip.z * 5; // Scale it up.

            setCursor(position, true);

            if (isPinching) {
                addPointToStroke(position);
            }

        } else {
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
