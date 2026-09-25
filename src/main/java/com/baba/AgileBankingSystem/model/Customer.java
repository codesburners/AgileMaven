package com.baba.AgileBankingSystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String dateOfBirth;
    private String gender;
    private String address;
    private String city;
    private String country;
    private String registrationDate;
    private String kycStatus;
    private String accountStatus;
    private String riskLevel;
    private List<Document> documents = new ArrayList<>();
    private List<StatusChange> statusHistory = new ArrayList<>();
    private String notes;
}
