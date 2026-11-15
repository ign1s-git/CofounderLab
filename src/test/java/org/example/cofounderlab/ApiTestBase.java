package org.example.cofounderlab;

import com.jayway.jsonpath.JsonPath;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.atomic.AtomicInteger;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Starts the whole app against a new empty SQLite file for every test run (never data/cofounderlab.db)
// and a test-only JWT secret, so tests don't need secrets.properties.
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = "jwt.secret=Y29mb3VuZGVybGFiLXRlc3Qtc2VjcmV0LW5vdC1mb3ItcHJvZHVjdGlvbi11c2Uh")
public abstract class ApiTestBase {
    private static final Path DATABASE = newDatabaseFile();

    // Keeps ddl-auto=update from application.properties: "create" loses the id column type on SQLite
    @DynamicPropertySource
    static void database(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", () -> "jdbc:sqlite:" + DATABASE);
    }

    private static Path newDatabaseFile() {
        try {
            Path file = Files.createTempFile("cofounderlab-test-", ".db");
            file.toFile().deleteOnExit();
            return file;
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    // The Spring context (and its database) is shared between test classes, so every test uses fresh logins
    private static final AtomicInteger counter = new AtomicInteger();

    @Autowired
    protected MockMvc mvc;

    protected static String uniqueLogin(String prefix) {
        return prefix + "_" + System.nanoTime() % 100000 + "_" + counter.incrementAndGet();
    }

    protected static String registerJson(String login, String password, String contact) {
        return """
                {"login": "%s", "password": "%s", "name": "Азиза", "surname": "Хасанова",
                 "department": "Computer Science", "year": 2, "contact": "%s"}
                """.formatted(login, password, contact);
    }

    protected static String adJson(String category, String description, String deadline, String contact) {
        String deadlineValue = deadline == null ? "null" : "\"" + deadline + "\"";
        return """
                {"title": "%s", "description": "%s", "deadline": %s, "studentContact": "%s"}
                """.formatted(category, description, deadlineValue, contact);
    }

    protected ResultActions postJson(String path, String json) throws Exception {
        return mvc.perform(post(path).contentType(MediaType.APPLICATION_JSON).content(json));
    }

    protected ResultActions perform(MockHttpServletRequestBuilder request, String token) throws Exception {
        return mvc.perform(request.header("Authorization", "Bearer " + token));
    }

    protected ResultActions performJson(MockHttpServletRequestBuilder request, String token, String json) throws Exception {
        return perform(request.contentType(MediaType.APPLICATION_JSON).content(json), token);
    }

    /** Registers a student with valid data and returns the token and the student's id. */
    protected Account register(String loginPrefix) throws Exception {
        String login = uniqueLogin(loginPrefix);
        String body = postJson("/api/auth/register", registerJson(login, "secret123", "@" + "user_" + counter.incrementAndGet()))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        String token = JsonPath.read(body, "$.token");
        Number id = JsonPath.read(body, "$.student.id");
        return new Account(login, token, id.longValue());
    }

    /** Creates a valid ad as the given account and returns its id. */
    protected long createAd(Account account, String category) throws Exception {
        String body = performJson(post("/api/ads"), account.token(),
                adJson(category, "Ищу фронтенд-разработчика в команду", null, "@aziza_dev"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        Number id = JsonPath.read(body, "$.id");
        return id.longValue();
    }

    protected record Account(String login, String token, long id) {
    }
}
