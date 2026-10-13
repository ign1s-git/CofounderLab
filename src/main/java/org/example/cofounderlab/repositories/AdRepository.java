package org.example.cofounderlab.repositories;

import org.example.cofounderlab.Objects.Ad;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdRepository extends JpaRepository<Ad,Long> {
}
