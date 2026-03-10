import { create } from 'zustand';
import * as THREE from 'three';

interface StrokePoint {
    position: THREE.Vector3;
    timestamp: number;
}

interface Stroke {
    id: string;
    points: StrokePoint[];
    color: string;
    lineWidth: number;
}

interface AppState {
    // Hand State
    cursorPosition: THREE.Vector3;
    isDrawing: boolean;
    handDetected: boolean;

    // Drawing State
    strokes: Stroke[];
    currentStrokeId: string | null;
    currentColor: string;
    currentLineWidth: number;

    // View State
    viewMode: boolean; // false = Draw, true = View (Orbit)

    // Camera State
    cameraPermission: 'prompt' | 'granted' | 'denied';
    setCameraPermission: (status: 'prompt' | 'granted' | 'denied') => void;

    // Actions
    setCursor: (pos: THREE.Vector3, detected: boolean) => void;
    setIsDrawing: (drawing: boolean) => void;
    startStroke: () => void;
    addPointToStroke: (point: THREE.Vector3) => void;
    endStroke: () => void;
    setColor: (color: string) => void;
    toggleViewMode: () => void;
    undoStroke: () => void;
    clearStrokes: () => void;
}

export const useStore = create<AppState>((set, get) => ({
    cameraPermission: 'prompt',
    setCameraPermission: (status) => set({ cameraPermission: status }),
    cursorPosition: new THREE.Vector3(0, 0, 0),
    isDrawing: false,
    handDetected: false,

    strokes: [],
    currentStrokeId: null,
    currentColor: '#00ffcc', // Default neon cyan
    currentLineWidth: 0.033, // Reduced to approx 2/3 of 0.05

    viewMode: false,

    setCursor: (pos, detected) => set({ cursorPosition: pos, handDetected: detected }),

    setIsDrawing: (drawing) => {
        const { isDrawing, startStroke, endStroke } = get();
        if (drawing && !isDrawing) {
            startStroke();
        } else if (!drawing && isDrawing) {
            endStroke();
        }
        set({ isDrawing: drawing });
    },

    startStroke: () => {
        const id = crypto.randomUUID();
        set((state) => ({
            currentStrokeId: id,
            strokes: [
                ...state.strokes,
                {
                    id,
                    points: [],
                    color: state.currentColor,
                    lineWidth: state.currentLineWidth,
                },
            ],
        }));
    },

    addPointToStroke: (point) => {
        set((state) => {
            const { currentStrokeId, strokes } = state;
            if (!currentStrokeId) return {};

            const newStrokes = strokes.map((stroke) => {
                if (stroke.id === currentStrokeId) {
                    const lastPoint = stroke.points[stroke.points.length - 1];

                    if (lastPoint) {
                        const dist = lastPoint.position.distanceTo(point);
                        // Further reduce distance threshold to almost nothing so points never drop when moving fast
                        if (dist < 0.001) return stroke;

                        // Stronger smoothing so the line stays connected without jagged edges
                        point.lerp(lastPoint.position, 0.5);
                    }

                    return {
                        ...stroke,
                        points: [...stroke.points, { position: point, timestamp: Date.now() }],
                    };
                }
                return stroke;
            });

            return { strokes: newStrokes };
        });
    },

    endStroke: () => {
        set({ currentStrokeId: null });
    },

    setColor: (color) => set({ currentColor: color }),

    toggleViewMode: () => set((state) => ({ viewMode: !state.viewMode })),

    undoStroke: () => set((state) => ({ strokes: state.strokes.slice(0, -1) })),

    clearStrokes: () => set({ strokes: [] }),
}));
