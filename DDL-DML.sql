-- Drop tables if they exist to ensure a clean slate
DROP TABLE IF EXISTS customer_family;
DROP TABLE IF EXISTS mobile_number;
DROP TABLE IF EXISTS address;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS city;
DROP TABLE IF EXISTS country;

-- DDL - Data Definition Language

-- Master table for Countries
CREATE TABLE country (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Master table for Cities
CREATE TABLE city (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_id BIGINT NOT NULL,
    FOREIGN KEY (country_id) REFERENCES country(id)
);

-- Main Customer table
CREATE TABLE customer (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    nic_number VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- One-to-Many table for Customer Addresses
CREATE TABLE address (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    FOREIGN KEY (city_id) REFERENCES city(id),
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE
);

-- One-to-Many table for Customer Mobile Numbers
CREATE TABLE mobile_number (
    customer_id BIGINT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    PRIMARY KEY (customer_id, phone_number),
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE
);


-- Many-to-Many join table for Family Members
CREATE TABLE customer_family (
    customer_id BIGINT NOT NULL,
    family_member_id BIGINT NOT NULL,
    PRIMARY KEY (customer_id, family_member_id),
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
    FOREIGN KEY (family_member_id) REFERENCES customer(id) ON DELETE CASCADE,
    CONSTRAINT chk_family_self CHECK (customer_id <> family_member_id)
);

-- Add indexes for performance
CREATE INDEX idx_customer_nic ON customer(nic_number);
CREATE INDEX idx_address_customer ON address(customer_id);

-- DML - Data Manipulation Language (Sample Master Data)
INSERT INTO country (name) VALUES ('USA'), ('Canada'), ('Sri Lanka'), ('India');
INSERT INTO city (name, country_id) VALUES ('New York', 1), ('Los Angeles', 1), ('Toronto', 2), ('Vancouver', 2), ('Colombo', 3), ('Kandy', 3), ('Mumbai', 4), ('Delhi', 4);