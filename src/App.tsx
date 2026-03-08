import { Suspense } from 'react';
import { Canvas3D } from './components/Canvas3D';
import { HandTracker } from './components/HandTracker';
import { UI } from './components/UI';

function App() {
  return (
    <>
      <HandTracker />
      <Suspense fallback={null}>
        <Canvas3D />
      </Suspense>
      <UI />

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
