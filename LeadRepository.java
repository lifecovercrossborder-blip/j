package com.crossborder.repository;

import com.crossborder.model.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    // You can add custom database queries here if needed later (e.g., finding leads by nationality)
}