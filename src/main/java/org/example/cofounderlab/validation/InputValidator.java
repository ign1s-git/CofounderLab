package org.example.cofounderlab.validation;

import org.example.cofounderlab.enums.AdTitle;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.regex.Pattern;

// Checks user input before it is saved. The same limits are used on the frontend in static/js/validate.js
public final class InputValidator {
    private static final Pattern LOGIN = Pattern.compile("^[a-zA-Z0-9._]{3,20}$");
    private static final Pattern PERSON_NAME = Pattern.compile("^\\p{L}[\\p{L}\\s'‘’`-]{1,29}$");
    private static final Pattern DEPARTMENT = Pattern.compile("^[\\p{L}\\d][\\p{L}\\d\\s&.,()'‘’`-]{1,49}$");
    private static final Pattern HAS_LETTER = Pattern.compile("\\p{L}");
    private static final Pattern HAS_DIGIT = Pattern.compile("\\d");
    private static final Pattern WHITESPACE = Pattern.compile("\\s");
    // Telegram usernames: 5-32 Latin letters, digits or underscores, starting with a letter
    private static final Pattern TELEGRAM = Pattern.compile("^@[a-zA-Z][a-zA-Z0-9_]{4,31}$");
    private static final Pattern EMAIL = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$");
    private static final int EMAIL_MAX_LENGTH = 64;

    private InputValidator() {
    }

    public static void validateLogin(String login) {
        check(login != null && LOGIN.matcher(login).matches(),
                "Login must be 3-20 characters: Latin letters, digits, dot or underscore");
    }

    public static void validatePassword(String password) {
        check(password != null && password.length() >= 8 && password.length() <= 64,
                "Password must be 8-64 characters");
        check(!WHITESPACE.matcher(password).find(), "Password must not contain spaces");
        check(HAS_LETTER.matcher(password).find() && HAS_DIGIT.matcher(password).find(),
                "Password must contain at least one letter and one digit");
    }

    public static void validateProfile(String name, String surname, String department, int year, String contact) {
        check(name != null && PERSON_NAME.matcher(name).matches(), "Name must be 2-30 letters");
        check(surname != null && PERSON_NAME.matcher(surname).matches(), "Surname must be 2-30 letters");
        check(department != null && DEPARTMENT.matcher(department).matches(), "Department must be 2-50 characters");
        check(year >= 1 && year <= 4, "Year must be from 1 to 4");
        validateContact(contact);
    }

    // previousDeadline is the ad's current deadline when editing, so an expired ad can still be edited
    public static void validateAd(AdTitle title, String description, LocalDate deadline, String contact, LocalDate previousDeadline) {
        check(title != null, "Category is required");
        check(description != null && description.length() >= 10 && description.length() <= 200,
                "Description must be 10-200 characters");
        if (deadline != null && !deadline.equals(previousDeadline)) {
            check(!deadline.isBefore(LocalDate.now()), "Deadline cannot be in the past");
        }
        validateContact(contact);
    }

    // Trims a value, keeping null as null
    public static String clean(String value) {
        return value == null ? null : value.trim();
    }

    // A contact is either a Telegram username (@name) or an email address
    private static void validateContact(String contact) {
        check(contact != null && !contact.isEmpty(), "Contact is required");
        boolean telegram = TELEGRAM.matcher(contact).matches();
        boolean email = contact.length() <= EMAIL_MAX_LENGTH && EMAIL.matcher(contact).matches();
        check(telegram || email, "Contact must be a Telegram username (@name) or an email address");
    }

    private static void check(boolean condition, String message) {
        if (!condition) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
    }
}
