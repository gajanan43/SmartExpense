package com.Smart.Expense.controller;

import com.Smart.Expense.model.Expense;
import com.Smart.Expense.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseService service;

    // ← ADD this helper method
    private String getUsername() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
    }

    // ← CHANGE: pass getUsername()
    @GetMapping("/expenses")
    public ResponseEntity<List<Expense>> getAll() {
        return ResponseEntity.ok(service.getAll(getUsername()));
    }

    // ← CHANGE: pass getUsername()
    @GetMapping("/expenses/{id}")
    public ResponseEntity<Expense> getById(@PathVariable Long id) {
        return new ResponseEntity<>(service.getById(id, getUsername()), HttpStatus.OK);
    }

    // ← CHANGE: pass getUsername()
    @PostMapping("/expenses")
    public ResponseEntity<String> create(@RequestBody Expense expense) {
        service.create(expense, getUsername());
        return new ResponseEntity<>("Saved Successfully", HttpStatus.CREATED);
    }

    // ← CHANGE: pass getUsername()
    @PutMapping("/expenses/{id}")
    public ResponseEntity<Expense> update(@PathVariable Long id, @RequestBody Expense expense) {
        return new ResponseEntity<>(service.update(id, expense, getUsername()), HttpStatus.OK);
    }

    // ← CHANGE: pass getUsername()
    @DeleteMapping("/expenses/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id, getUsername());
        return ResponseEntity.ok("Deleted successfully");
    }

    // ← CHANGE: pass getUsername()
    @GetMapping("/analytics/categories")
    public ResponseEntity<Map<String, Double>> getCategoryTotals() {
        Map<String, Double> result = new HashMap<>();
        service.getCategoryTotals(getUsername()).forEach(row ->
                result.put((String) row[0], ((Number) row[1]).doubleValue())
        );
        return ResponseEntity.ok(result);
    }
}