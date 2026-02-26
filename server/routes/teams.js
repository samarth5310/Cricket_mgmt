import express from 'express';
import Team from '../models/Team.js';
import Player from '../models/Player.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/teams
// @desc    Get all teams
// @access  Public
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('captain', 'name')
      .populate('players', 'name role')
      .sort({ points: -1, nrr: -1 });

    res.json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/teams/:id
// @desc    Get single team
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('captain', 'name role')
      .populate('players', 'name role battingStats bowlingStats');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/teams
// @desc    Create team
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, shortName } = req.body;

    const team = await Team.create({
      name,
      shortName
    });

    res.status(201).json({
      success: true,
      data: team
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/teams/:id
// @desc    Update team
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/teams/:id
// @desc    Delete team
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Delete all players in the team
    await Player.deleteMany({ team: team._id });

    await team.deleteOne();

    res.json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/teams/points-table
// @desc    Get points table
// @access  Public
router.get('/table/points', async (req, res) => {
  try {
    const teams = await Team.find()
      .select('name shortName matchesPlayed wins losses ties points nrr')
      .sort({ points: -1, nrr: -1 });

    res.json({
      success: true,
      data: teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
