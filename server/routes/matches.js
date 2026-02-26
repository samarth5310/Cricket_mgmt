import express from 'express';
import Match from '../models/Match.js';
import Team from '../models/Team.js';
import Player from '../models/Player.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/matches
// @desc    Get all matches
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const matches = await Match.find(filter)
      .populate('team1', 'name shortName')
      .populate('team2', 'name shortName')
      .populate('tossWinner', 'name')
      .populate('result.winner', 'name')
      .populate('manOfTheMatch', 'name')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/matches/:id
// @desc    Get single match
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('team1', 'name shortName')
      .populate('team2', 'name shortName')
      .populate('tossWinner', 'name')
      .populate('result.winner', 'name')
      .populate('manOfTheMatch', 'name')
      .populate('innings.balls.batsman', 'name')
      .populate('innings.balls.bowler', 'name');

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/matches
// @desc    Create match
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { matchNumber, team1, team2, venue, date, totalOvers } = req.body;

    const match = await Match.create({
      matchNumber,
      team1,
      team2,
      venue,
      date,
      totalOvers: totalOvers || 6
    });

    const populatedMatch = await Match.findById(match._id)
      .populate('team1', 'name shortName')
      .populate('team2', 'name shortName');

    res.status(201).json({
      success: true,
      data: populatedMatch
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/matches/:id/toss
// @desc    Update toss
// @access  Private/Admin
router.put('/:id/toss', protect, authorize('admin'), async (req, res) => {
  try {
    const { tossWinner, tossDecision } = req.body;

    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    match.tossWinner = tossWinner;
    match.tossDecision = tossDecision;
    match.status = 'live';

    // Initialize first innings
    const battingTeam = tossDecision === 'bat' ? tossWinner : 
      (match.team1.toString() === tossWinner ? match.team2 : match.team1);
    const bowlingTeam = battingTeam.toString() === match.team1.toString() ? match.team2 : match.team1;

    match.innings.push({
      battingTeam,
      bowlingTeam,
      runs: 0,
      wickets: 0,
      overs: 0,
      balls: []
    });

    match.currentInnings = 0;

    await match.save();

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/matches/:id
// @desc    Delete a live match
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    if (match.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Completed matches cannot be deleted'
      });
    }

    if (match.status !== 'live') {
      return res.status(400).json({
        success: false,
        message: 'Only live matches can be deleted'
      });
    }

    await match.deleteOne();

    res.json({
      success: true,
      message: 'Match deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/matches/:id/ball
// @desc    Add ball to match
// @access  Private/Admin
router.post('/:id/ball', protect, authorize('admin'), async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    if (match.status !== 'live') {
      return res.status(400).json({
        success: false,
        message: 'Match is not live'
      });
    }

    const { batsman, bowler, runs, isWicket, wicketType, isWide, isNoBall, isBye, isLegBye } = req.body;

    const currentInnings = match.innings[match.currentInnings];
    let extras = 0;

    // Calculate extras
    if (isWide) {
      extras = 1;
      currentInnings.extras.wides += 1;
    }
    if (isNoBall) {
      extras = 1;
      currentInnings.extras.noBalls += 1;
    }
    if (isBye) {
      currentInnings.extras.byes += runs;
    }
    if (isLegBye) {
      currentInnings.extras.legByes += runs;
    }

    // Calculate over and ball
    const totalBalls = currentInnings.balls.filter(b => !b.isWide && !b.isNoBall).length;
    const over = Math.floor(totalBalls / 6);
    const ball = totalBalls % 6;

    const ballData = {
      over,
      ball,
      batsman,
      bowler,
      runs: runs + extras,
      isWicket,
      wicketType,
      isWide,
      isNoBall,
      isBye,
      isLegBye,
      extras
    };

    currentInnings.balls.push(ballData);
    currentInnings.runs += runs + extras;

    if (isWicket) {
      currentInnings.wickets += 1;
    }

    // Update overs (only count legal deliveries)
    if (!isWide && !isNoBall) {
      const legalBalls = currentInnings.balls.filter(b => !b.isWide && !b.isNoBall).length;
      currentInnings.overs = Math.floor(legalBalls / 6) + (legalBalls % 6) / 10;
    }

    await match.save();

    // Check if innings is complete
    if (currentInnings.wickets >= 10 || currentInnings.overs >= match.totalOvers) {
      // Start second innings if first is complete
      if (match.currentInnings === 0) {
        match.innings.push({
          battingTeam: match.innings[0].bowlingTeam,
          bowlingTeam: match.innings[0].battingTeam,
          runs: 0,
          wickets: 0,
          overs: 0,
          balls: []
        });
        match.currentInnings = 1;
        await match.save();
      }
    }

    res.json({
      success: true,
      data: match,
      crr: match.calculateCRR(match.currentInnings),
      rrr: match.calculateRRR()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/matches/:id/complete
// @desc    Complete match and update stats
// @access  Private/Admin
router.put('/:id/complete', protect, authorize('admin'), async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    const { manOfTheMatch } = req.body;

    // Determine winner
    const innings1Score = match.innings[0].runs;
    const innings2Score = match.innings[1]?.runs || 0;

    let winner, winMargin, isTie = false;

    if (innings1Score > innings2Score) {
      winner = match.innings[0].battingTeam;
      winMargin = `${innings1Score - innings2Score} runs`;
    } else if (innings2Score > innings1Score) {
      winner = match.innings[1].battingTeam;
      const wicketsRemaining = 10 - match.innings[1].wickets;
      winMargin = `${wicketsRemaining} wickets`;
    } else {
      isTie = true;
      winMargin = 'Match tied';
    }

    match.result = { winner, winMargin, isTie };
    match.status = 'completed';
    match.manOfTheMatch = manOfTheMatch;

    await match.save();

    // Update team stats
    const team1 = await Team.findById(match.team1);
    const team2 = await Team.findById(match.team2);

    team1.matchesPlayed += 1;
    team2.matchesPlayed += 1;

    if (isTie) {
      team1.ties += 1;
      team2.ties += 1;
      team1.points += 1;
      team2.points += 1;
    } else if (winner.toString() === team1._id.toString()) {
      team1.wins += 1;
      team1.points += 2;
      team2.losses += 1;
    } else {
      team2.wins += 1;
      team2.points += 2;
      team1.losses += 1;
    }

    // Update NRR stats
    team1.totalRunsScored += match.innings.find(i => i.battingTeam.toString() === team1._id.toString())?.runs || 0;
    team1.totalOversPlayed += match.innings.find(i => i.battingTeam.toString() === team1._id.toString())?.overs || 0;
    team1.totalRunsConceded += match.innings.find(i => i.bowlingTeam.toString() === team1._id.toString())?.runs || 0;
    team1.totalOversBowled += match.innings.find(i => i.bowlingTeam.toString() === team1._id.toString())?.overs || 0;

    team2.totalRunsScored += match.innings.find(i => i.battingTeam.toString() === team2._id.toString())?.runs || 0;
    team2.totalOversPlayed += match.innings.find(i => i.battingTeam.toString() === team2._id.toString())?.overs || 0;
    team2.totalRunsConceded += match.innings.find(i => i.bowlingTeam.toString() === team2._id.toString())?.runs || 0;
    team2.totalOversBowled += match.innings.find(i => i.bowlingTeam.toString() === team2._id.toString())?.overs || 0;

    team1.calculateNRR();
    team2.calculateNRR();

    await team1.save();
    await team2.save();

    // Update man of the match awards
    if (manOfTheMatch) {
      await Player.findByIdAndUpdate(manOfTheMatch, {
        $inc: { manOfTheMatchAwards: 1 }
      });
    }

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/matches/:id/live
// @desc    Get live match data
// @access  Public
router.get('/:id/live', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('team1', 'name shortName')
      .populate('team2', 'name shortName')
      .populate('innings.balls.batsman', 'name')
      .populate('innings.balls.bowler', 'name');

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    const currentInnings = match.innings[match.currentInnings];
    const lastSixBalls = currentInnings?.balls.slice(-6) || [];

    const target = match.currentInnings === 1 ? match.innings[0].runs + 1 : null;
    const runsNeeded = target ? target - currentInnings.runs : null;
    const oversRemaining = match.totalOvers - currentInnings.overs;

    res.json({
      success: true,
      data: {
        match,
        currentInnings,
        crr: match.calculateCRR(match.currentInnings),
        rrr: match.calculateRRR(),
        target,
        runsNeeded,
        oversRemaining,
        lastSixBalls
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
