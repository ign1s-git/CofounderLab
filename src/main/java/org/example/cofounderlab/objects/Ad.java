package org.example.cofounderlab.objects;

import jakarta.persistence.*;
import org.example.cofounderlab.enums.AdTitle;
import org.example.cofounderlab.enums.AdStatus;
import java.time.LocalDate;

@Entity
@Table(name = "ads")
public class Ad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private AdTitle title;

    @Column(name = "description",
            length = 200)
    private String description;
//    private AdTitle category;
    @Enumerated(EnumType.STRING)
    private AdStatus status;

    @Column(name = "deadline")
    private LocalDate deadline;

    @Column (name = "studentTg", length = 64)
    private String studentContact;

    @Column(name = "studentId")
    private Long studentId;

    public Ad(AdTitle title, String description, LocalDate deadline, String studentContact, Long studentId) {
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.studentContact = studentContact;
        this.studentId = studentId;
    }

    public Ad() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AdTitle getTitle() {
        return title;
    }

    public void setTitle(AdTitle title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public AdStatus getStatus() {
        return status;
    }

    public void setStatus(AdStatus status) {
        this.status = status;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public String getStudentContact() {
        return studentContact;
    }

    public void setStudentContact(String studentContact) {
        this.studentContact = studentContact;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
}
