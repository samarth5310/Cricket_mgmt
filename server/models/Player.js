import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  role: {
    type: String,
    enum: ['batsman', 'bowler', 'all-rounder', 'wicket-keeper'],
    required: true
  },
  battingStats: {
    matches: { type: Number, default: 0 },
    innings: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    ballsFaced: { type: Number, default: 0 },
    fours: { type: Number, default: 0 },
    sixes: { type: Number, default: 0 },
    highestScore: { type: Number, default: 0 },
    timesOut: { type: Number, default: 0 },
    strikeRate: { type: Number, default: 0 },
    average: { type: Number, default: 0 }
  },
  bowlingStats: {
    matches: { type: Number, default: 0 },
    overs: { type: Number, default: 0 },
    runsConceded: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    economy: { type: Number, default: 0 },
    bestFigures: { type: String, default: '0/0' }
  },
  manOfTheMatchAwards: {
    type: Number,
    default: 0
  },
  allRounderScore: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate batting stats
playerSchema.methods.calculateBattingStats = function() {
  if (this.battingStats.ballsFaced > 0) {
    this.battingStats.strikeRate = ((this.battingStats.runs / this.battingStats.ballsFaced) * 100).toFixed(2);
  }
  if (this.battingStats.timesOut > 0) {
    this.battingStats.average = (this.battingStats.runs / this.battingStats.timesOut).toFixed(2);
  }
};

// Calculate bowling stats
playerSchema.methods.calculateBowlingStats = function() {
  if (this.bowlingStats.overs > 0) {
    this.bowlingStats.economy = (this.bowlingStats.runsConceded / this.bowlingStats.overs).toFixed(2);
  }
};

// Calculate all-rounder score
playerSchema.methods.calculateAllRounderScore = function() {
  this.allRounderScore = (this.battingStats.runs * 0.5) + (this.bowlingStats.wickets * 20);
  return this.allRounderScore;
};

export default mongoose.model('Player', playerSchema);
