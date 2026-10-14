package org.example.cofounderlab.Objects;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.example.cofounderlab.Enums.AdTitle;
import org.example.cofounderlab.Service.AdService;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
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

    public Student(Long id, String name, String surname, String department, int year, List<Long> ads) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.department = department;
        this.year = year;
        this.ads = ads;
    }

    public Student() {

    }
}
