package org.example.cofounderlab.objects;

public class AuthResponse {
    private String token;
    private Student student;

    public AuthResponse(String token, Student student) {
        this.token = token;
        this.student = student;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }
}
