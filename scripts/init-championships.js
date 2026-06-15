/**
 * Initialize Championship Database
 * Seeds final tournaments/playoffs for all sports
 */

const ChampionshipService = require('../server/services/championship-service');

console.log('🏆 Initializing VIC Tour Championship Database...\n');

const service = new ChampionshipService();

// Verify data
const championships = service.getAllChampionships();
const currentChamps = service.getCurrentChampionships();

console.log('\n📊 Championship Summary:');
console.log('─────────────────────────────────────');
console.log(`Total Championships: ${championships.length}`);
console.log(`Current/Upcoming: ${currentChamps.length}`);
console.log('');

championships.forEach(champ => {
  const statusIcon = champ.status === 'in_progress' ? '🟢' : champ.status === 'completed' ? '✅' : '🟡';
  console.log(`${statusIcon} ${champ.sport.toUpperCase()}: ${champ.name} (${champ.year})`);
  console.log(`   Format: ${champ.format} | Teams: ${champ.teams_count}`);
  console.log(`   Dates: ${champ.start_date} → ${champ.end_date}`);
  console.log(`   Status: ${champ.status}`);
  console.log('');
});

console.log('─────────────────────────────────────');
console.log('✅ Championship database initialized!');
console.log('📁 Database: /home/markusbot/vic-tour/data/tournaments.db\n');

service.close();
