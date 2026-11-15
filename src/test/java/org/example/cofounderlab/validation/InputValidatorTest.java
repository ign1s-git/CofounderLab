package org.example.cofounderlab.validation;

import org.example.cofounderlab.enums.AdTitle;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

class InputValidatorTest {

    private static void assertRejected(Runnable check) {
        ResponseStatusException e = assertThrows(ResponseStatusException.class, check::run);
        assertEquals(HttpStatus.BAD_REQUEST, e.getStatusCode());
    }

    // ---------- Login ----------

    @ParameterizedTest
    @ValueSource(strings = {"aziza", "aziza.h", "iza_2026", "abc", "a2345678901234567890"})
    void acceptsValidLogins(String login) {
        assertDoesNotThrow(() -> InputValidator.validateLogin(login));
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"ab", "a23456789012345678901", "азиза", "aziza hasanova", "aziza!", "aziza@mail"})
    void rejectsInvalidLogins(String login) {
        assertRejected(() -> InputValidator.validateLogin(login));
    }

    // ---------- Password ----------

    @ParameterizedTest
    @ValueSource(strings = {"secret123", "Пароль2026", "abcdefg1"})
    void acceptsValidPasswords(String password) {
        assertDoesNotThrow(() -> InputValidator.validatePassword(password));
    }

    @Test
    void rejectsShortPassword() {
        assertRejected(() -> InputValidator.validatePassword("abc1234"));
    }

    @Test
    void rejectsTooLongPassword() {
        assertRejected(() -> InputValidator.validatePassword("a1".repeat(33)));
    }

    @Test
    void rejectsPasswordWithoutDigit() {
        assertRejected(() -> InputValidator.validatePassword("abcdefgh"));
    }

    @Test
    void rejectsPasswordWithoutLetter() {
        assertRejected(() -> InputValidator.validatePassword("12345678"));
    }

    @Test
    void rejectsPasswordWithSpaces() {
        assertRejected(() -> InputValidator.validatePassword("secret 123"));
    }

    @Test
    void rejectsMissingPassword() {
        assertRejected(() -> InputValidator.validatePassword(null));
    }

    // ---------- Profile ----------

    @Test
    void acceptsValidProfile() {
        assertDoesNotThrow(() -> InputValidator.validateProfile("Азиза", "Хасанова", "Computer Science", 2, "@aziza_dev"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"O‘tkir-Bek", "Gʻayrat", "Anne-Marie", "Ji Hoon", "김민준"})
    void acceptsNamesFromDifferentAlphabets(String name) {
        assertDoesNotThrow(() -> InputValidator.validateProfile(name, "Kim", "IT", 1, "@aziza_dev"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"A", "Iza1", "-Iza", "Iza!"})
    void rejectsInvalidNames(String name) {
        assertRejected(() -> InputValidator.validateProfile(name, "Kim", "IT", 1, "@aziza_dev"));
    }

    @ParameterizedTest
    @ValueSource(ints = {0, 5, -1})
    void rejectsYearOutsideOneToFour(int year) {
        assertRejected(() -> InputValidator.validateProfile("Iza", "Kim", "IT", year, "@aziza_dev"));
    }

    @Test
    void rejectsTooLongDepartment() {
        assertRejected(() -> InputValidator.validateProfile("Iza", "Kim", "D".repeat(51), 1, "@aziza_dev"));
    }

    // ---------- Contact ----------

    @ParameterizedTest
    @ValueSource(strings = {"@aziza_dev", "@abcde", "aziza.hasanova.student@gmail.com", "a@b.co"})
    void acceptsTelegramOrEmail(String contact) {
        assertDoesNotThrow(() -> InputValidator.validateProfile("Iza", "Kim", "IT", 1, contact));
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"aziza_dev", "@abcd", "@1abcde", "@aziza-dev", "aziza@gmail", "hello",
            // 33 characters after "@", one more than Telegram allows
            "@abbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"})
    void rejectsInvalidContacts(String contact) {
        assertRejected(() -> InputValidator.validateProfile("Iza", "Kim", "IT", 1, contact));
    }

    @Test
    void rejectsEmailLongerThan64() {
        String email = "a".repeat(60) + "@mail.com";
        assertRejected(() -> InputValidator.validateProfile("Iza", "Kim", "IT", 1, email));
    }

    // ---------- Ad ----------

    @Test
    void acceptsValidAd() {
        assertDoesNotThrow(() -> InputValidator.validateAd(AdTitle.STARTUP, "Ищу дизайнера в команду",
                LocalDate.now().plusDays(10), "@aziza_dev", null));
    }

    @Test
    void acceptsAdWithoutDeadline() {
        assertDoesNotThrow(() -> InputValidator.validateAd(AdTitle.OTHER, "Ищу дизайнера в команду", null, "@aziza_dev", null));
    }

    @Test
    void rejectsAdWithoutCategory() {
        assertRejected(() -> InputValidator.validateAd(null, "Ищу дизайнера в команду", null, "@aziza_dev", null));
    }

    @Test
    void rejectsTooShortDescription() {
        assertRejected(() -> InputValidator.validateAd(AdTitle.STARTUP, "short", null, "@aziza_dev", null));
    }

    @Test
    void rejectsTooLongDescription() {
        assertRejected(() -> InputValidator.validateAd(AdTitle.STARTUP, "x".repeat(201), null, "@aziza_dev", null));
    }

    @Test
    void rejectsNewDeadlineInThePast() {
        assertRejected(() -> InputValidator.validateAd(AdTitle.STARTUP, "Ищу дизайнера в команду",
                LocalDate.now().minusDays(1), "@aziza_dev", null));
    }

    @Test
    void keepsAnExpiredDeadlineThatDidNotChange() {
        LocalDate expired = LocalDate.now().minusDays(5);
        assertDoesNotThrow(() -> InputValidator.validateAd(AdTitle.STARTUP, "Ищу дизайнера в команду",
                expired, "@aziza_dev", expired));
    }

    @Test
    void rejectsMovingDeadlineToAnotherPastDate() {
        assertRejected(() -> InputValidator.validateAd(AdTitle.STARTUP, "Ищу дизайнера в команду",
                LocalDate.now().minusDays(2), "@aziza_dev", LocalDate.now().minusDays(5)));
    }

    // ---------- clean ----------

    @Test
    void cleanTrimsAndKeepsNull() {
        assertEquals("aziza", InputValidator.clean("  aziza \t"));
        assertNull(InputValidator.clean(null));
    }
}
