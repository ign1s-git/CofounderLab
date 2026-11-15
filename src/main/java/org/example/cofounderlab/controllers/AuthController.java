package org.example.cofounderlab.controllers;

import org.example.cofounderlab.objects.AuthResponse;
import org.example.cofounderlab.objects.LoginRequest;
import org.example.cofounderlab.objects.Student;
import org.example.cofounderlab.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody Student student) {
        return authService.register(student);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public Student me(@AuthenticationPrincipal Long studentId) {
        return authService.me(studentId);
    }
}
