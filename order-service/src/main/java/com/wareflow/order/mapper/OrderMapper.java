package com.wareflow.order.mapper;

import com.wareflow.order.dto.OrderDTO;
import com.wareflow.order.entity.Order;
import com.wareflow.order.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public OrderDTO.Response toResponse(Order order) {
        return OrderDTO.Response.builder()
                .id(order.getId())
                .customerId(order.getCustomerId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .shippingAddress(order.getShippingAddress())
                .notes(order.getNotes())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(order.getItems().stream().map(this::toItemResponse).collect(Collectors.toList()))
                .build();
    }

    private OrderDTO.ItemResponse toItemResponse(OrderItem item) {
        return OrderDTO.ItemResponse.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .warehouseId(item.getWarehouseId())
                .productName(item.getProductName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .build();
    }
}
