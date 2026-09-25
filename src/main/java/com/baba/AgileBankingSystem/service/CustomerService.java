package com.baba.AgileBankingSystem.service;

import com.baba.AgileBankingSystem.model.Customer;
import com.baba.AgileBankingSystem.model.Document;
import com.baba.AgileBankingSystem.model.StatusChange;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final Map<String, Customer> customers = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        loadSeedData();
    }

    // ── CRUD ──────────────────────────────────────────────────

    public List<Customer> getAll() {
        return new ArrayList<>(customers.values());
    }

    public Optional<Customer> getById(String id) {
        return Optional.ofNullable(customers.get(id));
    }

    public Customer add(Customer customer) {
        if (customer.getId() == null || customer.getId().isBlank()) {
            customer.setId(generateId());
        }
        if (customer.getDocuments() == null) customer.setDocuments(new ArrayList<>());
        if (customer.getStatusHistory() == null) customer.setStatusHistory(new ArrayList<>());
        customers.put(customer.getId(), customer);
        return customer;
    }

    public Optional<Customer> update(String id, Map<String, Object> updates) {
        Customer existing = customers.get(id);
        if (existing == null) return Optional.empty();

        updates.forEach((key, value) -> {
            switch (key) {
                case "firstName" -> existing.setFirstName((String) value);
                case "lastName" -> existing.setLastName((String) value);
                case "email" -> existing.setEmail((String) value);
                case "phone" -> existing.setPhone((String) value);
                case "dateOfBirth" -> existing.setDateOfBirth((String) value);
                case "gender" -> existing.setGender((String) value);
                case "address" -> existing.setAddress((String) value);
                case "city" -> existing.setCity((String) value);
                case "country" -> existing.setCountry((String) value);
                case "kycStatus" -> existing.setKycStatus((String) value);
                case "accountStatus" -> existing.setAccountStatus((String) value);
                case "riskLevel" -> existing.setRiskLevel((String) value);
                case "notes" -> existing.setNotes((String) value);
            }
        });

        customers.put(id, existing);
        return Optional.of(existing);
    }

    public boolean delete(String id) {
        return customers.remove(id) != null;
    }

    // ── Search & Filter ───────────────────────────────────────

    public List<Customer> search(String query) {
        if (query == null || query.isBlank()) return getAll();

        String q = query.trim().toLowerCase();
        return customers.values().stream()
                .filter(c -> {
                    String fullName = (c.getFirstName() + " " + c.getLastName()).toLowerCase();
                    return fullName.contains(q)
                            || c.getEmail().toLowerCase().contains(q)
                            || c.getId().toLowerCase().contains(q);
                })
                .collect(Collectors.toList());
    }

    public List<Customer> filter(String kycStatus, String accountStatus, String riskLevel) {
        return customers.values().stream()
                .filter(c -> kycStatus == null || kycStatus.isBlank() || c.getKycStatus().equals(kycStatus))
                .filter(c -> accountStatus == null || accountStatus.isBlank() || c.getAccountStatus().equals(accountStatus))
                .filter(c -> riskLevel == null || riskLevel.isBlank() || c.getRiskLevel().equals(riskLevel))
                .collect(Collectors.toList());
    }

    // ── Status & Notes ────────────────────────────────────────

    public Optional<Customer> addStatusChange(String id, StatusChange change) {
        Customer customer = customers.get(id);
        if (customer == null) return Optional.empty();

        if (change.getTimestamp() == null || change.getTimestamp().isBlank()) {
            change.setTimestamp(new Date().toInstant().toString());
        }
        customer.getStatusHistory().add(change);
        return Optional.of(customer);
    }

    public Optional<Customer> updateNotes(String id, String notes) {
        Customer customer = customers.get(id);
        if (customer == null) return Optional.empty();

        customer.setNotes(notes);
        return Optional.of(customer);
    }

    // ── Analytics ─────────────────────────────────────────────

    public Map<String, Object> getStats() {
        Collection<Customer> all = customers.values();
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("total", all.size());
        stats.put("pending", all.stream().filter(c -> "pending".equals(c.getKycStatus())).count());
        stats.put("approved", all.stream().filter(c -> "approved".equals(c.getKycStatus())).count());
        stats.put("rejected", all.stream().filter(c -> "rejected".equals(c.getKycStatus())).count());
        stats.put("under_review", all.stream().filter(c -> "under_review".equals(c.getKycStatus())).count());
        stats.put("active", all.stream().filter(c -> "active".equals(c.getAccountStatus())).count());
        stats.put("suspended", all.stream().filter(c -> "suspended".equals(c.getAccountStatus())).count());
        stats.put("frozen", all.stream().filter(c -> "frozen".equals(c.getAccountStatus())).count());
        return stats;
    }

    public List<Map<String, String>> getRecentActivity() {
        List<Map<String, String>> activity = new ArrayList<>();

        for (Customer c : customers.values()) {
            if (c.getStatusHistory() != null) {
                for (StatusChange h : c.getStatusHistory()) {
                    Map<String, String> item = new LinkedHashMap<>();
                    item.put("timestamp", h.getTimestamp());
                    item.put("fromStatus", h.getFromStatus());
                    item.put("toStatus", h.getToStatus());
                    item.put("changedBy", h.getChangedBy());
                    item.put("reason", h.getReason());
                    item.put("customerName", c.getFirstName() + " " + c.getLastName());
                    activity.add(item);
                }
            }
        }

        activity.sort((a, b) -> {
            String ta = a.get("timestamp");
            String tb = b.get("timestamp");
            if (ta == null) return 1;
            if (tb == null) return -1;
            return tb.compareTo(ta);
        });

        return activity.size() > 10 ? activity.subList(0, 10) : activity;
    }

    // ── Reset ─────────────────────────────────────────────────

    public void resetData() {
        customers.clear();
        loadSeedData();
    }

    // ── ID Generation ─────────────────────────────────────────

    private String generateId() {
        int maxNum = 0;
        for (String id : customers.keySet()) {
            String[] parts = id.split("-");
            try {
                int num = Integer.parseInt(parts[parts.length - 1]);
                if (num > maxNum) maxNum = num;
            } catch (NumberFormatException ignored) {}
        }
        return String.format("CUS-%03d", maxNum + 1);
    }

    // ── Seed Data (mirrors data.js) ───────────────────────────

    private void loadSeedData() {
        // Customer 1: Aarav Sharma
        Customer c1 = new Customer();
        c1.setId("CUS-001");
        c1.setFirstName("Aarav");
        c1.setLastName("Sharma");
        c1.setEmail("aarav.sharma@email.com");
        c1.setPhone("9876543210");
        c1.setDateOfBirth("1985-04-12");
        c1.setAddress("Flat 4B, Harmony Apartments, MG Road");
        c1.setCity("Bangalore");
        c1.setCountry("India");
        c1.setRegistrationDate("2026-01-10T08:30:00.000Z");
        c1.setKycStatus("approved");
        c1.setAccountStatus("active");
        c1.setRiskLevel("low");
        c1.setDocuments(new ArrayList<>(List.of(
                new Document("DOC-001", "Aadhaar Card", "aarav_aadhaar.pdf", "2026-01-10T08:45:00.000Z", "approved"),
                new Document("DOC-002", "PAN Card", "aarav_pan.jpg", "2026-01-10T08:45:00.000Z", "approved")
        )));
        c1.setStatusHistory(new ArrayList<>(List.of(
                new StatusChange("2026-01-10T08:30:00.000Z", "none", "pending", "System", "New registration"),
                new StatusChange("2026-01-11T10:15:00.000Z", "pending", "under_review", "Officer Smith", "KYC review started"),
                new StatusChange("2026-01-11T14:30:00.000Z", "under_review", "approved", "Officer Smith", "All documents verified successfully")
        )));
        c1.setNotes("Standard KYC verified. Clean PEP checks.");
        customers.put(c1.getId(), c1);

        // Customer 2: Priya Patel
        Customer c2 = new Customer();
        c2.setId("CUS-002");
        c2.setFirstName("Priya");
        c2.setLastName("Patel");
        c2.setEmail("priya.patel@email.com");
        c2.setPhone("9123456780");
        c2.setDateOfBirth("1992-11-25");
        c2.setAddress("12, Sunrise Avenue, Bandra West");
        c2.setCity("Mumbai");
        c2.setCountry("India");
        c2.setRegistrationDate("2026-07-14T11:20:00.000Z");
        c2.setKycStatus("pending");
        c2.setAccountStatus("active");
        c2.setRiskLevel("medium");
        c2.setDocuments(new ArrayList<>(List.of(
                new Document("DOC-003", "Passport", "priya_passport.pdf", "2026-07-14T11:25:00.000Z", "pending")
        )));
        c2.setStatusHistory(new ArrayList<>(List.of(
                new StatusChange("2026-07-14T11:20:00.000Z", "none", "pending", "System", "New registration")
        )));
        c2.setNotes("");
        customers.put(c2.getId(), c2);

        // Customer 3: Rahul Verma
        Customer c3 = new Customer();
        c3.setId("CUS-003");
        c3.setFirstName("Rahul");
        c3.setLastName("Verma");
        c3.setEmail("rahul.verma@email.com");
        c3.setPhone("9988776655");
        c3.setDateOfBirth("1980-02-14");
        c3.setAddress("45, Park Street");
        c3.setCity("Kolkata");
        c3.setCountry("India");
        c3.setRegistrationDate("2026-07-12T09:10:00.000Z");
        c3.setKycStatus("under_review");
        c3.setAccountStatus("active");
        c3.setRiskLevel("medium");
        c3.setDocuments(new ArrayList<>(List.of(
                new Document("DOC-004", "Aadhaar Card", "rahul_aadhaar.pdf", "2026-07-12T09:15:00.000Z", "under_review"),
                new Document("DOC-005", "Driver's License", "rahul_dl.jpg", "2026-07-12T09:16:00.000Z", "under_review")
        )));
        c3.setStatusHistory(new ArrayList<>(List.of(
                new StatusChange("2026-07-12T09:10:00.000Z", "none", "pending", "System", "New registration"),
                new StatusChange("2026-07-15T08:30:00.000Z", "pending", "under_review", "Officer Jones", "Review initiated")
        )));
        c3.setNotes("Address proof slightly blurry. May need to request a clearer copy.");
        customers.put(c3.getId(), c3);

        // Customer 4: Sneha Gupta
        Customer c4 = new Customer();
        c4.setId("CUS-004");
        c4.setFirstName("Sneha");
        c4.setLastName("Gupta");
        c4.setEmail("sneha.gupta@email.com");
        c4.setPhone("9871122334");
        c4.setDateOfBirth("1995-09-30");
        c4.setAddress("88, Vasant Vihar");
        c4.setCity("New Delhi");
        c4.setCountry("India");
        c4.setRegistrationDate("2026-06-20T14:45:00.000Z");
        c4.setKycStatus("rejected");
        c4.setAccountStatus("suspended");
        c4.setRiskLevel("high");
        c4.setDocuments(new ArrayList<>(List.of(
                new Document("DOC-006", "PAN Card", "sneha_pan.pdf", "2026-06-20T14:50:00.000Z", "rejected")
        )));
        c4.setStatusHistory(new ArrayList<>(List.of(
                new StatusChange("2026-06-20T14:45:00.000Z", "none", "pending", "System", "New registration"),
                new StatusChange("2026-06-21T10:00:00.000Z", "pending", "under_review", "Officer Smith", "Review initiated"),
                new StatusChange("2026-06-21T16:20:00.000Z", "under_review", "rejected", "Officer Smith", "Name mismatch on PAN card"),
                new StatusChange("2026-06-21T16:25:00.000Z", "active", "suspended", "System", "Account suspended due to KYC rejection")
        )));
        c4.setNotes("Critical name mismatch between application and PAN card. Requesting re-submission with valid name proof.");
        customers.put(c4.getId(), c4);

        // Customer 5: Vikram Singh
        Customer c5 = new Customer();
        c5.setId("CUS-005");
        c5.setFirstName("Vikram");
        c5.setLastName("Singh");
        c5.setEmail("vikram.singh@email.com");
        c5.setPhone("9001234567");
        c5.setDateOfBirth("1975-01-20");
        c5.setAddress("15, Sector 17");
        c5.setCity("Chandigarh");
        c5.setCountry("India");
        c5.setRegistrationDate("2025-11-05T09:00:00.000Z");
        c5.setKycStatus("approved");
        c5.setAccountStatus("frozen");
        c5.setRiskLevel("high");
        c5.setDocuments(new ArrayList<>(List.of(
                new Document("DOC-010", "Passport", "vikram_pass.pdf", "2025-11-05T09:10:00.000Z", "approved"),
                new Document("DOC-011", "PAN Card", "vikram_pan.pdf", "2025-11-05T09:11:00.000Z", "approved")
        )));
        c5.setStatusHistory(new ArrayList<>(List.of(
                new StatusChange("2025-11-05T09:00:00.000Z", "none", "pending", "System", "New registration"),
                new StatusChange("2025-11-08T11:00:00.000Z", "pending", "approved", "Officer Jones", "KYC verified"),
                new StatusChange("2026-05-14T09:45:00.000Z", "active", "frozen", "Officer Kapoor", "Suspicious transaction activity flagged")
        )));
        c5.setNotes("Account frozen pending investigation. Compliance team reviewing transaction patterns from Apr-May 2026.");
        customers.put(c5.getId(), c5);

        // Customer 6: Ananya Reddy
        Customer c6 = new Customer();
        c6.setId("CUS-006");
        c6.setFirstName("Ananya");
        c6.setLastName("Reddy");
        c6.setEmail("ananya.reddy@email.com");
        c6.setPhone("9444333222");
        c6.setDateOfBirth("1998-07-09");
        c6.setAddress("22, Jubilee Hills, Road No. 10");
        c6.setCity("Hyderabad");
        c6.setCountry("India");
        c6.setRegistrationDate("2026-07-10T10:00:00.000Z");
        c6.setKycStatus("pending");
        c6.setAccountStatus("active");
        c6.setRiskLevel("low");
        c6.setDocuments(new ArrayList<>(List.of(
                new Document("DOC-013", "Aadhaar Card", "ananya_aadhaar.pdf", "2026-07-10T10:15:00.000Z", "pending")
        )));
        c6.setStatusHistory(new ArrayList<>(List.of(
                new StatusChange("2026-07-10T10:00:00.000Z", "none", "pending", "System", "New registration")
        )));
        c6.setNotes("Recently registered. Single document submitted — additional ID may be required.");
        customers.put(c6.getId(), c6);
    }
}
