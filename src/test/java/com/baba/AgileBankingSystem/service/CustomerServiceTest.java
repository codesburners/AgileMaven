package com.baba.AgileBankingSystem.service;

import com.baba.AgileBankingSystem.model.Customer;
import com.baba.AgileBankingSystem.model.Document;
import com.baba.AgileBankingSystem.model.StatusChange;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class CustomerServiceTest {

    private CustomerService service;

    @BeforeEach
    void setUp() {
        service = new CustomerService();
        service.init(); // loads seed data
    }

    // ── Seed Data ─────────────────────────────────────────────

    @Nested
    @DisplayName("Seed Data Initialization")
    class SeedDataTests {

        @Test
        @DisplayName("init() loads exactly 6 seed customers")
        void initLoadsSixCustomers() {
            List<Customer> all = service.getAll();
            assertEquals(6, all.size());
        }

        @Test
        @DisplayName("seed customers have correct IDs (CUS-001 through CUS-006)")
        void seedCustomerIds() {
            for (int i = 1; i <= 6; i++) {
                String id = String.format("CUS-%03d", i);
                assertTrue(service.getById(id).isPresent(), "Missing seed customer: " + id);
            }
        }

        @Test
        @DisplayName("seed customer CUS-001 has correct personal data")
        void seedCustomerData() {
            Customer c = service.getById("CUS-001").orElseThrow();
            assertEquals("Aarav", c.getFirstName());
            assertEquals("Sharma", c.getLastName());
            assertEquals("aarav.sharma@email.com", c.getEmail());
            assertEquals("9876543210", c.getPhone());
            assertEquals("Bangalore", c.getCity());
            assertEquals("approved", c.getKycStatus());
            assertEquals("active", c.getAccountStatus());
            assertEquals("low", c.getRiskLevel());
        }

        @Test
        @DisplayName("seed customers have documents and status history")
        void seedCustomerDocumentsAndHistory() {
            Customer c = service.getById("CUS-001").orElseThrow();
            assertEquals(2, c.getDocuments().size());
            assertEquals(3, c.getStatusHistory().size());
        }
    }

    // ── CRUD ──────────────────────────────────────────────────

    @Nested
    @DisplayName("CRUD Operations")
    class CrudTests {

        @Test
        @DisplayName("getAll() returns all customers")
        void getAllReturnsAll() {
            assertEquals(6, service.getAll().size());
        }

        @Test
        @DisplayName("getById() returns existing customer")
        void getByIdFound() {
            Optional<Customer> result = service.getById("CUS-003");
            assertTrue(result.isPresent());
            assertEquals("Rahul", result.get().getFirstName());
        }

        @Test
        @DisplayName("getById() returns empty for non-existent ID")
        void getByIdNotFound() {
            Optional<Customer> result = service.getById("CUS-999");
            assertTrue(result.isEmpty());
        }

        @Test
        @DisplayName("add() creates a new customer with provided ID")
        void addWithProvidedId() {
            Customer newCust = new Customer();
            newCust.setId("CUS-100");
            newCust.setFirstName("Test");
            newCust.setLastName("User");
            newCust.setEmail("test@example.com");
            newCust.setPhone("1234567890");
            newCust.setKycStatus("pending");
            newCust.setAccountStatus("active");
            newCust.setRiskLevel("low");

            Customer saved = service.add(newCust);
            assertEquals("CUS-100", saved.getId());
            assertEquals(7, service.getAll().size());
            assertTrue(service.getById("CUS-100").isPresent());
        }

        @Test
        @DisplayName("add() generates ID when none is provided")
        void addGeneratesId() {
            Customer newCust = new Customer();
            newCust.setFirstName("Auto");
            newCust.setLastName("Generated");
            newCust.setEmail("auto@example.com");

            Customer saved = service.add(newCust);
            assertNotNull(saved.getId());
            assertTrue(saved.getId().startsWith("CUS-"));
            assertEquals("CUS-007", saved.getId());
        }

        @Test
        @DisplayName("add() initializes null lists to empty")
        void addInitializesNullLists() {
            Customer newCust = new Customer();
            newCust.setId("CUS-200");
            newCust.setDocuments(null);
            newCust.setStatusHistory(null);

            Customer saved = service.add(newCust);
            assertNotNull(saved.getDocuments());
            assertNotNull(saved.getStatusHistory());
            assertTrue(saved.getDocuments().isEmpty());
            assertTrue(saved.getStatusHistory().isEmpty());
        }

        @Test
        @DisplayName("update() modifies existing customer fields")
        void updateExisting() {
            Map<String, Object> updates = Map.of(
                "firstName", "UpdatedName",
                "email", "updated@email.com",
                "kycStatus", "rejected"
            );

            Optional<Customer> result = service.update("CUS-001", updates);
            assertTrue(result.isPresent());
            assertEquals("UpdatedName", result.get().getFirstName());
            assertEquals("updated@email.com", result.get().getEmail());
            assertEquals("rejected", result.get().getKycStatus());
            // Unchanged fields should remain
            assertEquals("Sharma", result.get().getLastName());
        }

        @Test
        @DisplayName("update() returns empty for non-existent customer")
        void updateNonExistent() {
            Optional<Customer> result = service.update("CUS-999", Map.of("firstName", "Ghost"));
            assertTrue(result.isEmpty());
        }

        @Test
        @DisplayName("delete() removes existing customer")
        void deleteExisting() {
            assertTrue(service.delete("CUS-004"));
            assertEquals(5, service.getAll().size());
            assertTrue(service.getById("CUS-004").isEmpty());
        }

        @Test
        @DisplayName("delete() returns false for non-existent customer")
        void deleteNonExistent() {
            assertFalse(service.delete("CUS-999"));
            assertEquals(6, service.getAll().size());
        }
    }

    // ── Search & Filter ───────────────────────────────────────

    @Nested
    @DisplayName("Search & Filter")
    class SearchFilterTests {

        @Test
        @DisplayName("search() by first name")
        void searchByFirstName() {
            List<Customer> results = service.search("Aarav");
            assertEquals(1, results.size());
            assertEquals("CUS-001", results.get(0).getId());
        }

        @Test
        @DisplayName("search() by last name (case-insensitive)")
        void searchByLastNameCaseInsensitive() {
            List<Customer> results = service.search("PATEL");
            assertEquals(1, results.size());
            assertEquals("Priya", results.get(0).getFirstName());
        }

        @Test
        @DisplayName("search() by email")
        void searchByEmail() {
            List<Customer> results = service.search("rahul.verma@email.com");
            assertEquals(1, results.size());
            assertEquals("CUS-003", results.get(0).getId());
        }

        @Test
        @DisplayName("search() by customer ID")
        void searchByCustomerId() {
            List<Customer> results = service.search("CUS-005");
            assertEquals(1, results.size());
            assertEquals("Vikram", results.get(0).getFirstName());
        }

        @Test
        @DisplayName("search() with empty/null query returns all")
        void searchEmptyReturnsAll() {
            assertEquals(6, service.search("").size());
            assertEquals(6, service.search(null).size());
            assertEquals(6, service.search("   ").size());
        }

        @Test
        @DisplayName("search() with no match returns empty")
        void searchNoMatch() {
            List<Customer> results = service.search("zzzznonexistent");
            assertTrue(results.isEmpty());
        }

        @Test
        @DisplayName("filter() by kycStatus")
        void filterByKycStatus() {
            List<Customer> pending = service.filter("pending", null, null);
            assertEquals(2, pending.size());

            List<Customer> approved = service.filter("approved", null, null);
            assertEquals(2, approved.size());

            List<Customer> rejected = service.filter("rejected", null, null);
            assertEquals(1, rejected.size());
        }

        @Test
        @DisplayName("filter() by accountStatus")
        void filterByAccountStatus() {
            List<Customer> active = service.filter(null, "active", null);
            assertEquals(4, active.size());

            List<Customer> frozen = service.filter(null, "frozen", null);
            assertEquals(1, frozen.size());
        }

        @Test
        @DisplayName("filter() by riskLevel")
        void filterByRiskLevel() {
            List<Customer> high = service.filter(null, null, "high");
            assertEquals(2, high.size());

            List<Customer> low = service.filter(null, null, "low");
            assertEquals(2, low.size());
        }

        @Test
        @DisplayName("filter() with multiple criteria (AND logic)")
        void filterMultipleCriteria() {
            List<Customer> results = service.filter("approved", "active", "low");
            assertEquals(1, results.size());
            assertEquals("CUS-001", results.get(0).getId());
        }

        @Test
        @DisplayName("filter() with no criteria returns all")
        void filterNoCriteria() {
            assertEquals(6, service.filter(null, null, null).size());
        }
    }

    // ── Status & Notes ────────────────────────────────────────

    @Nested
    @DisplayName("Status Changes & Notes")
    class StatusNotesTests {

        @Test
        @DisplayName("addStatusChange() appends to history")
        void addStatusChange() {
            int originalSize = service.getById("CUS-002").orElseThrow().getStatusHistory().size();

            StatusChange change = new StatusChange(
                null, "pending", "under_review", "Officer Test", "Starting review"
            );

            Optional<Customer> result = service.addStatusChange("CUS-002", change);
            assertTrue(result.isPresent());
            assertEquals(originalSize + 1, result.get().getStatusHistory().size());

            StatusChange added = result.get().getStatusHistory().get(result.get().getStatusHistory().size() - 1);
            assertNotNull(added.getTimestamp(), "timestamp should be auto-filled");
            assertEquals("under_review", added.getToStatus());
            assertEquals("Officer Test", added.getChangedBy());
        }

        @Test
        @DisplayName("addStatusChange() preserves provided timestamp")
        void addStatusChangeWithTimestamp() {
            StatusChange change = new StatusChange(
                "2026-09-25T10:00:00.000Z", "pending", "approved", "Officer", "Approved"
            );

            Optional<Customer> result = service.addStatusChange("CUS-002", change);
            assertTrue(result.isPresent());
            StatusChange added = result.get().getStatusHistory().get(result.get().getStatusHistory().size() - 1);
            assertEquals("2026-09-25T10:00:00.000Z", added.getTimestamp());
        }

        @Test
        @DisplayName("addStatusChange() returns empty for non-existent customer")
        void addStatusChangeNonExistent() {
            StatusChange change = new StatusChange(null, "a", "b", "c", "d");
            assertTrue(service.addStatusChange("CUS-999", change).isEmpty());
        }

        @Test
        @DisplayName("updateNotes() updates customer notes")
        void updateNotes() {
            Optional<Customer> result = service.updateNotes("CUS-002", "New review notes here");
            assertTrue(result.isPresent());
            assertEquals("New review notes here", result.get().getNotes());
        }

        @Test
        @DisplayName("updateNotes() returns empty for non-existent customer")
        void updateNotesNonExistent() {
            assertTrue(service.updateNotes("CUS-999", "anything").isEmpty());
        }
    }

    // ── Analytics ─────────────────────────────────────────────

    @Nested
    @DisplayName("Analytics")
    class AnalyticsTests {

        @Test
        @DisplayName("getStats() returns correct counts")
        void getStats() {
            Map<String, Object> stats = service.getStats();

            assertEquals(6L, ((Number) stats.get("total")).longValue());
            assertEquals(2L, ((Number) stats.get("pending")).longValue());
            assertEquals(2L, ((Number) stats.get("approved")).longValue());
            assertEquals(1L, ((Number) stats.get("rejected")).longValue());
            assertEquals(1L, ((Number) stats.get("under_review")).longValue());
            assertEquals(4L, ((Number) stats.get("active")).longValue());
            assertEquals(1L, ((Number) stats.get("suspended")).longValue());
            assertEquals(1L, ((Number) stats.get("frozen")).longValue());
        }

        @Test
        @DisplayName("getStats() updates after adding a customer")
        void getStatsAfterAdd() {
            Customer c = new Customer();
            c.setId("CUS-NEW");
            c.setKycStatus("pending");
            c.setAccountStatus("active");
            c.setRiskLevel("low");
            service.add(c);

            Map<String, Object> stats = service.getStats();
            assertEquals(7L, ((Number) stats.get("total")).longValue());
            assertEquals(3L, ((Number) stats.get("pending")).longValue());
        }

        @Test
        @DisplayName("getRecentActivity() returns max 10 items sorted by timestamp desc")
        void getRecentActivity() {
            List<Map<String, String>> activity = service.getRecentActivity();

            assertFalse(activity.isEmpty());
            assertTrue(activity.size() <= 10);

            // Verify sorted descending
            for (int i = 0; i < activity.size() - 1; i++) {
                String t1 = activity.get(i).get("timestamp");
                String t2 = activity.get(i + 1).get("timestamp");
                assertTrue(t1.compareTo(t2) >= 0, "Activity should be sorted descending by timestamp");
            }
        }

        @Test
        @DisplayName("getRecentActivity() includes customerName")
        void activityIncludesCustomerName() {
            List<Map<String, String>> activity = service.getRecentActivity();
            for (Map<String, String> item : activity) {
                assertNotNull(item.get("customerName"));
                assertFalse(item.get("customerName").isBlank());
            }
        }
    }

    // ── Reset ─────────────────────────────────────────────────

    @Nested
    @DisplayName("Reset Data")
    class ResetTests {

        @Test
        @DisplayName("resetData() restores seed data after modifications")
        void resetRestoresSeedData() {
            // Modify data
            service.delete("CUS-001");
            service.delete("CUS-002");
            assertEquals(4, service.getAll().size());

            // Reset
            service.resetData();

            // Verify restored
            assertEquals(6, service.getAll().size());
            assertTrue(service.getById("CUS-001").isPresent());
            assertTrue(service.getById("CUS-002").isPresent());
        }

        @Test
        @DisplayName("resetData() removes added customers")
        void resetRemovesAdded() {
            Customer c = new Customer();
            c.setId("CUS-NEW");
            c.setKycStatus("pending");
            c.setAccountStatus("active");
            service.add(c);
            assertEquals(7, service.getAll().size());

            service.resetData();
            assertEquals(6, service.getAll().size());
            assertTrue(service.getById("CUS-NEW").isEmpty());
        }
    }
}
