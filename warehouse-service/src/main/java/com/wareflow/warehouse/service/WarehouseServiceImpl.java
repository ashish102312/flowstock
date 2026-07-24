package com.wareflow.warehouse.service;

import com.wareflow.warehouse.dto.WarehouseDTO;
import com.wareflow.warehouse.entity.Warehouse;
import com.wareflow.warehouse.entity.WarehouseStatus;
import com.wareflow.warehouse.exception.ResourceNotFoundException;
import com.wareflow.warehouse.mapper.WarehouseMapper;
import com.wareflow.warehouse.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final WarehouseMapper warehouseMapper;

    @Override
    @Transactional(readOnly = true)
    public List<WarehouseDTO.Response> getAllWarehouses() {
        log.info("Fetching all active warehouses");
        return warehouseRepository.findAllByIsDeletedFalse()
                .stream()
                .map(warehouseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public WarehouseDTO.Response getWarehouseById(String id) {
        log.info("Fetching warehouse by id: {}", id);
        Warehouse warehouse = warehouseRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with id: " + id));
        return warehouseMapper.toResponse(warehouse);
    }

    @Override
    @Transactional
    public WarehouseDTO.Response createWarehouse(WarehouseDTO.Request request) {
        log.info("Creating new warehouse with code: {}", request.getCode());
        if (warehouseRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("Warehouse code already exists: " + request.getCode());
        }
        Warehouse warehouse = warehouseMapper.toEntity(request);
        Warehouse saved = warehouseRepository.save(warehouse);
        log.info("Warehouse created with id: {}", saved.getId());
        return warehouseMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public WarehouseDTO.Response updateWarehouse(String id, WarehouseDTO.Request request) {
        log.info("Updating warehouse with id: {}", id);
        Warehouse warehouse = warehouseRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with id: " + id));

        warehouse.setName(request.getName());
        warehouse.setDescription(request.getDescription());
        warehouse.setAddressLine1(request.getAddressLine1());
        warehouse.setAddressLine2(request.getAddressLine2());
        warehouse.setCity(request.getCity());
        warehouse.setState(request.getState());
        warehouse.setCountry(request.getCountry());
        warehouse.setPostalCode(request.getPostalCode());
        warehouse.setLatitude(request.getLatitude());
        warehouse.setLongitude(request.getLongitude());
        warehouse.setTotalCapacity(request.getTotalCapacity());

        return warehouseMapper.toResponse(warehouseRepository.save(warehouse));
    }

    @Override
    @Transactional
    public void deleteWarehouse(String id) {
        log.info("Soft-deleting warehouse with id: {}", id);
        Warehouse warehouse = warehouseRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with id: " + id));
        warehouse.setDeleted(true);
        warehouse.setStatus(WarehouseStatus.INACTIVE);
        warehouseRepository.save(warehouse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WarehouseDTO.Response> getWarehousesByStatus(WarehouseStatus status) {
        return warehouseRepository.findAllByStatusAndIsDeletedFalse(status)
                .stream()
                .map(warehouseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<WarehouseDTO.Response> getWarehousesWithAvailableCapacity() {
        return warehouseRepository.findWarehousesWithAvailableCapacity()
                .stream()
                .map(warehouseMapper::toResponse)
                .collect(Collectors.toList());
    }
}
