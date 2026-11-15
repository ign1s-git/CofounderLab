package org.example.cofounderlab.controllers;

import org.example.cofounderlab.objects.Student;
import org.example.cofounderlab.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    @Autowired
    private StudentService studentService;

    @GetMapping("{id}")
    public Student findStudentById(@PathVariable Long id){
        return studentService.findStudentById(id);
    }

    @GetMapping
    public List<Student> findAllStudents(){
        return studentService.findAllStudents();
    }

    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student student, @AuthenticationPrincipal Long studentId){
        checkSelf(id, studentId);
        return studentService.updateStudent(id, student.getName(),student.getSurname(),student.getDepartment(),student.getYear(),student.getContact());
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id, @AuthenticationPrincipal Long studentId){
        checkSelf(id, studentId);
        studentService.deleteStudent(id);
    }

    private void checkSelf(Long id, Long studentId) {
        if (!id.equals(studentId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only change your own profile");
        }
    }
}
