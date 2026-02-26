# Cricket Tournament System - API Testing Guide

## Test the System

### 1. Start Servers

```powershell
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
cd client
npm run dev
```

### 2. Create Admin User

```powershell
npm run seed
```

### 3. Test Flow

#### A. Authentication Tests

**Register User:**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "user@test.com",
  "password": "Test@123"
}
```

**Login:**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@sports26.com",
  "password": "Admin@2026"
}
```

Save the JWT token from response.

#### B. Team Management (Admin Only)

**Create Team:**
```bash
POST http://localhost:5000/api/teams
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Computer Science",
  "shortName": "CSE"
}
```

**Get All Teams:**
```bash
GET http://localhost:5000/api/teams
```

#### C. Player Management

**Add Player:**
```bash
POST http://localhost:5000/api/players
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Virat Kohli",
  "team": "TEAM_ID_HERE",
  "role": "batsman"
}
```

#### D. Match Management

**Create Match:**
```bash
POST http://localhost:5000/api/matches
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "matchNumber": 1,
  "team1": "TEAM1_ID",
  "team2": "TEAM2_ID",
  "venue": "BGMIT Ground",
  "date": "2026-03-15T10:00:00",
  "totalOvers": 6
}
```

**Start Match (Update Toss):**
```bash
PUT http://localhost:5000/api/matches/MATCH_ID/toss
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "tossWinner": "TEAM_ID",
  "tossDecision": "bat"
}
```

**Add Ball:**
```bash
POST http://localhost:5000/api/matches/MATCH_ID/ball
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "batsman": "PLAYER_ID",
  "bowler": "PLAYER_ID",
  "runs": 4,
  "isWicket": false,
  "isWide": false,
  "isNoBall": false,
  "isBye": false,
  "isLegBye": false
}
```

**Complete Match:**
```bash
PUT http://localhost:5000/api/matches/MATCH_ID/complete
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "manOfTheMatch": "PLAYER_ID"
}
```

#### E. Statistics

**Get Leaderboard:**
```bash
GET http://localhost:5000/api/stats/leaderboard
```

**Get Points Table:**
```bash
GET http://localhost:5000/api/teams/table/points
```

**Get Overview:**
```bash
GET http://localhost:5000/api/stats/overview
```

## Frontend Testing

### 1. Public Pages (No Auth Required)
- Home: http://localhost:3000
- Matches: http://localhost:3000/matches
- Points Table: http://localhost:3000/points-table
- Teams: http://localhost:3000/teams
- Players: http://localhost:3000/players
- Leaderboard: http://localhost:3000/leaderboard

### 2. Auth Required
- Dashboard: http://localhost:3000/dashboard
- Login: http://localhost:3000/login

### 3. Admin Only
- Admin Dashboard: http://localhost:3000/admin
- Manage Teams: http://localhost:3000/admin/teams
- Manage Players: http://localhost:3000/admin/players
- Manage Matches: http://localhost:3000/admin/matches
- Live Scoring: http://localhost:3000/admin/scoring/MATCH_ID

## Sample Test Scenario

### Complete Match Flow

1. **Login as Admin**
2. **Create 2 Teams:**
   - Team A (CSE)
   - Team B (ECE)
3. **Add 5 Players per Team**
4. **Set Captains**
5. **Schedule Match:**
   - 6 overs per side
6. **Start Match:**
   - Toss: CSE won, choose to bat
7. **Score Innings 1:**
   - Ball 1: CSE Batsman 1 scores 4 runs off ECE Bowler 1
   - Ball 2: 1 run
   - Ball 3: 6 runs
   - Continue for 6 overs...
8. **Score Innings 2:**
   - ECE batting, CSE bowling
   - Complete 6 overs
9. **Complete Match:**
   - Declare winner
   - Set Man of the Match
10. **Verify:**
    - Points table updated
    - NRR calculated
    - Leaderboard shows top performers

## Expected Results

### After Match Completion:
- ✅ Winner team gets 2 points
- ✅ Loser team gets 0 points
- ✅ NRR calculated for both teams
- ✅ Player stats updated (runs, balls, wickets)
- ✅ Leaderboards updated
- ✅ Match history saved

## Testing Checklist

- [ ] User registration works
- [ ] Admin can create teams
- [ ] Admin can add players
- [ ] Admin can schedule matches
- [ ] Toss can be updated
- [ ] Ball-by-ball scoring works
- [ ] CRR calculates correctly
- [ ] RRR calculates correctly (2nd innings)
- [ ] Wickets reduce correctly
- [ ] Overs increment properly
- [ ] Wide/No ball treated as extras
- [ ] Match completion updates stats
- [ ] Points table sorts correctly
- [ ] NRR calculates properly
- [ ] Leaderboards show correct data
- [ ] Man of the Match updates player awards
- [ ] Player of Tournament formula works
- [ ] Live match updates in real-time
- [ ] Mobile responsive works
- [ ] All admin routes protected
- [ ] Regular users can't access admin panels

## Common Issues & Solutions

**MongoDB Connection Failed:**
- Ensure MongoDB is running
- Check connection string in .env

**JWT Token Invalid:**
- Re-login to get fresh token
- Check token expiry (7 days default)

**CORS Error:**
- Verify proxy in vite.config.js
- Check backend CORS settings

**NRR Not Calculating:**
- Ensure match is completed
- Check totalOversPlayed > 0

**Leaderboard Empty:**
- Complete at least one match
- Ensure players have stats

## Performance Testing

Test with:
- 8 teams
- 11 players per team
- 28 matches (round-robin)
- 50+ balls per match

Monitor:
- Response times
- Database queries
- Memory usage
- Frontend rendering
