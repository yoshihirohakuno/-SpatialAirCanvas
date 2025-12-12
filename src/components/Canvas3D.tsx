import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useStore } from '../store';

const StrokeMesh = ({ stroke }: { stroke: any }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    const geometry = useMemo(() => {
        if (stroke.points.length < 2) return null;

        const points = stroke.points.map((p: any) => p.position);
        // CatmullRomCurve3 for smooth curves
        const curve = new THREE.CatmullRomCurve3(points);
        // TubeGeometry: path, tubularSegments, radius, radialSegments, closed
        return new THREE.TubeGeometry(curve, points.length * 6, stroke.lineWidth, 8, false);
    }, [stroke.points, stroke.lineWidth]);

    if (!geometry) return null;

    return (
        <mesh ref={meshRef} geometry={geometry}>
            <meshStandardMaterial
                color={stroke.color}
                emissive={stroke.color}
                emissiveIntensity={2}
                roughness={0.1}
                metalness={0.8}
            />
        </mesh>
    );
};

const CurrentCursor = () => {
    const { cursorPosition, handDetected, isDrawing, currentColor } = useStore();
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (meshRef.current) {
            // Smoothly interpolate cursor position for visual stability
            meshRef.current.position.lerp(cursorPosition, 0.2);
        }
    });

    if (!handDetected) return null;

    return (
        <Sphere ref={meshRef} args={[isDrawing ? 0.05 : 0.08, 16, 16]}>
            <meshStandardMaterial
                color={isDrawing ? currentColor : '#ffffff'}
                emissive={isDrawing ? currentColor : '#ffffff'}
                emissiveIntensity={isDrawing ? 2 : 0.5}
                transparent
                opacity={0.8}
            />
        </Sphere>
    );
};

const SceneContent = () => {
    const { strokes, viewMode } = useStore();

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            {strokes.map((stroke) => (
                <StrokeMesh key={stroke.id} stroke={stroke} />
            ))}

            <CurrentCursor />

            {viewMode && <OrbitControls makeDefault />}

            <EffectComposer>
                <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.8} />
            </EffectComposer>
        </>
    );
};

export const Canvas3D = () => {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping }}
            >
                <color attach="background" args={['#050505']} />
                <SceneContent />
            </Canvas>
        </div>
    );
};
