package com.wareflow.inventory_service.repository;

import com.wareflow.inventory_service.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, UUID> {
    Optional<Inventory> findByProductIdAndWarehouseId(UUID productId, UUID warehouseId);
    List<Inventory> findByProductId(UUID productId);
    List<Inventory> findByWarehouseId(UUID warehouseId);
}
