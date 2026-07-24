package com.wareflow.supplier.mapper;

import com.wareflow.supplier.dto.PurchaseOrderDTO;
import com.wareflow.supplier.dto.SupplierDTO;
import com.wareflow.supplier.entity.PurchaseOrder;
import com.wareflow.supplier.entity.Supplier;
import org.springframework.stereotype.Component;

@Component
public class SupplierMapper {

    public Supplier toEntity(SupplierDTO.Request request) {
        return Supplier.builder()
                .code(request.getCode())
                .name(request.getName())
                .contactPerson(request.getContactPerson())
                .email(request.getEmail())
                .phone(request.getPhone())
                .website(request.getWebsite())
                .addressLine1(request.getAddressLine1())
                .city(request.getCity())
                .country(request.getCountry())
                .build();
    }

    public SupplierDTO.Response toResponse(Supplier supplier) {
        return SupplierDTO.Response.builder()
                .id(supplier.getId())
                .code(supplier.getCode())
                .name(supplier.getName())
                .contactPerson(supplier.getContactPerson())
                .email(supplier.getEmail())
                .phone(supplier.getPhone())
                .website(supplier.getWebsite())
                .addressLine1(supplier.getAddressLine1())
                .city(supplier.getCity())
                .country(supplier.getCountry())
                .status(supplier.getStatus())
                .createdAt(supplier.getCreatedAt())
                .updatedAt(supplier.getUpdatedAt())
                .build();
    }

    public PurchaseOrderDTO.Response toPurchaseOrderResponse(PurchaseOrder order) {
        return PurchaseOrderDTO.Response.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .supplier(toResponse(order.getSupplier()))
                .productId(order.getProductId())
                .quantity(order.getQuantity())
                .unitPrice(order.getUnitPrice())
                .totalAmount(order.getTotalAmount())
                .expectedDeliveryDate(order.getExpectedDeliveryDate())
                .warehouseId(order.getWarehouseId())
                .status(order.getStatus())
                .notes(order.getNotes())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
