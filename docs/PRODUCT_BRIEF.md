# VIC Tour - Chief Sports Tournaments Signal Manager Brief

**Product:** VIC Tour (Tournament Intelligence Engine)  
**Status:** ✅ MVP Complete  
**Version:** 1.0.0  
**Date:** June 14, 2026  

---

## 🎯 Executive Summary

VIC Tour is now **operational** as a standalone tournament tracking service for all 9 supported sports. The system provides real-time season data, tournament calendars, and API endpoints ready for integration with the VIC signal engine.

---

## ✅ Completed Deliverables

### 1. Core Infrastructure
- ✅ SQLite database with tournament/season/game schema
- ✅ RESTful API server (Express.js)
- ✅ Auto-seeding with 2026-2027 season data
- ✅ Health monitoring endpoint
- ✅ Rate limiting (100 req/min)
- ✅ CORS-enabled for frontend integration

### 2. Supported Sports (9 Total)

| Sport | League | Status | Current Season |
|-------|--------|--------|----------------|
| **NFL** | National Football League | 🟢 Active | 2026-2027 (Sep 5 - Feb 9) |
| **NBA** | National Basketball Association | 🟡 Scheduled | 2026-2027 (Oct 15 - Jun 20) |
| **MLB** | Major League Baseball | 🟢 In Progress | 2026 (Mar 28 - Nov 2) |
| **NHL** | National Hockey League | 🟡 Scheduled | 2026-2027 (Oct 10 - Jun 15) |
| **MLS** | Major League Soccer | 🟢 In Progress | 2026 (Feb 21 - Dec 7) |
| **EPL** | English Premier League | 🟡 Scheduled | 2026-2027 (Aug 16 - May 25) |
| **NCAAF** | NCAA Football | 🟡 Scheduled | 2026 (Aug 24 - Jan 20) |
| **NCAAB** | NCAA Basketball | 🟡 Scheduled | 2026-2027 (Nov 4 - Apr 7) |
| **World Cup** | FIFA 2026 | 🟡 Scheduled | 2026 (Jun 11 - Jul 19) |

🟢 = Currently in season  
🟡 = Upcoming season

### 3. API Endpoints (11 Total)

#### Tournaments
- `GET /api/tournaments` - All tournaments
- `GET /api/tournaments/current` - All active seasons
- `GET /api/tournaments/:sport` - Specific sport data
- `GET /api/tournaments/:sport/season/current` - Current season for sport
- `GET /api/tournaments/upcoming` - Tournaments starting soon
- `GET /api/tournaments/active` - Tournaments in progress
- `GET /api/tournaments/:id` - Tournament by ID

#### Seasons
- `GET /api/seasons/:id` - Season details
- `POST /api/seasons` - Create new season
- `PUT /api/seasons/:id/status` - Update season status

#### Utility
- `GET /api/sports` - List all supported sports
- `GET /health` - Health check
- `GET /api/docs` - Interactive documentation

---

## 🚀 Server Status

**Running:** Port 3748  
**Health:** ✅ Healthy  
**Database:** `/home/markusbot/vic-tour/data/tournaments.db`

```bash
# Test health endpoint
curl http://localhost:3748/health

# Get all current seasons
curl http://localhost:3748/api/tournaments/current

# Get NFL data
curl http://localhost:3748/api/tournaments/nfl

# View API docs
open http://localhost:3748/api/docs
```

---

## 📊 Sample API Response

**Endpoint:** `GET /api/tournaments/current`

```json
{
  "success": true,
  "count": 9,
  "data": [
    {
      "id": 1,
      "tournament_id": 1,
      "season_name": "2026-2027 Season",
      "year": 2026,
      "start_date": "2026-09-05",
      "end_date": "2027-02-09",
      "is_current": 1,
      "status": "in_progress",
      "tournament_name": "National Football League",
      "sport": "nfl",
      "type": "season",
      "region": "USA"
    }
    // ... 8 more seasons
  ]
}
```

---

## 🔗 Integration Points with VIC

### Phase 1: Signal Filtering (Immediate)
```javascript
// Only generate signals for active tournaments
const activeSports = await fetch('http://localhost:3748/api/tournaments/active');
// Returns: ['mlb', 'mls', 'nfl'] (currently in season)
```

### Phase 2: Tournament Context (Next Sprint)
- Add tournament stage to signal cards (Regular Season, Playoffs, Championship)
- Display season progress (% of games completed)
- Show historical champion data

### Phase 3: Game-Level Integration (Future)
- Store individual game schedules
- Track game results and scores
- Link VIC signals to specific tournament games

---

## 📁 Project Location

```
/home/markusbot/vic-tour/
├── server.js                    # Main server entry
├── server/
│   ├── routes/tournaments.js    # API routes
│   └── services/tournament-service.js  # Database layer
├── scripts/
│   └── init-tournaments.js      # Database seeder
├── data/
│   └── tournaments.db           # SQLite database
├── package.json
└── README.md
```

---

## 🛠️ Commands

```bash
# Start server
cd /home/markusbot/vic-tour && npm start

# Development mode (auto-reload)
npm run dev

# Initialize/reset database
npm run init-data

# Run tests
npm test
```

---

## 📋 Next Steps (Priority Order)

### Week 1: Foundation
1. ✅ ~~Core API server~~ **DONE**
2. ⏳ Add game schedule endpoints (populate with 2026 fixtures)
3. ⏳ Create tournament metadata enrichment (team lists, standings)

### Week 2: VIC Integration
1. ⏳ Modify VIC signal engine to query tournament status
2. ⏳ Add tournament context to signal cards
3. ⏳ Filter signals by active sports only

### Week 3: Frontend
1. ⏳ Build tournament dashboard page
2. ⏳ Add season calendar view
3. ⏳ Create sport selector component

### Week 4: Advanced Features
1. ⏳ FIFA World Cup 2026 special tracking (groups, knockout stages)
2. ⏳ Playoff bracket visualization
3. ⏳ Championship history database

---

## 🎖️ FIFA World Cup 2026 Special Tracking

The system includes dedicated support for the 2026 FIFA World Cup:
- **Host Countries:** USA, Canada, Mexico
- **Format:** 48 teams, group stage + knockout
- **Venues:** 16 stadiums across 3 countries
- **Dates:** June 11 - July 19, 2026

**Quadrennial tracking** ensures the system automatically handles:
- 2026: Active tournament year
- 2027-2029: Off-years (no World Cup)
- 2030: Next tournament cycle

---

## 📞 Contact

**Chief Sports Tournaments Signal Manager:** Ruth  
**Organization:** Oddsify Labs  
**Location:** Queen Creek, AZ  
**Telegram:** t.me/testudolegio  
**Website:** https://oddsifylabs.com

---

**VIC Tour — Built by Oddsify Labs**  
*Part of the VIC (Vegas Intelligence Console) ecosystem*
