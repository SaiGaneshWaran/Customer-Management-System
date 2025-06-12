package com.example.customermanagement.mapper;

import com.example.customermanagement.domain.Country;
import com.example.customermanagement.dto.CountryDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CountryMapper {
    CountryDTO toDto(Country country);
    Country toEntity(CountryDTO countryDTO);
}