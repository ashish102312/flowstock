package com.wareflow.inventory_service.service;

import com.wareflow.inventory_service.entity.Inventory;
import com.wareflow.inventory_service.repository.InventoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock
    private InventoryRepository repository;

    @InjectMocks
    private InventoryService service;

    private UUID productId;
    private UUID warehouseId;
    private Inventory sampleInventory;

    @BeforeEach
    void setUp() {
        productId = UUID.randomUUID();
        warehouseId = UUID.randomUUID();
        sampleInventory = new Inventory(UUID.randomUUID(), productId, warehouseId, 50, 10);
    }

    @Test
    void getAllInventory_returnsAll() {
        when(repository.findAll()).thenReturn(List.of(sampleInventory));

        List<Inventory> result = service.getAllInventory();

        assertEquals(1, result.size());
        assertEquals(sampleInventory, result.get(0));
        verify(repository, times(1)).findAll();
    }

    @Test
    void getInventoryByProduct_returnsMatching() {
        when(repository.findByProductId(productId)).thenReturn(List.of(sampleInventory));

        List<Inventory> result = service.getInventoryByProduct(productId);

        assertEquals(1, result.size());
        assertEquals(productId, result.get(0).getProductId());
        verify(repository, times(1)).findByProductId(productId);
    }

    @Test
    void getInventoryByWarehouse_returnsMatching() {
        when(repository.findByWarehouseId(warehouseId)).thenReturn(List.of(sampleInventory));

        List<Inventory> result = service.getInventoryByWarehouse(warehouseId);

        assertEquals(1, result.size());
        assertEquals(warehouseId, result.get(0).getWarehouseId());
        verify(repository, times(1)).findByWarehouseId(warehouseId);
    }

    @Test
    void addStock_whenNewItem_createsAndSaves() {
        when(repository.findByProductIdAndWarehouseId(productId, warehouseId)).thenReturn(Optional.empty());
        when(repository.save(any(Inventory.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Inventory result = service.addStock(productId, warehouseId, 25);

        assertNotNull(result);
        assertEquals(productId, result.getProductId());
        assertEquals(warehouseId, result.getWarehouseId());
        assertEquals(25, result.getQuantity());
        assertEquals(0, result.getReserved());
        verify(repository, times(1)).save(any(Inventory.class));
    }

    @Test
    void addStock_whenExistingItem_incrementsAndSaves() {
        when(repository.findByProductIdAndWarehouseId(productId, warehouseId)).thenReturn(Optional.of(sampleInventory));
        when(repository.save(any(Inventory.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Inventory result = service.addStock(productId, warehouseId, 20);

        assertEquals(70, result.getQuantity());
        assertEquals(10, result.getReserved());
        verify(repository, times(1)).save(sampleInventory);
    }

    @Test
    void reserveStock_whenSufficientStock_incrementsReservedAndReturnsTrue() {
        when(repository.findByProductIdAndWarehouseId(productId, warehouseId)).thenReturn(Optional.of(sampleInventory));
        when(repository.save(any(Inventory.class))).thenAnswer(invocation -> invocation.getArgument(0));

        boolean result = service.reserveStock(productId, warehouseId, 30);

        assertTrue(result);
        assertEquals(40, sampleInventory.getReserved());
        verify(repository, times(1)).save(sampleInventory);
    }

    @Test
    void reserveStock_whenInsufficientStock_returnsFalseWithoutSaving() {
        when(repository.findByProductIdAndWarehouseId(productId, warehouseId)).thenReturn(Optional.of(sampleInventory));

        boolean result = service.reserveStock(productId, warehouseId, 50);

        assertFalse(result);
        assertEquals(10, sampleInventory.getReserved());
        verify(repository, never()).save(sampleInventory);
    }

    @Test
    void reserveStock_whenItemNotFound_throwsException() {
        when(repository.findByProductIdAndWarehouseId(productId, warehouseId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.reserveStock(productId, warehouseId, 5));
    }
}
