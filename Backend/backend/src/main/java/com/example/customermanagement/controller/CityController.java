package com.example.customermanagement.controller;

import com.example.customermanagement.domain.City;
import com.example.customermanagement.repository.CityRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/cities")
@CrossOrigin(origins = "http://localhost:3000")
public class CityController {

    private final CityRepository cityRepository;

    public CityController(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @GetMapping
    public List<City> getCitiesByCountry(@RequestParam(required = false) Long countryId) {
        if (countryId != null) {
            return cityRepository.findByCountryId(countryId);
        }
        return Collections.emptyList();
    }
}