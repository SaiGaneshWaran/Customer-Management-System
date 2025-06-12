package com.example.customermanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync // Crucial for async bulk upload
public class CustomerManagementApplication {
	public static void main(String[] args) {
		SpringApplication.run(CustomerManagementApplication.class, args);
	}
}