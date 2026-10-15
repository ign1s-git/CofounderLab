package org.example.cofounderlab.service;

import org.example.cofounderlab.enums.AdTitle;
import org.example.cofounderlab.objects.Ad;
import org.example.cofounderlab.objects.Student;
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

    public Ad createAdForStudent(Long studentId, AdTitle title, String description, LocalDate deadline, String studentContact) {
        Student student = findStudentById(studentId);
        if (student == null) {
            throw new RuntimeException("Student not found");
        }
        Ad ad = adService.createAd(title, description, deadline, studentContact, studentId);
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

    public Ad updateAdForStudent(Long id, AdTitle title, String description, LocalDate deadline, String studentContact) {
        Ad ad = adService.findAdById(id);
        if(ad == null) {
            throw new RuntimeException("Ad not found");
        }
        Student student = studentRepository.findById(ad.getStudentId()).orElse(null);
        if (student == null) {
            throw new RuntimeException("Student not found");
        }
        return adService.updateAd(id, title, description, deadline, studentContact);
    }

    public Student createStudent(Long id, String name, String surname, String department, int year, List<Long> ads,String contact) {
        Student student = new Student(id, name, surname, department, year, ads,contact);
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, String name, String surname, String department, int year,String contact) {
        Student student = studentRepository.findById(id).orElse(null);
        if (student == null) {
            throw new RuntimeException("Student not found");
        }
        student.setName(name);
        student.setSurname(surname);
        student.setDepartment(department);
        student.setYear(year);
        student.setContact(contact);
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id).orElse(null);
        if (student == null) {
            throw new RuntimeException("Student not found");
        }
        studentRepository.delete(student);
    }

    public List<Student> findAllStudents() {
        return studentRepository.findAll();
    }

}
