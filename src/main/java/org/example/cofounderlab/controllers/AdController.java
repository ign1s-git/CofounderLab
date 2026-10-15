package org.example.cofounderlab.controllers;

import org.example.cofounderlab.objects.Ad;
import org.example.cofounderlab.service.AdService;
import org.example.cofounderlab.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public Ad findAdById(Long id){
        return adService.findAdById(id);
    }

    @PostMapping
    public Ad addAd(@RequestBody Ad ad){
        return studentService.createAdForStudent(ad.getStudentId(),ad.getTitle(),ad.getDescription(),ad.getDeadline(),ad.getStudentContact());
    }

    @DeleteMapping("/{id}")
    public void deleteAdById(@PathVariable Long id){
        studentService.deleteAd(id);
    }

    @PutMapping("/{id}")
    public Ad updateAd(@PathVariable Long id, @RequestBody Ad ad){
       return studentService.updateAdForStudent(id, ad.getTitle(), ad.getDescription(), ad.getDeadline(), ad.getStudentContact());
    }
}
