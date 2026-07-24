package com.wareflow.inventory.repository;

import com.wareflow.inventory.entity.StockAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockAuditRepository extends JpaRepository<StockAudit, String> {
    List<StockAudit> findAllByInventoryItemIdOrderByCreatedAtDesc(String inventoryItemId);
    List<StockAudit> findAllByProductIdOrderByCreatedAtDesc(String productId);
}
