package com.baba.AgileBankingSystem.controller;

import com.baba.AgileBankingSystem.model.Customer;
import com.baba.AgileBankingSystem.model.StatusChange;
import com.baba.AgileBankingSystem.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class CustomerControllerTest {

    private CustomerService service;
    private CustomerController controller;

    @BeforeEach
    void setUp() {
        service = new CustomerService();
        service.init(); // loads seed data
        controller = new CustomerController(service);
    }

    // ── GET /api/customers ────────────────────────────────────

    @Nested
    @DisplayName("GET /api/customers")
    class GetAllTests {

        @Test
        @DisplayName("returns all 6 seed customers")
        void getAllCustomers() {
            List<Customer> customers = controller.getCustomers(null, null, null, null);
            assertEquals(6, customers.size());
        }

        @Test
        @DisplayName("search by name returns matching customers")
        void searchByName() {
            List<Customer> customers = controller.getCustomers("Aarav", null, null, null);
            assertEquals(1, customers.size());
            assertEquals("Aarav", customers.get(0).getFirstName());
        }

        @Test
        @DisplayName("search by email returns matching customer")
        void searchByEmail() {
            List<Customer> customers = controller.getCustomers("priya.patel@email.com", null, null, null);
            assertEquals(1, customers.size());
            assertEquals("CUS-002", customers.get(0).getId());
        }

        @Test
        @DisplayName("filter by kycStatus=pending")
        void filterByKycStatus() {
            List<Customer> customers = controller.getCustomers(null, "pending", null, null);
            assertEquals(2, customers.size());
        }

        @Test
        @DisplayName("filter by accountStatus=frozen")
        void filterByAccountStatus() {
            List<Customer> customers = controller.getCustomers(null, null, "frozen", null);
            assertEquals(1, customers.size());
            assertEquals("CUS-005", customers.get(0).getId());
        }
    }

    // ── GET /api/customers/{id} ───────────────────────────────

    @Nested
    @DisplayName("GET /api/customers/{id}")
    class GetByIdTests {

        @Test
        @DisplayName("returns customer when found")
        void getByIdFound() {
            ResponseEntity<Customer> response = controller.getById("CUS-001");
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals("CUS-001", response.getBody().getId());
            assertEquals("Aarav", response.getBody().getFirstName());
        }

        @Test
        @DisplayName("returns 404 when not found")
        void getByIdNotFound() {
            ResponseEntity<Customer> response = controller.getById("CUS-999");
            assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        }
    }

    // ── POST /api/customers ───────────────────────────────────

    @Nested
    @DisplayName("POST /api/customers")
    class CreateTests {

        @Test
        @DisplayName("creates a new customer and returns it")
        void createCustomer() {
            Customer newCust = new Customer();
            newCust.setId("CUS-TEST");
            newCust.setFirstName("Test");
            newCust.setEmail("test@example.com");

            Customer saved = controller.addCustomer(newCust);
            assertEquals("CUS-TEST", saved.getId());
            assertEquals("Test", saved.getFirstName());

            // Verify persisted
            assertEquals(7, controller.getCustomers(null, null, null, null).size());
        }
    }

    // ── PUT /api/customers/{id} ───────────────────────────────

    @Nested
    @DisplayName("PUT /api/customers/{id}")
    class UpdateTests {

        @Test
        @DisplayName("updates customer fields and returns updated customer")
        void updateCustomer() {
            Map<String, Object> updates = Map.of(
                    "firstName", "UpdatedAarav",
                    "email", "updated@email.com",
                    "kycStatus", "rejected"
            );

            ResponseEntity<Customer> response = controller.updateCustomer("CUS-001", updates);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals("UpdatedAarav", response.getBody().getFirstName());
            assertEquals("updated@email.com", response.getBody().getEmail());
            assertEquals("rejected", response.getBody().getKycStatus());
            assertEquals("Sharma", response.getBody().getLastName()); // unchanged
        }

        @Test
        @DisplayName("returns 404 for non-existent customer")
        void updateNotFound() {
            ResponseEntity<Customer> response = controller.updateCustomer("CUS-999", Map.of("firstName", "Ghost"));
            assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        }
    }

    // ── DELETE /api/customers/{id} ────────────────────────────

    @Nested
    @DisplayName("DELETE /api/customers/{id}")
    class DeleteTests {

        @Test
        @DisplayName("deletes existing customer and returns 204")
        void deleteExisting() {
            ResponseEntity<Void> response = controller.deleteCustomer("CUS-004");
            assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());

            // Verify gone
            ResponseEntity<Customer> getResponse = controller.getById("CUS-004");
            assertEquals(HttpStatus.NOT_FOUND, getResponse.getStatusCode());
            assertEquals(5, controller.getCustomers(null, null, null, null).size());
        }

        @Test
        @DisplayName("returns 404 for non-existent customer")
        void deleteNotFound() {
            ResponseEntity<Void> response = controller.deleteCustomer("CUS-999");
            assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        }
    }

    // ── POST /api/customers/{id}/status ───────────────────────

    @Nested
    @DisplayName("POST /api/customers/{id}/status")
    class StatusChangeTests {

        @Test
        @DisplayName("adds status change and returns updated customer")
        void addStatusChange() {
            StatusChange change = new StatusChange(
                    "2026-09-25T12:00:00.000Z", "pending", "under_review",
                    "Officer Test", "Starting review"
            );

            ResponseEntity<Customer> response = controller.addStatusChange("CUS-002", change);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(2, response.getBody().getStatusHistory().size());
            assertEquals("under_review", response.getBody().getStatusHistory().get(1).getToStatus());
        }

        @Test
        @DisplayName("returns 404 for non-existent customer")
        void statusChangeNotFound() {
            StatusChange change = new StatusChange(null, "a", "b", "c", "d");
            ResponseEntity<Customer> response = controller.addStatusChange("CUS-999", change);
            assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        }
    }

    // ── PUT /api/customers/{id}/notes ─────────────────────────

    @Nested
    @DisplayName("PUT /api/customers/{id}/notes")
    class NotesTests {

        @Test
        @DisplayName("updates notes and returns updated customer")
        void updateNotes() {
            ResponseEntity<Customer> response = controller.updateNotes("CUS-002", Map.of("notes", "Updated review notes"));
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals("Updated review notes", response.getBody().getNotes());
        }

        @Test
        @DisplayName("returns 404 for non-existent customer")
        void notesNotFound() {
            ResponseEntity<Customer> response = controller.updateNotes("CUS-999", Map.of("notes", "anything"));
            assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        }
    }

    // ── GET /api/customers/stats ──────────────────────────────

    @Nested
    @DisplayName("GET /api/customers/stats")
    class StatsTests {

        @Test
        @DisplayName("returns correct statistics")
        void getStats() {
            Map<String, Object> stats = controller.getStats();
            assertEquals(6L, ((Number) stats.get("total")).longValue());
            assertEquals(2L, ((Number) stats.get("pending")).longValue());
        }
    }

    // ── GET /api/customers/activity ───────────────────────────

    @Nested
    @DisplayName("GET /api/customers/activity")
    class ActivityTests {

        @Test
        @DisplayName("returns recent activity with customerName")
        void getActivity() {
            List<Map<String, String>> activity = controller.getRecentActivity();
            assertFalse(activity.isEmpty());
            assertTrue(activity.size() <= 10);
            assertNotNull(activity.get(0).get("customerName"));
        }
    }

    // ── POST /api/customers/reset ─────────────────────────────

    @Nested
    @DisplayName("POST /api/customers/reset")
    class ResetTests {

        @Test
        @DisplayName("resets data back to 6 seed customers after modifications")
        void resetData() {
            // Delete some customers first
            controller.deleteCustomer("CUS-001");
            controller.deleteCustomer("CUS-002");
            assertEquals(4, controller.getCustomers(null, null, null, null).size());

            // Reset
            ResponseEntity<Void> response = controller.resetData();
            assertEquals(HttpStatus.OK, response.getStatusCode());

            // Verify restored
            assertEquals(6, controller.getCustomers(null, null, null, null).size());
        }
    }
}
