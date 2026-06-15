/**
 * Championship Routes
 * Final tournament and playoff bracket endpoints
 */

const express = require('express');
const router = express.Router();
const ChampionshipService = require('../services/championship-service');

let championshipService = null;

const getService = () => {
  if (!championshipService) {
    championshipService = new ChampionshipService();
  }
  return championshipService;
};

/**
 * GET /api/championships
 * Get all championships
 */
router.get('/championships', (req, res) => {
  try {
    const { sport, year, status } = req.query;
    const service = getService();

    const options = { sport, year: year ? parseInt(year) : null, status };
    const championships = service.getAllChampionships(options);

    res.json({
      success: true,
      count: championships.length,
      data: championships
    });
  } catch (error) {
    console.error('Error fetching championships:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/championships/current
 * Get current/upcoming championships
 */
router.get('/championships/current', (req, res) => {
  try {
    const service = getService();
    const championships = service.getCurrentChampionships();

    res.json({
      success: true,
      count: championships.length,
      data: championships
    });
  } catch (error) {
    console.error('Error fetching current championships:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/championships/:sport
 * Get championship for specific sport
 */
router.get('/championships/:sport', (req, res) => {
  try {
    const { sport } = req.params;
    const { year } = req.query;
    const service = getService();

    const championship = service.getChampionshipBySport(sport, year ? parseInt(year) : null);

    if (!championship) {
      return res.status(404).json({
        success: false,
        error: `Championship not found for sport: ${sport}`
      });
    }

    res.json({
      success: true,
      data: championship
    });
  } catch (error) {
    console.error('Error fetching championship:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/championships/:id/brackets
 * Get championship bracket
 */
router.get('/championships/:id/brackets', (req, res) => {
  try {
    const { id } = req.params;
    const service = getService();

    const brackets = service.getChampionshipBrackets(parseInt(id));

    res.json({
      success: true,
      count: brackets.length,
      data: brackets
    });
  } catch (error) {
    console.error('Error fetching brackets:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/championships/:id/brackets
 * Add bracket match
 */
router.post('/championships/:id/brackets', (req, res) => {
  try {
    const { id } = req.params;
    const matchData = req.body;

    if (!matchData.round || !matchData.home_team || !matchData.away_team) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: round, home_team, away_team'
      });
    }

    const service = getService();
    const match = service.addBracketMatch(parseInt(id), matchData);

    res.status(201).json({
      success: true,
      data: match
    });
  } catch (error) {
    console.error('Error creating bracket match:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/brackets/:id/result
 * Update bracket match result
 */
router.put('/brackets/:id/result', (req, res) => {
  try {
    const { id } = req.params;
    const { winner, home_score, away_score } = req.body;

    if (!winner) {
      return res.status(400).json({
        success: false,
        error: 'Winner is required'
      });
    }

    const service = getService();
    const match = service.updateBracketMatch(parseInt(id), winner, home_score, away_score);

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    console.error('Error updating bracket result:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
