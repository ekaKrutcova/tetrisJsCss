# Tetris-CSS-JS

A classic Tetris game built with pure HTML, CSS, and JavaScript. Features a retro-inspired design with sound effects, level progression, and smooth animations.

<img src="./tetris.gif" width="250"/>

## 🎮 Features

- **Classic Tetris Gameplay**: 7 different tetrominoes (I, O, T, S, Z, J, L) with rotation mechanics
- **Next Piece Preview**: See the upcoming tetromino before it appears
- **Score & Level System**: 5 levels with star indicators
- **Sound Effects**: Background music and action sounds (can be toggled)
- **Responsive Design**: Built with CSS custom properties for flexible sizing
- **Game Controls**: 
  - On-screen buttons for mobile/tablet play
  - Keyboard controls for desktop play
- **Visual Feedback**: Animated line clears and game over sequences
- **Pause/Resume**: Ability to pause and resume gameplay

## 🕹️ Controls

### Keyboard
- **Arrow Left** (`←`): Move tetromino left
- **Arrow Right** (`→`): Move tetromino right
- **Arrow Down** (`↓`): Drop tetromino to bottom instantly
- **Arrow Up** (`↑`): Increase game speed
- **Shift**: Rotate tetromino

### On-Screen Buttons
- **On/Off**: Power button to start/reset the game
- **Start/Pause**: Control game state
- **Sound**: Toggle sound effects on/off
- **Reset**: Restart the current game
- **Movement Buttons**: Arrow pad for moving pieces
- **Rotate Button**: Large button for rotating tetrominoes

## 🎯 How to Play

1. Click the **On/Off** button to power on the game
2. Click **Start/Pause** to begin playing
3. Use arrow keys or on-screen buttons to move and rotate tetrominoes
4. Complete horizontal lines to clear them and earn points
5. Clear lines to progress through 5 levels (indicated by stars)
6. Game ends when the stack reaches the top

## 📁 Project Structure

```
tetrisJsCss/
├── index.html      # Main HTML structure
├── styles.css      # Game styling and layout
├── app.js          # Game logic and controls
├── sounds/         # Audio files for game effects
│   ├── tetris.ogg
│   ├── success.wav
│   ├── fall.wav
│   ├── rotation.wav
│   ├── gameover.wav
│   └── glory.mp3
├── DS-DIGI.TTF     # Digital font for score display
└── tetris.gif      # Game preview image
```

## 🚀 Getting Started

Simply open `index.html` in a web browser. No build process or dependencies required!

```bash
# Open directly in browser
open index.html

# Or serve with a local server
python -m http.server 8000
# Then visit http://localhost:8000
```

## 🎨 Customization

The game uses CSS custom properties for easy customization. Modify these variables in `styles.css`:

```css
:root {
    --square_size: 15px;
    --main_grid_width: 10;
    --preview_grid_width: 4;
    --square_color: #9ea488;
    --screen_color: #a5ac8d;
    --tetris_color: #222;
    /* ... and more */
}
```

## 🔧 Technical Details

- **Grid Size**: 10×20 game board
- **Speed Levels**: 3 adjustable speed levels
- **Scoring**: 10 points per line cleared
- **Level Progression**: Every 50 points unlocks a new level
- **Animations**: Spiral and blink animations on game over

## 📝 License

This project is open source and available for educational purposes.

---

Enjoy playing Tetris! 🎮
