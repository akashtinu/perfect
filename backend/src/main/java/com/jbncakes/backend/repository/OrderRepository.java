package com.jbncakes.backend.repository;

import com.jbncakes.backend.model.Order;
import com.jbncakes.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByUserAndStatusNotInOrderByCreatedAtDesc(User user, List<String> statuses);
    List<Order> findByUserAndStatusInOrderByCreatedAtDesc(User user, List<String> statuses);
    List<Order> findAllByOrderByCreatedAtDesc();
    
    long countByStatus(String status);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status != 'CANCELLED'")
    BigDecimal calculateTotalRevenue();
}
