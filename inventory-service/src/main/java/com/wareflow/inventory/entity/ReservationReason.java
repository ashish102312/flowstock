package com.wareflow.inventory.entity;

/**
 * Reason why an inventory reservation was created.
 * Allows downstream services to distinguish between different hold types.
 */
public enum ReservationReason {
    ORDER_PLACED,
    MANUAL_HOLD,
    QUALITY_CHECK,
    TRANSFER_HOLD
}
