package com.wareflow.warehouse.repository;

import com.wareflow.warehouse.entity.Warehouse;
import com.wareflow.warehouse.entity.WarehouseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, String> {

    List<Warehouse> findAllByIsDeletedFalse();

    List<Warehouse> findAllByStatusAndIsDeletedFalse(WarehouseStatus status);

    Optional<Warehouse> findByIdAndIsDeletedFalse(String id);

    boolean existsByCode(String code);

    @Query("SELECT w FROM Warehouse w WHERE w.isDeleted = false AND (w.totalCapacity - w.usedCapacity) > 0 ORDER BY (w.totalCapacity - w.usedCapacity) DESC")
    List<Warehouse> findWarehousesWithAvailableCapacity();
}
