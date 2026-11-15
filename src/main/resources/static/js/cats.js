// Memes shown next to texts, buttons and empty states.
// Each slot is an image in /img/memes/ plus an optional caption (an i18n key, so it follows the language switch).
// cutout: true marks a PNG with a transparent background, shown without the photo frame.
// To change a meme, replace the file. A missing image hides the whole slot.

const MEMES = {
    login:         { file: "login.jpg",          caption: "meme.login" },
    register:      { file: "register.png",       caption: "meme.register", cutout: true },
    wrongPassword: { file: "wrong-password.jpg", caption: "meme.wrongPassword" },
    home:          { file: "home.jpg",           caption: "meme.home" },
    my:            { file: "my.jpg",             caption: "meme.my" },
    empty:         { file: "empty.png",          caption: "meme.empty", cutout: true },
    myEmpty:       { file: "my-empty.png",       caption: "meme.myEmpty", cutout: true },
    profile:       { file: "profile.png",        caption: "meme.profile", cutout: true },
    newAd:         { file: "new-ad.jpg",         caption: "meme.newAd" },
    peek:          { file: "peek.png",           cutout: true },
    noResults:     { file: "mind-blown.png",     caption: "meme.noResults", cutout: true },
    deleteConfirm: { file: "stop.png",           caption: "meme.deleteConfirm", cutout: true },
    writeThem:     { file: "pop-open.jpg",       caption: "meme.writeThem" },
    bye:           { file: "bye.jpg",            caption: "meme.bye" },
    suspicious:    { file: "suspicious.jpg",     caption: "meme.suspicious" },
    broken:        { file: "aaaa.jpg",           caption: "meme.broken" },

    // Small pictures inside toasts, the toast text is their caption
    published:     { file: "happy.jpg" },
    updated:       { file: "pop.jpg" },
    copied:        { file: "wink.jpg" },
    saved:         { file: "polite.jpg" },

    // Classic meme templates with captions drawn in; {lang} is replaced with ru / en / uz
    fine:          { file: "tpl/fine.{lang}.jpg", template: true },
    drake:         { file: "tpl/drake.{lang}.jpg", template: true },
    buttons:       { file: "tpl/buttons.{lang}.jpg", template: true },
    distracted:    { file: "tpl/distracted.{lang}.jpg", template: true },
    handshake:     { file: "tpl/handshake.{lang}.jpg", template: true },
    brain:         { file: "tpl/brain.{lang}.jpg", template: true },
    mind:          { file: "tpl/mind.{lang}.jpg", template: true },
    pigeon:        { file: "tpl/pigeon.{lang}.jpg", template: true },
    yelling:       { file: "tpl/yelling.{lang}.jpg", template: true }
};

// Rotation for the "Meme of the day" block
const MEME_OF_DAY = ["drake", "distracted", "buttons", "handshake", "brain", "pigeon", "yelling", "mind", "fine"];

function memeSrc(meme) {
    return "/img/memes/" + meme.file.replace("{lang}", currentLang);
}

// Loads every meme once, up front, so a meme shows up together with its text instead of popping in later
let memePreload = [];
function preloadMemes() {
    memePreload = Object.values(MEMES).map(meme => {
        const img = new Image();
        img.src = memeSrc(meme);
        return img;
    });
}
preloadMemes();

function memeHtml(slot, className = "") {
    const meme = MEMES[slot];
    if (!meme) return "";
    const caption = meme.caption
        ? `<figcaption class="bubble" data-i18n="${meme.caption}">${t(meme.caption)}</figcaption>`
        : "";
    return `
        <figure class="meme ${meme.cutout ? "cutout" : ""} ${meme.template ? "template" : ""} ${className}">
            <div class="meme-photo">
                <img src="${memeSrc(meme)}" alt="" decoding="sync" onerror="this.closest('.meme').remove()">
            </div>
            ${caption}
        </figure>`;
}

// Fills every [data-meme="slot"] element on the page
function renderMemes(root = document) {
    root.querySelectorAll("[data-meme]").forEach(el => el.innerHTML = memeHtml(el.dataset.meme));
}

// "Meme of the day": a big template meme with a button that shows the next one
function renderMemeDay(box) {
    const index = Number(box.dataset.index);
    box.innerHTML = `
        <div class="meme-day-head">
            <h3>${t("memeDay.title")}</h3>
            <button type="button" class="btn btn-line" data-next-meme>${t("memeDay.next")}</button>
        </div>
        <img src="${memeSrc(MEMES[MEME_OF_DAY[index]])}" alt="">`;
}

function initMemeDays() {
    // Starts at a different meme each day
    const start = Math.floor(Date.now() / 86400000) % MEME_OF_DAY.length;
    document.querySelectorAll("[data-meme-day]").forEach((box, i) => {
        box.dataset.index = (start + i * 3) % MEME_OF_DAY.length;
        renderMemeDay(box);
        box.addEventListener("click", event => {
            if (!event.target.closest("[data-next-meme]")) return;
            box.dataset.index = (Number(box.dataset.index) + 1) % MEME_OF_DAY.length;
            renderMemeDay(box);
        });
    });
}

// Template memes have text in the picture, so they are swapped when the language changes
onLangChange(() => {
    preloadMemes();
    document.querySelectorAll("[data-meme-day]").forEach(renderMemeDay);
});
