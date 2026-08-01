package com.wareflow.product_service.service;

import com.wareflow.product_service.entity.Product;
import com.wareflow.product_service.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    @Mock
    private ProductRepository repository;

    @InjectMocks
    private ProductService service;

    private UUID productId;
    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        productId = UUID.randomUUID();
        sampleProduct = new Product(productId, "Test Widget", "A high quality test widget", "TW-100", new BigDecimal("49.99"), "Widgets");
    }

    @Test
    void testGetAllProducts() {
        when(repository.findAll()).thenReturn(List.of(sampleProduct));

        List<Product> products = service.getAllProducts();

        assertEquals(1, products.size());
        assertEquals("Test Widget", products.get(0).getName());
        verify(repository, times(1)).findAll();
    }

    @Test
    void testGetProductById_Success() {
        when(repository.findById(productId)).thenReturn(Optional.of(sampleProduct));

        Product found = service.getProductById(productId);

        assertNotNull(found);
        assertEquals(productId, found.getId());
        assertEquals("TW-100", found.getSku());
    }

    @Test
    void testGetProductById_NotFound() {
        when(repository.findById(any())).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.getProductById(UUID.randomUUID()));
    }

    @Test
    void testCreateProduct_Success() {
        when(repository.findBySku(sampleProduct.getSku())).thenReturn(Optional.empty());
        when(repository.save(sampleProduct)).thenReturn(sampleProduct);

        Product created = service.createProduct(sampleProduct);

        assertNotNull(created);
        assertEquals("Test Widget", created.getName());
        verify(repository, times(1)).save(sampleProduct);
    }

    @Test
    void testCreateProduct_DuplicateSku() {
        when(repository.findBySku(sampleProduct.getSku())).thenReturn(Optional.of(sampleProduct));

        assertThrows(IllegalArgumentException.class, () -> service.createProduct(sampleProduct));
        verify(repository, never()).save(any());
    }

    @Test
    void testUpdateProduct_Success() {
        Product updatedData = new Product(null, "Updated Name", "Updated Desc", "TW-100", new BigDecimal("59.99"), "NewCat");
        when(repository.findById(productId)).thenReturn(Optional.of(sampleProduct));
        when(repository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        Product result = service.updateProduct(productId, updatedData);

        assertEquals("Updated Name", result.getName());
        assertEquals("Updated Desc", result.getDescription());
        assertEquals(new BigDecimal("59.99"), result.getPrice());
        assertEquals("NewCat", result.getCategory());
        verify(repository, times(1)).save(any(Product.class));
    }

    @Test
    void testDeleteProduct() {
        doNothing().when(repository).deleteById(productId);

        service.deleteProduct(productId);

        verify(repository, times(1)).deleteById(productId);
    }
}
