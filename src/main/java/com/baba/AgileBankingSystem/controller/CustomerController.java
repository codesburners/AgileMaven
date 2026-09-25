package com.baba.AgileBankingSystem.controller;

import com.baba.AgileBankingSystem.model.Customer;
import com.baba.AgileBankingSystem.model.StatusChange;
import com.baba.AgileBankingSystem.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    // ── GET /api/customers ────────────────────────────────────
    // Supports: ?search=query, ?kycStatus=x&accountStatus=y&riskLevel=z
    @GetMapping
    public List<Customer> getCustomers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String kycStatus,
            @RequestParam(required = false) String accountStatus,
            @RequestParam(required = false) String riskLevel) {

        if (search != null && !search.isBlank()) {
            return service.search(search);
        }
        if (kycStatus != null || accountStatus != null || riskLevel != null) {
            return service.filter(kycStatus, accountStatus, riskLevel);
        }
        return service.getAll();
    }

    // ── GET /api/customers/stats ──────────────────────────────
    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return service.getStats();
    }

    // ── GET /api/customers/activity ───────────────────────────
    @GetMapping("/activity")
    public List<Map<String, String>> getRecentActivity() {
        return service.getRecentActivity();
    }

    // ── GET /api/customers/{id} ───────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getById(@PathVariable String id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── POST /api/customers ───────────────────────────────────
    @PostMapping
    public Customer addCustomer(@RequestBody Customer customer) {
        return service.add(customer);
    }

    // ── PUT /api/customers/{id} ───────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(
            @PathVariable String id,
            @RequestBody Map<String, Object> updates) {
        return service.update(id, updates)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── DELETE /api/customers/{id} ────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String id) {
        if (service.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ── POST /api/customers/{id}/status ───────────────────────
    @PostMapping("/{id}/status")
    public ResponseEntity<Customer> addStatusChange(
            @PathVariable String id,
            @RequestBody StatusChange change) {
        return service.addStatusChange(id, change)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── PUT /api/customers/{id}/notes ─────────────────────────
    @PutMapping("/{id}/notes")
    public ResponseEntity<Customer> updateNotes(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String notes = body.getOrDefault("notes", "");
        return service.updateNotes(id, notes)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── POST /api/customers/reset ─────────────────────────────
    @PostMapping("/reset")
    public ResponseEntity<Void> resetData() {
        service.resetData();
        return ResponseEntity.ok().build();
    }
}
