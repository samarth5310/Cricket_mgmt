# 🏏 SPORTS'26 - Quick Start

## 1. Install Dependencies

```powershell
npm install
cd client
npm install
cd ..
```

## 2. Create Admin Account

```powershell
npm run seed
```

**Admin Login:**
- Email: `admin@sports26.com`
- Password: `Admin@2026`

## 3. Start Application

```powershell
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 4. Usage Flow

### Admin Workflow:
1. Login → Go to Admin Panel
2. Create Teams (e.g., CSE, ECE, MECH, CIVIL)
3. Add Players to each team
4. Schedule Matches
5. Start Match → Enter Toss Details
6. Live Scoring → Ball-by-ball updates
7. Complete Match → Declare Man of the Match

### User Workflow:
1. Visit homepage
2. View live matches
3. Check points table
4. Browse leaderboards
5. View player/team stats

## Key Features

✅ Live ball-by-ball scoring
✅ Auto-calculated CRR, RRR, NRR
✅ Points table with sorting
✅ Top batsmen, bowlers, all-rounders
✅ Player of the tournament
✅ Brutalist UI design
✅ Mobile responsive
✅ Secure authentication

## Need Help?

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed documentation.
