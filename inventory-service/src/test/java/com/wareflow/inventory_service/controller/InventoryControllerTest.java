package com.wareflow.inventory_service.controller;

import com.wareflow.inventory_service.entity.Inventory;
import com.wareflow.inventory_service.repository.InventoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class InventoryControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Autowired
    private InventoryRepository repository;

    private UUID productId;
    private UUID warehouseId;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        repository.deleteAll();
        productId = UUID.randomUUID();
        warehouseId = UUID.randomUUID();
    }

    @Test
    void testAddStockAndRetrieve() throws Exception {
        mockMvc.perform(post("/api/inventory/add")
                .param("productId", productId.toString())
                .param("warehouseId", warehouseId.toString())
                .param("quantity", "100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productId").value(productId.toString()))
                .andExpect(jsonPath("$.warehouseId").value(warehouseId.toString()))
                .andExpect(jsonPath("$.quantity").value(100))
                .andExpect(jsonPath("$.reserved").value(0));

        mockMvc.perform(get("/api/inventory"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].quantity").value(100));

        mockMvc.perform(get("/api/inventory/product/" + productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].productId").value(productId.toString()));

        mockMvc.perform(get("/api/inventory/warehouse/" + warehouseId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].warehouseId").value(warehouseId.toString()));
    }

    @Test
    void testReserveStockSuccessAndFailure() throws Exception {
        repository.save(new Inventory(null, productId, warehouseId, 50, 0));

        mockMvc.perform(post("/api/inventory/reserve")
                .param("productId", productId.toString())
                .param("warehouseId", warehouseId.toString())
                .param("quantity", "30"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        mockMvc.perform(post("/api/inventory/reserve")
                .param("productId", productId.toString())
                .param("warehouseId", warehouseId.toString())
                .param("quantity", "30"))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }
}
