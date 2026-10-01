package com.jbncakes.backend.controller;

import com.jbncakes.backend.dto.AuthRequests.OrderItemRequest;
import com.jbncakes.backend.dto.AuthRequests.OrderRequest;
import com.jbncakes.backend.dto.AuthRequests.StatusUpdateRequest;
import com.jbncakes.backend.model.Order;
import com.jbncakes.backend.model.OrderItem;
import com.jbncakes.backend.model.Product;
import com.jbncakes.backend.model.User;
import com.jbncakes.backend.repository.OrderRepository;
import com.jbncakes.backend.repository.ProductRepository;
import com.jbncakes.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // Place a new order (Customer)
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (orderRequest.getItems() == null || orderRequest.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Order items cannot be empty!"));
        }

        Order order = new Order();
        order.setUser(user);
        order.setDeliveryAddress(orderRequest.getDeliveryAddress() != null ? orderRequest.getDeliveryAddress() : user.getAddress());
        order.setCustomerPhone(orderRequest.getCustomerPhone() != null ? orderRequest.getCustomerPhone() : user.getPhone());
        order.setNotes(orderRequest.getNotes());
        order.setStatus("PENDING");

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemReq : orderRequest.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductId()));

            int quantity = itemReq.getQuantity() != null && itemReq.getQuantity() > 0 ? itemReq.getQuantity() : 1;
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));
            totalAmount = totalAmount.add(itemTotal);

            OrderItem orderItem = new OrderItem(order, product, quantity, product.getPrice());
            orderItems.add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    // Customer: Get current active orders
    @GetMapping("/my-active")
    public ResponseEntity<?> getMyActiveOrders(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> activeStatuses = Arrays.asList("PENDING", "PREPARING", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY");
        List<Order> activeOrders = orderRepository.findByUserAndStatusInOrderByCreatedAtDesc(user, activeStatuses);
        return ResponseEntity.ok(activeOrders);
    }

    // Customer: Get order history (Delivered / Picked Up / Cancelled)
    @GetMapping("/my-history")
    public ResponseEntity<?> getMyOrderHistory(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> historyStatuses = Arrays.asList("DELIVERED", "COMPLETED", "PICKED_UP", "CANCELLED");
        List<Order> historyOrders = orderRepository.findByUserAndStatusInOrderByCreatedAtDesc(user, historyStatuses);
        return ResponseEntity.ok(historyOrders);
    }

    // Customer: Get all my orders
    @GetMapping("/my-all")
    public ResponseEntity<?> getMyOrders(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        return ResponseEntity.ok(orders);
    }

    // Admin: Get all orders across system
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    // Admin or Customer: Update order status / Cancel order
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest statusReq, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = "ADMIN".equalsIgnoreCase(currentUser.getRole());
        boolean isOwner = order.getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        // If customer, can only cancel pending order
        if (!isAdmin) {
            if ("CANCELLED".equalsIgnoreCase(statusReq.getStatus()) && "PENDING".equalsIgnoreCase(order.getStatus())) {
                order.setStatus("CANCELLED");
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Orders cannot be cancelled once baking or preparation has started!"));
            }
        } else {
            // Admin can update to any valid status
            order.setStatus(statusReq.getStatus().toUpperCase());
        }

        Order updated = orderRepository.save(order);
        return ResponseEntity.ok(updated);
    }
}
