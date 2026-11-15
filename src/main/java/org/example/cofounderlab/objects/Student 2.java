package org.example.cofounderlab.objects;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
@Getter
@Setter
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "surname")
    private String surname;

    @Column(name = "department")
    private String department;

    @Column(name = "year")
    private int year;

    @Column(name = "ads")
    private List<Long> ads = new ArrayList<>();

    @Column(name = "contact")
    private String contact;

    public Student(Long id, String name, String surname, String department, int year, List<Long> ads, String contact) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.department = department;
        this.year = year;
        this.ads = ads;
        this.contact = contact;
    }

    public Student() {

    }
}
