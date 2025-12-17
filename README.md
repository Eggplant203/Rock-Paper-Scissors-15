# 🎮 RPS-15 ARENA

Real-time multiplayer Rock-Paper-Scissors with **15 options**! Challenge your friends in this extended version of the classic game.

## ✨ Features

- 🎲 15 unique options (Rock, Gun, Lightning, Devil, Dragon, Water, Air, Paper, Sponge, Wolf, Tree, Human, Snake, Scissors, Fire)
- 👥 Real-time 2-player gameplay
- 🏠 Room-based matchmaking with 6-digit codes
- 📊 Win streak scoring system (1pt → 2pts @ 3 streak → 3pts @ 5 streak)
- 🎨 Smooth animations and sound effects
- 📱 Mobile-friendly responsive design
- ⚡ Built with TypeScript, React, and Socket.IO

## 🎮 Game Rules

Each of the 15 options:

- **Beats 7 other options**
- **Loses to 7 options**
- **Draws with itself**

### Scoring System

- Win: +1 point
- Win streak ≥ 3: +2 points per win
- Win streak ≥ 5: +3 points per win
- Lose: 0 points (streak resets)
- Draw: 0 points (streak unchanged)

## 🛠️ Tech Stack

**Frontend:** React 18 + TypeScript + Vite + Socket.IO + Framer Motion + SCSS  
**Backend:** Node.js + Express + Socket.IO  
**Testing:** Jest + Vitest (88 tests passing)

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - Download from https://nodejs.org/
- **npm** (comes with Node.js)

### Installation

**1. Install dependencies:**

```bash
npm run install:all
```

**2. Create environment files:**

`server/.env`:

```env
PORT=3001
CLIENT_URL=http://localhost:5173
```

`client/.env`:

```env
VITE_SERVER_URL=http://localhost:3001
```

**3. Run the game:**

```bash
npm run dev
```

Opens on http://localhost:5173 (frontend) and http://localhost:3001 (backend)

### How to Play

1. Open http://localhost:5173 in two browser tabs
2. Player 1: Create room → Copy code
3. Player 2: Join with code
4. Select weapon → Confirm → Watch countdown → See result!
5. Use **?** button for rules, **×** button to exit

## 📦 Build & Deploy

**Build for production:**

```bash
npm run build
```

**Deployment options:**

- **Vercel** (Frontend) + **Render** (Backend) - Recommended
- **Railway.app** - All-in-one
- **Netlify** + **Heroku**

Set production environment variables and update CORS settings in `server/src/index.ts`

## 🔧 Scripts

```bash
npm run install:all   # Install dependencies
npm run dev          # Run dev servers
npm run build        # Build for production
npm test             # Run tests (88 passing)
```

## 🐛 Troubleshooting

### "Cannot connect to server"

- ✅ Check if server is running on port 3001
- ✅ Verify `VITE_SERVER_URL` in `client/.env`
- ✅ Check CORS settings in `server/src/index.ts`

### "Module not found" errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules server/node_modules client/node_modules
npm run install:all
```

### "Port already in use"

- Change `PORT` in `server/.env`
- Or kill the process using that port:

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <process_id> /F

# Mac/Linux
lsof -ti:3001 | xargs kill
```

### Images not displaying

- ✅ Check filenames are **lowercase** and match exactly
- ✅ Verify path: `client/public/assets/images/options/`
- ✅ Clear browser cache (Ctrl+Shift+R)
- ✅ Check browser console for 404 errors

### Sounds not playing

- ✅ Check filenames match exactly
- ✅ Click on screen first (browser autoplay policy)
- ✅ Check browser console for audio errors
- ✅ Verify audio files are valid WAV/MP3 format

### Game state stuck/not updating

- ✅ Refresh both browser windows
- ✅ Check server logs for errors
- ✅ Verify both players are in the same room
- ✅ Check browser console for Socket.IO connection issues

---

## 📄 License

MIT - Free to use and modify

---

## Author

© 2025 - Developed by Eggplant203 🍆
