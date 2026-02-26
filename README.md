# 🏏 SPORTS'26 - Cricket Tournament Management System

<div align="center">

![SPORTS'26](client/public/trophy.svg)

### Annual Inter-Branch Sports • Mudhol • March 2026

**compete • excel • conquer**

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-success.svg)](https://www.mongodb.com/)

</div>

---

## 🎯 Overview

A **full-stack cricket tournament management system** with live ball-by-ball scoring, automatic calculations (CRR, RRR, NRR), and comprehensive statistics tracking. Built with a bold **brutalist UI design** for the ultimate sports experience.

### ✨ Key Features

- 🔴 **Live Scoring** - Ball-by-ball updates with real-time calculations
- 📊 **Auto Calculations** - CRR, RRR, NRR computed automatically
- 🏆 **Leaderboards** - Orange Cap, Purple Cap, All-Rounders, Player of Tournament
- 📈 **Points Table** - Auto-sorted by Points & NRR
- 👥 **Team Management** - Create teams, add players, set captains
- 🎮 **Admin Panel** - Complete control over tournament
- 📱 **Responsive** - Mobile-first brutalist design
- 🔐 **Secure** - JWT authentication with role-based access

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Installation (3 Simple Steps)

```powershell
# 1. Install all dependencies
npm install
cd client && npm install && cd ..

# 2. Create admin account
npm run seed

# 3. Start development servers
npm run dev
```

### Access the Application

- 🌐 **Frontend**: http://localhost:3000
- ⚙️ **Backend API**: http://localhost:5000
- 🏥 **Health Check**: http://localhost:5000/api/health

### Default Admin Login

- 📧 **Email**: `admin@sports26.com`
- 🔑 **Password**: `Admin@2026`

---

## 📖 Documentation

- 📘 [**QUICKSTART.md**](QUICKSTART.md) - Get started in 5 minutes
- 📗 [**SETUP_GUIDE.md**](SETUP_GUIDE.md) - Detailed installation & deployment
- 📕 [**TESTING_GUIDE.md**](TESTING_GUIDE.md) - API testing & validation
- 📙 [**PROJECT_SUMMARY.md**](PROJECT_SUMMARY.md) - Complete feature documentation

---

## 🎯 Usage Flow

### For Administrators

1. **Login** → Access admin panel
2. **Create Teams** → Add departments/branches
3. **Add Players** → Build team rosters
4. **Schedule Matches** → Set fixtures with overs, venue, time
5. **Start Match** → Conduct toss, declare decision
6. **Live Scoring** → Ball-by-ball updates
7. **Complete Match** → Declare Man of the Match

### For Users (Viewers)

- 📺 Watch live matches
- 📊 View points table
- 🏆 Check leaderboards
- 👥 Browse teams & players
- 📈 View match history

---

## 💻 Tech Stack

### Backend
- **Runtime**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (JSON Web Tokens)
- **Security**: bcrypt, CORS

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State**: Zustand
- **HTTP**: Axios
- **Styling**: Tailwind CSS

---

## 📊 Core Features

### Live Scoring System
- Ball-by-ball updates
- Runs: 0, 1, 2, 3, 4, 6
- Extras: Wide, No Ball, Bye, Leg Bye
- Wickets: Bowled, Caught, LBW, Run Out, Stumped, Hit Wicket
- Auto over calculation
- Last 6 balls display

### Automatic Calculations

**Current Run Rate (CRR)**
```
CRR = Total Runs ÷ Overs Played
```

**Required Run Rate (RRR)**
```
RRR = Runs Needed ÷ Overs Remaining
```

**Net Run Rate (NRR)**
```
NRR = (Runs Scored ÷ Overs Played) - (Runs Conceded ÷ Overs Bowled)
```

### Points System
- 🏆 **Win**: 2 points
- 🤝 **Tie**: 1 point each
- ❌ **Loss**: 0 points

### Leaderboards

- 🟠 **Orange Cap**: Top run scorer
- 🟣 **Purple Cap**: Top wicket taker
- ⭐ **All-Rounder**: Weighted formula (Runs × 0.5 + Wickets × 20)
- 🏆 **Player of Tournament**: Complex weighted score

---

## 🎨 Design System

### Brutalist UI
- **Dark Theme**: #0a0a0a background
- **Primary**: #FF6B35 (Orange)
- **Secondary**: #F7931E (Golden)
- **Bold Borders**: 4px solid
- **Typography**: Impact, Arial Black
- **High Contrast**: White on dark
- **Sharp Edges**: No rounded corners
- **Box Shadows**: 8px offset

---

## 📁 Project Structure

```
sorts2/
├── server/              # Backend (Node.js + Express)
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth middleware
│   └── index.js        # Server entry
├── client/             # Frontend (React + Vite)
│   └── src/
│       ├── components/ # Reusable components
│       ├── pages/      # Route pages
│       ├── store/      # State management
│       └── utils/      # API utilities
├── .env                # Environment variables
└── package.json        # Dependencies
```

---

## 🔒 Security

- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ Protected routes
- ✅ Role-based authorization
- ✅ CORS enabled
- ✅ Input validation

---

## 🧪 Testing

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for:
- API endpoint testing
- Complete match flow
- Verification checklist
- Sample test scenarios

---

## 🚀 Deployment

### Build for Production

```powershell
# Build frontend
cd client
npm run build

# Start production server
npm start
```

### Recommended Platforms

- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Render, Heroku
- **Database**: MongoDB Atlas (free tier)

---

## 📈 Statistics Tracked

### Team Stats
- Matches played, Wins, Losses, Ties
- Total runs scored/conceded
- Net run rate
- Points

### Player Stats

**Batting:**
- Runs, Balls faced, Strike rate, Average
- Fours, Sixes, Highest score

**Bowling:**
- Wickets, Overs, Economy, Best figures

**Awards:**
- Man of the Match count
- All-rounder score
- Tournament ranking

---

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Full-stack development
- ✅ RESTful API design
- ✅ Real-time data handling
- ✅ Complex calculations
- ✅ Authentication & authorization
- ✅ Responsive design
- ✅ State management
- ✅ MongoDB schema design

---

## 🤝 Contributing

This is an educational project. Feel free to:
- Fork the repository
- Add new features
- Improve existing code
- Report issues
- Submit pull requests

---

## 📝 License

MIT License - Free to use for educational and commercial purposes.

---

## 🎉 Acknowledgments

**Built for:**
- BGMIT Annual Inter-Branch Sports Meet
- Mudhol, Karnataka
- March 2026

**Motto:** compete • excel • conquer

---

## 📞 Support

Need help?
1. Check [QUICKSTART.md](QUICKSTART.md)
2. Review [SETUP_GUIDE.md](SETUP_GUIDE.md)
3. See [TESTING_GUIDE.md](TESTING_GUIDE.md)
4. Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

---

<div align="center">

**SPORTS'26** • Built with ❤️ for Cricket Lovers

⭐ Star this repo if you found it helpful!

</div>
