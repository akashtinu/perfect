package com.jbncakes.backend.controller;

import com.jbncakes.backend.dto.AuthRequests.AdminStatsDto;
import com.jbncakes.backend.model.User;
import com.jbncakes.backend.repository.OrderRepository;
import com.jbncakes.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getDashboardStats() {
        BigDecimal revenue = orderRepository.calculateTotalRevenue();
        long totalOrders = orderRepository.count();
        long activeOrders = orderRepository.countByStatus("PENDING") + 
                             orderRepository.countByStatus("PREPARING") + 
                             orderRepository.countByStatus("OUT_FOR_DELIVERY");
        long totalCustomers = userRepository.countByRole("CUSTOMER");

        return ResponseEntity.ok(new AdminStatsDto(revenue, totalOrders, activeOrders, totalCustomers));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        // Clear passwords for security
        users.forEach(u -> u.setPassword("*****"));
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newRole = body.get("role");
        if (newRole == null || (!newRole.equalsIgnoreCase("ADMIN") && !newRole.equalsIgnoreCase("CUSTOMER"))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid role"));
        }

        return userRepository.findById(id).map(user -> {
            user.setRole(newRole.toUpperCase());
            userRepository.save(user);
            user.setPassword("*****");
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }
}
