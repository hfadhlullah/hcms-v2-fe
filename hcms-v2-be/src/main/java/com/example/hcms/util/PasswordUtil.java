package com.example.hcms.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordUtil {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
        
        String rawPassword = "test123";
        String encodedPassword = encoder.encode(rawPassword);
        
        System.out.println("Raw Password: " + rawPassword);
        System.out.println("Encoded: " + encodedPassword);
        System.out.println("Matches: " + encoder.matches(rawPassword, encodedPassword));
        
        // Test with known hash
        String knownHash = "$2a$10$F9XcQMFzDf8rZQlJaKXiMO8lzC/THD9XlHz6R4T8l7WHjN8sYZJhm";
        System.out.println("\nKnown Hash from DB: " + knownHash);
        System.out.println("Matches with 'test123': " + encoder.matches("test123", knownHash));
    }
}
