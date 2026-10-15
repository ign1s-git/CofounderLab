package org.example.cofounderlab.objects;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.cofounderlab.enums.AdTitle;
import org.example.cofounderlab.enums.AdStatus;
import java.time.LocalDate;

@Getter
@Setter
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

    @Column (name = "studentTg", length = 20)
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
}
