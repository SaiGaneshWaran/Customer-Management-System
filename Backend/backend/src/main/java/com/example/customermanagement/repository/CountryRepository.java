package com.example.customermanagement.repository;

import com.example.customermanagement.domain.Country;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CountryRepository extends JpaRepository<Country, Long> {
}