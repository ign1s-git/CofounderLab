package org.example.cofounderlab;

import org.example.cofounderlab.enums.AdTitle;
import org.example.cofounderlab.objects.Ad;
import org.example.cofounderlab.repositories.AdRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Ads: creating, reading, editing, deleting and who is allowed to do it
class AdApiTest extends ApiTestBase {

    @Autowired
    private AdRepository adRepository;

    @Test
    void createdAdBelongsToTheSignedInStudent() throws Exception {
        Account author = register("author");
        Account other = register("other");
        // studentId in the body must be ignored: the author always comes from the token
        String json = """
                {"title": "HACKATHON", "description": "Собираю команду на хакатон", "deadline": null,
                 "studentContact": "@aziza_dev", "studentId": %d}
                """.formatted(other.id());
        performJson(post("/api/ads"), author.token(), json)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.studentId").value(author.id()))
                .andExpect(jsonPath("$.title").value("HACKATHON"));
    }

    @Test
    void adsCanBeListedAndReadById() throws Exception {
        Account author = register("list");
        long adId = createAd(author, "PROJECT");
        perform(get("/api/ads"), author.token())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].id").value(hasItem((int) adId)));
        perform(get("/api/ads/" + adId), author.token())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("PROJECT"));
    }

    @Test
    void adsRequireSigningIn() throws Exception {
        mvc.perform(get("/api/ads")).andExpect(status().isUnauthorized());
        postJson("/api/ads", adJson("STARTUP", "Ищу дизайнера в команду", null, "@aziza_dev"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createRejectsInvalidAds() throws Exception {
        Account author = register("bad");
        String yesterday = LocalDate.now().minusDays(1).toString();
        performJson(post("/api/ads"), author.token(), adJson("STARTUP", "short", null, "@aziza_dev"))
                .andExpect(status().isBadRequest());
        performJson(post("/api/ads"), author.token(), adJson("STARTUP", "Ищу дизайнера в команду", yesterday, "@aziza_dev"))
                .andExpect(status().isBadRequest());
        performJson(post("/api/ads"), author.token(), adJson("STARTUP", "Ищу дизайнера в команду", null, "not-a-contact"))
                .andExpect(status().isBadRequest());
        performJson(post("/api/ads"), author.token(), """
                {"description": "Ищу дизайнера в команду", "studentContact": "@aziza_dev"}
                """).andExpect(status().isBadRequest());
    }

    @Test
    void authorCanEditTheirAd() throws Exception {
        Account author = register("edit");
        long adId = createAd(author, "STARTUP");
        String nextWeek = LocalDate.now().plusDays(7).toString();
        performJson(put("/api/ads/" + adId), author.token(),
                adJson("COMPETITION", "Ищу двоих в команду на конкурс", nextWeek, "aziza.h@gmail.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("COMPETITION"))
                .andExpect(jsonPath("$.deadline").value(nextWeek))
                .andExpect(jsonPath("$.studentContact").value("aziza.h@gmail.com"));
    }

    @Test
    void anotherStudentCannotEditOrDeleteTheAd() throws Exception {
        Account author = register("owner");
        Account stranger = register("stranger");
        long adId = createAd(author, "STARTUP");
        performJson(put("/api/ads/" + adId), stranger.token(), adJson("OTHER", "Я поменяю чужое объявление", null, "@stranger_x"))
                .andExpect(status().isForbidden());
        perform(delete("/api/ads/" + adId), stranger.token()).andExpect(status().isForbidden());
        // The ad is untouched
        perform(get("/api/ads/" + adId), author.token()).andExpect(jsonPath("$.title").value("STARTUP"));
    }

    @Test
    void authorCanDeleteTheirAd() throws Exception {
        Account author = register("del");
        long adId = createAd(author, "OTHER");
        perform(delete("/api/ads/" + adId), author.token()).andExpect(status().isOk());
        perform(get("/api/auth/me"), author.token()).andExpect(jsonPath("$.ads").isEmpty());
        // Deleting again: the ad is gone
        perform(delete("/api/ads/" + adId), author.token()).andExpect(status().isNotFound());
    }

    @Test
    void createdAdIsListedInTheStudentsAds() throws Exception {
        Account author = register("mine");
        long adId = createAd(author, "PROJECT");
        perform(get("/api/auth/me"), author.token()).andExpect(jsonPath("$.ads[0]").value((int) adId));
    }

    @Test
    void editingMissingAdGivesNotFound() throws Exception {
        Account author = register("missing");
        performJson(put("/api/ads/999999"), author.token(), adJson("OTHER", "Объявления с таким номером нет", null, "@aziza_dev"))
                .andExpect(status().isNotFound());
    }

    @Test
    void adWithExpiredDeadlineCanStillBeEdited() throws Exception {
        Account author = register("expired");
        // The API refuses past deadlines, so the expired ad is written straight to the database
        LocalDate expired = LocalDate.now().minusDays(3);
        Ad ad = adRepository.save(new Ad(AdTitle.STARTUP, "Старое объявление со сроком", expired, "@aziza_dev", author.id()));
        performJson(put("/api/ads/" + ad.getId()), author.token(),
                adJson("STARTUP", "Исправила опечатку в описании", expired.toString(), "@aziza_dev"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Исправила опечатку в описании"));
    }
}
