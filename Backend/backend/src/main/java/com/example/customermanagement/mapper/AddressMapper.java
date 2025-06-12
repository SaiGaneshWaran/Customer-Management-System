package com.example.customermanagement.mapper;

import com.example.customermanagement.domain.Address;
import com.example.customermanagement.domain.City;
import com.example.customermanagement.dto.AddressDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AddressMapper {

    @Mapping(target = "cityId", source = "city.id")
    @Mapping(target = "cityName", source = "city.name")
    @Mapping(target = "countryName", source = "city.country.name")
    AddressDTO toDto(Address address);


    @Mapping(target = "city", source = "cityId")
    Address toEntity(AddressDTO addressDTO);

    default City mapCityIdToCity(Long cityId) {
        if (cityId == null) {
            return null;
        }
        City city = new City();
        city.setId(cityId);
        return city;
    }
}