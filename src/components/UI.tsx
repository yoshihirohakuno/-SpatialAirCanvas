import { useStore } from '../store';
import { Eye, PenTool, Undo2, Trash2 } from 'lucide-react';

const COLORS = [
    '#ff0055', // Neon Red
    '#00ffcc', // Neon Cyan
    '#ccff00', // Neon Lime
    '#aa00ff', // Neon Purple
    '#ffffff', // White
];

export const UI = () => {
    const { currentColor, setColor, viewMode, toggleViewMode, strokes, undoStroke, clearStrokes } = useStore();

    return (
        <>
            {/* Actions Container - Bottom Left */}
            <div className="glass-panel" style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column', // Stack vertically if cramped? Let's use horizontal for now. Or follow user's "small in bottom left"
                gap: '10px',
                padding: '12px',
                borderRadius: '16px',
                pointerEvents: 'auto',
            }}>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className={`glass-button ${viewMode ? 'active' : ''}`}
                        onClick={toggleViewMode}
                        style={{
                            padding: '10px',
                            borderRadius: '12px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        title={viewMode ? 'Draw Mode' : 'View Mode'}
                    >
                        {viewMode ? <PenTool size={16} /> : <Eye size={16} />}
                    </button>

                    <button
                        className="glass-button"
                        onClick={undoStroke}
                        disabled={strokes.length === 0}
                        style={{
                            padding: '10px',
                            borderRadius: '12px',
                            cursor: strokes.length === 0 ? 'not-allowed' : 'pointer',
                            opacity: strokes.length === 0 ? 0.5 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                        }}
                        title="Undo"
                    >
                        <Undo2 size={16} />
                    </button>

                    <button
                        className="glass-button"
                        onClick={clearStrokes}
                        disabled={strokes.length === 0}
                        style={{
                            padding: '10px',
                            borderRadius: '12px',
                            cursor: strokes.length === 0 ? 'not-allowed' : 'pointer',
                            opacity: strokes.length === 0 ? 0.5 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: strokes.length > 0 ? '#ff4444' : 'inherit',
                            border: 'none',
                        }}
                        title="Clear All"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Colors Container - Bottom Center */}
            {!viewMode && (
                <div className="glass-panel" style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    display: 'flex',
                    gap: '12px',
                    padding: '8px',
                    borderRadius: '20px',
                    pointerEvents: 'auto',
                }}>
                    {COLORS.map((color) => (
                        <button
                            key={color}
                            onClick={() => setColor(color)}
                            style={{
                                width: '32px',
                                height: '32px',
                                minWidth: '32px', // Prevent shrinking
                                minHeight: '32px', // Prevent shrinking
                                padding: 0, // Reset default padding
                                borderRadius: '50%',
                                background: color,
                                border: currentColor === color ? '3px solid white' : '2px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                transform: currentColor === color ? 'scale(1.15)' : 'scale(1)',
                                boxShadow: currentColor === color ? `0 0 15px ${color}` : `0 0 5px ${color}80`,
                            }}
                        />
                    ))}
                </div>
            )}
        </>
    );
};
