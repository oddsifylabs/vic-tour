# ⚠️ Odds API Key Issue

## Current Status

**Provided Key:** `6f46bbb3b2fb69b5e14980a57e9909da`  
**Status:** ❌ **INVALID / EXPIRED**

When we test this key, The Odds API returns an HTML page (their homepage) instead of JSON data, which means:
- The key is expired, OR
- The key was revoked, OR
- The key hit rate limits and was disabled

---

## 🔑 How to Get a Fresh API Key

### Step 1: Sign Up
1. Go to **https://the-odds-api.com**
2. Click **"Get API Key"** or **"Sign Up"**
3. Create a free account

### Step 2: Get Your Key
- **Free Tier:** 500 calls/month (enough for development)
- **Paid Plans:** Start at $29/month for 50,000 calls

### Step 3: Update VIC Tour

#### Option A: Local Development
Edit `server/services/odds-service.js`:
```javascript
const ODDS_API_KEY=proces..._KEY || 'YOUR_NEW_KEY_HERE';
```

#### Option B: Railway Production
1. Go to Railway dashboard
2. Select `vic-tour` project
3. Go to **Variables** tab
4. Add/Update: `ODDS_API_KEY=YOUR_NEW_KEY_HERE`
5. Redeploy

#### Option C: Dashboard Fallback
Edit `dashboard.html` line 685:
```javascript
const ODDS_API_KEY='YOUR_NEW_KEY_HERE';
```

---

## ✅ Current Setup (Mock Data)

Until you get a fresh key, the dashboard uses **mock data**:

```javascript
const USE_MOCK_DATA = true; // Default fallback
```

**Mock data includes:**
- ⚾ MLB: Yankees vs Red Sox
- 🏈 NFL: Chiefs vs Bills (preseason example)
- 🏀 NBA: Lakers vs Celtics
- ⚽ EPL: Man City vs Arsenal

---

## 🧪 Test Your New Key

Once you have a new key, test it:

```bash
curl "https://the-odds-api.com/api/v4/sports?apiKey=YOUR_NEW_KEY"
```

**Good response:** JSON array of sports  
**Bad response:** HTML page (key invalid)

---

## 📊 API Usage in VIC Tour

### Current Implementation
```javascript
// Backend proxy (avoids CORS)
GET /api/odds/vic/nfl
  → Server calls The Odds API
  → Returns odds to frontend
```

### Calls Per Minute
- Dashboard loads: ~3-5 API calls
- Auto-refresh (60s): ~3-5 more calls
- **Hourly:** ~180-300 calls
- **Daily:** ~4,000-7,000 calls

**Recommendation:** Start with free tier, upgrade if needed

---

## 🚀 After Updating Key

1. Set `USE_MOCK_DATA = false` in `dashboard.html`
2. Restart server (or Railway auto-redeploys)
3. Refresh dashboard
4. You should see **real odds** from The Odds API!

---

## 📞 Support

If you need help:
- The Odds API docs: https://the-odds-api.com/quickstart
- VIC Tour issues: https://github.com/oddsifylabs/vic-tour/issues

---

**Current Status:** ✅ Dashboard works with mock data  
**Next Step:** 🔑 Get fresh API key for live odds
