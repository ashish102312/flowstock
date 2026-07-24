package com.wareflow.inventory.repository;

import com.wareflow.inventory.entity.InventoryItem;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryItem, String> {

    Optional<InventoryItem> findByProductIdAndWarehouseId(String productId, String warehouseId);

    List<InventoryItem> findAllByProductId(String productId);

    List<InventoryItem> findAllByWarehouseId(String warehouseId);

    boolean existsByProductIdAndWarehouseId(String productId, String warehouseId);

    /**
     * Finds items where available quantity is below or equal to the low stock threshold.
     */
    @Query("SELECT i FROM InventoryItem i WHERE i.availableQty <= i.lowStockThreshold")
    List<InventoryItem> findLowStockItems();

    /**
     * Pessimistic Write Lock.
     * Useful for forced synchronization at DB level if Redis lock isn't sufficient.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM InventoryItem i WHERE i.id = :id")
    Optional<InventoryItem> findByIdWithPessimisticLock(String id);
}
