package org.example.cofounderlab.Service;

import org.example.cofounderlab.Objects.Student;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StudentService {
    private final List <Student> students = new ArrayList<>();

    public Student findStudentById(int studentId) {
        for (Student student : students) {
            if (student.getId() == studentId) {
                return student;
            }
        }
        return null;
    }

    public List<Student> getStudents() {
        return students;
    }

}
