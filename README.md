# LeetMetric

LeetMetric is a lightweight web app (HTML, CSS, JS) that shows a LeetCode-style user summary: total solved questions and breakdown by difficulty (Easy / Medium / Hard) along with percentages. The app fetches data from a simple API by username and renders a clean, mobile-friendly dashboard.

---

## Features

* Enter a username and fetch solved problem counts.
* Shows total solved, count for Easy / Medium / Hard, and percent contribution for each difficulty.
* Simple UI built with plain HTML, CSS (flexbox), and vanilla JavaScript (fetch API).
* Minimal dependencies — easy to host on GitHub Pages or any static host.

---

## Demo

> Enter a username and click **Get Stats** — the dashboard updates with counts and percentages.

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/leetmetric.git
cd leetmetric
```

### 2. Install (optional)

No build step required. If you want to run a local HTTP server for testing, you can use `http-server` or Python's http server:

```bash
# using python3
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

### 3. Open in browser

Open `index.html` in your browser or visit the local server address.

---

## File structure

```
leetmetric/
├─ index.html          # main UI
├─ styles.css          # styling
├─ script.js           # fetch + render logic
├─ api/                # example/mock API (optional)
│  └─ user-stats.json  # example response
└─ README.md           # this file
```

---

## API

LeetMetric expects a simple API endpoint that returns JSON in the following shape:

```json
{
  "username": "alice",
  "totalSolved": 123,
  "breakdown": {
    "easy": 60,
    "medium": 50,
    "hard": 13
  }
}
```

### Using a mock API

For quick local testing, you can store the example JSON above as `api/user-stats.json` and fetch it from `script.js`.

### Implementing your own backend

If you want to create a real API that gathers LeetCode stats, the backend should:

* Accept `GET /stats?username=<username>` (or similar)
* Return the JSON structure described above

You can implement the backend in any language (Node.js, Python/Flask, Go, etc.). If you prefer, the frontend can also call a third-party service or a serverless function.

---

## Frontend: How it works

* `index.html` contains an input for the username and a `Get Stats` button.
* `script.js` listens for the button click, calls the API, and renders the results into the dashboard.
* Percentages are calculated in the frontend as: `(count / totalSolved * 100)` and rounded to one decimal place.

---

## UI/UX notes

* Keep the layout responsive using flexbox and simple media queries.
* Provide a loading state and handle API errors gracefully (user not found, network error).
* Show friendly messages when `totalSolved` is 0 or when the username returns no data.

---

## Example `script.js` (minimal)

```js
async function getStats(username) {
  const res = await fetch(`/api/stats?username=${encodeURIComponent(username)}`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}

function renderStats(data) {
  const total = data.totalSolved || 0;
  const easy = data.breakdown.easy || 0;
  const medium = data.breakdown.medium || 0;
  const hard = data.breakdown.hard || 0;

  const pct = v => (total === 0 ? 0 : Math.round((v / total) * 1000) / 10);

  document.getElementById('total').textContent = total;
  document.getElementById('easy-count').textContent = easy + ` (${pct(easy)}%)`;
  document.getElementById('medium-count').textContent = medium + ` (${pct(medium)}%)`;
  document.getElementById('hard-count').textContent = hard + ` (${pct(hard)}%)`;
}

// wire up button
document.getElementById('fetch-btn').addEventListener('click', async () => {
  const username = document.getElementById('username').value.trim();
  if (!username) return alert('Enter a username');
  try {
    // show loading state
    const data = await getStats(username);
    renderStats(data);
  } catch (err) {
    console.error(err);
    alert('Could not fetch stats.');
  }
});
```

---

## Example `index.html` (structure)

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>LeetMetric</title>
    <link
```
