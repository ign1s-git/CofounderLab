// Tests for the site's JavaScript (src/main/resources/static/js).
// Run from the project folder: node --test src/test/js/frontend.test.mjs
//
// The browser scripts are plain <script> files that share globals, so they are loaded
// into one sandbox in the same order as in the HTML pages.

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const STATIC = join(dirname(fileURLToPath(import.meta.url)), "../../main/resources/static");
const read = file => readFileSync(join(STATIC, file), "utf8");

function loadSite(lang = "ru") {
    const storage = new Map([["cofounderlab_lang", lang]]);
    const sandbox = {
        localStorage: {
            getItem: key => storage.get(key) ?? null,
            setItem: (key, value) => storage.set(key, String(value)),
            removeItem: key => storage.delete(key)
        },
        navigator: { language: lang },
        document: { documentElement: {}, querySelectorAll: () => [] },
        Image: class { },
        Intl,
        console
    };
    vm.createContext(sandbox);
    for (const file of ["js/i18n.js", "js/cats.js", "js/validate.js", "js/api.js"]) {
        vm.runInContext(read(file), sandbox, { filename: file });
    }
    return expression => vm.runInContext(expression, sandbox);
}

const site = loadSite();
const RULES = site("RULES");

describe("field rules match the server (InputValidator.java)", () => {
    test("login", () => {
        for (const ok of ["aziza", "aziza.h", "iza_2026", "abc", "a2345678901234567890"]) {
            assert.equal(RULES.login(ok), null, ok);
        }
        for (const bad of ["", "ab", "a23456789012345678901", "азиза", "aziza hasanova", "aziza!", "aziza@mail"]) {
            assert.notEqual(RULES.login(bad), null, bad);
        }
    });

    test("password", () => {
        for (const ok of ["secret123", "Пароль2026", "abcdefg1"]) assert.equal(RULES.password(ok), null, ok);
        assert.equal(RULES.password("abc1234"), "v.passwordShort");
        assert.equal(RULES.password("a1".repeat(33)), "v.passwordLong");
        assert.equal(RULES.password("abcdefgh"), "v.passwordMix");
        assert.equal(RULES.password("12345678"), "v.passwordMix");
        assert.equal(RULES.password("secret 123"), "v.noSpaces");
        assert.equal(RULES.password(""), "v.required");
    });

    test("names in different alphabets", () => {
        for (const ok of ["Азиза", "O‘tkir-Bek", "Gʻayrat", "Anne-Marie", "Ji Hoon", "김민준"]) {
            assert.equal(RULES.personName(ok), null, ok);
        }
        for (const bad of ["A", "Iza1", "-Iza", "Iza!", ""]) assert.notEqual(RULES.personName(bad), null, bad);
    });

    test("department and year", () => {
        assert.equal(RULES.department("Computer Science"), null);
        assert.notEqual(RULES.department("D".repeat(51)), null);
        for (const year of ["1", "2", "3", "4"]) assert.equal(RULES.year(year), null);
        for (const year of ["0", "5", ""]) assert.equal(RULES.year(year), "v.year");
    });

    test("ad description and deadline", () => {
        assert.equal(RULES.description("Ищу дизайнера в команду"), null);
        assert.equal(RULES.description("short"), "v.descriptionShort");
        assert.equal(RULES.description("x".repeat(201)), "v.descriptionLong");
        assert.equal(RULES.deadline(""), null, "a deadline is optional");
        assert.equal(RULES.deadline("2020-01-01"), "v.datePast");
        assert.equal(RULES.deadline("2999-12-31"), null);
        assert.equal(RULES.deadline("31.12.2999"), "v.date");
    });

    test("category", () => {
        for (const key of ["STARTUP", "HACKATHON", "PROJECT", "COMPETITION", "OTHER"]) {
            assert.equal(RULES.category(key), null, key);
        }
        assert.equal(RULES.category("SPORT"), "v.category");
        assert.equal(RULES.category(""), "v.category");
    });
});

describe("contact: Telegram or email", () => {
    const normalize = site("normalizeContact");
    const error = site("contactError");
    const typeOf = site("contactTypeOf");

    test("Telegram input is turned into @username", () => {
        assert.equal(normalize("aziza_dev", "telegram"), "@aziza_dev");
        assert.equal(normalize("t.me/aziza_dev", "telegram"), "@aziza_dev");
        assert.equal(normalize("https://t.me/aziza_dev", "telegram"), "@aziza_dev");
        assert.equal(normalize("  @aziza_dev ", "telegram"), "@aziza_dev");
    });

    test("emails are lower-cased", () => {
        assert.equal(normalize(" Aziza@Gmail.com ", "email"), "aziza@gmail.com");
    });

    test("same contact rules as the server", () => {
        for (const ok of ["@aziza_dev", "@abcde"]) assert.equal(error(ok, "telegram"), null, ok);
        for (const bad of ["", "@abcd", "@1abcde", "@aziza-dev", "@abbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"]) {
            assert.notEqual(error(bad, "telegram"), null, bad);
        }
        for (const ok of ["aziza.hasanova.student@gmail.com", "a@b.co"]) assert.equal(error(ok, "email"), null, ok);
        for (const bad of ["aziza@gmail", "hello", "a".repeat(60) + "@mail.com"]) {
            assert.notEqual(error(bad, "email"), null, bad);
        }
    });

    test("the type is read from the stored value", () => {
        assert.equal(typeOf("@aziza_dev"), "telegram");
        assert.equal(typeOf("aziza@gmail.com"), "email");
        assert.equal(typeOf(""), "telegram");
    });
});

describe("translations", () => {
    const TRANSLATIONS = site("TRANSLATIONS");
    const languages = Object.keys(TRANSLATIONS);

    test("there are exactly Russian, English and Uzbek", () => {
        assert.deepEqual(languages.sort(), ["en", "ru", "uz"]);
    });

    test("every language has the same keys and no empty texts", () => {
        const ruKeys = Object.keys(TRANSLATIONS.ru).sort();
        for (const lang of languages) {
            assert.deepEqual(Object.keys(TRANSLATIONS[lang]).sort(), ruKeys, lang);
            for (const [key, text] of Object.entries(TRANSLATIONS[lang])) {
                assert.ok(String(text).trim(), `${lang}: ${key} is empty`);
            }
        }
    });

    test("every key used by the pages exists", () => {
        const sources = ["index.html", "home.html", "js/api.js", "js/validate.js", "js/cats.js"].map(read).join("\n");
        const used = new Set();
        for (const m of sources.matchAll(/data-i18n(?:-html|-placeholder|-aria|-title)?="([^"$]+)"/g)) used.add(m[1]);
        // Only whole keys: t("cat." + key) is built at runtime and checked in the categories test below
        for (const m of sources.matchAll(/\bt\("([^"]+)"\s*[,)]/g)) used.add(m[1]);
        for (const m of sources.matchAll(/return "(v\.[A-Za-z]+)"/g)) used.add(m[1]);
        for (const m of sources.matchAll(/caption: "([^"]+)"/g)) used.add(m[1]);
        assert.ok(used.size > 50, "the scan found the keys");
        const missing = [...used].filter(key => !(key in TRANSLATIONS.ru));
        assert.deepEqual(missing, []);
    });

    test("every category has a name and a hint", () => {
        for (const key of Object.keys(site("CATEGORIES"))) {
            assert.ok(TRANSLATIONS.ru["cat." + key], key);
            assert.ok(TRANSLATIONS.ru["cat." + key + ".hint"], key + ".hint");
        }
    });

    test("server error codes have a message", () => {
        for (const code of [400, 401, 403, 404, 409]) assert.ok(TRANSLATIONS.ru["err." + code], code);
    });

    test("placeholders are filled in", () => {
        assert.equal(site('t("home.hi", { name: "Азиза" })'), "Привет, Азиза!");
    });
});

describe("memes", () => {
    const MEMES = site("MEMES");

    test("every meme picture exists, in every language for templates", () => {
        for (const [slot, meme] of Object.entries(MEMES)) {
            const files = meme.file.includes("{lang}")
                ? ["ru", "en", "uz"].map(lang => meme.file.replace("{lang}", lang))
                : [meme.file];
            for (const file of files) assert.ok(existsSync(join(STATIC, "img/memes", file)), `${slot}: ${file}`);
        }
    });

    test("memes used by the pages are defined", () => {
        const pages = read("index.html") + read("home.html");
        const slots = [...pages.matchAll(/data-meme="([a-zA-Z]+)"/g), ...pages.matchAll(/memeHtml\("([a-zA-Z]+)"/g),
            ...pages.matchAll(/setPeek\("([a-zA-Z]+)"/g)].map(m => m[1]);
        for (const slot of slots) assert.ok(MEMES[slot], slot);
    });
});

describe("deadlines", () => {
    const info = site("deadlineInfo");

    test("no deadline, past, today and soon", () => {
        assert.equal(info(null), null);
        assert.equal(info("2020-01-01").past, true);
        const today = new Date();
        const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        assert.equal(info(iso(today)).urgent, true);
        const inThreeDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);
        assert.equal(info(iso(inThreeDays)).text, "Ещё 3 дня");
    });
});
