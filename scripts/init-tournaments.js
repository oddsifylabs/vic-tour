/**
 * Initialize Tournament Database
 * Seeds the database with all tournament definitions
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'tournaments.db');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✓ Created data directory:', dataDir);
}

// Remove existing database for fresh start
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('✓ Removed existing database');
}

console.log('🏆 Initializing VIC Tour Tournament Database...\n');

// Import and initialize service
const TournamentService = require('../server/services/tournament-service');
const service = new TournamentService();

// Verify data
const tournaments = service.getAllTournaments({ include_seasons: true });
const currentSeasons = service.getAllCurrentSeasons();

console.log('\n📊 Database Summary:');
console.log('─────────────────────────────────────');
console.log(`Total Tournaments: ${tournaments.length}`);
console.log(`Current Seasons: ${currentSeasons.length}`);
console.log('');

tournaments.forEach(tour => {
  console.log(`✓ ${tour.sport.toUpperCase()}: ${tour.name}`);
  console.log(`  Region: ${tour.region} | Type: ${tour.type} | Frequency: ${tour.frequency}`);
  if (tour.seasons && tour.seasons.length > 0) {
    tour.seasons.forEach(season => {
      const status = season.is_current ? ' [CURRENT]' : '';
      console.log(`  └─ Season: ${season.season_name} (${season.year})${status}`);
    });
  }
  console.log('');
});

console.log('─────────────────────────────────────');
console.log('✅ Database initialization complete!');
console.log(`📁 Database location: ${dbPath}\n`);

service.close();
