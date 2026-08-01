package com.wareflow.product_service.config;

import com.wareflow.product_service.entity.Product;
import com.wareflow.product_service.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.UUID;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository repository;

    public DataInitializer(ProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (repository.count() == 0) {
            UUID product1 = UUID.fromString("00000000-0000-0000-0000-000000000001");
            UUID product2 = UUID.fromString("00000000-0000-0000-0000-000000000002");
            UUID product3 = UUID.fromString("00000000-0000-0000-0000-000000000003");

            repository.save(new Product(product1, "Ultra-Durable Pallet Jack", "Heavy duty industrial pallet truck with 5500 lbs capacity", "PL-JK-01", new BigDecimal("450.00"), "Equipment"));
            repository.save(new Product(product2, "Heavy-Duty Steel Shelving Unit", "Multi-tier industrial storage racking unit", "SH-ST-02", new BigDecimal("220.00"), "Storage"));
            repository.save(new Product(product3, "Industrial Barcode Scanner", "Wireless ergonomic scanner with rugged drop resistance", "SC-IN-03", new BigDecimal("150.00"), "Electronics"));
        }
    }
}
