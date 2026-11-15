package org.example.cofounderlab.service;

import org.example.cofounderlab.objects.AuthResponse;
import org.example.cofounderlab.objects.LoginRequest;
import org.example.cofounderlab.objects.Student;
import org.example.cofounderlab.repositories.StudentRepository;
import org.example.cofounderlab.security.JwtService;
import org.example.cofounderlab.validation.InputValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.example.cofounderlab.validation.InputValidator.clean;

import java.util.ArrayList;

@Service
public class AuthService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public AuthResponse register(Student student) {
        // Logins are case-insensitive, so they are stored in lower case
        String login = clean(student.getLogin());
        student.setLogin(login == null ? null : login.toLowerCase());
        student.setName(clean(student.getName()));
        student.setSurname(clean(student.getSurname()));
        student.setDepartment(clean(student.getDepartment()));
        student.setContact(clean(student.getContact()));
        InputValidator.validateLogin(student.getLogin());
        InputValidator.validatePassword(student.getPassword());
        InputValidator.validateProfile(student.getName(), student.getSurname(), student.getDepartment(),
                student.getYear(), student.getContact());
        if (studentRepository.findByLogin(student.getLogin()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Login is already taken");
        }
        if (student.getAds() == null) {
            student.setAds(new ArrayList<>());
        }
        student.setId(null);
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        Student saved = studentRepository.save(student);
        return new AuthResponse(jwtService.generateToken(saved), saved);
    }

    public AuthResponse login(LoginRequest request) {
        String login = clean(request.getLogin());
        Student student = login == null ? null : studentRepository.findByLogin(login.toLowerCase()).orElse(null);
        if (student == null || request.getPassword() == null || !passwordEncoder.matches(request.getPassword(), student.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        return new AuthResponse(jwtService.generateToken(student), student);
    }

    public Student me(Long studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Student not found"));
    }
}
