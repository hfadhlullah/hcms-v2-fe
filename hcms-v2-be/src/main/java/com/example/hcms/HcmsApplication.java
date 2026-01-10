package com.example.hcms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Main Spring Boot application class for HCMS Time & Attendance System
 */
@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.hcms")
public class HcmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(HcmsApplication.class, args);
    }
}
