# VIC Tour - Installation Commands for Remote Computer

**Issue:** Node.js v25.9.0 requires C++20 compiler support for better-sqlite3

---

## ✅ Solution 1: Use Node.js LTS (Recommended)

Node.js v25 is bleeding-edge. Use LTS version (v20 or v22) instead:

```bash
# Remove current Node.js (if installed via nvm)
nvm uninstall 25

# Install LTS version
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version  # Should show v20.x.x

# Now install VIC Tour
cd ~/projects
rm -rf vic-tour
git clone https://github.com/oddsifylabs/vic-tour.git
cd vic-tour
npm install
npm run init-data
npm start
```

---

## ✅ Solution 2: Force C++20 Compiler Flags

If you must use Node.js v25, add C++20 flags:

```bash
cd ~/projects/vic-tour

# Set C++20 flags for node-gyp
export CXXFLAGS="--std=c++20"
export CXX=g++

# Clean and reinstall
rm -rf node_modules
npm cache clean --force
npm install

# Start
npm run init-data
npm start
```

---

## ✅ Solution 3: Use SQLite Alternative (No Native Compile)

Replace better-sqlite3 with sql.js (pure JavaScript):

**On your local computer (where VIC Tour repo is):**

```bash
cd /home/markusbot/vic-tour

# Update package.json to use sql.js instead
npm uninstall better-sqlite3
npm install sql.js

# Update server/services/tournament-service.js to use sql.js
# (Requires code changes - I can do this if needed)

# Commit and push
git add -A
git commit -m 'Switch to sql.js for cross-platform compatibility'
git push

# Then on remote computer:
cd ~/projects/vic-tour
git pull
npm install
npm start
```

---

## 📋 Full Installation Script (Solution 1 - Recommended)

Copy/paste this entire block on the remote computer:

```bash
#!/bin/bash
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         VIC Tour - Installation Script                    ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if nvm is installed
if command -v nvm &> /dev/null; then
    echo "✓ nvm found"
    nvm install 20
    nvm use 20
    nvm alias default 20
else
    echo "✗ nvm not found - installing..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 20
    nvm use 20
fi

echo ""
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""

# Clone and install
cd ~/projects
rm -rf vic-tour
git clone https://github.com/oddsifylabs/vic-tour.git
cd vic-tour

echo "Installing dependencies..."
npm install

echo "Initializing database..."
npm run init-data

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║              VIC Tour Installed Successfully!             ║"
echo "╠═══════════════════════════════════════════════════════════╣"
echo "║  Start server: npm start                                  ║"
echo "║  Dashboard: http://localhost:3748/dashboard               ║"
echo "╚═══════════════════════════════════════════════════════════╝"
```

---

## 🔍 Check Current Setup

Run this to diagnose:

```bash
# Check Node.js version
node --version

# Check compiler
g++ --version

# Check if build tools are installed
which make
which python3
```

---

## 🎯 Recommended: Use Solution 1

**Node.js LTS (v20.x)** is stable and works perfectly with better-sqlite3 without any compiler issues.

---

**After running the fix, the server will start on port 3748 and you can access:**
- Dashboard: http://localhost:3748/dashboard
- API: http://localhost:3748/api
