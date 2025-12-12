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
        top: '20px',
        left: '20px',
        color: 'white',
        zIndex: 5,
        pointerEvents: 'none',
        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Spatial Air Canvas</h1>
        <p style={{ margin: '5px 0', opacity: 0.8 }}>
          Pinch index & thumb to draw.<br />
          Move hand closer/further for depth.
        </p>
      </div>
    </>
  );
}

export default App;
