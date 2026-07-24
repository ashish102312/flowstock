package com.wareflow.order.repository;

import com.wareflow.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findAllByCustomerIdOrderByCreatedAtDesc(String customerId);
}
