package com.Smart.Expense.repo;

import com.Smart.Expense.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepo extends JpaRepository<Expense, Long> {

    // ← CHANGE: add username parameter
    List<Expense> findByUsername(String username);

    // ← CHANGE: add username filter
    List<Expense> findByCategoryAndUsername(String category, String username);

    // ← CHANGE: add username filter
    List<Expense> findByDateBetweenAndUsername(LocalDate start, LocalDate end, String username);

    // ← CHANGE: add username to query
    @Query("SELECT e FROM Expense e WHERE e.username = :username " +
            "AND (:category IS NULL OR e.category = :category) " +
            "AND (:start IS NULL OR e.date >= :start) AND (:end IS NULL OR e.date <= :end) " +
            "ORDER BY e.date DESC")
    List<Expense> findFiltered(
            @Param("username") String username,   // ← ADD
            @Param("category") String category,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    // ← CHANGE: filter by username
    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.username = :username GROUP BY e.category")
    List<Object[]> getCategoryTotals(@Param("username") String username);  // ← ADD param
}