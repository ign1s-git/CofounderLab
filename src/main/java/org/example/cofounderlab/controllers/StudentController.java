package org.example.cofounderlab.controllers;

import org.example.cofounderlab.objects.Student;
import org.example.cofounderlab.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    public Student createStudent(@RequestBody Student student){
        return studentService.createStudent(student.getId(),student.getName(), student.getSurname(),
                student.getDepartment(),student.getYear(),student.getAds(),student.getContact());
    }

    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student student){
        return studentService.updateStudent(id, student.getName(),student.getSurname(),student.getDepartment(),student.getYear(),student.getContact());
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id){
        studentService.deleteStudent(id);
    }
}
