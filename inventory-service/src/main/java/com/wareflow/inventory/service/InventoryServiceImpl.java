package com.wareflow.inventory.service;

import com.wareflow.inventory.config.RabbitMQConfig;
import com.wareflow.inventory.dto.InventoryDTO;
import com.wareflow.inventory.entity.*;
import com.wareflow.inventory.exception.InsufficientStockException;
import com.wareflow.inventory.lock.DistributedLockManager;
import com.wareflow.inventory.mapper.InventoryMapper;
import com.wareflow.inventory.repository.InventoryRepository;
import com.wareflow.inventory.repository.ReservationRepository;
import com.wareflow.inventory.repository.StockAuditRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ReservationRepository reservationRepository;
    private final StockAuditRepository auditRepository;
    private final InventoryMapper mapper;
    private final DistributedLockManager lockManager;
    private final RabbitTemplate rabbitTemplate;

    // ── Queries ──────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<InventoryDTO.Response> getInventoryByProduct(String productId) {
        return inventoryRepository.findAllByProductId(productId).stream()
                .map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryDTO.Response> getInventoryByWarehouse(String warehouseId) {
        return inventoryRepository.findAllByWarehouseId(warehouseId).stream()
                .map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryDTO.Response getInventoryItem(String productId, String warehouseId) {
        return inventoryRepository.findByProductIdAndWarehouseId(productId, warehouseId)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryDTO.Response> getLowStockItems() {
        return inventoryRepository.findLowStockItems().stream()
                .map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryDTO.AuditResponse> getAuditLogByProduct(String productId) {
        return auditRepository.findAllByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(mapper::toAuditResponse).collect(Collectors.toList());
    }

    // ── Setup / Initialization ───────────────────────────────────────────────────

    @Override
    @Transactional
    public InventoryDTO.Response initializeInventory(InventoryDTO.Request request) {
        if (inventoryRepository.existsByProductIdAndWarehouseId(request.getProductId(), request.getWarehouseId())) {
            throw new IllegalArgumentException("Inventory already initialized for this product and warehouse");
        }

        InventoryItem item = InventoryItem.builder()
                .productId(request.getProductId())
                .warehouseId(request.getWarehouseId())
                .availableQty(request.getInitialQty())
                .lowStockThreshold(request.getLowStockThreshold() != null ? request.getLowStockThreshold() : 10)
                .reorderPoint(request.getReorderPoint() != null ? request.getReorderPoint() : 5)
                .build();

        item = inventoryRepository.save(item);

        if (request.getInitialQty() > 0) {
            logAudit(item, AuditAction.STOCK_ADDED, 0, request.getInitialQty(), request.getInitialQty(), "INITIALIZATION", "SYSTEM", "Initial setup");
        }

        return mapper.toResponse(item);
    }

    // ── Operations ───────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public InventoryDTO.Response adjustStock(String id, InventoryDTO.AdjustmentRequest request) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));

        int before = item.getAvailableQty();
        int after = before + request.getDelta();

        if (after < 0) {
            throw new InsufficientStockException("Cannot adjust below 0. Current available: " + before);
        }

        item.setAvailableQty(after);
        item = inventoryRepository.save(item);

        AuditAction action = request.getDelta() > 0 ? AuditAction.STOCK_ADDED : AuditAction.STOCK_REMOVED;
        logAudit(item, action, before, after, request.getDelta(), request.getReferenceId(), request.getPerformedBy(), request.getReason());

        checkLowStock(item);

        return mapper.toResponse(item);
    }

    @Override
    public InventoryDTO.ReservationResponse reserveStock(String id, InventoryDTO.ReservationRequest request) {
        // Lock key specific to the inventory item
        String lockKey = "lock:inventory:reserve:" + id;

        // Execute reservation logic inside distributed lock
        return lockManager.executeWithLock(lockKey, () -> {
            return executeReservationTransaction(id, request);
        });
    }

    @Transactional
    protected InventoryDTO.ReservationResponse executeReservationTransaction(String id, InventoryDTO.ReservationRequest request) {
        // Use pessimistic lock at DB level as secondary defense against lost updates
        InventoryItem item = inventoryRepository.findByIdWithPessimisticLock(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));

        if (item.getAvailableQty() < request.getQuantity()) {
            throw new InsufficientStockException("Insufficient stock. Available: " + item.getAvailableQty() + ", Requested: " + request.getQuantity());
        }

        int before = item.getAvailableQty();
        
        // Decrement available, increment reserved
        item.setAvailableQty(item.getAvailableQty() - request.getQuantity());
        item.setReservedQty(item.getReservedQty() + request.getQuantity());
        item = inventoryRepository.save(item);

        // Create reservation record
        InventoryReservation reservation = InventoryReservation.builder()
                .inventoryItem(item)
                .referenceId(request.getReferenceId())
                .quantity(request.getQuantity())
                .reason(request.getReason())
                .build();
        reservation = reservationRepository.save(reservation);

        // Audit
        logAudit(item, AuditAction.STOCK_RESERVED, before, item.getAvailableQty(), -request.getQuantity(), request.getReferenceId(), "SYSTEM", "Reserved for " + request.getReason());

        // Emit Reserved Event
        rabbitTemplate.convertAndSend(RabbitMQConfig.INVENTORY_EXCHANGE, RabbitMQConfig.RESERVED_ROUTING_KEY, mapper.toReservationResponse(reservation));

        // Check if this reservation triggered a low stock alert
        checkLowStock(item);

        return mapper.toReservationResponse(reservation);
    }

    @Override
    @Transactional
    public void releaseReservation(String reservationId) {
        InventoryReservation res = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (res.isReleased()) return;

        InventoryItem item = res.getInventoryItem();
        int before = item.getAvailableQty();

        // Increment available, decrement reserved
        item.setAvailableQty(item.getAvailableQty() + res.getQuantity());
        item.setReservedQty(item.getReservedQty() - res.getQuantity());
        inventoryRepository.save(item);

        res.setReleased(true);
        res.setReleasedAt(LocalDateTime.now());
        reservationRepository.save(res);

        logAudit(item, AuditAction.RESERVATION_RELEASED, before, item.getAvailableQty(), res.getQuantity(), res.getReferenceId(), "SYSTEM", "Reservation released");

        // Emit Released Event
        rabbitTemplate.convertAndSend(RabbitMQConfig.INVENTORY_EXCHANGE, RabbitMQConfig.RELEASED_ROUTING_KEY, mapper.toReservationResponse(res));
    }

    @Override
    @Transactional
    public void consumeReservation(String reservationId) {
        InventoryReservation res = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (res.isReleased()) {
            throw new IllegalStateException("Cannot consume an already released reservation");
        }

        InventoryItem item = res.getInventoryItem();
        
        // Permanent decrement of reserved (stock has physically left the building)
        item.setReservedQty(item.getReservedQty() - res.getQuantity());
        inventoryRepository.save(item);

        res.setReleased(true);
        res.setReleasedAt(LocalDateTime.now());
        reservationRepository.save(res);

        // Delta is 0 for available, because we are dropping reserved
        logAudit(item, AuditAction.RESERVATION_CONSUMED, item.getAvailableQty(), item.getAvailableQty(), 0, res.getReferenceId(), "SYSTEM", "Reservation fulfilled/consumed");
    }

    // ── Internals ────────────────────────────────────────────────────────────────

    private void checkLowStock(InventoryItem item) {
        if (item.isLowStock()) {
            log.warn("LOW STOCK ALERT: Product {}, Warehouse {}, Available {}", item.getProductId(), item.getWarehouseId(), item.getAvailableQty());
            rabbitTemplate.convertAndSend(RabbitMQConfig.INVENTORY_EXCHANGE, RabbitMQConfig.LOW_STOCK_ROUTING_KEY, mapper.toResponse(item));
        }
    }

    private void logAudit(InventoryItem item, AuditAction action, int before, int after, int delta, String ref, String by, String notes) {
        StockAudit audit = StockAudit.builder()
                .inventoryItemId(item.getId())
                .productId(item.getProductId())
                .warehouseId(item.getWarehouseId())
                .action(action)
                .quantityBefore(before)
                .quantityAfter(after)
                .delta(delta)
                .referenceId(ref)
                .performedBy(by)
                .notes(notes)
                .build();
        auditRepository.save(audit);
    }
}
