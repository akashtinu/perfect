package com.jbncakes.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*")
public class HealthController {

    @Autowired(required = false)
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "JBN Cakes Backend");
        health.put("timestamp", LocalDateTime.now().toString());

        boolean dbStatus = false;
        try {
            if (jdbcTemplate != null) {
                jdbcTemplate.execute("SELECT 1");
                dbStatus = true;
            }
        } catch (Exception e) {
            dbStatus = false;
            health.put("dbError", e.getMessage());
        }

        health.put("database", dbStatus ? "CONNECTED (TiDB/MySQL)" : "DISCONNECTED");

        if (dbStatus) {
            return ResponseEntity.ok(health);
        } else {
            // Still return 200 OK or 503 Service Unavailable depending on requirements
            health.put("status", "DEGRADED");
            return ResponseEntity.status(503).body(health);
        }
    }
}
