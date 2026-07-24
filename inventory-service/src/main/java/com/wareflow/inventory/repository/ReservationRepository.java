package com.wareflow.inventory.repository;

import com.wareflow.inventory.entity.InventoryReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<InventoryReservation, String> {
    List<InventoryReservation> findAllByInventoryItemId(String inventoryItemId);
    Optional<InventoryReservation> findByReferenceIdAndInventoryItemId(String referenceId, String inventoryItemId);
    List<InventoryReservation> findAllByReferenceId(String referenceId);
}
