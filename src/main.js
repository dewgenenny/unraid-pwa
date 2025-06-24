// Register service worker for offline capabilities
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(console.error);
    });
}

// Helpers for persisting connection settings and communicating with the Unraid GraphQL interface
export function getSettings() {
    if (typeof localStorage === 'undefined') return { host: '', token: '', allowSelfSigned: false };
    return {
        host: localStorage.getItem('unraidHost') || '',
        token: localStorage.getItem('unraidToken') || '',
        allowSelfSigned: localStorage.getItem('unraidAllowSelfSigned') === 'true'
    };
}

export function setSettings({ host, token, allowSelfSigned }) {
    if (typeof localStorage === 'undefined') return;
    if (host !== undefined) localStorage.setItem('unraidHost', host);
    if (token !== undefined) localStorage.setItem('unraidToken', token);
    if (allowSelfSigned !== undefined) localStorage.setItem('unraidAllowSelfSigned', String(allowSelfSigned));
}

export async function fetchUnraidData(query, fetchFn = fetch) {
    const { host, token, allowSelfSigned } = getSettings();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const options = {
        method: 'POST',
        headers,
        body: JSON.stringify({ query })
    };
    if (allowSelfSigned && typeof window === 'undefined') {
        const { Agent } = await import('https');
        options.agent = new Agent({ rejectUnauthorized: false });
    }
    const response = await fetchFn(`${host}/graphql`, options);
    return response.json();
}

// Simple UI wiring to load settings and display basic info
function updateInfo() {
    const el = document.getElementById('info');
    if (!el) return;
    fetchUnraidData('query { vars { version } }')
        .then(data => {
            el.textContent = JSON.stringify(data, null, 2);
        })
        .catch(err => {
            el.textContent = err.message;
        });
}

if (typeof document !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        const { host, token, allowSelfSigned } = getSettings();
        const hostInput = document.getElementById('host');
        const tokenInput = document.getElementById('token');
        const allowSelfSignedInput = document.getElementById('allowSelfSigned');
        if (hostInput) hostInput.value = host;
        if (tokenInput) tokenInput.value = token;
        if (allowSelfSignedInput) allowSelfSignedInput.checked = allowSelfSigned;
        const saveBtn = document.getElementById('saveSettings');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                setSettings({ host: hostInput.value, token: tokenInput.value, allowSelfSigned: allowSelfSignedInput.checked });
                updateInfo();
            });
        }
        updateInfo();
    });
}
