package org.example.cofounderlab.Service;

import org.example.cofounderlab.Enums.AdTitle;
import org.example.cofounderlab.Objects.Ad;
import org.example.cofounderlab.Objects.Student;
import org.example.cofounderlab.repositories.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudentService {
    private final List <Student> students = new ArrayList<>();

    @Autowired
    private AdService adService;

    @Autowired
    private StudentRepository studentRepository;

    public Student findStudentById(Long studentId) {
        return studentRepository.findById(studentId).orElse(null);
    }

    public Ad createAdForStudent(Long studentId, AdTitle title, String description, LocalDate deadline, String studentTg) {
        Student student = findStudentById(studentId);
        if (student == null) {
            throw new RuntimeException("Student not found");
        }
        Ad ad = adService.createAd(title, description, deadline, studentTg, studentId);
        student.getAds().add(ad.getId());
        studentRepository.save(student);
        return ad;
    }
    public void deleteAd(Long id) {
        Ad ad = adService.findAdById(id);
        if (ad == null) {
            throw new RuntimeException("Ad not found");
        }
        Student student = studentRepository.findById(ad.getStudentId()).orElse(null);
        if(student !=  null) {
            student.getAds().remove(id);
            studentRepository.save(student);
            adService.deleteAd(id);
        }

    }

    public List<Student> getStudents() {
        return students;
    }

}
