const API_BASE = window.API_BASE;

const categoryIcons = {
  Food: '🍔', Transport: '🚗', Shopping: '🛍️',
  Bills: '📄', Health: '💊', Entertainment: '🎮', Other: '📦'
};

const categoryColors = {
  Food: '#ff9f43', Transport: '#54a0ff', Shopping: '#ff6b9d',
  Bills: '#ffd32a', Health: '#00d2d3', Entertainment: '#a29bfe', Other: '#636e72'
};

// ==========================================
//  TOKEN HELPERS
// ==========================================
function getToken() { return localStorage.getItem('jwt_token'); }
function setToken(t) { localStorage.setItem('jwt_token', t); }
function removeToken() { localStorage.removeItem('jwt_token'); }

// Auth headers for every protected request
function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getToken()
  };
}

// ==========================================
//  AUTH — LOGIN / REGISTER / LOGOUT
// ==========================================
function showLogin() {
  document.getElementById('loginPage').classList.add('active');
  document.getElementById('registerPage').classList.remove('active');
}

function showRegister() {
  document.getElementById('registerPage').classList.add('active');
  document.getElementById('loginPage').classList.remove('active');
}

async function login() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const msg = document.getElementById('loginMsg');

  if (!username || !password) {
    msg.textContent = '⚠️ Please enter username and password.';
    msg.className = 'form-msg error'; return;
  }

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const token = await res.text();

    if (res.ok && token && token.length > 10) {
      setToken(token);
      showApp();
    } else {
      msg.textContent = '❌ Invalid username or password.';
      msg.className = 'form-msg error';
    }
  } catch (e) {
    msg.textContent = '❌ Cannot connect to server.';
    msg.className = 'form-msg error';
  }
}

async function register() {
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const msg = document.getElementById('registerMsg');

  if (!username || !password) {
    msg.textContent = '⚠️ Please fill in all fields.';
    msg.className = 'form-msg error'; return;
  }

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      msg.textContent = '✅ Account created! Please sign in.';
      msg.className = 'form-msg success';
      setTimeout(() => {
        showLogin();
        document.getElementById('loginUsername').value = username;
      }, 1500);
    } else {
      msg.textContent = '❌ Registration failed. Try a different username.';
      msg.className = 'form-msg error';
    }
  } catch (e) {
    msg.textContent = '❌ Cannot connect to server.';
    msg.className = 'form-msg error';
  }
}

function logout() {
  removeToken();
  document.getElementById('appContainer').classList.add('hidden');
  document.getElementById('authContainer').classList.remove('hidden');
  showLogin();
  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
}

function showApp() {
  document.getElementById('authContainer').classList.add('hidden');
  document.getElementById('appContainer').classList.remove('hidden');
  document.getElementById('expDate').value = new Date().toISOString().split('T')[0];
  loadDashboard();
}

// Check token expiry (JWT exp claim)
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch { return true; }
}

// ==========================================
//  NAVIGATION
// ==========================================
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  const map = { dashboard: 0, add: 1, history: 2 };
  document.querySelectorAll('.nav-btn')[map[id]].classList.add('active');
  if (id === 'dashboard') loadDashboard();
  if (id === 'history') loadHistory();
}

// ==========================================
//  API HELPER (handles 401 auto logout)
// ==========================================
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) }
  });

  if (res.status === 401 || res.status === 403) {
    removeToken();
    logout();
    throw new Error('Session expired. Please login again.');
  }
  return res;
}

// ==========================================
//  DASHBOARD
// ==========================================
async function loadDashboard() {
  try {
    const res = await apiFetch(`${API_BASE}/expenses`);
    const expenses = await res.json();

    if (!Array.isArray(expenses)) { console.error('Not an array:', expenses); return; }

    const total = expenses.reduce((s, e) => s + e.amount, 0);
    document.getElementById('totalSpent').textContent = '₹' + total.toLocaleString('en-IN', { minimumFractionDigits: 2 });

    const now = new Date();
    const month = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthTotal = month.reduce((s, e) => s + e.amount, 0);
    document.getElementById('monthSpent').textContent = '₹' + monthTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 });

    const catMap = {};
    expenses.forEach(e => catMap[e.category] = (catMap[e.category] || 0) + e.amount);
    const top = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('topCategory').textContent = top ? categoryIcons[top[0]] + ' ' + top[0] : '—';

    renderChart(catMap);
    const recent = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    renderList('recentList', recent, false);
  } catch (err) {
    console.error('Dashboard error:', err.message);
  }
}

function renderChart(catMap) {
  const container = document.getElementById('chartBars');
  if (!Object.keys(catMap).length) {
    container.innerHTML = '<p class="empty-msg">No data yet. Add expenses!</p>'; return;
  }
  const max = Math.max(...Object.values(catMap));
  container.innerHTML = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => `
      <div class="bar-row">
        <span class="bar-label">${categoryIcons[cat] || '📦'} ${cat}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${(amt/max*100).toFixed(1)}%;background:${categoryColors[cat]||'#636e72'}"></div></div>
        <span class="bar-amount">₹${amt.toLocaleString('en-IN')}</span>
      </div>`).join('');
}

function renderList(elementId, expenses, showDelete = true) {
  const el = document.getElementById(elementId);
  if (!expenses.length) { el.innerHTML = '<li class="empty-msg">No transactions found.</li>'; return; }
  el.innerHTML = expenses.map(e => `
    <li class="txn-item">
      <div class="txn-icon">${categoryIcons[e.category] || '📦'}</div>
      <div class="txn-info">
        <div class="txn-title">${escHtml(e.title)}</div>
        <div class="txn-meta">${e.category} · ${formatDate(e.date)}${e.notes ? ' · ' + escHtml(e.notes) : ''}</div>
      </div>
      <div class="txn-amount">₹${e.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
      ${showDelete ? `<button class="txn-delete" onclick="deleteExpense(${e.id})" title="Delete">✕</button>` : ''}
    </li>`).join('');
}

// ==========================================
//  ADD EXPENSE
// ==========================================
async function addExpense() {
  const title    = document.getElementById('expTitle').value.trim();
  const amount   = parseFloat(document.getElementById('expAmount').value);
  const category = document.getElementById('expCategory').value;
  const date     = document.getElementById('expDate').value;
  const notes    = document.getElementById('expNotes').value.trim();
  const msg      = document.getElementById('formMsg');

  if (!title || isNaN(amount) || amount <= 0 || !date) {
    msg.textContent = '⚠️ Please fill in all required fields.';
    msg.className = 'form-msg error'; return;
  }

  try {
    const res = await apiFetch(`${API_BASE}/expenses`, {
      method: 'POST',
      body: JSON.stringify({ title, amount, category, date, notes })
    });

    if (res.ok) {
      msg.textContent = '✅ Expense saved successfully!';
      msg.className = 'form-msg success';
      document.getElementById('expTitle').value = '';
      document.getElementById('expAmount').value = '';
      document.getElementById('expNotes').value = '';
      setTimeout(() => { msg.textContent = ''; }, 3000);
    } else {
      msg.textContent = '❌ Failed to save expense.';
      msg.className = 'form-msg error';
    }
  } catch (e) {
    msg.textContent = '❌ ' + e.message;
    msg.className = 'form-msg error';
  }
}

// ==========================================
//  HISTORY
// ==========================================
async function loadHistory() {
  try {
    const res = await apiFetch(`${API_BASE}/expenses`);
    let expenses = await res.json();
    if (!Array.isArray(expenses)) return;

    const category = document.getElementById('filterCategory').value;
    const month    = document.getElementById('filterMonth').value;

    if (category) expenses = expenses.filter(e => e.category === category);
    if (month) {
      const [y, m] = month.split('-');
      expenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() == y && (d.getMonth() + 1) == parseInt(m);
      });
    }

    const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    renderList('historyList', sorted, true);

    const total = expenses.reduce((s, e) => s + e.amount, 0);
    document.getElementById('historyTotal').textContent = '₹' + total.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  } catch (err) {
    console.error('History error:', err.message);
  }
}

// ==========================================
//  DELETE
// ==========================================
async function deleteExpense(id) {
  if (!confirm('Delete this expense?')) return;
  try {
    await apiFetch(`${API_BASE}/expenses/${id}`, { method: 'DELETE' });
    loadHistory();
  } catch (err) {
    alert('Could not delete: ' + err.message);
  }
}

// ==========================================
//  UTILS
// ==========================================
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ==========================================
//  INIT — check token on page load
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const token = getToken();
  if (token && !isTokenExpired(token)) {
    showApp();
  } else {
    removeToken();
    document.getElementById('authContainer').classList.remove('hidden');
  }
});
