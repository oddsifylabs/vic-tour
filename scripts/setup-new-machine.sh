#!/bin/bash
# VIC Tour - Setup Script for New Machine
# Run this on pil_coder1@ccclt01

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         VIC Tour - Setup on New Machine                   ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
echo "→ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "  ✗ Node.js not found. Installing..."
    # Install Node.js 20 via NodeSource
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    NODE_VERSION=$(node -v)
    echo "  ✓ Node.js $NODE_VERSION installed"
fi

# Check npm
echo "→ Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "  ✗ npm not found"
    exit 1
else
    NPM_VERSION=$(npm -v)
    echo "  ✓ npm $NPM_VERSION installed"
fi

# Clone repository
echo ""
echo "→ Cloning repository..."
cd ~/projects
if [ -d "vic-tour" ]; then
    echo "  ✓ vic-tour directory exists"
    cd vic-tour
    git pull origin master
else
    git clone https://github.com/oddsifylabs/vic-tour.git
    cd vic-tour
fi

# Install dependencies
echo ""
echo "→ Installing dependencies..."
npm install

# Initialize database
echo ""
echo "→ Initializing tournament database..."
npm run init-data

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                  Setup Complete!                          ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "To start the server:"
echo "  cd ~/projects/vic-tour"
echo "  npm start"
echo ""
echo "Then open in browser:"
echo "  http://localhost:3748/dashboard"
echo ""
