package org.example.cofounderlab.service;

import org.example.cofounderlab.enums.AdTitle;
import org.example.cofounderlab.objects.Ad;
import org.example.cofounderlab.repositories.AdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdService {
    private final List<Ad> ads = new ArrayList<>();

    @Autowired
    private AdRepository adRepository;

    public Ad findAdById(Long id) { return adRepository.findById(id).orElse(null);}

    public Ad createAd(AdTitle adTitle,String description , LocalDate deadline, String studentTg, Long studentId) {
        Ad ad =  new Ad(adTitle, description, deadline, studentTg, studentId);
        ads.add(ad);
        adRepository.save(ad);
        return ad;
    }

    public Ad updateAd (Long id,AdTitle adTitle,String description , LocalDate deadline, String studentTg){
        Ad ad = findAdById(id);
        if (ad==null){
            throw new RuntimeException("No ad found with id " + id);
        }
        ad.setTitle(adTitle);
        ad.setDescription(description);
        ad.setDeadline(deadline);
        ad.setStudentContact(studentTg);
        return  adRepository.save(ad);
    }

    public List<Ad> getAllAds(){
        return adRepository.findAll();
    }
void deleteAd(Long id) {
        adRepository.deleteById(id);
    }

}
