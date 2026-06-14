# VIC Tour — Sports Tournament Intelligence Engine

**Part of the VIC (Vegas Intelligence Console) ecosystem by Oddsify Labs**

VIC Tour is a comprehensive tournament/season tracking system for all major sports leagues, providing real-time season data, tournament calendars, and integration with the VIC signal engine.

---

## 🏆 Supported Sports

| Sport | League | Region | Season Type |
|-------|--------|--------|-------------|
| **NFL** | National Football League | USA | Annual (Fall-Winter) |
| **NBA** | National Basketball Association | USA | Annual (Winter-Summer) |
| **MLB** | Major League Baseball | USA | Annual (Spring-Fall) |
| **NHL** | National Hockey League | USA/Canada | Annual (Winter-Summer) |
| **MLS** | Major League Soccer | USA/Canada | Annual (Spring-Fall) |
| **EPL** | English Premier League | England | Annual (Fall-Spring) |
| **NCAAF** | NCAA Football | USA | Annual (Fall-Winter) |
| **NCAAB** | NCAA Basketball | USA | Annual (Winter-Spring) |
| **World Cup** | FIFA World Cup | International | Quadrennial (2026) |

---

## 🚀 Quick Start

### Installation

```bash
cd vic-tour
npm install
```

### Initialize Database

```bash
npm run init-data
```

This creates the SQLite database and seeds it with all tournament definitions.

### Start Server

```bash
npm start
```

Server runs on **port 3748** by default.

### Development Mode

```bash
npm run dev
```

Auto-restarts on file changes.

---

## 📡 API Endpoints

### Base URL
```
http://localhost:3748
```

### Tournaments

| Endpoint | Description |
|----------|-------------|
| `GET /api/tournaments` | Get all tournaments |
| `GET /api/tournaments/current` | Get all current active seasons |
| `GET /api/tournaments/:sport` | Get tournament for specific sport |
| `GET /api/tournaments/:sport/season/current` | Get current season for a sport |
| `GET /api/tournaments/upcoming` | Get upcoming tournaments (next 30 days) |
| `GET /api/tournaments/active` | Get tournaments currently in progress |
| `GET /api/tournaments/:id` | Get tournament by ID with seasons |

### Seasons

| Endpoint | Description |
|----------|-------------|
| `GET /api/seasons/:id` | Get season by ID |
| `POST /api/seasons` | Create a new season |
| `PUT /api/seasons/:id/status` | Update season status |

### Utility

| Endpoint | Description |
|----------|-------------|
| `GET /api/sports` | Get list of supported sports |
| `GET /health` | Health check endpoint |
| `GET /api/docs` | Interactive API documentation |

---

## 📝 Example Requests

### Get All Current Seasons

```bash
curl http://localhost:3748/api/tournaments/current
```

**Response:**
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
    },
    // ... more seasons
  ]
}
```

### Get NFL Tournament Data

```bash
curl "http://localhost:3748/api/tournaments/nfl?include_seasons=true"
```

### Get Upcoming Tournaments (Next 60 Days)

```bash
curl "http://localhost:3748/api/tournaments/upcoming?days=60"
```

### Get All Supported Sports

```bash
curl http://localhost:3748/api/sports
```

---

## 🗄️ Database Schema

### Tournaments Table
```sql
CREATE TABLE tournaments (
  id INTEGER PRIMARY KEY,
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
  created_at TEXT,
  updated_at TEXT
);
```

### Tournament Seasons Table
```sql
CREATE TABLE tournament_seasons (
  id INTEGER PRIMARY KEY,
  tournament_id INTEGER NOT NULL,
  season_name TEXT NOT NULL,
  year INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  is_current INTEGER DEFAULT 0,
  status TEXT DEFAULT 'scheduled',
  champion TEXT,
  metadata TEXT,
  created_at TEXT,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
);
```

### Tournament Games Table
```sql
CREATE TABLE tournament_games (
  id INTEGER PRIMARY KEY,
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
  created_at TEXT,
  FOREIGN KEY (season_id) REFERENCES tournament_seasons(id)
);
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
PORT=3748
NODE_ENV=development
CORS_ORIGIN=*
DATA_DIR=./data
```

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3748 | Server port |
| `NODE_ENV` | development | Environment mode |
| `CORS_ORIGIN` | * | Allowed CORS origins |
| `DATA_DIR` | ./data | Database directory |

---

## 🔗 Integration with VIC

VIC Tour is designed to integrate seamlessly with the main VIC (Vegas Intelligence Console) system:

### Signal Engine Integration
- Tournament data provides context for VIC signals
- Season status determines which sports are active for signal generation
- Tournament metadata enriches signal cards

### Planned Integrations
```javascript
// Example: Get active tournaments for signal filtering
const activeTournaments = await fetch('http://localhost:3748/api/tournaments/active');

// Example: Check if sport is in season before generating signals
const season = await fetch('http://localhost:3748/api/tournaments/nfl/season/current');
if (season.data.status === 'in_progress') {
  // Generate NFL signals
}
```

---

## 📊 API Documentation

Visit `http://localhost:3748/api/docs` for interactive API documentation with:
- Complete endpoint reference
- Request/response examples
- Supported sports list
- Rate limit information

---

## 🧪 Testing

```bash
npm test
```

---

## 📁 Project Structure

```
vic-tour/
├── server/
│   ├── routes/
│   │   └── tournaments.js      # API routes
│   ├── services/
│   │   └── tournament-service.js  # Database service
│   └── middleware/
├── scripts/
│   └── init-tournaments.js     # Database initialization
├── config/
├── data/
│   └── tournaments.db          # SQLite database (generated)
├── docs/
├── server.js                   # Main server entry
├── package.json
└── README.md
```

---

## 🚀 Deployment

### Railway Deploy

1. Push to GitHub
2. Connect repo to Railway
3. Add environment variables
4. Deploy

### Docker Deploy

```bash
docker build -t vic-tour .
docker run -p 3748:3748 -v ./data:/app/data vic-tour
```

---

## 📝 License

**Proprietary — Oddsify Labs**

VIC Tour is part of the VIC ecosystem and is distributed under private license.

---

## 🔗 Links

- **VIC Main:** https://github.com/oddsifylabs/vic
- **Oddsify Labs:** https://oddsifylabs.com
- **API Docs:** http://localhost:3748/api/docs

---

**Built by Oddsify Labs — Queen Creek, AZ**
