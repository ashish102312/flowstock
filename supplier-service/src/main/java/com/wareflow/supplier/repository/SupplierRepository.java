package com.wareflow.supplier.repository;

import com.wareflow.supplier.entity.Supplier;
import com.wareflow.supplier.entity.SupplierStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, String> {
    List<Supplier> findAllByIsDeletedFalse();
    Optional<Supplier> findByIdAndIsDeletedFalse(String id);
    List<Supplier> findAllByStatusAndIsDeletedFalse(SupplierStatus status);
    boolean existsByCode(String code);
}
