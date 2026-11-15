package org.example.cofounderlab.controllers;

import org.example.cofounderlab.objects.Ad;
import org.example.cofounderlab.service.AdService;
import org.example.cofounderlab.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/ads")
public class AdController {
    @Autowired
    private AdService adService;
    @Autowired
    private StudentService studentService;

    @GetMapping
    public List<Ad> getAds() {
        return adService.getAllAds();
    }

    @GetMapping("/{id}")
    public Ad findAdById(@PathVariable Long id){
        return adService.findAdById(id);
    }

    @PostMapping
    public Ad addAd(@RequestBody Ad ad, @AuthenticationPrincipal Long studentId){
        // The ad always belongs to the logged-in student, studentId from the body is ignored
        return studentService.createAdForStudent(studentId,ad.getTitle(),ad.getDescription(),ad.getDeadline(),ad.getStudentContact());
    }

    @DeleteMapping("/{id}")
    public void deleteAdById(@PathVariable Long id, @AuthenticationPrincipal Long studentId){
        checkOwner(id, studentId);
        studentService.deleteAd(id);
    }

    @PutMapping("/{id}")
    public Ad updateAd(@PathVariable Long id, @RequestBody Ad ad, @AuthenticationPrincipal Long studentId){
       checkOwner(id, studentId);
       return studentService.updateAdForStudent(id, ad.getTitle(), ad.getDescription(), ad.getDeadline(), ad.getStudentContact());
    }

    private void checkOwner(Long adId, Long studentId) {
        Ad ad = adService.findAdById(adId);
        if (ad == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ad not found");
        }
        if (!studentId.equals(ad.getStudentId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only change your own ads");
        }
    }
}
