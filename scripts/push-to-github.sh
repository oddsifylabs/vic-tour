#!/bin/bash
# Create GitHub repo and push

# Extract token from credentials
TOKEN=$(cat /home/markusbot/.git-credentials | sed 's|https://||; s|@github.com||')

# Create repository via API
echo "Creating repository vic-tour..."
RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d '{"name":"vic-tour","description":"VIC Tour - Sports Tournament Intelligence Engine by Oddsify Labs","private":false,"auto_init":false}')

echo "$RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if 'full_name' in data:
        print(f\"✓ Repository created: {data['full_name']}\")
        print(f\"  URL: {data['html_url']}\")
    else:
        print(f\"✗ Error: {data.get('message', 'Unknown error')}\")
except:
    print('Response:', data)
"

# Set remote and push
cd /home/markusbot/vic-tour
git remote set-url origin https://github.com/markusbot/vic-tour.git 2>/dev/null || git remote add origin https://github.com/markusbot/vic-tour.git

echo ""
echo "Pushing to GitHub..."
git push -u origin master
