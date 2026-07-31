package com.wareflow.inventory_service.service;

import com.wareflow.inventory_service.entity.Inventory;
import com.wareflow.inventory_service.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository repository;

    public List<Inventory> getAllInventory() {
        return repository.findAll();
    }

    public List<Inventory> getInventoryByProduct(UUID productId) {
        return repository.findByProductId(productId);
    }

    @Transactional
    public Inventory addStock(UUID productId, UUID warehouseId, int quantity) {
        Inventory inventory = repository.findByProductIdAndWarehouseId(productId, warehouseId)
                .orElseGet(() -> {
                    Inventory inv = new Inventory();
                    inv.setProductId(productId);
                    inv.setWarehouseId(warehouseId);
                    inv.setQuantity(0);
                    inv.setReserved(0);
                    return inv;
                });
        
        inventory.setQuantity(inventory.getQuantity() + quantity);
        return repository.save(inventory);
    }

    @Transactional
    public boolean reserveStock(UUID productId, UUID warehouseId, int quantity) {
        Inventory inventory = repository.findByProductIdAndWarehouseId(productId, warehouseId)
                .orElseThrow(() -> new IllegalArgumentException("Inventory not found"));

        if (inventory.getQuantity() - inventory.getReserved() >= quantity) {
            inventory.setReserved(inventory.getReserved() + quantity);
            repository.save(inventory);
            return true;
        }
        return false;
    }
}
