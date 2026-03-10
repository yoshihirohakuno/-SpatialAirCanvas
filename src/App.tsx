import { Suspense } from 'react';
import { Canvas3D } from './components/Canvas3D';
import { HandTracker } from './components/HandTracker';
import { UI } from './components/UI';
import { useStore } from './store';

function App() {
  const { cameraPermission } = useStore();

  return (
    <>
      <HandTracker />
      <Suspense fallback={null}>
        <Canvas3D />
      </Suspense>
      <UI />

      {/* Permission Denied Overlay */}
      {cameraPermission === 'denied' && (
        <div className="glass-panel" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 100,
          padding: '40px',
          borderRadius: '24px',
          textAlign: 'center',
          color: 'white',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <h2 style={{ margin: 0, color: '#ff4d4d', fontSize: '1.5rem', fontWeight: '600' }}>Camera Access Required</h2>
          <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9, lineHeight: '1.5' }}>
            Spatial Air Canvas uses your webcam to track your hand movements for drawing in 3D space.
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '16px',
            borderRadius: '12px',
            marginTop: '8px',
            fontSize: '0.9rem',
            textAlign: 'left',
            width: '100%',
          }}>
            <strong style={{ display: 'block', marginBottom: '8px' }}>How to enable:</strong>
            <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Click the lock or camera icon in your browser's address bar.</li>
              <li>Find "Camera" and set it to <strong>Allow</strong>.</li>
              <li>Refresh the page to start drawing.</li>
            </ol>
          </div>
        </div>
      )}

      {/* Instructions Overlay */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: 'white',
        zIndex: 5,
        pointerEvents: 'none',
        opacity: 0.5,
        fontSize: '10px',
        fontFamily: 'monospace',
      }}>
        SpatialAirCanvas v1.0<br />
        [Draw] Pinch Index+Thumb<br />
        [Depth] Move Hand In/Out
      </div>
    </>
  );
}

export default App;
