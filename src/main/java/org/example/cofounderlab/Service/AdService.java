package org.example.cofounderlab.Service;

import org.example.cofounderlab.Enums.AdTitle;
import org.example.cofounderlab.Objects.Ad;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdService {
    private final List<Ad> ads = new ArrayList<>();

    public Ad findAdById(int id) {
        for (Ad ad : ads) {
            if (ad.getId() == id) {
                return ad;
            }
        }
        return null;
    }
    public Ad createAd(AdTitle adTitle,String description , LocalDate deadline, String studentTg, Long studentId) {
        Ad ad =  new Ad(adTitle, description, deadline, studentTg, studentId);
        return ad;
    }


}
