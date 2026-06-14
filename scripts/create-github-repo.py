#!/usr/bin/env python3
"""
Create GitHub repo and push VIC Tour code - User account version
"""

import subprocess
import json
import urllib.request
import urllib.error

# Read token from file
with open('/home/markusbot/.github_token', 'r') as f:
    TOKEN = f.read().strip()

REPO = "vic-tour"

def get_username():
    """Get authenticated user's username"""
    url = "https://api.github.com/user"
    req = urllib.request.Request(
        url,
        headers={
            'Authorization': f'token {TOKEN}',
            'Accept': 'application/vnd.github.v3+json'
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result.get('login')
    except Exception as e:
        print(f"Error getting username: {e}")
        return None

def create_repo():
    """Create repository via GitHub API (user account)"""
    url = "https://api.github.com/user/repos"
    
    data = json.dumps({
        "name": REPO,
        "description": "VIC Tour - Sports Tournament Intelligence Engine by Oddsify Labs",
        "private": False,
        "auto_init": False
    }).encode('utf-8')
    
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            'Authorization': f'token {TOKEN}',
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            owner = result['owner']['login']
            print(f"✓ Repository created: {owner}/{REPO}")
            print(f"  URL: {result['html_url']}")
            return owner
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        try:
            error_data = json.loads(error_body)
            msg = error_data.get('message', str(e))
        except:
            msg = str(e)
        
        if 'already exists' in msg:
            print(f"✓ Repository already exists")
            return OWNER
        print(f"✗ Error: {msg}")
        return None
    except Exception as e:
        print(f"✗ Error: {e}")
        return None

def push_code(owner):
    """Push code to GitHub"""
    repo_dir = "/home/markusbot/vic-tour"
    
    # Set remote URL with token for authentication
    remote_url = f"https://{TOKEN}@github.com/{owner}/{REPO}.git"
    
    print(f"\n→ Setting remote URL...")
    subprocess.run(f"cd {repo_dir} && git remote set-url origin {remote_url}", 
                   shell=True, capture_output=True)
    
    print("→ Adding new files...")
    subprocess.run(f"cd {repo_dir} && git add -A", 
                   shell=True, capture_output=True)
    
    print("→ Committing...")
    subprocess.run(f"cd {repo_dir} && git commit -m 'VIC Tour v1.0 - Complete app with dashboard' || echo 'No changes'", 
                   shell=True, capture_output=True)
    
    print("→ Pushing to GitHub...")
    result = subprocess.run(f"cd {repo_dir} && git push -u origin master --force", 
                           shell=True, capture_output=True, text=True)
    
    if result.stdout:
        lines = result.stdout.strip().split('\n')
        for line in lines[-5:]:  # Show last 5 lines
            if line.strip():
                print(f"  {line}")
    if result.returncode == 0:
        print("  ✓ Push successful!")
        return True
    else:
        print(f"  ✗ Push failed")
        if result.stderr:
            print(f"  {result.stderr.strip()[:300]}")
        return False

if __name__ == "__main__":
    print("╔═══════════════════════════════════════════════════════════╗")
    print("║     VIC Tour - GitHub Repository Setup                    ║")
    print("╚═══════════════════════════════════════════════════════════╝")
    print()
    print(f"✓ Token loaded")
    print()
    
    # Get username
    username = get_username()
    if not username:
        print("✗ Could not get GitHub username")
        exit(1)
    
    print(f"✓ Authenticated as: {username}")
    print()
    print("Step 1: Creating GitHub repository...")
    
    owner = create_repo()
    if owner:
        print()
        print("Step 2: Pushing code...")
        if push_code(owner):
            print()
            print("═══════════════════════════════════════════════════════════")
            print(f"✓ Complete! Repository URL:")
            print(f"  https://github.com/{owner}/{REPO}")
            print("═══════════════════════════════════════════════════════════")
        else:
            print("✗ Push failed")
    else:
        print()
        print("✗ Repository creation failed")
