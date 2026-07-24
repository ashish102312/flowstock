package com.wareflow.inventory.mapper;

import com.wareflow.inventory.dto.InventoryDTO;
import com.wareflow.inventory.entity.InventoryItem;
import com.wareflow.inventory.entity.InventoryReservation;
import com.wareflow.inventory.entity.StockAudit;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {

    public InventoryDTO.Response toResponse(InventoryItem item) {
        return InventoryDTO.Response.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .warehouseId(item.getWarehouseId())
                .availableQty(item.getAvailableQty())
                .reservedQty(item.getReservedQty())
                .damagedQty(item.getDamagedQty())
                .incomingQty(item.getIncomingQty())
                .totalQty(item.getTotalQty())
                .lowStockThreshold(item.getLowStockThreshold())
                .reorderPoint(item.getReorderPoint())
                .lowStock(item.isLowStock())
                .version(item.getVersion())
                .updatedAt(item.getUpdatedAt())
                .build();
    }

    public InventoryDTO.ReservationResponse toReservationResponse(InventoryReservation reservation) {
        return InventoryDTO.ReservationResponse.builder()
                .id(reservation.getId())
                .inventoryItemId(reservation.getInventoryItem().getId())
                .referenceId(reservation.getReferenceId())
                .quantity(reservation.getQuantity())
                .reason(reservation.getReason())
                .released(reservation.isReleased())
                .createdAt(reservation.getCreatedAt())
                .build();
    }

    public InventoryDTO.AuditResponse toAuditResponse(StockAudit audit) {
        return InventoryDTO.AuditResponse.builder()
                .id(audit.getId())
                .inventoryItemId(audit.getInventoryItemId())
                .productId(audit.getProductId())
                .warehouseId(audit.getWarehouseId())
                .action(audit.getAction())
                .quantityBefore(audit.getQuantityBefore())
                .quantityAfter(audit.getQuantityAfter())
                .delta(audit.getDelta())
                .referenceId(audit.getReferenceId())
                .performedBy(audit.getPerformedBy())
                .notes(audit.getNotes())
                .createdAt(audit.getCreatedAt())
                .build();
    }
}
