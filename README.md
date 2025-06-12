# Customer Management System (Full Stack)

This is a comprehensive full-stack application for managing customer data, built with a modern Java backend and a reactive frontend. The system provides full CRUD (Create, Read, Update, Delete) functionality for customers, supports complex relationships, and features a highly optimized bulk upload/update capability via Excel files.

## Features

-   **Full Customer CRUD**: Create, view, edit, and delete customers through a user-friendly interface.
-   **Detailed Customer View**: Access a complete profile for each customer, including multiple addresses, phone numbers, and family connections.
-   **Paginated Customer List**: Browse all customers efficiently with a clean, paginated table.
-   **Cascading Dropdowns**: Smart address forms where selecting a country dynamically populates the relevant city choices.
-   **Dynamic Forms**: Easily add or remove multiple addresses and phone numbers on the fly.
-   **Optimized Bulk Processing**: Asynchronously upload Excel files containing up to 1,000,000 records to create new customers or update existing ones based on their unique NIC number. The process is designed for high performance and low memory usage.

## Technology Stack

### Backend
-   **Java**: 17
-   **Spring Boot**: 3.5.0
-   **Database**:  MySQL
-   **Data Access**: Spring Data JPA 
-   **Build Tool**: Apache Maven
-   **Excel Processing**: Apache POI
-   **Mapping**: MapStruct

### Frontend
-   **JavaScript Library**: React JS
-   **HTTP Client**: Axios
-   **Routing**: React Router
-   **Styling**: Bootstrap 5



## Bulk Upload Excel Format


-   Create an Excel file (`.xlsx`) with a header row.
-   The first three columns **must** be in the following order:
    1.  `nicNumber`
    2.  `name`
    3.  `dateOfBirth`

