package com.wareflow.inventory_service.service;

import com.wareflow.inventory_service.entity.Inventory;
import com.wareflow.inventory_service.repository.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class InventoryService {

    private final InventoryRepository repository;

    public InventoryService(InventoryRepository repository) {
        this.repository = repository;
    }

    public List<Inventory> getAllInventory() {
        return repository.findAll();
    }

    public List<Inventory> getInventoryByProduct(UUID productId) {
        return repository.findByProductId(productId);
    }

    public List<Inventory> getInventoryByWarehouse(UUID warehouseId) {
        return repository.findByWarehouseId(warehouseId);
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

    @Transactional
    public Inventory updateInventory(UUID id, int quantity) {
        Inventory inventory = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventory not found"));
        inventory.setQuantity(quantity);
        return repository.save(inventory);
    }

    @Transactional
    public void deleteInventory(UUID id) {
        repository.deleteById(id);
    }
}
