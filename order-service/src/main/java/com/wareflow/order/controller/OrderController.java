package com.wareflow.order.controller;

import com.wareflow.order.dto.OrderDTO;
import com.wareflow.order.mapper.OrderMapper;
import com.wareflow.order.repository.OrderRepository;
import com.wareflow.order.saga.OrderSagaManager;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderSagaManager sagaManager;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    @PostMapping
    public ResponseEntity<OrderDTO.Response> placeOrder(
            @RequestHeader(value = "X-User-Id", required = false, defaultValue = "anonymous") String customerId,
            @Valid @RequestBody OrderDTO.Request request) {
            
        var order = sagaManager.placeOrder(customerId, request);
        
        // If order saga triggered compensation, return conflict/unprocessable depending on status
        if (order.getStatus().name().startsWith("CANCELLED")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(orderMapper.toResponse(order));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(orderMapper.toResponse(order));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDTO.Response>> getMyOrders(
            @RequestHeader(value = "X-User-Id", required = false, defaultValue = "anonymous") String customerId) {
        
        List<OrderDTO.Response> orders = orderRepository.findAllByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO.Response> getOrderById(@PathVariable String id) {
        return orderRepository.findById(id)
                .map(orderMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
