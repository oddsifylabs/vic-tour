/**
 * VIC Tour Server
 * Sports Tournament Intelligence Engine
 * 
 * Part of the VIC (Vegas Intelligence Console) ecosystem
 * by Oddsify Labs
 */

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// Import routes
const tournamentRoutes = require('./server/routes/tournaments');
const oddsRoutes = require('./server/routes/odds');
const championshipRoutes = require('./server/routes/championships');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3748;

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✓ Created data directory:', dataDir);
}

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    success: false,
    error: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', limiter);

// Request logging (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'VIC Tour'
  });
});

// API Routes
app.use('/api', tournamentRoutes);
app.use('/api', oddsRoutes);
app.use('/api', championshipRoutes);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve Dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Serve Championship Dashboard
app.get('/championships', (req, res) => {
res.sendFile(path.join(__dirname, 'championships.html'));
});

// Serve Event Detail Page
app.get('/event', (req, res) => {
res.sendFile(path.join(__dirname, 'event.html'));
});

// Root redirect to championships
app.get('/', (req, res) => {
res.redirect('/championships');
});

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    service: 'VIC Tour API',
    version: '1.0.0',
    documentation: '/api/docs',
    dashboard: '/dashboard',
    endpoints: {
      tournaments: {
        'GET /api/tournaments': 'Get all tournaments',
        'GET /api/tournaments/current': 'Get all current active seasons',
        'GET /api/tournaments/:sport': 'Get tournament for specific sport',
        'GET /api/tournaments/:sport/season/current': 'Get current season for a sport',
        'GET /api/tournaments/upcoming': 'Get upcoming tournaments',
        'GET /api/tournaments/active': 'Get active tournaments (in progress)',
        'GET /api/tournaments/:id': 'Get tournament by ID',
        'GET /api/seasons/:id': 'Get season by ID',
        'POST /api/seasons': 'Create new season',
        'PUT /api/seasons/:id/status': 'Update season status',
        'GET /api/sports': 'Get list of supported sports'
      },
      odds: {
        'GET /api/odds/sports': 'Get available sports from The Odds API',
        'GET /api/odds/:sport': 'Get odds for specific sport',
        'GET /api/odds/vic/:vicSport': 'Get odds using VIC sport ID',
        'GET /api/odds/multi': 'Get odds for multiple sports',
        'POST /api/odds/cache/clear': 'Clear odds cache'
      }
    },
    supported_sports: [
      'nfl', 'nba', 'mlb', 'nhl', 'mls', 'epl', 'ncaaf', 'ncaab', 'world_cup'
    ]
  });
});

// API Documentation (simple HTML)
app.get('/api/docs', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VIC Tour API Documentation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      background: #0a0e1a;
      color: #e0e0e0;
      line-height: 1.6;
      padding: 2rem;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { color: #3b82f6; margin-bottom: 0.5rem; }
    h2 { color: #8b5cf6; margin: 2rem 0 1rem; }
    .endpoint {
      background: rgba(59, 130, 246, 0.1);
      border-left: 3px solid #3b82f6;
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 0 8px 8px 0;
    }
    .method {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-weight: bold;
      margin-right: 0.5rem;
    }
    .get { background: #10b981; color: white; }
    .post { background: #3b82f6; color: white; }
    .put { background: #f59e0b; color: white; }
    code {
      background: rgba(0, 0, 0, 0.3);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      color: #10b981;
    }
    .sport-tag {
      display: inline-block;
      background: rgba(139, 92, 246, 0.2);
      color: #a78bfa;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      margin: 0.25rem;
      font-size: 0.875rem;
    }
    .info-box {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid #3b82f6;
      padding: 1rem;
      border-radius: 8px;
      margin: 1rem 0;
    }
    a { color: #60a5fa; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🏆 VIC Tour API</h1>
    <p style="color: #9ca3af; margin-bottom: 2rem;">Sports Tournament Intelligence Engine — Oddsify Labs</p>

    <div class="info-box">
      <strong>Base URL:</strong> <code>http://localhost:${PORT}</code><br>
      <strong>Dashboard:</strong> <a href="/dashboard">http://localhost:${PORT}/dashboard</a><br>
      <strong>Version:</strong> 1.0.0<br>
      <strong>Rate Limit:</strong> 100 requests/minute
    </div>

    <h2>Supported Sports</h2>
    <div style="margin: 1rem 0;">
      <span class="sport-tag">NFL</span>
      <span class="sport-tag">NBA</span>
      <span class="sport-tag">MLB</span>
      <span class="sport-tag">NHL</span>
      <span class="sport-tag">MLS</span>
      <span class="sport-tag">EPL</span>
      <span class="sport-tag">NCAAF</span>
      <span class="sport-tag">NCAAB</span>
      <span class="sport-tag">FIFA World Cup</span>
    </div>

    <h2>Endpoints</h2>

    <h3>Tournaments</h3>

    <div class="endpoint">
      <span class="method get">GET</span>
      <code>/api/tournaments</code>
      <p style="margin-top: 0.5rem; color: #9ca3af;">Get all tournaments</p>
    </div>

    <div class="endpoint">
      <span class="method get">GET</span>
      <code>/api/tournaments/current</code>
      <p style="margin-top: 0.5rem; color: #9ca3af;">Get all current active seasons</p>
    </div>

    <div class="endpoint">
      <span class="method get">GET</span>
      <code>/api/tournaments/:sport</code>
      <p style="margin-top: 0.5rem; color: #9ca3af;">Get tournament for specific sport</p>
    </div>

    <h3>Odds (The Odds API)</h3>

    <div class="endpoint">
      <span class="method get">GET</span>
      <code>/api/odds/vic/nfl</code>
      <p style="margin-top: 0.5rem; color: #9ca3af;">Get NFL odds (uses VIC sport ID mapping)</p>
    </div>

    <div class="endpoint">
      <span class="method get">GET</span>
      <code>/api/odds/multi?sports=americanfootball_nfl,basketball_nba</code>
      <p style="margin-top: 0.5rem; color: #9ca3af;">Get odds for multiple sports</p>
    </div>

    <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #374151; color: #9ca3af;">
      <p>Built by <a href="https://oddsifylabs.com" target="_blank">Oddsify Labs</a></p>
      <p style="font-size: 0.875rem; margin-top: 0.5rem;">Part of the VIC (Vegas Intelligence Console) ecosystem</p>
    </div>
  </div>
</body>
</html>
  `);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    hint: 'Visit /api/docs for available endpoints or /dashboard for the UI'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                    🏆 VIC Tour Server                     ║
║         Sports Tournament Intelligence Engine             ║
╠═══════════════════════════════════════════════════════════╣
║  Status: Running                                          ║
║  Port: ${PORT}                                            ║
║  Dashboard: http://localhost:${PORT}/dashboard            ║
║  API Docs: http://localhost:${PORT}/api/docs              ║
║  Health: http://localhost:${PORT}/health                  ║
╠═══════════════════════════════════════════════════════════╣
║  Supported Sports:                                        ║
║  NFL | NBA | MLB | NHL | MLS | EPL | NCAAF | NCAAB       ║
║  + FIFA World Cup 2026                                    ║
╠═══════════════════════════════════════════════════════════╣
║  Odds Provider: The Odds API ✓                            ║
║  Built by Oddsify Labs                                    ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
