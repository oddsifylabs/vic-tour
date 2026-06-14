#!/bin/bash
# VIC Tour - GitHub Push Script
# Run this to create repo and push code

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         VIC Tour - GitHub Repository Setup                ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

cd /home/markusbot/vic-tour

# Check if remote exists
if ! git remote get-url origin &>/dev/null; then
  echo "✓ Adding remote origin..."
  git remote add origin https://github.com/markusbot/vic-tour.git
else
  echo "✓ Remote origin already configured"
fi

echo ""
echo "📦 Repository is ready to push!"
echo ""
echo "Next steps:"
echo "1. Create repository on GitHub:"
echo "   https://github.com/new"
echo "   - Name: vic-tour"
echo "   - Description: VIC Tour - Sports Tournament Intelligence Engine"
echo "   - Visibility: Public"
echo "   - DO NOT initialize with README (we have local files)"
echo ""
echo "2. After creating, run:"
echo "   git push -u origin master"
echo ""
echo "Or use GitHub CLI if authenticated:"
echo "   gh repo create markusbot/vic-tour --public --source=. --remote=origin --push"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Repository URL will be:"
echo "https://github.com/markusbot/vic-tour"
echo "═══════════════════════════════════════════════════════════"
