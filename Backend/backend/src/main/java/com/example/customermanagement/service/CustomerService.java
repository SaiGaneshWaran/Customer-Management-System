package com.example.customermanagement.service;

import com.example.customermanagement.domain.Address;
import com.example.customermanagement.domain.City;
import com.example.customermanagement.domain.Customer;
import com.example.customermanagement.dto.CustomerDTO;
import com.example.customermanagement.dto.CustomerSummaryDTO;
import com.example.customermanagement.exception.ResourceNotFoundException;
import com.example.customermanagement.mapper.CustomerMapper;
import com.example.customermanagement.repository.CityRepository;
import com.example.customermanagement.repository.CustomerRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerService {
    private static final Logger logger = LoggerFactory.getLogger(CustomerService.class);
    private static final int BATCH_SIZE = 1000;

    private final CustomerRepository customerRepository;
    private final CityRepository cityRepository;
    private final CustomerMapper customerMapper;

    public CustomerService(CustomerRepository customerRepository, CityRepository cityRepository, CustomerMapper customerMapper) {
        this.customerRepository = customerRepository;
        this.cityRepository = cityRepository;
        this.customerMapper = customerMapper;
    }

    @Transactional(readOnly = true)
    public Page<CustomerSummaryDTO> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable).map(customerMapper::toSummaryDto);
    }

    @Transactional(readOnly = true)
    public Optional<CustomerDTO> getCustomerById(Long id) {
        return customerRepository.findById(id).map(customerMapper::toDto);
    }

    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        if (customerRepository.existsByNicNumber(customerDTO.getNicNumber())) {
            throw new IllegalArgumentException("Customer with NIC " + customerDTO.getNicNumber() + " already exists.");
        }
        Customer customer = customerMapper.toEntity(customerDTO);
        resolveAndSetRelationships(customer, customerDTO);
        Customer savedCustomer = customerRepository.save(customer);
        return customerMapper.toDto(savedCustomer);
    }

    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        customerMapper.updateFromDto(customerDTO, existingCustomer);
        resolveAndSetRelationships(existingCustomer, customerDTO);
        Customer updatedCustomer = customerRepository.save(existingCustomer);
        return customerMapper.toDto(updatedCustomer);
    }

    private void resolveAndSetRelationships(Customer customer, CustomerDTO dto) {
        customer.getAddresses().clear();
        if (dto.getAddresses() != null) {
            List<Address> newAddresses = dto.getAddresses().stream()
                    .filter(addressDTO -> addressDTO.getCityId() != null)
                    .map(addressDTO -> {
                        City city = cityRepository.findById(addressDTO.getCityId())
                                .orElseThrow(() -> new ResourceNotFoundException("City not found with id: " + addressDTO.getCityId()));
                        Address address = new Address();
                        address.setAddressLine1(addressDTO.getAddressLine1());
                        address.setAddressLine2(addressDTO.getAddressLine2());
                        address.setCity(city);
                        address.setCustomer(customer);
                        return address;
                    }).collect(Collectors.toList());
            customer.getAddresses().addAll(newAddresses);
        }

        if (dto.getFamilyMemberIds() != null) {
            Set<Customer> familyMembers = new HashSet<>(customerRepository.findAllById(dto.getFamilyMemberIds()));
            customer.setFamilyMembers(familyMembers);
        } else {
            customer.getFamilyMembers().clear();
        }
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    @Async
    public CompletableFuture<Void> bulkCreateOrUpdateCustomers(MultipartFile file) {
        // ... (Bulk upload logic remains unchanged)
        logger.info("Starting bulk customer create/update from file: {}", file.getOriginalFilename());
        long startTime = System.currentTimeMillis();

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            if (rows.hasNext()) rows.next(); // Skip header

            List<Customer> customersToProcess = new ArrayList<>(BATCH_SIZE);
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                try {
                    String nic = currentRow.getCell(0).getStringCellValue();
                    String name = currentRow.getCell(1).getStringCellValue();
                    LocalDate dob = currentRow.getCell(2).getDateCellValue().toInstant()
                            .atZone(ZoneId.systemDefault()).toLocalDate();

                    Customer customer = customerRepository.findByNicNumber(nic).orElse(new Customer());
                    customer.setNicNumber(nic);
                    customer.setName(name);
                    customer.setDateOfBirth(dob);
                    customersToProcess.add(customer);

                    if (customersToProcess.size() >= BATCH_SIZE) {
                        customerRepository.saveAll(customersToProcess);
                        customersToProcess.clear();
                    }
                } catch (Exception e) {
                    logger.error("Skipping malformed row {}: {}", currentRow.getRowNum(), e.getMessage());
                }
            }
            if (!customersToProcess.isEmpty()) {
                customerRepository.saveAll(customersToProcess);
            }
        } catch (Exception e) {
            logger.error("Failed to process bulk upload file", e);
            throw new RuntimeException("Failed to process Excel file: " + e.getMessage());
        }

        logger.info("Finished bulk customer processing in {} ms", (System.currentTimeMillis() - startTime));
        return CompletableFuture.completedFuture(null);
    }
}