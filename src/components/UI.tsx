import { useStore } from '../store';

const COLORS = [
    '#ff0055', // Neon Red
    '#00ffcc', // Neon Cyan
    '#ccff00', // Neon Lime
    '#aa00ff', // Neon Purple
    '#ffffff', // White
];

export const UI = () => {
    const { currentColor, setColor, viewMode, toggleViewMode, strokes } = useStore();

    return (
        <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            pointerEvents: 'auto', // Ensure clicks pass through
        }}>

            {/* Mode Toggle */}
            <button
                onClick={toggleViewMode}
                style={{
                    padding: '10px 20px',
                    borderRadius: '20px',
                    border: 'none',
                    background: viewMode ? '#ffffff' : '#333333',
                    color: viewMode ? '#000000' : '#ffffff',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                }}
            >
                {viewMode ? 'Back to Drawing' : 'View Mode'}
            </button>

            {/* Color Palette */}
            {!viewMode && (
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    background: 'rgba(0,0,0,0.5)',
                    padding: '10px',
                    borderRadius: '30px',
                    backdropFilter: 'blur(10px)',
                }}>
                    {COLORS.map((color) => (
                        <button
                            key={color}
                            onClick={() => setColor(color)}
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                background: color,
                                border: currentColor === color ? '3px solid white' : 'none',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                transform: currentColor === color ? 'scale(1.2)' : 'scale(1)',
                            }}
                        />
                    ))}
                </div>
            )}

            <div style={{ color: '#666', fontSize: '12px' }}>
                Strokes: {strokes.length}
            </div>
        </div>
    );
};
