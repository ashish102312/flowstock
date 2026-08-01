package com.wareflow.product_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wareflow.product_service.entity.Product;
import com.wareflow.product_service.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class ProductControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Autowired
    private ProductRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).build();
        repository.deleteAll();
    }

    @Test
    void testCreateAndGetProduct() throws Exception {
        Product newProduct = new Product(null, "Test Device", "Smart iot tracking device", "SKU-999", new BigDecimal("199.99"), "Hardware");

        // Create product
        String response = mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newProduct)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Test Device")))
                .andExpect(jsonPath("$.sku", is("SKU-999")))
                .andReturn().getResponse().getContentAsString();

        Product created = objectMapper.readValue(response, Product.class);

        // Get all products
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[*].sku", hasItem("SKU-999")));

        // Get by ID
        mockMvc.perform(get("/api/products/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Test Device")));

        // Update Product
        created.setPrice(new BigDecimal("249.99"));
        mockMvc.perform(put("/api/products/" + created.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.price", is(249.99)));

        // Delete Product
        mockMvc.perform(delete("/api/products/" + created.getId()))
                .andExpect(status().isNoContent());
    }
}
