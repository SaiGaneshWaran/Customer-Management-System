package com.example.customermanagement.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
public class CustomerDTO {
    private Long id;
    private String name;
    private LocalDate dateOfBirth;
    private String nicNumber;
    private Set<String> mobileNumbers = new HashSet<>();
    private List<AddressDTO> addresses = new ArrayList<>();
    private Set<Long> familyMemberIds = new HashSet<>();
}