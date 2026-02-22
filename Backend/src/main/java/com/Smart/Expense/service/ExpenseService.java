package com.Smart.Expense.service;

import com.Smart.Expense.model.Expense;
import com.Smart.Expense.repo.ExpenseRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepo repo;

    // ← CHANGE: findAll() → findByUsername()
    public List<Expense> getAll(String username) {
        return repo.findByUsername(username);
    }

    // ← CHANGE: add username + security check
    public Expense getById(Long id, String username) {
        Expense expense = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id " + id));

        if (!expense.getUsername().equals(username)) {
            throw new RuntimeException("Access denied");
        }
        return expense;
    }

    // ← CHANGE: set username before saving
    public void create(Expense expense, String username) {
        expense.setUsername(username);
        repo.save(expense);
    }

    // ← CHANGE: add username + security check
    public Expense update(Long id, Expense expense, String username) {
        Expense expense1 = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id " + id));

        if (!expense1.getUsername().equals(username)) {
            throw new RuntimeException("Access denied");
        }

        expense1.setTitle(expense.getTitle());
        expense1.setAmount(expense.getAmount());
        expense1.setCategory(expense.getCategory());
        expense1.setDate(expense.getDate());
        expense1.setNotes(expense.getNotes());

        return repo.save(expense1);
    }

    // ← CHANGE: add username + security check
    public void delete(Long id, String username) {
        Expense expense = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id " + id));

        if (!expense.getUsername().equals(username)) {
            throw new RuntimeException("Access denied");
        }

        repo.deleteById(id);
    }

    // ← CHANGE: pass username to repo
    public List<Object[]> getCategoryTotals(String username) {
        return repo.getCategoryTotals(username);
    }
}

