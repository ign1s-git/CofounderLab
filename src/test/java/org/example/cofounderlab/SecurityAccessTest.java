package org.example.cofounderlab;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Which addresses are open without signing in (SecurityConfig)
class SecurityAccessTest extends ApiTestBase {

    @ParameterizedTest
    @ValueSource(strings = {"/index.html", "/home.html", "/css/style.css", "/js/api.js", "/js/i18n.js",
            "/js/validate.js", "/js/cats.js", "/img/memes/home.jpg", "/img/memes/tpl/drake.ru.jpg"})
    void sitePagesAndFilesAreOpen(String path) throws Exception {
        mvc.perform(get(path)).andExpect(status().isOk());
    }

    @ParameterizedTest
    @ValueSource(strings = {"/api/ads", "/api/ads/1", "/api/students", "/api/students/1", "/api/auth/me"})
    void apiIsClosedWithoutToken(String path) throws Exception {
        mvc.perform(get(path)).andExpect(status().isUnauthorized());
    }
}
