package com.example.hcms.auth.service;

import com.example.hcms.auth.domain.User;
import com.example.hcms.auth.dto.CreateUserRequest;
import com.example.hcms.auth.dto.UpdateUserRequest;
import com.example.hcms.auth.dto.UserResponse;
import com.example.hcms.auth.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

/**
 * Service for managing users/members
 */
@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Create a new user/member
     * 
     * @param request the create user request
     * @return the created user response
     */
    public UserResponse createUser(CreateUserRequest request) {
        // Generate username from name or email
        String username = generateUsername(request);

        // Generate a temporary password (user will be invited)
        String tempPassword = UUID.randomUUID().toString().substring(0, 8);
        String passwordHash = passwordEncoder.encode(tempPassword);

        // Create user entity
        User user = new User();
        user.setEmail(request.getEmail() != null ? request.getEmail() : username + "@temp.local");
        user.setUsername(username);
        user.setPasswordHash(passwordHash);
        user.setFirstName(request.getFirstName() != null ? request.getFirstName() : request.getName());
        user.setLastName(request.getLastName());
        user.setStatus(User.UserStatus.INACTIVE); // INACTIVE until they accept invitation

        // Detailed info
        user.setPhoneNumber(request.getPhoneNumber());
        user.setDepartmentId(request.getDepartmentId());
        user.setAlias(request.getAlias());
        user.setDeskId(request.getDeskId());
        user.setPhoneExtension(request.getPhoneExtension());
        user.setEmployeeNumber(request.getEmployeeNumber());
        user.setUserId(request.getUserId());
        user.setGender(request.getGender());
        user.setWorkforceType(request.getWorkforceType());
        user.setDateOfEmployment(request.getDateOfEmployment());
        user.setCountry(request.getCountry());
        user.setCity(request.getCity());
        user.setDirectManager(request.getDirectManager());
        user.setDottedLineManager(request.getDottedLineManager());
        user.setJobTitle(request.getJobTitle());

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                Set.of("EMPLOYEE") // Default role
        );
    }

    /**
     * Get all users with pagination
     * 
     * @param pageable pagination info
     * @return page of user responses
     */
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getRoles().stream()
                                .map(ur -> ur.getRole().name())
                                .collect(java.util.stream.Collectors.toSet())));
    }

    /**
     * Generate a unique username from the request
     */
    private String generateUsername(CreateUserRequest request) {
        String baseName = request.getName().toLowerCase().replaceAll("[^a-z0-9]", "");
        String username = baseName;
        int counter = 1;

        while (userRepository.findByUsername(username).isPresent()) {
            username = baseName + counter;
            counter++;
        }

        return username;
    }

    /**
     * Reset a user's password
     * 
     * @param userId   the user ID
     * @param password the new password, or null to generate by system
     * @return the generated password if generateBySystem is true, otherwise null
     */
    public String resetPassword(Long userId, String password) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newPassword;
        if (password != null && !password.isEmpty()) {
            newPassword = password;
        } else {
            // Generate a random password
            newPassword = UUID.randomUUID().toString().substring(0, 12);
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setStatus(User.UserStatus.ACTIVE); // Activate user if they were invited
        userRepository.save(user);

        return newPassword;
    }

    /**
     * Update an existing user
     * 
     * @param id      user ID
     * @param request update request
     * @return updated user response
     */
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null)
            user.setFirstName(request.getName()); // Basic mapping
        if (request.getFirstName() != null)
            user.setFirstName(request.getFirstName());
        if (request.getLastName() != null)
            user.setLastName(request.getLastName());
        if (request.getEmail() != null)
            user.setEmail(request.getEmail()); // TODO: Check for duplicates?

        if (request.getPhoneNumber() != null)
            user.setPhoneNumber(request.getPhoneNumber());
        if (request.getDepartmentId() != null)
            user.setDepartmentId(request.getDepartmentId());
        if (request.getAlias() != null)
            user.setAlias(request.getAlias());
        if (request.getDeskId() != null)
            user.setDeskId(request.getDeskId());
        if (request.getPhoneExtension() != null)
            user.setPhoneExtension(request.getPhoneExtension());
        if (request.getEmployeeNumber() != null)
            user.setEmployeeNumber(request.getEmployeeNumber());
        if (request.getUserId() != null)
            user.setUserId(request.getUserId());
        if (request.getGender() != null)
            user.setGender(request.getGender());
        if (request.getWorkforceType() != null)
            user.setWorkforceType(request.getWorkforceType());
        if (request.getDateOfEmployment() != null)
            user.setDateOfEmployment(request.getDateOfEmployment());
        if (request.getCountry() != null)
            user.setCountry(request.getCountry());
        if (request.getCity() != null)
            user.setCity(request.getCity());
        if (request.getDirectManager() != null)
            user.setDirectManager(request.getDirectManager());
        if (request.getDottedLineManager() != null)
            user.setDottedLineManager(request.getDottedLineManager());
        if (request.getJobTitle() != null)
            user.setJobTitle(request.getJobTitle());

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getRoles().stream()
                        .map(ur -> ur.getRole().name())
                        .collect(java.util.stream.Collectors.toSet()));
    }

    /**
     * Delete a user
     * 
     * @param id user ID
     */
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }
}
