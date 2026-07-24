package com.wareflow.order.entity;

public enum OrderStatus {
    PENDING,                 // Initial state
    INVENTORY_RESERVED,      // Reserved in inventory
    PAYMENT_FAILED,          // Simulated payment failure
    CANCELLED_NO_INVENTORY,  // Saga compensation triggered due to out of stock
    CONFIRMED,               // Payment successful, order is final
    SHIPPED,
    DELIVERED
}
