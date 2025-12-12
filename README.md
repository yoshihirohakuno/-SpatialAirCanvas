# Spatial Air Canvas

A web application that allows you to draw 3D lines in space using your hands via a webcam. Built with React, Three.js (R3F), and MediaPipe.

## Features

- **Hand Tracking**: Use your index finger and thumb to draw in the air.
- **3D Drawing**: Create volumetric 3D tubes that float in space.
- **Neon Aesthetics**: Glowing strokes with bloom effects.
- **View Mode**: Rotate and zoom to admire your creations from any angle.

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yoshihirohakuno/-SpatialAirCanvas.git
   cd -SpatialAirCanvas
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

3. Allow camera access when prompted.

## How to Use

- **Draw**: Pinch your index finger and thumb together. Move your hand to draw.
- **Stop Drawing**: Release the pinch.
- **Depth**: Move your hand closer/further from the camera to change depth.
- **Change Color**: Click the color buttons at the bottom of the screen.
- **View Mode**: Click the "View Mode" button to rotate the scene with your mouse.

## Technologies

- [React](https://reactjs.org/)
- [Three.js](https://threejs.org/) / [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [MediaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)
- [Vite](https://vitejs.dev/)
