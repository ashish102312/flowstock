package com.wareflow.supplier.repository;

import com.wareflow.supplier.entity.PurchaseOrder;
import com.wareflow.supplier.entity.PurchaseOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, String> {
    List<PurchaseOrder> findAllBySupplierId(String supplierId);
    List<PurchaseOrder> findAllByStatus(PurchaseOrderStatus status);
    boolean existsByOrderNumber(String orderNumber);
}
