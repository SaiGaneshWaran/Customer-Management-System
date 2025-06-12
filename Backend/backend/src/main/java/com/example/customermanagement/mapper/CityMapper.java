package com.example.customermanagement.mapper;

import com.example.customermanagement.domain.City;
import com.example.customermanagement.dto.CityDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CityMapper {
    CityDTO toDto(City city);
    City toEntity(CityDTO cityDTO);
}