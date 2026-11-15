package org.example.cofounderlab;

import org.junit.jupiter.api.Test;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.emptyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Registration, sign in and the token
class AuthApiTest extends ApiTestBase {

    @Test
    void registerReturnsTokenAndStudentWithoutPassword() throws Exception {
        String login = uniqueLogin("Reg");
        postJson("/api/auth/register", registerJson(login, "secret123", "@aziza_dev"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(not(emptyString())))
                // Logins are stored in lower case
                .andExpect(jsonPath("$.student.login").value(login.toLowerCase()))
                .andExpect(jsonPath("$.student.name").value("Азиза"))
                .andExpect(jsonPath("$.student.password").doesNotExist());
    }

    @Test
    void registerTrimsSpacesAroundFields() throws Exception {
        String login = uniqueLogin("trim");
        String json = """
                {"login": "  %s  ", "password": "secret123", "name": "  Азиза ", "surname": "Хасанова",
                 "department": " IT ", "year": 1, "contact": " @aziza_dev "}
                """.formatted(login);
        postJson("/api/auth/register", json)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.student.login").value(login.toLowerCase()))
                .andExpect(jsonPath("$.student.name").value("Азиза"))
                .andExpect(jsonPath("$.student.department").value("IT"))
                .andExpect(jsonPath("$.student.contact").value("@aziza_dev"));
    }

    @Test
    void sameLoginInAnotherCaseIsTaken() throws Exception {
        String login = uniqueLogin("dup");
        postJson("/api/auth/register", registerJson(login, "secret123", "@aziza_dev")).andExpect(status().isOk());
        postJson("/api/auth/register", registerJson(login.toUpperCase(), "secret123", "@aziza_dev"))
                .andExpect(status().isConflict());
    }

    @Test
    void twoStudentsWithTheSameNameCanRegister() throws Exception {
        // registerJson always uses the same name, surname, department and year
        register("twin");
        register("twin");
    }

    @Test
    void registerRejectsInvalidFields() throws Exception {
        postJson("/api/auth/register", registerJson("ab", "secret123", "@aziza_dev")).andExpect(status().isBadRequest());
        postJson("/api/auth/register", registerJson(uniqueLogin("pw"), "short1", "@aziza_dev")).andExpect(status().isBadRequest());
        postJson("/api/auth/register", registerJson(uniqueLogin("ct"), "secret123", "hello")).andExpect(status().isBadRequest());
        postJson("/api/auth/register", """
                {"login": "%s", "password": "secret123", "name": "Iza", "surname": "Kim",
                 "department": "IT", "year": 7, "contact": "@aziza_dev"}
                """.formatted(uniqueLogin("yr"))).andExpect(status().isBadRequest());
        postJson("/api/auth/register", "{}").andExpect(status().isBadRequest());
    }

    @Test
    void loginIsCaseInsensitive() throws Exception {
        Account account = register("Case");
        postJson("/api/auth/login", """
                {"login": "%s", "password": "secret123"}
                """.formatted(account.login().toUpperCase()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(not(emptyString())))
                .andExpect(jsonPath("$.student.id").value(account.id()));
    }

    @Test
    void wrongPasswordAndUnknownLoginGiveTheSameAnswer() throws Exception {
        Account account = register("pw");
        postJson("/api/auth/login", """
                {"login": "%s", "password": "wrong1234"}
                """.formatted(account.login())).andExpect(status().isUnauthorized());
        postJson("/api/auth/login", """
                {"login": "nobody_here_123", "password": "secret123"}
                """).andExpect(status().isUnauthorized());
        postJson("/api/auth/login", "{}").andExpect(status().isUnauthorized());
    }

    @Test
    void meReturnsTheSignedInStudent() throws Exception {
        Account account = register("me");
        perform(get("/api/auth/me"), account.token())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(account.id()))
                .andExpect(jsonPath("$.login").value(account.login().toLowerCase()));
    }

    @Test
    void meRequiresAValidToken() throws Exception {
        mvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
        perform(get("/api/auth/me"), "not-a-real-token").andExpect(status().isUnauthorized());
    }
}
