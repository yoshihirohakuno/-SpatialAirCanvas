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

    // Actions
    setCursor: (pos: THREE.Vector3, detected: boolean) => void;
    setIsDrawing: (drawing: boolean) => void;
    startStroke: () => void;
    addPointToStroke: (point: THREE.Vector3) => void;
    endStroke: () => void;
    setColor: (color: string) => void;
    toggleViewMode: () => void;
}

export const useStore = create<AppState>((set, get) => ({
    cursorPosition: new THREE.Vector3(0, 0, 0),
    isDrawing: false,
    handDetected: false,

    strokes: [],
    currentStrokeId: null,
    currentColor: '#00ffcc', // Default neon cyan
    currentLineWidth: 0.1,

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
                    // Prevent adding points that are too close
                    const lastPoint = stroke.points[stroke.points.length - 1];
                    if (lastPoint) {
                        const dist = lastPoint.position.distanceTo(point);
                        if (dist < 0.01) return stroke;
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
}));
