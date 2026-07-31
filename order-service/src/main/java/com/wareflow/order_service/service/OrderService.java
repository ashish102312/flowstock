package com.wareflow.order_service.service;

import com.wareflow.order_service.entity.Order;
import com.wareflow.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository repository;

    public List<Order> getAllOrders() {
        return repository.findAll();
    }

    public List<Order> getOrdersByUser(UUID userId) {
        return repository.findByUserId(userId);
    }

    public Order getOrderById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }

    public Order createOrder(Order order) {
        order.setStatus("PENDING");
        if (order.getItems() != null) {
            order.getItems().forEach(item -> item.setOrder(order));
        }
        return repository.save(order);
    }

    public Order updateOrderStatus(UUID id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return repository.save(order);
    }
}
