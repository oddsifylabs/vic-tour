/**
 * VIC Tour - Tournament Data Service
 * Manages tournament/season data for all supported sports
 */

const Database = require('better-sqlite3');
const path = require('path');

class TournamentService {
  constructor(dbPath = './data/tournaments.db') {
    this.dbPath = path.resolve(__dirname, '../../', dbPath);
    this.db = new Database(this.dbPath);
    this.initSchema();
    this.seedTournaments();
  }

  initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tournaments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sport TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT DEFAULT 'season',
        region TEXT,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        is_active INTEGER DEFAULT 0,
        is_current INTEGER DEFAULT 0,
        frequency TEXT DEFAULT 'annual',
        metadata TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS tournament_seasons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tournament_id INTEGER NOT NULL,
        season_name TEXT NOT NULL,
        year INTEGER NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        is_current INTEGER DEFAULT 0,
        status TEXT DEFAULT 'scheduled',
        champion TEXT,
        metadata TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
      );

      CREATE TABLE IF NOT EXISTS tournament_games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        season_id INTEGER NOT NULL,
        game_id TEXT,
        home_team TEXT,
        away_team TEXT,
        game_date TEXT NOT NULL,
        venue TEXT,
        status TEXT DEFAULT 'scheduled',
        home_score INTEGER,
        away_score INTEGER,
        round TEXT,
        metadata TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (season_id) REFERENCES tournament_seasons(id)
      );

      CREATE INDEX IF NOT EXISTS idx_tournaments_sport ON tournaments(sport);
      CREATE INDEX IF NOT EXISTS idx_tournaments_active ON tournaments(is_active);
      CREATE INDEX IF NOT EXISTS idx_seasons_tournament ON tournament_seasons(tournament_id);
      CREATE INDEX IF NOT EXISTS idx_seasons_current ON tournament_seasons(is_current);
      CREATE INDEX IF NOT EXISTS idx_games_season ON tournament_games(season_id);
      CREATE INDEX IF NOT EXISTS idx_games_date ON tournament_games(game_date);
    `);
  }

  seedTournaments() {
    const checkExists = this.db.prepare('SELECT COUNT(*) as count FROM tournaments WHERE sport = ?');
    const insertTournament = this.db.prepare(`
      INSERT INTO tournaments (sport, name, type, region, start_date, end_date, is_active, is_current, frequency, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const tournaments = this.getTournamentDefinitions();

    tournaments.forEach(tour => {
      const exists = checkExists.get(tour.sport);
      if (exists.count === 0) {
        insertTournament.run(
          tour.sport,
          tour.name,
          tour.type || 'season',
          tour.region || null,
          tour.start_date,
          tour.end_date,
          tour.is_active !== false ? 1 : 0,
          tour.is_current !== false ? 1 : 0,
          tour.frequency || 'annual',
          JSON.stringify(tour.metadata || {})
        );
      }
    });

    // Seed seasons for current/active tournaments
    const insertSeason = this.db.prepare(`
      INSERT OR IGNORE INTO tournament_seasons (tournament_id, season_name, year, start_date, end_date, is_current, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const getTournamentId = this.db.prepare('SELECT id FROM tournaments WHERE sport = ? AND is_current = 1');
    const checkSeasonExists = this.db.prepare('SELECT COUNT(*) as count FROM tournament_seasons WHERE tournament_id = ? AND season_name = ?');

    tournaments.filter(t => t.is_current !== false).forEach(tour => {
      const tourRow = getTournamentId.get(tour.sport);
      if (tourRow && tour.seasons) {
        tour.seasons.forEach(season => {
          const seasonExists = checkSeasonExists.get(tourRow.id, season.name);
          if (seasonExists.count === 0) {
            insertSeason.run(
              tourRow.id,
              season.name,
              season.year,
              season.start_date,
              season.end_date,
              season.is_current ? 1 : 0,
              season.status || 'in_progress'
            );
          }
        });
      }
    });
  }

  getTournamentDefinitions() {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    return [
      // NFL
      {
        sport: 'nfl',
        name: 'National Football League',
        type: 'season',
        region: 'USA',
        start_date: `${currentYear}-09-05`,
        end_date: `${nextYear}-02-09`,
        is_active: true,
        is_current: true,
        frequency: 'annual',
        metadata: {
          playoff_format: '14 teams',
          championship: 'Super Bowl',
          teams: 32,
          divisions: ['AFC East', 'AFC North', 'AFC South', 'AFC West', 'NFC East', 'NFC North', 'NFC South', 'NFC West']
        },
        seasons: [
          {
            name: `${currentYear}-${nextYear} Season`,
            year: currentYear,
            start_date: `${currentYear}-09-05`,
            end_date: `${nextYear}-02-09`,
            is_current: true,
            status: 'in_progress'
          }
        ]
      },

      // NBA
      {
        sport: 'nba',
        name: 'National Basketball Association',
        type: 'season',
        region: 'USA',
        start_date: `${currentYear}-10-15`,
        end_date: `${nextYear}-06-20`,
        is_active: true,
        is_current: true,
        frequency: 'annual',
        metadata: {
          playoff_format: '16 teams',
          championship: 'NBA Finals',
          teams: 30,
          conferences: ['Eastern', 'Western']
        },
        seasons: [
          {
            name: `${currentYear}-${nextYear} Season`,
            year: currentYear,
            start_date: `${currentYear}-10-15`,
            end_date: `${nextYear}-06-20`,
            is_current: true,
            status: 'scheduled'
          }
        ]
      },

      // MLB
      {
        sport: 'mlb',
        name: 'Major League Baseball',
        type: 'season',
        region: 'USA',
        start_date: `${currentYear}-03-28`,
        end_date: `${currentYear}-11-02`,
        is_active: true,
        is_current: true,
        frequency: 'annual',
        metadata: {
          playoff_format: '12 teams',
          championship: 'World Series',
          teams: 30,
          leagues: ['American League', 'National League']
        },
        seasons: [
          {
            name: `${currentYear} Season`,
            year: currentYear,
            start_date: `${currentYear}-03-28`,
            end_date: `${currentYear}-11-02`,
            is_current: true,
            status: 'in_progress'
          }
        ]
      },

      // NHL
      {
        sport: 'nhl',
        name: 'National Hockey League',
        type: 'season',
        region: 'USA/Canada',
        start_date: `${currentYear}-10-10`,
        end_date: `${nextYear}-06-15`,
        is_active: true,
        is_current: true,
        frequency: 'annual',
        metadata: {
          playoff_format: '16 teams',
          championship: 'Stanley Cup',
          teams: 32,
          conferences: ['Eastern', 'Western']
        },
        seasons: [
          {
            name: `${currentYear}-${nextYear} Season`,
            year: currentYear,
            start_date: `${currentYear}-10-10`,
            end_date: `${nextYear}-06-15`,
            is_current: true,
            status: 'scheduled'
          }
        ]
      },

      // MLS
      {
        sport: 'mls',
        name: 'Major League Soccer',
        type: 'season',
        region: 'USA/Canada',
        start_date: `${currentYear}-02-21`,
        end_date: `${currentYear}-12-07`,
        is_active: true,
        is_current: true,
        frequency: 'annual',
        metadata: {
          playoff_format: '18 teams',
          championship: 'MLS Cup',
          teams: 29,
          conferences: ['Eastern', 'Western']
        },
        seasons: [
          {
            name: `${currentYear} Season`,
            year: currentYear,
            start_date: `${currentYear}-02-21`,
            end_date: `${currentYear}-12-07`,
            is_current: true,
            status: 'in_progress'
          }
        ]
      },

      // EPL (English Premier League)
      {
        sport: 'epl',
        name: 'English Premier League',
        type: 'season',
        region: 'England',
        start_date: `${currentYear}-08-16`,
        end_date: `${nextYear}-05-25`,
        is_active: true,
        is_current: true,
        frequency: 'annual',
        metadata: {
          playoff_format: 'none',
          championship: 'Premier League Title',
          teams: 20,
          relegation: 'Bottom 3 teams'
        },
        seasons: [
          {
            name: `${currentYear}-${nextYear} Season`,
            year: currentYear,
            start_date: `${currentYear}-08-16`,
            end_date: `${nextYear}-05-25`,
            is_current: true,
            status: 'scheduled'
          }
        ]
      },

      // NCAAF
      {
        sport: 'ncaaf',
        name: 'NCAA Football',
        type: 'season',
        region: 'USA',
        start_date: `${currentYear}-08-24`,
        end_date: `${nextYear}-01-20`,
        is_active: true,
        is_current: true,
        frequency: 'annual',
        metadata: {
          playoff_format: '12 teams',
          championship: 'CFP National Championship',
          conferences: ['SEC', 'Big Ten', 'ACC', 'Big 12', 'Pac-12', 'Others'],
          divisions: 'FBS, FCS'
        },
        seasons: [
          {
            name: `${currentYear} Season`,
            year: currentYear,
            start_date: `${currentYear}-08-24`,
            end_date: `${nextYear}-01-20`,
            is_current: true,
            status: 'scheduled'
          }
        ]
      },

      // NCAAB
      {
        sport: 'ncaab',
        name: 'NCAA Basketball',
        type: 'season',
        region: 'USA',
        start_date: `${currentYear}-11-04`,
        end_date: `${nextYear}-04-07`,
        is_active: true,
        is_current: true,
        frequency: 'annual',
        metadata: {
          playoff_format: '68 teams (March Madness)',
          championship: 'NCAA Tournament',
          divisions: 'Division I, II, III'
        },
        seasons: [
          {
            name: `${currentYear}-${nextYear} Season`,
            year: currentYear,
            start_date: `${currentYear}-11-04`,
            end_date: `${nextYear}-04-07`,
            is_current: true,
            status: 'scheduled'
          }
        ]
      },

      // FIFA World Cup
      {
        sport: 'world_cup',
        name: 'FIFA World Cup',
        type: 'tournament',
        region: 'International',
        start_date: '2026-06-11',
        end_date: '2026-07-19',
        is_active: true,
        is_current: false,
        frequency: 'quadrennial',
        metadata: {
          host_countries: ['USA', 'Canada', 'Mexico'],
          teams: 48,
          format: 'Group stage + Knockout',
          venues: 16
        },
        seasons: [
          {
            name: '2026 World Cup',
            year: 2026,
            start_date: '2026-06-11',
            end_date: '2026-07-19',
            is_current: true,
            status: 'scheduled'
          },
          {
            name: '2022 World Cup',
            year: 2022,
            start_date: '2022-11-20',
            end_date: '2022-12-18',
            is_current: false,
            status: 'completed',
            champion: 'Argentina'
          }
        ]
      }
    ];
  }

  // Get all tournaments
  getAllTournaments(options = {}) {
    const { sport, active_only = false, include_seasons = false } = options;

    let query = 'SELECT * FROM tournaments';
    const params = [];

    if (active_only) {
      query += ' WHERE is_active = 1';
    }

    if (sport) {
      query += active_only ? ' AND sport = ?' : ' WHERE sport = ?';
      params.push(sport.toLowerCase());
    }

    query += ' ORDER BY sport, name';

    const tournaments = this.db.prepare(query).all(...params);

    if (include_seasons) {
      const getSeasons = this.db.prepare('SELECT * FROM tournament_seasons WHERE tournament_id = ? ORDER BY year DESC');

      tournaments.forEach(tour => {
        tour.seasons = getSeasons.all(tour.id);
      });
    }

    return tournaments;
  }

  // Get current season for a sport
  getCurrentSeason(sport) {
    const query = `
      SELECT ts.*, t.name as tournament_name, t.sport
      FROM tournament_seasons ts
      JOIN tournaments t ON ts.tournament_id = t.id
      WHERE t.sport = ? AND ts.is_current = 1
    `;

    return this.db.prepare(query).get(sport.toLowerCase());
  }

  // Get all current seasons
  getAllCurrentSeasons() {
    const query = `
      SELECT ts.*, t.name as tournament_name, t.sport, t.type, t.region
      FROM tournament_seasons ts
      JOIN tournaments t ON ts.tournament_id = t.id
      WHERE ts.is_current = 1
      ORDER BY t.sport, ts.year DESC
    `;

    return this.db.prepare(query).all();
  }

  // Get tournaments by sport
  getTournamentsBySport(sport) {
    return this.getAllTournaments({ sport, include_seasons: true });
  }

  // Get upcoming tournaments (next 30 days)
  getUpcomingTournaments(days = 30) {
    const query = `
      SELECT ts.*, t.name as tournament_name, t.sport
      FROM tournament_seasons ts
      JOIN tournaments t ON ts.tournament_id = t.id
      WHERE ts.start_date >= date('now')
        AND ts.start_date <= date('now', '+' || ? || ' days')
      ORDER BY ts.start_date
    `;

    return this.db.prepare(query).all(days);
  }

  // Get active tournaments (in progress)
  getActiveTournaments() {
    const query = `
      SELECT ts.*, t.name as tournament_name, t.sport
      FROM tournament_seasons ts
      JOIN tournaments t ON ts.tournament_id = t.id
      WHERE ts.status = 'in_progress'
      ORDER BY t.sport
    `;

    return this.db.prepare(query).all();
  }

  // Get tournament by ID
  getTournamentById(id) {
    const tournament = this.db.prepare('SELECT * FROM tournaments WHERE id = ?').get(id);

    if (tournament) {
      tournament.seasons = this.db.prepare('SELECT * FROM tournament_seasons WHERE tournament_id = ? ORDER BY year DESC').all(id);
    }

    return tournament;
  }

  // Get season by ID
  getSeasonById(id) {
    return this.db.prepare('SELECT * FROM tournament_seasons WHERE id = ?').get(id);
  }

  // Add a new season
  addSeason(tournamentId, seasonData) {
    const insert = this.db.prepare(`
      INSERT INTO tournament_seasons (tournament_id, season_name, year, start_date, end_date, is_current, status, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      tournamentId,
      seasonData.season_name,
      seasonData.year,
      seasonData.start_date,
      seasonData.end_date,
      seasonData.is_current ? 1 : 0,
      seasonData.status || 'scheduled',
      JSON.stringify(seasonData.metadata || {})
    );

    return this.getSeasonById(result.lastInsertRowid);
  }

  // Update season status
  updateSeasonStatus(seasonId, status) {
    const update = this.db.prepare(`
      UPDATE tournament_seasons
      SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `);

    update.run(status, seasonId);
    return this.getSeasonById(seasonId);
  }

  // Close database connection
  close() {
    this.db.close();
  }
}

module.exports = TournamentService;
