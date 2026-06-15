/**
 * VIC Tour - Championship/Final Tournament Tracker
 * Tracks playoffs, championship brackets, and final tournaments for each sport
 */

const Database = require('better-sqlite3');
const path = require('path');

class ChampionshipService {
  constructor(dbPath = './data/tournaments.db') {
    this.dbPath = path.resolve(__dirname, '../../', dbPath);
    this.db = new Database(this.dbPath);
    this.initChampionshipSchema();
    this.seedChampionships();
  }

  initChampionshipSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS championships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sport TEXT NOT NULL,
        name TEXT NOT NULL,
        year INTEGER NOT NULL,
        type TEXT DEFAULT 'playoff',
        status TEXT DEFAULT 'scheduled',
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        champion TEXT,
        runner_up TEXT,
        final_score TEXT,
        format TEXT,
        teams_count INTEGER,
        rounds TEXT,
        metadata TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS championship_brackets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        championship_id INTEGER NOT NULL,
        round TEXT NOT NULL,
        match_number INTEGER,
        home_team TEXT,
        away_team TEXT,
        home_seed INTEGER,
        away_seed INTEGER,
        home_score INTEGER,
        away_score INTEGER,
        winner TEXT,
        game_date TEXT,
        venue TEXT,
        status TEXT DEFAULT 'scheduled',
        metadata TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (championship_id) REFERENCES championships(id)
      );

      CREATE INDEX IF NOT EXISTS idx_championships_sport ON championships(sport);
      CREATE INDEX IF NOT EXISTS idx_championships_year ON championships(year);
      CREATE INDEX IF NOT EXISTS idx_championships_status ON championships(status);
      CREATE INDEX IF NOT EXISTS idx_brackets_championship ON championship_brackets(championship_id);
      CREATE INDEX IF NOT EXISTS idx_brackets_round ON championship_brackets(round);
    `);
  }

  seedChampionships() {
    const checkExists = this.db.prepare('SELECT COUNT(*) as count FROM championships WHERE sport = ? AND year = ?');
    const insertChamp = this.db.prepare(`
      INSERT INTO championships (sport, name, year, type, status, start_date, end_date, format, teams_count, rounds, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    const championships = [
      // NFL - Super Bowl
      {
        sport: 'nfl',
        name: 'Super Bowl LXI',
        year: nextYear,
        type: 'championship',
        status: 'scheduled',
        start_date: `${nextYear}-02-07`,
        end_date: `${nextYear}-02-09`,
        format: 'Single Elimination',
        teams_count: 14,
        rounds: 'Wild Card, Divisional, Conference Championships, Super Bowl',
        metadata: JSON.stringify({
          venue: 'Allegiant Stadium, Las Vegas, NV',
          tv: 'FOX',
          defending_champion: 'Kansas City Chiefs'
        })
      },
      // NBA - Finals
      {
        sport: 'nba',
        name: 'NBA Finals',
        year: nextYear,
        type: 'championship',
        status: 'scheduled',
        start_date: `${nextYear}-06-04`,
        end_date: `${nextYear}-06-20`,
        format: 'Best of 7',
        teams_count: 16,
        rounds: 'Play-In, First Round, Conference Semifinals, Conference Finals, Finals',
        metadata: JSON.stringify({
          defending_champion: 'Boston Celtics',
          mvp_finals: 'TBD'
        })
      },
      // MLB - World Series
      {
        sport: 'mlb',
        name: 'World Series',
        year: currentYear,
        type: 'championship',
        status: 'scheduled',
        start_date: `${currentYear}-10-21`,
        end_date: `${currentYear}-11-02`,
        format: 'Best of 7',
        teams_count: 12,
        rounds: 'Wild Card, Division Series, Championship Series, World Series',
        metadata: JSON.stringify({
          defending_champion: 'Texas Rangers',
          venues: 'TBD'
        })
      },
      // NHL - Stanley Cup
      {
        sport: 'nhl',
        name: 'Stanley Cup Finals',
        year: nextYear,
        type: 'championship',
        status: 'scheduled',
        start_date: `${nextYear}-06-01`,
        end_date: `${nextYear}-06-15`,
        format: 'Best of 7',
        teams_count: 16,
        rounds: 'Wild Card, Division Semifinals, Division Finals, Conference Finals, Stanley Cup',
        metadata: JSON.stringify({
          defending_champion: 'Florida Panthers',
          trophy: 'Stanley Cup'
        })
      },
      // MLS - MLS Cup
      {
        sport: 'mls',
        name: 'MLS Cup',
        year: currentYear,
        type: 'championship',
        status: 'scheduled',
        start_date: `${currentYear}-12-05`,
        end_date: `${currentYear}-12-07`,
        format: 'Single Elimination',
        teams_count: 18,
        rounds: 'Wild Card, Round One, Conference Semifinals, Conference Finals, MLS Cup',
        metadata: JSON.stringify({
          defending_champion: 'Columbus Crew',
          venue: 'TBD (Higher Seed)'
        })
      },
      // EPL - No playoff, but track title race
      {
        sport: 'epl',
        name: 'Premier League Title Race',
        year: nextYear,
        type: 'league',
        status: 'scheduled',
        start_date: `${currentYear}-08-16`,
        end_date: `${nextYear}-05-25`,
        format: 'Round Robin',
        teams_count: 20,
        rounds: '38 Matchdays',
        metadata: JSON.stringify({
          defending_champion: 'Manchester City',
          format: 'Most points wins'
        })
      },
      // NCAAF - College Football Playoff
      {
        sport: 'ncaaf',
        name: 'College Football Playoff',
        year: currentYear,
        type: 'playoff',
        status: 'scheduled',
        start_date: `${currentYear}-12-19`,
        end_date: `${nextYear}-01-19`,
        format: '12-Team Playoff',
        teams_count: 12,
        rounds: 'First Round, Quarterfinals, Semifinals, National Championship',
        metadata: JSON.stringify({
          championship_game: 'Mercedes-Benz Stadium, Atlanta',
          defending_champion: 'Michigan Wolverines'
        })
      },
      // NCAAB - March Madness
      {
        sport: 'ncaab',
        name: 'NCAA Tournament (March Madness)',
        year: nextYear,
        type: 'tournament',
        status: 'scheduled',
        start_date: `${nextYear}-03-17`,
        end_date: `${nextYear}-04-07`,
        format: '68-Team Single Elimination',
        teams_count: 68,
        rounds: 'First Four, Round of 64, Round of 32, Sweet 16, Elite Eight, Final Four, Championship',
        metadata: JSON.stringify({
          final_four_venue: 'Alamodome, San Antonio',
          defending_champion: 'UConn Huskies'
        })
      },
      // FIFA World Cup 2026
      {
        sport: 'world_cup',
        name: 'FIFA World Cup 2026',
        year: 2026,
        type: 'tournament',
        status: 'scheduled',
        start_date: '2026-06-11',
        end_date: '2026-07-19',
        format: '48-Team Tournament',
        teams_count: 48,
        rounds: 'Group Stage, Round of 32, Round of 16, Quarterfinals, Semifinals, Final',
        metadata: JSON.stringify({
          hosts: ['USA', 'Canada', 'Mexico'],
          final_venue: 'MetLife Stadium, New York/New Jersey',
          defending_champion: 'Argentina'
        })
      }
    ];

    championships.forEach(champ => {
      const exists = checkExists.get(champ.sport, champ.year);
      if (exists.count === 0) {
        insertChamp.run(
          champ.sport,
          champ.name,
          champ.year,
          champ.type,
          champ.status,
          champ.start_date,
          champ.end_date,
          champ.format,
          champ.teams_count,
          champ.rounds,
          champ.metadata
        );
      }
    });
  }

  // Get all championships
  getAllChampionships(options = {}) {
    const { sport, year, status } = options;
    
    let query = 'SELECT * FROM championships WHERE 1=1';
    const params = [];

    if (sport) {
      query += ' AND sport = ?';
      params.push(sport);
    }

    if (year) {
      query += ' AND year = ?';
      params.push(year);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY start_date';

    return this.db.prepare(query).all(...params);
  }

  // Get current/upcoming championships
  getCurrentChampionships() {
    const today = new Date().toISOString().split('T')[0];
    
    const query = `
      SELECT * FROM championships
      WHERE end_date >= ?
      ORDER BY start_date
    `;

    return this.db.prepare(query).all(today);
  }

  // Get championship by sport
  getChampionshipBySport(sport, year = null) {
    const currentYear = new Date().getFullYear();
    const targetYear = year || currentYear;

    const query = `
      SELECT * FROM championships
      WHERE sport = ? AND year = ?
    `;

    return this.db.prepare(query).get(sport, targetYear);
  }

  // Get championship by ID
  getChampionshipById(id) {
    const query = `
      SELECT * FROM championships
      WHERE id = ?
    `;

    return this.db.prepare(query).get(id);
  }

  // Get championship brackets
  getChampionshipBrackets(championshipId) {
    const query = `
      SELECT * FROM championship_brackets
      WHERE championship_id = ?
      ORDER BY 
        CASE round
          WHEN 'Final' THEN 1
          WHEN 'Semifinals' THEN 2
          WHEN 'Quarterfinals' THEN 3
          ELSE 4
        END,
        match_number
    `;

    return this.db.prepare(query).all(championshipId);
  }

  // Add championship bracket match
  addBracketMatch(championshipId, matchData) {
    const insert = this.db.prepare(`
      INSERT INTO championship_brackets (
        championship_id, round, match_number, home_team, away_team,
        home_seed, away_seed, game_date, venue, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      championshipId,
      matchData.round,
      matchData.match_number || 1,
      matchData.home_team,
      matchData.away_team,
      matchData.home_seed,
      matchData.away_seed,
      matchData.game_date,
      matchData.venue,
      matchData.status || 'scheduled'
    );

    return this.db.prepare('SELECT * FROM championship_brackets WHERE id = ?').get(result.lastInsertRowid);
  }

  // Update bracket match result
  updateBracketMatch(matchId, winner, homeScore, awayScore) {
    const update = this.db.prepare(`
      UPDATE championship_brackets
      SET winner = ?, home_score = ?, away_score = ?, status = 'completed'
      WHERE id = ?
    `);

    update.run(winner, homeScore, awayScore, matchId);
    return this.db.prepare('SELECT * FROM championship_brackets WHERE id = ?').get(matchId);
  }

  // Get championships by status
  getChampionshipsByStatus(status) {
    const query = `
      SELECT * FROM championships
      WHERE status = ?
      ORDER BY start_date
    `;

    return this.db.prepare(query).all(status);
  }

  // Close database
  close() {
    this.db.close();
  }
}

module.exports = ChampionshipService;
