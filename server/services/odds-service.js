/**
 * Odds Service - Fetch live odds from The Odds API
 */

const fetch = require('node-fetch');

const ODDS_API_KEY = process.env.ODDS_API_KEY || '6f46bbb3b2fb69b5e14980a57e9909da';
const ODDS_API_BASE = 'https://the-odds-api.com/api/v4';

class OddsService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 60000; // 1 minute cache
  }

  /**
   * Get odds for a specific sport
   * @param {string} sport - Sport key (e.g., 'americanfootball_nfl', 'basketball_nba')
   * @param {string} region - Region (us, uk, eu, au)
   * @param {string} markets - Markets (h2h,spreads,totals)
   * @returns {Promise<Object>}
   */
  async getOdds(sport, region = 'us', markets = 'h2h,spreads,totals') {
    const cacheKey = `${sport}-${region}-${markets}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const url = `${ODDS_API_BASE}/sports/${sport}/odds?apiKey=${ODDS_API_KEY}&regions=${region}&markets=${markets}`;
      const response = await fetch(url, { timeout: 10000 });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.message);
      }

      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error(`Error fetching odds for ${sport}:`, error.message);
      throw error;
    }
  }

  /**
   * Get list of available sports
   * @returns {Promise<Array>}
   */
  async getSports() {
    const cacheKey = 'sports-list';
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry * 10) {
      return cached.data;
    }

    try {
      const url = `${ODDS_API_BASE}/sports?apiKey=${ODDS_API_KEY}`;
      const response = await fetch(url, { timeout: 10000 });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.message);
      }

      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Error fetching sports list:', error.message);
      throw error;
    }
  }

  /**
   * Get odds for multiple sports (for dashboard)
   * @param {Array<string>} sports - Array of sport keys
   * @returns {Promise<Object>}
   */
  async getMultiSportOdds(sports) {
    const results = {};

    for (const sport of sports) {
      try {
        results[sport] = await this.getOdds(sport);
      } catch (error) {
        results[sport] = { error: error.message, events: [] };
      }
    }

    return results;
  }

  /**
   * Map VIC Tour sport IDs to Odds API sport keys
   * @param {string} vicSport - VIC Tour sport ID
   * @returns {string}
   */
  static mapSportId(vicSport) {
    const mapping = {
      'nfl': 'americanfootball_nfl',
      'nba': 'basketball_nba',
      'mlb': 'baseball_mlb',
      'nhl': 'icehockey_nhl',
      'mls': 'soccer_usa_mls',
      'epl': 'soccer_epl',
      'ncaaf': 'americanfootball_ncaaf',
      'ncaab': 'basketball_ncaab',
      'world_cup': 'soccer_world_cup'
    };
    return mapping[vicSport] || vicSport;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    console.log('Odds cache cleared');
  }
}

module.exports = OddsService;
