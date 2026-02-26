import express from 'express';
import Player from '../models/Player.js';
import Team from '../models/Team.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/players
// @desc    Get all players
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { team, role } = req.query;
    const filter = {};

    if (team) filter.team = team;
    if (role) filter.role = role;

    const players = await Player.find(filter).populate('team', 'name shortName');

    res.json({
      success: true,
      count: players.length,
      data: players
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/players/:id
// @desc    Get single player
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate('team', 'name shortName');

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    res.json({
      success: true,
      data: player
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/players
// @desc    Create player
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, team, role } = req.body;

    const player = await Player.create({
      name,
      team,
      role
    });

    // Add player to team
    await Team.findByIdAndUpdate(team, {
      $push: { players: player._id }
    });

    const populatedPlayer = await Player.findById(player._id).populate('team', 'name shortName');

    res.status(201).json({
      success: true,
      data: populatedPlayer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/players/:id
// @desc    Update player
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('team', 'name shortName');

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    res.json({
      success: true,
      data: player
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/players/:id
// @desc    Delete player
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    // Remove player from team
    await Team.findByIdAndUpdate(player.team, {
      $pull: { players: player._id }
    });

    await player.deleteOne();

    res.json({
      success: true,
      message: 'Player deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/players/:id/captain
// @desc    Set player as captain
// @access  Private/Admin
router.put('/:id/captain', protect, authorize('admin'), async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    await Team.findByIdAndUpdate(player.team, {
      captain: player._id
    });

    res.json({
      success: true,
      message: 'Captain updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
