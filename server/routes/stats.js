import express from 'express';
import Player from '../models/Player.js';
import Team from '../models/Team.js';
import Match from '../models/Match.js';

const router = express.Router();

// @route   GET /api/stats/leaderboard
// @desc    Get all leaderboards
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    // Top Run Scorers (Orange Cap)
    const topRunScorers = await Player.find()
      .sort({ 'battingStats.runs': -1 })
      .limit(10)
      .populate('team', 'name shortName')
      .select('name battingStats team');

    // Top Wicket Takers (Purple Cap)
    const topWicketTakers = await Player.find()
      .sort({ 'bowlingStats.wickets': -1 })
      .limit(10)
      .populate('team', 'name shortName')
      .select('name bowlingStats team');

    // Top All-Rounders
    const players = await Player.find().populate('team', 'name shortName');
    players.forEach(player => player.calculateAllRounderScore());
    const topAllRounders = players
      .sort((a, b) => b.allRounderScore - a.allRounderScore)
      .slice(0, 10)
      .map(p => ({
        _id: p._id,
        name: p.name,
        team: p.team,
        allRounderScore: p.allRounderScore,
        runs: p.battingStats.runs,
        wickets: p.bowlingStats.wickets
      }));

    // Player of the Tournament (weighted formula)
    const potPlayers = players.map(player => {
      const score = 
        (player.battingStats.runs * 1) +
        (player.bowlingStats.wickets * 25) +
        (player.manOfTheMatchAwards * 50) +
        (player.battingStats.strikeRate * 0.1) -
        (player.bowlingStats.economy * 5);
      
      return {
        _id: player._id,
        name: player.name,
        team: player.team,
        tournamentScore: score.toFixed(2),
        runs: player.battingStats.runs,
        wickets: player.bowlingStats.wickets,
        motmAwards: player.manOfTheMatchAwards
      };
    }).sort((a, b) => b.tournamentScore - a.tournamentScore);

    const playerOfTournament = potPlayers[0];

    res.json({
      success: true,
      data: {
        topRunScorers,
        topWicketTakers,
        topAllRounders,
        playerOfTournament
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/stats/player/:id
// @desc    Get player statistics
// @access  Public
router.get('/player/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate('team', 'name shortName');

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    // Get matches played
    const matches = await Match.find({
      status: 'completed',
      'innings.balls.batsman': player._id
    }).populate('team1 team2', 'name');

    res.json({
      success: true,
      data: {
        player,
        matchesPlayed: matches
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/stats/team/:id
// @desc    Get team statistics
// @access  Public
router.get('/team/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('captain', 'name')
      .populate('players', 'name role battingStats bowlingStats');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const matches = await Match.find({
      $or: [{ team1: team._id }, { team2: team._id }],
      status: 'completed'
    }).populate('team1 team2 result.winner', 'name');

    res.json({
      success: true,
      data: {
        team,
        matches
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/stats/overview
// @desc    Get tournament overview
// @access  Public
router.get('/overview', async (req, res) => {
  try {
    const totalTeams = await Team.countDocuments();
    const totalPlayers = await Player.countDocuments();
    const totalMatches = await Match.countDocuments();
    const completedMatches = await Match.countDocuments({ status: 'completed' });
    const liveMatches = await Match.countDocuments({ status: 'live' });

    // Calculate total runs and wickets
    const matches = await Match.find({ status: 'completed' });
    let totalRuns = 0;
    let totalWickets = 0;
    let totalSixes = 0;
    let totalFours = 0;

    matches.forEach(match => {
      match.innings.forEach(innings => {
        totalRuns += innings.runs;
        totalWickets += innings.wickets;
        innings.balls.forEach(ball => {
          if (ball.runs === 6) totalSixes++;
          if (ball.runs === 4) totalFours++;
        });
      });
    });

    res.json({
      success: true,
      data: {
        totalTeams,
        totalPlayers,
        totalMatches,
        completedMatches,
        liveMatches,
        totalRuns,
        totalWickets,
        totalSixes,
        totalFours
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
