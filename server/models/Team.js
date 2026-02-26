import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  shortName: {
    type: String,
    required: true,
    uppercase: true,
    maxlength: 4
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  matchesPlayed: {
    type: Number,
    default: 0
  },
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  ties: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  nrr: {
    type: Number,
    default: 0
  },
  totalRunsScored: {
    type: Number,
    default: 0
  },
  totalOversPlayed: {
    type: Number,
    default: 0
  },
  totalRunsConceded: {
    type: Number,
    default: 0
  },
  totalOversBowled: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate NRR
teamSchema.methods.calculateNRR = function() {
  const runsScoredRate = this.totalOversPlayed > 0 ? this.totalRunsScored / this.totalOversPlayed : 0;
  const runsConcededRate = this.totalOversBowled > 0 ? this.totalRunsConceded / this.totalOversBowled : 0;
  this.nrr = (runsScoredRate - runsConcededRate).toFixed(3);
  return this.nrr;
};

export default mongoose.model('Team', teamSchema);
