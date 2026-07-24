package com.wareflow.warehouse.service;

import com.wareflow.warehouse.dto.WarehouseDTO;
import com.wareflow.warehouse.entity.WarehouseStatus;

import java.util.List;

public interface WarehouseService {

    List<WarehouseDTO.Response> getAllWarehouses();

    WarehouseDTO.Response getWarehouseById(String id);

    WarehouseDTO.Response createWarehouse(WarehouseDTO.Request request);

    WarehouseDTO.Response updateWarehouse(String id, WarehouseDTO.Request request);

    void deleteWarehouse(String id);

    List<WarehouseDTO.Response> getWarehousesByStatus(WarehouseStatus status);

    List<WarehouseDTO.Response> getWarehousesWithAvailableCapacity();
}
