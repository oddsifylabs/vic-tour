/**
 * VIC Tour API Routes
 * Tournament data endpoints
 */

const express = require('express');
const router = express.Router();
const TournamentService = require('../services/tournament-service');

// Initialize service (singleton pattern)
let tournamentService = null;

const getService = () => {
  if (!tournamentService) {
    tournamentService = new TournamentService();
  }
  return tournamentService;
};

/**
 * GET /api/tournaments
 * Get all tournaments
 * Query params: sport, active_only, include_seasons
 */
router.get('/tournaments', (req, res) => {
  try {
    const { sport, active_only, include_seasons } = req.query;
    const service = getService();

    const options = {
      sport: sport || undefined,
      active_only: active_only === 'true',
      include_seasons: include_seasons === 'true'
    };

    const tournaments = service.getAllTournaments(options);
    res.json({
      success: true,
      count: tournaments.length,
      data: tournaments
    });
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tournaments'
    });
  }
});

/**
 * GET /api/tournaments/current
 * Get all current active seasons
 */
router.get('/tournaments/current', (req, res) => {
  try {
    const service = getService();
    const seasons = service.getAllCurrentSeasons();

    res.json({
      success: true,
      count: seasons.length,
      data: seasons
    });
  } catch (error) {
    console.error('Error fetching current seasons:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch current seasons'
    });
  }
});

/**
 * GET /api/tournaments/:sport
 * Get tournament for specific sport
 */
router.get('/tournaments/:sport', (req, res) => {
  try {
    const { sport } = req.params;
    const service = getService();

    const tournament = service.getTournamentsBySport(sport);

    if (!tournament || tournament.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Tournament not found for sport: ${sport}`
      });
    }

    res.json({
      success: true,
      data: tournament[0]
    });
  } catch (error) {
    console.error('Error fetching tournament:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tournament'
    });
  }
});

/**
 * GET /api/tournaments/:sport/season/current
 * Get current season for a sport
 */
router.get('/tournaments/:sport/season/current', (req, res) => {
  try {
    const { sport } = req.params;
    const service = getService();

    const season = service.getCurrentSeason(sport);

    if (!season) {
      return res.status(404).json({
        success: false,
        error: `Current season not found for sport: ${sport}`
      });
    }

    res.json({
      success: true,
      data: season
    });
  } catch (error) {
    console.error('Error fetching current season:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch current season'
    });
  }
});

/**
 * GET /api/tournaments/upcoming
 * Get upcoming tournaments (next 30 days by default)
 * Query param: days (default: 30)
 */
router.get('/tournaments/upcoming', (req, res) => {
  try {
    const { days } = req.query;
    const service = getService();

    const tournaments = service.getUpcomingTournaments(parseInt(days) || 30);

    res.json({
      success: true,
      count: tournaments.length,
      data: tournaments
    });
  } catch (error) {
    console.error('Error fetching upcoming tournaments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch upcoming tournaments'
    });
  }
});

/**
 * GET /api/tournaments/active
 * Get currently active tournaments (in progress)
 */
router.get('/tournaments/active', (req, res) => {
  try {
    const service = getService();
    const tournaments = service.getActiveTournaments();

    res.json({
      success: true,
      count: tournaments.length,
      data: tournaments
    });
  } catch (error) {
    console.error('Error fetching active tournaments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch active tournaments'
    });
  }
});

/**
 * GET /api/tournaments/:id
 * Get tournament by ID with seasons
 */
router.get('/tournaments/:id', (req, res) => {
  try {
    const { id } = req.params;
    const service = getService();

    const tournament = service.getTournamentById(parseInt(id));

    if (!tournament) {
      return res.status(404).json({
        success: false,
        error: 'Tournament not found'
      });
    }

    res.json({
      success: true,
      data: tournament
    });
  } catch (error) {
    console.error('Error fetching tournament:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tournament'
    });
  }
});

/**
 * GET /api/seasons/:id
 * Get season by ID
 */
router.get('/seasons/:id', (req, res) => {
  try {
    const { id } = req.params;
    const service = getService();

    const season = service.getSeasonById(parseInt(id));

    if (!season) {
      return res.status(404).json({
        success: false,
        error: 'Season not found'
      });
    }

    res.json({
      success: true,
      data: season
    });
  } catch (error) {
    console.error('Error fetching season:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch season'
    });
  }
});

/**
 * POST /api/seasons
 * Add a new season
 * Body: tournament_id, season_name, year, start_date, end_date, is_current, status, metadata
 */
router.post('/seasons', (req, res) => {
  try {
    const { tournament_id, season_name, year, start_date, end_date, is_current, status, metadata } = req.body;

    if (!tournament_id || !season_name || !year || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: tournament_id, season_name, year, start_date, end_date'
      });
    }

    const service = getService();
    const season = service.addSeason(tournament_id, {
      season_name,
      year,
      start_date,
      end_date,
      is_current,
      status,
      metadata
    });

    res.status(201).json({
      success: true,
      data: season
    });
  } catch (error) {
    console.error('Error creating season:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create season'
    });
  }
});

/**
 * PUT /api/seasons/:id/status
 * Update season status
 * Body: status
 */
router.put('/seasons/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const service = getService();
    const season = service.updateSeasonStatus(parseInt(id), status);

    if (!season) {
      return res.status(404).json({
        success: false,
        error: 'Season not found'
      });
    }

    res.json({
      success: true,
      data: season
    });
  } catch (error) {
    console.error('Error updating season status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update season status'
    });
  }
});

/**
 * GET /api/sports
 * Get list of supported sports
 */
router.get('/sports', (req, res) => {
  try {
    const service = getService();
    const tournaments = service.getAllTournaments();

    const sports = tournaments.map(t => ({
      id: t.sport,
      name: t.name,
      region: t.region,
      type: t.type,
      frequency: t.frequency,
      is_active: !!t.is_active,
      is_current: !!t.is_current
    }));

    res.json({
      success: true,
      count: sports.length,
      data: sports
    });
  } catch (error) {
    console.error('Error fetching sports:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sports'
    });
  }
});

module.exports = router;
