# VIC Tour - Setup on Remote Computer

**Target:** pil_coder1@ccclt01:~/projects/vic-tour

---

## Step 1: Install Node.js 20

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load nvm
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install and use Node 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

---

## Step 2: Clone Repository

```bash
cd ~/projects
git clone https://github.com/oddsifylabs/vic-tour.git
cd vic-tour
```

---

## Step 3: Install Dependencies

```bash
npm install
```

---

## Step 4: Initialize Database

```bash
npm run init-data
```

This creates the SQLite database with all tournament data.

---

## Step 5: Start Server

```bash
npm start
```

Server will run on **port 3748**.

---

## Step 6: Verify Dashboard

Open in browser:
```
http://ccclt01:3748/dashboard
```

Or from local machine (if port forwarding):
```
http://localhost:3748/dashboard
```

---

## Expected Dashboard Data (June 2026)

| Sport | Status | Progress |
|-------|--------|----------|
| **MLB** | 🟢 In Progress | 36% |
| **MLS** | 🟢 In Progress | 39% |
| **NFL** | 🟡 Scheduled | 0% (starts Sep) |
| **NBA** | 🟡 Scheduled | 0% (starts Oct) |
| **NHL** | 🟡 Scheduled | 0% (starts Oct) |
| **NCAAF** | 🟡 Scheduled | 0% (starts Aug) |
| **EPL** | 🟡 Scheduled | 0% (starts Aug) |

---

## Commands Reference

```bash
# Start server
npm start

# Development mode (auto-reload)
npm run dev

# Initialize/reset database
npm run init-data

# Run tests
npm test

# Check API health
curl http://localhost:3748/health

# Get current seasons
curl http://localhost:3748/api/tournaments/current
```

---

## Troubleshooting

### nvm not found
```bash
# Add to ~/.bashrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
source ~/.bashrc
```

### Port 3748 in use
```bash
# Change port in server.js or set env var
PORT=3749 npm start
```

### Database errors
```bash
# Reset database
rm data/tournaments.db
npm run init-data
```

---

## Repository

**URL:** https://github.com/oddsifylabs/vic-tour

---

**Last Updated:** June 14, 2026  
**Version:** 1.0.0
