package com.example.customermanagement.repository;

import com.example.customermanagement.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    boolean existsByNicNumber(String nicNumber);
    Optional<Customer> findByNicNumber(String nicNumber);
}