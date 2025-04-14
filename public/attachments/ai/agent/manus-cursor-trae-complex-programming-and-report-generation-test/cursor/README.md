# Magic Ruler (魔尺) 3D Simulation

A 3D simulation of a Magic Ruler (also known as "Magic Snake" or "Rubik's Twist") using Three.js.

![Magic Ruler Screenshot](https://raw.githubusercontent.com/zozowind/magic-ruler/main/screenshot.png)

## Features

- Interactive 3D rendering of a 24-segment Magic Ruler
- Mouse controls: rotate the view and fold segments
- Each segment has the correct geometry (5 faces: 2 squares, 2 triangles, and 1 rectangle)
- Adjacent segments connected along square faces with 360-degree rotation capability
- Customizable colors for odd and even segments
- Multiple rotation axes (X, Y, Z, or random)
- Adjustable rotation angles (45°, 90°, 180°, or custom)
- Reset and random fold functionality

## How to Run

### Option 1: Simple opening in browser
Just open `index.html` in a modern web browser.

### Option 2: Using the included Node.js server (recommended)
1. Make sure you have [Node.js](https://nodejs.org/) installed
2. Navigate to the project directory in your terminal
3. Run the server:
   ```
   node server.js
   ```
4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

1. Drag to rotate the 3D view
2. Use mouse wheel to zoom in/out
3. Click on a segment to rotate it
4. Use the control panel to:
   - Reset the ruler to its original position
   - Apply random folds to all segments
   - Change colors of odd and even segments
   - Select rotation axis (X, Y, Z, or random)
   - Set rotation amount (45°, 90°, 180°, or custom angle)

## Implementation Details

- Built with Three.js for 3D rendering
- Custom geometry for each segment with 5 faces
- Pivot-based rotation system for segment folding
- Raycasting for segment selection
- Responsive design that adapts to window size

## Requirements

- Modern web browser with JavaScript and WebGL support
- (Optional) Node.js for running the server

## License

Open source for educational purposes. 