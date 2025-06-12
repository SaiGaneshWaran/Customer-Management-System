package com.example.customermanagement.dto;

import lombok.Data;

@Data
public class AddressDTO {
    private Long id;
    private String addressLine1;
    private String addressLine2;
    private Long cityId;
    private String cityName;
    private String countryName;
}