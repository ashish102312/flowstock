package com.wareflow.inventory_service.config;

import com.wareflow.inventory_service.entity.Inventory;
import com.wareflow.inventory_service.repository.InventoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.UUID;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final InventoryRepository repository;

    public DataInitializer(InventoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (repository.count() == 0) {
            UUID defaultWarehouse = UUID.fromString("11111111-1111-1111-1111-111111111111");
            UUID product1 = UUID.fromString("00000000-0000-0000-0000-000000000001");
            UUID product2 = UUID.fromString("00000000-0000-0000-0000-000000000002");
            UUID product3 = UUID.fromString("00000000-0000-0000-0000-000000000003");

            repository.save(new Inventory(null, product1, defaultWarehouse, 500, 10));
            repository.save(new Inventory(null, product2, defaultWarehouse, 120, 0));
            repository.save(new Inventory(null, product3, defaultWarehouse, 50, 5));
        }
    }
}
