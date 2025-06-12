package com.example.customermanagement.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private LocalDate dateOfBirth;

    @Column(unique = true, nullable = false)
    private String nicNumber;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "mobile_number", joinColumns = @JoinColumn(name = "customer_id"))
    @Column(name = "phone_number")
    private Set<String> mobileNumbers = new HashSet<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Address> addresses = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "customer_family", joinColumns = @JoinColumn(name = "customer_id"), inverseJoinColumns = @JoinColumn(name = "family_member_id"))
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Customer> familyMembers = new HashSet<>();

    public void addAddress(Address address) {
        addresses.add(address);
        address.setCustomer(this);
    }
}