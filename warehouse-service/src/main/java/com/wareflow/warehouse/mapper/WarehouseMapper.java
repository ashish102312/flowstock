package com.wareflow.warehouse.mapper;

import com.wareflow.warehouse.dto.WarehouseDTO;
import com.wareflow.warehouse.entity.Warehouse;
import org.springframework.stereotype.Component;

@Component
public class WarehouseMapper {

    public Warehouse toEntity(WarehouseDTO.Request request) {
        return Warehouse.builder()
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .addressLine1(request.getAddressLine1())
                .addressLine2(request.getAddressLine2())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .postalCode(request.getPostalCode())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .totalCapacity(request.getTotalCapacity())
                .usedCapacity(0)
                .build();
    }

    public WarehouseDTO.Response toResponse(Warehouse warehouse) {
        int available = warehouse.getTotalCapacity() - warehouse.getUsedCapacity();
        double utilization = warehouse.getTotalCapacity() > 0
                ? (double) warehouse.getUsedCapacity() / warehouse.getTotalCapacity() * 100
                : 0.0;

        return WarehouseDTO.Response.builder()
                .id(warehouse.getId())
                .code(warehouse.getCode())
                .name(warehouse.getName())
                .description(warehouse.getDescription())
                .addressLine1(warehouse.getAddressLine1())
                .addressLine2(warehouse.getAddressLine2())
                .city(warehouse.getCity())
                .state(warehouse.getState())
                .country(warehouse.getCountry())
                .postalCode(warehouse.getPostalCode())
                .latitude(warehouse.getLatitude())
                .longitude(warehouse.getLongitude())
                .totalCapacity(warehouse.getTotalCapacity())
                .usedCapacity(warehouse.getUsedCapacity())
                .availableCapacity(available)
                .utilizationPercent(Math.round(utilization * 10.0) / 10.0)
                .status(warehouse.getStatus())
                .createdAt(warehouse.getCreatedAt())
                .updatedAt(warehouse.getUpdatedAt())
                .build();
    }
}
