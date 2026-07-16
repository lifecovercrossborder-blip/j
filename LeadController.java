package com.crossborder.controller;

import com.crossborder.model.Lead;
import com.crossborder.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows local file execution access
public class LeadController {

    @Autowired
    private LeadRepository leadRepository;

    @PostMapping("/leads")
    public ResponseEntity<String> saveLead(@RequestBody Lead lead) {
        try {
            // Save your customer data into the database
            leadRepository.save(lead);
            
            // TODO: Optional: Add JavaMailSender logic here to alert agents of a new signup
            
            return ResponseEntity.ok("Lead captured successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving registration details: " + e.getMessage());
        }
    }
}