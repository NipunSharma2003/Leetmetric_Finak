const $ = (sel, el=document) => el.querySelector(sel);
const usernameInput = $('#username');
const goBtn = $('#go');
const loading = $('#loading');
const err = $('#err');

const write = (id, value) => { $(`#${id} [data-value]`).textContent = value ?? '—'; };
const clearStats = () => ['total','easy','medium','hard'].forEach(k => write(k, '—'));

function showError(msg) {
  err.textContent = msg;
  err.classList.add('show');
}
function hideError() { err.classList.remove('show'); err.textContent=''; }

// Proxy wrapper with multiple fallbacks
async function fetchWithProxies(url) {
  const proxies = [
    (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`
  ];

  let lastErr = null;
  for (const makeURL of proxies) {
    try {
      const res = await fetch(makeURL(url), { timeout: 10000 });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("All proxies failed");
}

// normalize data shape from APIs
function normalizeStats(data) {
  if (typeof data?.totalSolved === 'number') {
    return { total: data.totalSolved, easy: data.easySolved, medium: data.mediumSolved, hard: data.hardSolved };
  }
  if (data?.solved) {
    return { total: data.solved.total, easy: data.solved.easy, medium: data.solved.medium, hard: data.solved.hard };
  }
  throw new Error('Unknown API response');
}

async function getStats(username) {
  const endpoints = [
    `https://alfa-leetcode-api.onrender.com/${encodeURIComponent(username)}/solved`,
    `https://leetcode-stats-api.herokuapp.com/${encodeURIComponent(username)}`
  ];
  let lastErr = null;
  for (const url of endpoints) {
    try {
      const data = await fetchWithProxies(url);
      return normalizeStats(data);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("All endpoints failed");
}

async function handleFetch() {
  hideError(); clearStats();
  const username = usernameInput.value.trim();
  if (!username) { showError('Enter a username'); return; }

  goBtn.disabled = true; loading.classList.add('show');
  try {
    const stats = await getStats(username);
    write('total', stats.total);
    write('easy', stats.easy);
    write('medium', stats.medium);
    write('hard', stats.hard);
  } catch (e) {
    console.error(e);
    showError('Could not fetch stats. Check username or try again later.');
  } finally {
    goBtn.disabled = false; loading.classList.remove('show');
  }
}

goBtn.addEventListener('click', handleFetch);
usernameInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleFetch(); });
$('#year').textContent = new Date().getFullYear();
