/**
 * Odds API Routes
 * Proxy endpoints for The Odds API
 */

const express = require('express');
const router = express.Router();
const OddsService = require('../services/odds-service');

const oddsService = new OddsService();

/**
 * GET /api/odds/sports
 * Get list of available sports from The Odds API
 */
router.get('/odds/sports', async (req, res) => {
  try {
    const sports = await oddsService.getSports();
    res.json({
      success: true,
      count: sports.length,
      data: sports
    });
  } catch (error) {
    console.error('Error fetching sports:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/odds/:sport
 * Get odds for a specific sport
 * Query params: region, markets
 */
router.get('/odds/:sport', async (req, res) => {
  try {
    const { sport } = req.params;
    const { region = 'us', markets = 'h2h,spreads,totals' } = req.query;

    const odds = await oddsService.getOdds(sport, region, markets);
    
    res.json({
      success: true,
      sport: sport,
      count: odds.length || 0,
      data: odds
    });
  } catch (error) {
    console.error('Error fetching odds:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/odds/vic/:vicSport
 * Get odds using VIC Tour sport ID (auto-mapped)
 */
router.get('/odds/vic/:vicSport', async (req, res) => {
  try {
    const { vicSport } = req.params;
    const { region = 'us', markets = 'h2h,spreads,totals' } = req.query;

    const apiSport = OddsService.mapSportId(vicSport);
    const odds = await oddsService.getOdds(apiSport, region, markets);
    
    res.json({
      success: true,
      vic_sport: vicSport,
      api_sport: apiSport,
      count: odds.length || 0,
      data: odds
    });
  } catch (error) {
    console.error('Error fetching odds:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/odds/multi
 * Get odds for multiple sports at once
 * Query params: sports (comma-separated), region, markets
 */
router.get('/odds/multi', async (req, res) => {
  try {
    const { sports = 'americanfootball_nfl,basketball_nba,baseball_mlb', region = 'us', markets = 'h2h' } = req.query;
    const sportList = sports.split(',');

    const results = await oddsService.getMultiSportOdds(sportList);
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching multi-sport odds:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/odds/cache/clear
 * Clear the odds cache
 */
router.post('/odds/cache/clear', async (req, res) => {
  oddsService.clearCache();
  res.json({
    success: true,
    message: 'Cache cleared'
  });
});

module.exports = router;
