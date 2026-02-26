# 🏏 Cricket Tournament Management System - Setup Guide

## Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Git

### Installation Steps

#### 1. Install Dependencies

**Backend:**
```powershell
npm install
```

**Frontend:**
```powershell
cd client
npm install
cd ..
```

#### 2. Setup Environment Variables

The `.env` file is already created with default values. For production, update:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A strong secret key

#### 3. Start MongoDB

Make sure MongoDB is running on your system:
```powershell
# If MongoDB is installed as a service, it should start automatically
# Otherwise, start it manually:
mongod
```

#### 4. Seed Admin User

Create the default admin account:
```powershell
node server/seedAdmin.js
```

**Default Admin Credentials:**
- Email: `admin@sports26.com`
- Password: `Admin@2026`

#### 5. Start Development Servers

**Option A - Start both servers together:**
```powershell
npm run dev
```

**Option B - Start separately:**

Terminal 1 (Backend):
```powershell
npm run server
```

Terminal 2 (Frontend):
```powershell
cd client
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## Usage Guide

### For Admin Users

1. **Login** with admin credentials at `/login`
2. **Create Teams** at `/admin/teams`
3. **Add Players** to teams at `/admin/players`
4. **Schedule Matches** at `/admin/matches`
5. **Start Live Scoring**:
   - Go to match and click "START MATCH"
   - Enter toss winner team ID and decision
   - Use the scoring interface for ball-by-ball updates
6. **Complete Match**:
   - When innings complete, click "COMPLETE MATCH"
   - Enter Man of the Match player ID

### For Regular Users

- View live matches
- Check points table
- Browse teams and players
- View leaderboards
- View match history

---

## Features Implemented

### ✅ Authentication & Authorization
- JWT-based authentication
- Role-based access (Admin/User)
- Protected routes
- Secure password hashing

### ✅ Team Management
- Create/edit/delete teams
- Assign captains
- Track team statistics

### ✅ Player Management
- Add players to teams
- Define player roles
- Track batting/bowling statistics

### ✅ Match Management
- Schedule matches
- Set match overs
- Toss management
- Match status tracking

### ✅ Live Scoring System
- Ball-by-ball scoring
- Runs tracking (0-6)
- Extras (Wide, No Ball, Bye, Leg Bye)
- Wicket types
- Real-time updates

### ✅ Automatic Calculations
- **Current Run Rate (CRR)**: Total runs / Overs played
- **Required Run Rate (RRR)**: Runs needed / Overs remaining
- **Net Run Rate (NRR)**: (Runs scored rate) - (Runs conceded rate)
- Strike Rate, Economy Rate, Averages

### ✅ Points System
- Win: 2 points
- Tie: 1 point
- Loss: 0 points
- Automatic NRR calculation

### ✅ Leaderboards
- Top Run Scorer (Orange Cap)
- Top Wicket Taker (Purple Cap)
- Top All-Rounder (Runs × 0.5 + Wickets × 20)
- Player of the Tournament (weighted formula)

### ✅ Statistics
- Comprehensive batting stats
- Bowling statistics
- Team performance metrics
- Match history

### ✅ Brutalist UI Design
- Dark theme with orange/secondary accents
- Bold typography
- Border-heavy design elements
- Responsive layout
- Mobile-friendly

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get single team
- `POST /api/teams` - Create team (Admin)
- `PUT /api/teams/:id` - Update team (Admin)
- `DELETE /api/teams/:id` - Delete team (Admin)
- `GET /api/teams/table/points` - Get points table

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get single player
- `POST /api/players` - Create player (Admin)
- `PUT /api/players/:id` - Update player (Admin)
- `DELETE /api/players/:id` - Delete player (Admin)
- `PUT /api/players/:id/captain` - Set as captain (Admin)

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/:id` - Get single match
- `POST /api/matches` - Create match (Admin)
- `PUT /api/matches/:id/toss` - Update toss (Admin)
- `POST /api/matches/:id/ball` - Add ball (Admin)
- `PUT /api/matches/:id/complete` - Complete match (Admin)
- `GET /api/matches/:id/live` - Get live match data

### Statistics
- `GET /api/stats/leaderboard` - Get all leaderboards
- `GET /api/stats/player/:id` - Get player stats
- `GET /api/stats/team/:id` - Get team stats
- `GET /api/stats/overview` - Get tournament overview

---

## Database Schema

### User
- name, email, password, role (admin/user)

### Team
- name, shortName, captain, players[]
- matchesPlayed, wins, losses, ties, points, nrr
- totalRunsScored, totalOversPlayed, totalRunsConceded, totalOversBowled

### Player
- name, team, role (batsman/bowler/all-rounder/wicket-keeper)
- battingStats (runs, balls, strikeRate, average, etc.)
- bowlingStats (wickets, overs, economy, etc.)
- manOfTheMatchAwards, allRounderScore

### Match
- matchNumber, team1, team2, venue, date, totalOvers
- tossWinner, tossDecision
- innings[] (batting/bowling teams, runs, wickets, overs, balls[])
- status (scheduled/live/completed/abandoned)
- result (winner, winMargin, isTie)
- manOfTheMatch

---

## Production Deployment

### Environment Setup

1. Set production environment variables:
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_secret_key
PORT=5000
```

2. Build frontend:
```powershell
cd client
npm run build
```

3. Serve built files from Express (add to server/index.js):
```javascript
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}
```

### Deployment Platforms

**Recommended:**
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Render, Heroku
- **Database**: MongoDB Atlas (Free tier available)

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify firewall settings

### Port Already in Use
- Change PORT in `.env`
- Kill existing process: `netstat -ano | findstr :5000`

### CORS Errors
- Check proxy settings in `vite.config.js`
- Verify backend URL in API calls

---

## Support & Documentation

For issues or questions:
1. Check the README.md
2. Review API documentation above
3. Check browser console for errors
4. Verify MongoDB connection

---

## Credits

**SPORTS'26** - Annual Inter-Branch Sports Meet
BGMIT, Mudhol - March 2026

Built with:
- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- Tailwind CSS
- JWT Authentication
