package com.wareflow.supplier.service;

import com.wareflow.supplier.dto.PurchaseOrderDTO;
import com.wareflow.supplier.dto.SupplierDTO;
import java.util.List;

public interface SupplierService {
    List<SupplierDTO.Response> getAllSuppliers();
    SupplierDTO.Response getSupplierById(String id);
    SupplierDTO.Response createSupplier(SupplierDTO.Request request);
    SupplierDTO.Response updateSupplier(String id, SupplierDTO.Request request);
    void deleteSupplier(String id);

    List<PurchaseOrderDTO.Response> getAllPurchaseOrders();
    PurchaseOrderDTO.Response getPurchaseOrderById(String id);
    PurchaseOrderDTO.Response createPurchaseOrder(PurchaseOrderDTO.Request request);
    PurchaseOrderDTO.Response updatePurchaseOrderStatus(String id, String status);
    List<PurchaseOrderDTO.Response> getPurchaseOrdersBySupplier(String supplierId);
}
