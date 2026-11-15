// Shared helpers: token storage, API calls, category metadata

const TOKEN_KEY = "cofounderlab_token";

function getToken() {
    try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; }
}

function setToken(token) {
    try { localStorage.setItem(TOKEN_KEY, token); } catch (e) { /* storage unavailable */ }
}

function clearToken() {
    try { localStorage.removeItem(TOKEN_KEY); } catch (e) { /* storage unavailable */ }
}

class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

// Spring hides exception messages by default, so the text comes from the status code
const KNOWN_STATUSES = [400, 401, 403, 404, 409];

async function api(path, options = {}) {
    const headers = { "Content-Type": "application/json" };
    const token = getToken();
    if (token) headers["Authorization"] = "Bearer " + token;

    const response = await fetch(path, {
        method: options.method || "GET",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
    });

    if (!response.ok) {
        throw new ApiError(response.status, t(KNOWN_STATUSES.includes(response.status) ? "err." + response.status : "err.generic"));
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

// Keys match the AdTitle enum on the backend; labels live in i18n.js as cat.<KEY>
const CATEGORIES = {
    STARTUP: {
        icon: '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M9 12a12 12 0 0 1 11-9 12 12 0 0 1-9 11l-2-2Z"/><path d="M9 12H5l2-4h4M12 15v4l4-2v-4"/>'
    },
    HACKATHON: {
        icon: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>'
    },
    PROJECT: {
        icon: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>'
    },
    COMPETITION: {
        icon: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>'
    },
    OTHER: {
        icon: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>'
    }
};

function catLabel(key) {
    return t("cat." + key);
}

function catHint(key) {
    return t("cat." + key + ".hint");
}

function categoryIcon(key, size = 18) {
    const c = CATEGORIES[key] || CATEGORIES.OTHER;
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${c.icon}</svg>`;
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => (
        { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
    ));
}

function initials(student) {
    if (!student) return "?";
    return ((student.name || "")[0] || "") + ((student.surname || "")[0] || "");
}

// Returns { text, urgent, past } for a "YYYY-MM-DD" deadline
function deadlineInfo(deadline) {
    if (!deadline) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(deadline + "T00:00:00");
    const days = Math.round((date - today) / 86400000);
    if (days < 0) return { text: t("dl.past", { date: formatDate(date) }), past: true };
    if (days === 0) return { text: t("dl.today"), urgent: true };
    if (days <= 7) return { text: t("dl.left", { n: days, days: daysWord(days) }), urgent: true };
    return { text: t("dl.until", { date: formatDate(date) }) };
}
