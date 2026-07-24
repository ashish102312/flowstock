package com.wareflow.order.saga;

import com.wareflow.order.client.InventoryClient;
import com.wareflow.order.client.ProductClient;
import com.wareflow.order.dto.OrderDTO;
import com.wareflow.order.entity.Order;
import com.wareflow.order.entity.OrderItem;
import com.wareflow.order.entity.OrderStatus;
import com.wareflow.order.entity.PaymentStatus;
import com.wareflow.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Orchestrates the Order Checkout Saga.
 * Uses Choreography via synchronous REST (Feign) for simplicity in this phase.
 *
 * Flow:
 * 1. Validate pricing (Product Service).
 * 2. Create Order in PENDING state.
 * 3. Reserve Inventory (Inventory Service).
 * 4. Simulate Payment.
 * 5. Confirm or Compensate (Cancel).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderSagaManager {

    private final OrderRepository orderRepository;
    private final ProductClient productClient;
    private final InventoryClient inventoryClient;

    /**
     * Entry point for the checkout saga.
     */
    @Transactional
    public Order placeOrder(String customerId, OrderDTO.Request request) {
        log.info("Starting order saga for customer: {}", customerId);

        // 1. Create and validate order (Product Service call)
        Order order = createPendingOrder(customerId, request);

        // 2. Reserve Inventory
        boolean inventoryReserved = reserveInventoryForOrder(order);

        if (!inventoryReserved) {
            log.error("Saga Compensation: Inventory reservation failed for Order {}", order.getId());
            order.setStatus(OrderStatus.CANCELLED_NO_INVENTORY);
            return orderRepository.save(order);
        }
        
        order.setStatus(OrderStatus.INVENTORY_RESERVED);
        orderRepository.save(order);

        // 3. Simulate Payment
        boolean paymentSuccess = simulatePayment(order);

        if (!paymentSuccess) {
            log.error("Saga Compensation: Payment failed for Order {}. Releasing inventory.", order.getId());
            order.setStatus(OrderStatus.PAYMENT_FAILED);
            order.setPaymentStatus(PaymentStatus.FAILED);
            orderRepository.save(order);
            
            compensateInventory(order);
            return order;
        }

        // 4. Confirm Order (Commit reservations)
        order.setStatus(OrderStatus.CONFIRMED);
        order.setPaymentStatus(PaymentStatus.PAID);
        orderRepository.save(order);
        
        commitInventory(order);

        log.info("Order saga completed successfully for Order {}", order.getId());
        return order;
    }

    private Order createPendingOrder(String customerId, OrderDTO.Request request) {
        Order order = Order.builder()
                .customerId(customerId)
                .shippingAddress(request.getShippingAddress())
                .notes(request.getNotes())
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (OrderDTO.ItemRequest itemReq : request.getItems()) {
            // Synchronous call to Product Catalog to fetch actual price and name
            ProductClient.ProductDTO productDTO = productClient.getProductById(itemReq.getProductId());
            
            BigDecimal lineTotal = productDTO.basePrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            total = total.add(lineTotal);

            OrderItem orderItem = OrderItem.builder()
                    .productId(itemReq.getProductId())
                    .warehouseId(itemReq.getWarehouseId())
                    .productName(productDTO.name())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(productDTO.basePrice())
                    .totalPrice(lineTotal)
                    .build();

            order.addItem(orderItem);
        }

        order.setTotalAmount(total);
        return orderRepository.save(order);
    }

    private boolean reserveInventoryForOrder(Order order) {
        try {
            for (OrderItem item : order.getItems()) {
                // 1. Fetch inventory item ID
                InventoryClient.InventoryItemDTO invItem = inventoryClient.getItem(item.getProductId(), item.getWarehouseId());
                
                // 2. Request reservation
                InventoryClient.ReservationRequest req = InventoryClient.ReservationRequest.builder()
                        .quantity(item.getQuantity())
                        .referenceId(order.getId())
                        .reason("ORDER_PLACED")
                        .build();
                        
                InventoryClient.ReservationResponse res = inventoryClient.reserveStock(invItem.getId(), req);
                
                // 3. Save reservation ID on the OrderItem for later commit/rollback
                item.setInventoryReservationId(res.getId());
            }
            return true;
        } catch (Exception e) {
            log.error("Inventory reservation failed for Order {}", order.getId(), e);
            return false;
        }
    }

    private boolean simulatePayment(Order order) {
        // Mock payment gateway. Randomly fail 10% of the time, or fail if amount > $10,000 (fraud check)
        if (order.getTotalAmount().compareTo(new BigDecimal("10000")) > 0) {
            return false; // Fraud check failed
        }
        return Math.random() > 0.1; // 10% random failure
    }

    private void compensateInventory(Order order) {
        for (OrderItem item : order.getItems()) {
            if (item.getInventoryReservationId() != null) {
                try {
                    inventoryClient.releaseReservation(item.getInventoryReservationId());
                } catch (Exception e) {
                    log.error("CRITICAL: Failed to release inventory during compensation for reservation {}", item.getInventoryReservationId());
                    // In a real system, this goes to a Dead Letter Queue for manual intervention
                }
            }
        }
    }

    private void commitInventory(Order order) {
        for (OrderItem item : order.getItems()) {
            if (item.getInventoryReservationId() != null) {
                try {
                    inventoryClient.consumeReservation(item.getInventoryReservationId());
                } catch (Exception e) {
                    log.error("CRITICAL: Failed to consume inventory during commit for reservation {}", item.getInventoryReservationId());
                }
            }
        }
    }
}
