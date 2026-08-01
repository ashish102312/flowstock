package com.wareflow.user_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.Objects;

@Entity
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    private String userId; // 5-digit user ID (e.g. "10001")

    private String phoneNumber;
    private String address;
    private String department;

    public UserProfile() {
    }

    public UserProfile(String userId, String phoneNumber, String address, String department) {
        this.userId = userId;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.department = department;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserProfile that = (UserProfile) o;
        return Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId);
    }

    @Override
    public String toString() {
        return "UserProfile{" +
               "userId='" + userId + '\'' +
               ", phoneNumber='" + phoneNumber + '\'' +
               ", address='" + address + '\'' +
               ", department='" + department + '\'' +
               '}';
    }
}
