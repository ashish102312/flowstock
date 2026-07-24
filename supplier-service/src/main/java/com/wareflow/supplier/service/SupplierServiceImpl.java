package com.wareflow.supplier.service;

import com.wareflow.supplier.dto.PurchaseOrderDTO;
import com.wareflow.supplier.dto.SupplierDTO;
import com.wareflow.supplier.entity.PurchaseOrder;
import com.wareflow.supplier.entity.PurchaseOrderStatus;
import com.wareflow.supplier.entity.Supplier;
import com.wareflow.supplier.entity.SupplierStatus;
import com.wareflow.supplier.mapper.SupplierMapper;
import com.wareflow.supplier.repository.PurchaseOrderRepository;
import com.wareflow.supplier.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierMapper supplierMapper;

    // ── Suppliers ────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<SupplierDTO.Response> getAllSuppliers() {
        return supplierRepository.findAllByIsDeletedFalse()
                .stream().map(supplierMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SupplierDTO.Response getSupplierById(String id) {
        return supplierRepository.findByIdAndIsDeletedFalse(id)
                .map(supplierMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
    }

    @Override
    @Transactional
    public SupplierDTO.Response createSupplier(SupplierDTO.Request request) {
        if (supplierRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("Supplier code already exists: " + request.getCode());
        }
        Supplier supplier = supplierMapper.toEntity(request);
        return supplierMapper.toResponse(supplierRepository.save(supplier));
    }

    @Override
    @Transactional
    public SupplierDTO.Response updateSupplier(String id, SupplierDTO.Request request) {
        Supplier supplier = supplierRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        supplier.setName(request.getName());
        supplier.setContactPerson(request.getContactPerson());
        supplier.setEmail(request.getEmail());
        supplier.setPhone(request.getPhone());
        supplier.setWebsite(request.getWebsite());
        supplier.setAddressLine1(request.getAddressLine1());
        supplier.setCity(request.getCity());
        supplier.setCountry(request.getCountry());
        return supplierMapper.toResponse(supplierRepository.save(supplier));
    }

    @Override
    @Transactional
    public void deleteSupplier(String id) {
        Supplier supplier = supplierRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        supplier.setDeleted(true);
        supplier.setStatus(SupplierStatus.INACTIVE);
        supplierRepository.save(supplier);
    }

    // ── Purchase Orders ──────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderDTO.Response> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll()
                .stream().map(supplierMapper::toPurchaseOrderResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrderDTO.Response getPurchaseOrderById(String id) {
        return purchaseOrderRepository.findById(id)
                .map(supplierMapper::toPurchaseOrderResponse)
                .orElseThrow(() -> new RuntimeException("Purchase order not found: " + id));
    }

    @Override
    @Transactional
    public PurchaseOrderDTO.Response createPurchaseOrder(PurchaseOrderDTO.Request request) {
        Supplier supplier = supplierRepository.findByIdAndIsDeletedFalse(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found: " + request.getSupplierId()));

        BigDecimal total = request.getUnitPrice().multiply(BigDecimal.valueOf(request.getQuantity()));
        String orderNumber = "PO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        PurchaseOrder order = PurchaseOrder.builder()
                .orderNumber(orderNumber)
                .supplier(supplier)
                .productId(request.getProductId())
                .quantity(request.getQuantity())
                .unitPrice(request.getUnitPrice())
                .totalAmount(total)
                .expectedDeliveryDate(request.getExpectedDeliveryDate())
                .warehouseId(request.getWarehouseId())
                .notes(request.getNotes())
                .build();

        return supplierMapper.toPurchaseOrderResponse(purchaseOrderRepository.save(order));
    }

    @Override
    @Transactional
    public PurchaseOrderDTO.Response updatePurchaseOrderStatus(String id, String status) {
        PurchaseOrder order = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase order not found: " + id));
        order.setStatus(PurchaseOrderStatus.valueOf(status.toUpperCase()));
        return supplierMapper.toPurchaseOrderResponse(purchaseOrderRepository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderDTO.Response> getPurchaseOrdersBySupplier(String supplierId) {
        return purchaseOrderRepository.findAllBySupplierId(supplierId)
                .stream().map(supplierMapper::toPurchaseOrderResponse).collect(Collectors.toList());
    }
}
