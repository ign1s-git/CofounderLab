// Field validation. Limits mirror InputValidator.java on the backend.
// A rule returns null when the value is fine, otherwise an i18n key from i18n.js ("v.*").

const LIMITS = {
    loginMin: 3, loginMax: 20,
    passwordMin: 8, passwordMax: 64,
    nameMin: 2, nameMax: 30,
    departmentMin: 2, departmentMax: 50,
    emailMax: 64,
    descriptionMin: 10, descriptionMax: 200
};

const RULES = {
    login(value) {
        if (!value) return "v.required";
        if (value.length < LIMITS.loginMin || value.length > LIMITS.loginMax) return "v.loginLength";
        if (!/^[a-zA-Z0-9._]+$/.test(value)) return "v.loginChars";
        return null;
    },
    password(value) {
        if (!value) return "v.required";
        if (value.length < LIMITS.passwordMin) return "v.passwordShort";
        if (value.length > LIMITS.passwordMax) return "v.passwordLong";
        if (/\s/.test(value)) return "v.noSpaces";
        if (!/\p{L}/u.test(value) || !/\d/.test(value)) return "v.passwordMix";
        return null;
    },
    personName(value) {
        if (!value) return "v.required";
        if (value.length < LIMITS.nameMin || value.length > LIMITS.nameMax) return "v.nameLength";
        if (!/^\p{L}[\p{L}\s'‘’`-]*$/u.test(value)) return "v.nameChars";
        return null;
    },
    department(value) {
        if (!value) return "v.required";
        if (value.length < LIMITS.departmentMin || value.length > LIMITS.departmentMax) return "v.departmentLength";
        if (!/^[\p{L}\d][\p{L}\d\s&.,()'‘’`-]*$/u.test(value)) return "v.departmentChars";
        return null;
    },
    year(value) {
        return ["1", "2", "3", "4"].includes(value) ? null : "v.year";
    },

    category(value) {
        return value && CATEGORIES[value] ? null : "v.category";
    },
    description(value) {
        if (!value) return "v.required";
        if (value.length < LIMITS.descriptionMin) return "v.descriptionShort";
        if (value.length > LIMITS.descriptionMax) return "v.descriptionLong";
        return null;
    },
    deadline(value) {
        if (!value) return null;
        const date = new Date(value + "T00:00:00");
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || isNaN(date)) return "v.date";
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today ? "v.datePast" : null;
    },
    required(value) {
        return value ? null : "v.required";
    }
};

// ---------- Contact: Telegram or email ----------
// The contact type is not stored separately: "@name" is Telegram, anything with "@" inside is an email.

function contactTypeOf(value) {
    return value && !value.startsWith("@") && value.includes("@") ? "email" : "telegram";
}

// Brings what people paste into the stored form: "t.me/name" or "name" becomes "@name", emails are lower-cased
function normalizeContact(value, type) {
    value = (value || "").trim();
    if (type === "email") return value.toLowerCase();
    value = value.replace(/^(https?:\/\/)?(www\.)?(t\.me|telegram\.me)\//i, "");
    return value && !value.startsWith("@") ? "@" + value : value;
}

function contactError(value, type) {
    if (!value) return "v.required";
    if (type === "email") {
        return value.length <= LIMITS.emailMax && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? null : "v.email";
    }
    return /^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(value) ? null : "v.telegram";
}

function contactBox(form, name) {
    const input = form.querySelector(`[name="${name}"]`);
    return input && input.closest("[data-contact-field]");
}

// Rule for a contact input; it reads the Telegram / email switch next to the input
function contactRule(form, name) {
    return () => {
        const box = contactBox(form, name);
        const type = box ? box.dataset.type : "telegram";
        return contactError(normalizeContact(form.querySelector(`[name="${name}"]`).value, type), type);
    };
}

// Value to send to the server
function contactValue(form, name) {
    const box = contactBox(form, name);
    return normalizeContact(form.querySelector(`[name="${name}"]`).value, box ? box.dataset.type : "telegram");
}

function setContactType(box, type) {
    box.dataset.type = type;
    const input = box.querySelector("input");
    input.type = type === "email" ? "email" : "text";
    input.placeholder = type === "email" ? "name@mail.com" : "@username";
    input.autocomplete = type === "email" ? "email" : "off";
    input.maxLength = type === "email" ? LIMITS.emailMax : 33;
    box.querySelectorAll("[data-contact-type]").forEach(btn => {
        const active = btn.dataset.contactType === type;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-pressed", active);
    });
}

// Fills a contact input and switches it to the matching type
function setContactValue(form, name, value) {
    const box = contactBox(form, name);
    form.querySelector(`[name="${name}"]`).value = value || "";
    if (box) setContactType(box, contactTypeOf(value));
}

// Turns every [data-contact-field] into a Telegram / email switch plus input
function initContactFields(root = document) {
    root.querySelectorAll("[data-contact-field]").forEach(box => {
        const input = box.querySelector("input");
        const switcher = document.createElement("div");
        switcher.className = "contact-switch";
        switcher.innerHTML = `
            <button type="button" data-contact-type="telegram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.5 4.2 2.9 11.4c-1.3.5-1.3 1.2-.2 1.6l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.4-1.5ZM9.7 14.2l-.4 4.1-1.6-5 9.8-6.2-7.8 7.1Z"/></svg>
                <span data-i18n="contact.telegram">${t("contact.telegram")}</span>
            </button>
            <button type="button" data-contact-type="email">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                <span data-i18n="contact.email">${t("contact.email")}</span>
            </button>`;
        input.before(switcher);
        switcher.addEventListener("click", event => {
            const btn = event.target.closest("[data-contact-type]");
            if (!btn) return;
            setContactType(box, btn.dataset.contactType);
            const form = box.closest("form");
            // Re-check right away if the field was already flagged
            if (form && box.classList.contains("invalid")) input.dispatchEvent(new Event("input", { bubbles: true }));
            input.focus();
        });
        setContactType(box, contactTypeOf(input.value));
    });
}

// Link that opens the contact: a Telegram chat or a new email
function contactLink(value) {
    if (!value) return "—";
    const safe = escapeHtml(value);
    if (contactTypeOf(value) === "email") return `<a href="mailto:${safe}">${safe}</a>`;
    if (/^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(value)) {
        return `<a href="https://t.me/${safe.slice(1)}" target="_blank" rel="noopener">${safe}</a>`;
    }
    return safe;
}

function fieldValue(form, name) {
    const checked = form.querySelector(`[name="${name}"]:checked`);
    if (checked) return checked.value;
    const input = form.querySelector(`[name="${name}"]:not([type="radio"])`);
    if (!input) return "";
    // Passwords are taken as typed, everything else is trimmed
    return input.type === "password" ? input.value : input.value.trim();
}

function fieldBox(form, name) {
    const input = form.querySelector(`[name="${name}"]`);
    return input ? input.closest(".field") : null;
}

function setFieldError(form, name, key) {
    const box = fieldBox(form, name);
    if (!box) return;
    let message = box.querySelector(".field-error");
    box.classList.toggle("invalid", Boolean(key));
    box.querySelectorAll("input, textarea, select").forEach(el => el.setAttribute("aria-invalid", key ? "true" : "false"));
    if (!key) {
        if (message) message.remove();
        return;
    }
    if (!message) {
        message = document.createElement("small");
        message.className = "field-error";
        message.setAttribute("role", "alert");
        box.appendChild(message);
    }
    // data-i18n lets applyTranslations() re-translate the message when the language changes
    message.dataset.i18n = key;
    message.textContent = t(key);
}

// rules: { fieldName: ruleFunction }. Returns true when every field passes.
function validateFields(form, rules) {
    let firstInvalid = null;
    for (const [name, rule] of Object.entries(rules)) {
        const error = rule(fieldValue(form, name));
        setFieldError(form, name, error);
        if (error && !firstInvalid) firstInvalid = form.querySelector(`[name="${name}"]`);
    }
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
}

function clearFieldErrors(form) {
    form.querySelectorAll(".field.invalid").forEach(box => box.classList.remove("invalid"));
    form.querySelectorAll(".field-error").forEach(el => el.remove());
    form.querySelectorAll("[aria-invalid]").forEach(el => el.setAttribute("aria-invalid", "false"));
}

// Checks a field when the user leaves it, then re-checks on every keystroke once it has been flagged.
// getRules is a function so a form can change its rules (sign in vs register).
function attachLiveValidation(form, getRules) {
    const check = (target, onlyIfFlagged) => {
        const name = target.name;
        const rule = name && getRules()[name];
        if (!rule) return;
        const box = fieldBox(form, name);
        if (onlyIfFlagged && !(box && box.classList.contains("invalid"))) return;
        setFieldError(form, name, rule(fieldValue(form, name)));
    };
    form.addEventListener("focusout", event => {
        if (event.target.value !== "" || event.target.type === "radio") check(event.target, false);
    });
    form.addEventListener("input", event => check(event.target, true));
    form.addEventListener("change", event => check(event.target, event.target.type !== "radio"));
}
