/**
 * VIC Tour Integration Example
 * How to integrate tournament data into VIC signal engine
 */

const fetch = require('node-fetch');

const VIC_TOUR_API = process.env.VIC_TOUR_API || 'http://localhost:3748';

/**
 * Check if a sport is currently in season
 * @param {string} sport - Sport ID (nfl, nba, mlb, etc.)
 * @returns {Promise<boolean>}
 */
async function isSportInSeason(sport) {
  try {
    const response = await fetch(`${VIC_TOUR_API}/api/tournaments/${sport}/season/current`);
    const data = await response.json();
    
    if (!data.success || !data.data) {
      return false;
    }
    
    return data.data.status === 'in_progress';
  } catch (error) {
    console.error(`Error checking season status for ${sport}:`, error);
    return false;
  }
}

/**
 * Get all currently active tournaments
 * @returns {Promise<Array>}
 */
async function getActiveTournaments() {
  try {
    const response = await fetch(`${VIC_TOUR_API}/api/tournaments/active`);
    const data = await response.json();
    
    if (!data.success) {
      return [];
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching active tournaments:', error);
    return [];
  }
}

/**
 * Get current season for a sport with metadata
 * @param {string} sport - Sport ID
 * @returns {Promise<Object>}
 */
async function getCurrentSeason(sport) {
  try {
    const response = await fetch(`${VIC_TOUR_API}/api/tournaments/${sport}/season/current`);
    const data = await response.json();
    
    if (!data.success || !data.data) {
      return null;
    }
    
    // Parse metadata if present
    if (data.data.metadata) {
      try {
        data.data.metadata = JSON.parse(data.data.metadata);
      } catch (e) {
        // Keep as string if parsing fails
      }
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error fetching season for ${sport}:`, error);
    return null;
  }
}

/**
 * Get all supported sports
 * @returns {Promise<Array>}
 */
async function getSupportedSports() {
  try {
    const response = await fetch(`${VIC_TOUR_API}/api/sports`);
    const data = await response.json();
    
    if (!data.success) {
      return [];
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching sports:', error);
    return [];
  }
}

/**
 * Filter signals by active tournaments only
 * @param {Array} signals - Array of VIC signals
 * @returns {Promise<Array>}
 */
async function filterSignalsByActiveSeasons(signals) {
  const activeSports = await getActiveTournaments();
  const activeSportIds = activeSports.map(t => t.sport);
  
  return signals.filter(signal => {
    return activeSportIds.includes(signal.sport);
  });
}

/**
 * Enrich a signal with tournament context
 * @param {Object} signal - VIC signal object
 * @returns {Promise<Object>}
 */
async function enrichSignalWithTournamentData(signal) {
  const season = await getCurrentSeason(signal.sport);
  
  if (!season) {
    return {
      ...signal,
      tournament_context: null
    };
  }
  
  // Calculate season progress
  const startDate = new Date(season.start_date);
  const endDate = new Date(season.end_date);
  const today = new Date();
  
  const totalDuration = endDate - startDate;
  const elapsed = today - startDate;
  const progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  
  // Determine tournament stage
  let stage = 'Regular Season';
  if (progressPercent > 85) {
    stage = 'Playoffs';
  }
  if (progressPercent > 95) {
    stage = 'Championship';
  }
  
  return {
    ...signal,
    tournament_context: {
      season_name: season.season_name,
      stage: stage,
      progress_percent: Math.round(progressPercent),
      start_date: season.start_date,
      end_date: season.end_date,
      status: season.status,
      metadata: season.metadata
    }
  };
}

/**
 * Example: Generate daily signal briefing with tournament context
 */
async function generateDailyBriefing() {
  console.log('🏆 VIC Tour Daily Briefing\n');
  
  // Get all active tournaments
  const activeTournaments = await getActiveTournaments();
  
  console.log(`📊 Active Tournaments: ${activeTournaments.length}\n`);
  
  activeTournaments.forEach(tournament => {
    console.log(`✓ ${tournament.tournament_name.toUpperCase()}`);
    console.log(`  Season: ${tournament.season_name}`);
    console.log(`  Status: ${tournament.status}`);
    console.log(`  Period: ${tournament.start_date} to ${tournament.end_date}\n`);
  });
  
  // Get upcoming tournaments (next 30 days)
  const upcomingResponse = await fetch(`${VIC_TOUR_API}/api/tournaments/upcoming?days=30`);
  const upcomingData = await upcomingResponse.json();
  
  if (upcomingData.success && upcomingData.data.length > 0) {
    console.log(`📅 Upcoming Tournaments (Next 30 Days): ${upcomingData.data.length}\n`);
    
    upcomingData.data.forEach(tournament => {
      console.log(`⏰ ${tournament.tournament_name}`);
      console.log(`  Starts: ${tournament.start_date}\n`);
    });
  }
}

// Export for use in VIC signal engine
module.exports = {
  isSportInSeason,
  getActiveTournaments,
  getCurrentSeason,
  getSupportedSports,
  filterSignalsByActiveSeasons,
  enrichSignalWithTournamentData,
  generateDailyBriefing,
  VIC_TOUR_API
};

// Run briefing if executed directly
if (require.main === module) {
  generateDailyBriefing().catch(console.error);
}
