package org.example.cofounderlab;

import org.junit.jupiter.api.Test;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Profiles: reading students and editing your own profile
class StudentApiTest extends ApiTestBase {

    private static String profileJson(String name, int year, String contact) {
        return """
                {"name": "%s", "surname": "Хасанова", "department": "Дизайн", "year": %d, "contact": "%s"}
                """.formatted(name, year, contact);
    }

    @Test
    void studentsCanBeListedWithoutPasswords() throws Exception {
        Account account = register("list");
        perform(get("/api/students"), account.token())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].id").value(hasItem((int) account.id())))
                .andExpect(jsonPath("$[*].password").isEmpty());
    }

    @Test
    void studentListRequiresSigningIn() throws Exception {
        mvc.perform(get("/api/students")).andExpect(status().isUnauthorized());
    }

    @Test
    void studentCanEditTheirProfile() throws Exception {
        Account account = register("prof");
        performJson(put("/api/students/" + account.id()), account.token(), profileJson("Азиза", 3, "aziza@gmail.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.department").value("Дизайн"))
                .andExpect(jsonPath("$.year").value(3))
                .andExpect(jsonPath("$.contact").value("aziza@gmail.com"))
                // The login can't be changed through the profile
                .andExpect(jsonPath("$.login").value(account.login().toLowerCase()));
    }

    @Test
    void studentCannotEditSomeoneElsesProfile() throws Exception {
        Account me = register("me");
        Account other = register("other");
        performJson(put("/api/students/" + other.id()), me.token(), profileJson("Хакер", 1, "@hacker_x"))
                .andExpect(status().isForbidden());
        perform(get("/api/students/" + other.id()), me.token()).andExpect(jsonPath("$.name").value("Азиза"));
    }

    @Test
    void profileRejectsInvalidFields() throws Exception {
        Account account = register("badprof");
        performJson(put("/api/students/" + account.id()), account.token(), profileJson("Азиза", 0, "@aziza_dev"))
                .andExpect(status().isBadRequest());
        performJson(put("/api/students/" + account.id()), account.token(), profileJson("A1", 2, "@aziza_dev"))
                .andExpect(status().isBadRequest());
        performJson(put("/api/students/" + account.id()), account.token(), profileJson("Азиза", 2, ""))
                .andExpect(status().isBadRequest());
    }

    @Test
    void passwordStillWorksAfterProfileEdit() throws Exception {
        Account account = register("pwkeep");
        performJson(put("/api/students/" + account.id()), account.token(), profileJson("Азиза", 4, "@aziza_dev"))
                .andExpect(status().isOk());
        postJson("/api/auth/login", """
                {"login": "%s", "password": "secret123"}
                """.formatted(account.login())).andExpect(status().isOk());
    }
}
