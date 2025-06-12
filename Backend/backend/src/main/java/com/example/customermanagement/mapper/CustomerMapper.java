package com.example.customermanagement.mapper;


import com.example.customermanagement.domain.Customer;

import com.example.customermanagement.dto.CustomerDTO;
import com.example.customermanagement.dto.CustomerSummaryDTO;
import org.mapstruct.*;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(
        componentModel = "spring",
        uses = {AddressMapper.class},
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface CustomerMapper {


    @Mapping(target = "familyMemberIds", source = "familyMembers", qualifiedByName = "customersToIds")
    CustomerDTO toDto(Customer customer);

    CustomerSummaryDTO toSummaryDto(Customer customer);



    @Mapping(target = "familyMembers", source = "familyMemberIds", qualifiedByName = "idsToCustomers")
    Customer toEntity(CustomerDTO customerDTO);

    @Mapping(target = "familyMembers", source = "familyMemberIds", qualifiedByName = "idsToCustomers")
    void updateFromDto(CustomerDTO customerDTO, @MappingTarget Customer customer);



    @Named("customersToIds")
    default Set<Long> mapCustomersToIds(Set<Customer> familyMembers) {
        if (familyMembers == null) {
            return null;
        }
        return familyMembers.stream()
                .map(Customer::getId)
                .collect(Collectors.toSet());
    }

    @Named("idsToCustomers")
    default Set<Customer> mapIdsToCustomers(Set<Long> familyMemberIds) {
        if (familyMemberIds == null) {
            return null;
        }
        return familyMemberIds.stream()
                .map(id -> {
                    if (id == null) return null;
                    Customer customer = new Customer();
                    customer.setId(id);
                    return customer;
                })
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toSet());
    }
}