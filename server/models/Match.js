import mongoose from 'mongoose';

const ballSchema = new mongoose.Schema({
  over: Number,
  ball: Number,
  bowler: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  batsman: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  runs: { type: Number, default: 0 },
  isWicket: { type: Boolean, default: false },
  wicketType: String,
  isWide: { type: Boolean, default: false },
  isNoBall: { type: Boolean, default: false },
  isBye: { type: Boolean, default: false },
  isLegBye: { type: Boolean, default: false },
  extras: { type: Number, default: 0 }
}, { _id: false });

const inningsSchema = new mongoose.Schema({
  battingTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  bowlingTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  overs: { type: Number, default: 0 },
  balls: [ballSchema],
  extras: {
    wides: { type: Number, default: 0 },
    noBalls: { type: Number, default: 0 },
    byes: { type: Number, default: 0 },
    legByes: { type: Number, default: 0 }
  }
}, { _id: false });

const matchSchema = new mongoose.Schema({
  matchNumber: {
    type: Number,
    required: true
  },
  team1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  team2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  totalOvers: {
    type: Number,
    required: true,
    default: 6
  },
  tossWinner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  tossDecision: {
    type: String,
    enum: ['bat', 'bowl']
  },
  innings: [inningsSchema],
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'abandoned'],
    default: 'scheduled'
  },
  result: {
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    winMargin: String,
    isTie: { type: Boolean, default: false }
  },
  manOfTheMatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  currentInnings: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate Current Run Rate
matchSchema.methods.calculateCRR = function(inningsIndex) {
  const innings = this.innings[inningsIndex];
  if (!innings || innings.overs === 0) return 0;
  return (innings.runs / innings.overs).toFixed(2);
};

// Calculate Required Run Rate
matchSchema.methods.calculateRRR = function() {
  if (this.innings.length < 2) return 0;
  const target = this.innings[0].runs + 1;
  const secondInnings = this.innings[1];
  const runsNeeded = target - secondInnings.runs;
  const oversRemaining = this.totalOvers - secondInnings.overs;
  if (oversRemaining <= 0) return 0;
  return (runsNeeded / oversRemaining).toFixed(2);
};

export default mongoose.model('Match', matchSchema);
