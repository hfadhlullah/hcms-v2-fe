package com.example.hcms.auth.controller;

import com.example.hcms.auth.dto.CreateUserRequest;
import com.example.hcms.auth.dto.ResetPasswordRequest;
import com.example.hcms.auth.dto.UpdateUserRequest;
import com.example.hcms.auth.dto.UserResponse;
import com.example.hcms.auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for user management endpoints
 */
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "User management endpoints")
public class UserController {

        private final UserService userService;

        public UserController(UserService userService) {
                this.userService = userService;
        }

        /**
         * Create a new user/member
         * 
         * @param request the create user request
         * @return the created user
         */
        @PostMapping
        @Operation(summary = "Create a new user", description = "Create a new user/member in the system")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "201", description = "User created successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserResponse.class))),
                        @ApiResponse(responseCode = "400", description = "Invalid input"),
                        @ApiResponse(responseCode = "409", description = "User already exists")
        })
        public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
                UserResponse response = userService.createUser(request);
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        /**
         * Get all users with pagination
         * 
         * @param pageable pagination parameters
         * @return page of users
         */
        @GetMapping
        @Operation(summary = "Get all users", description = "Get all users with pagination")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Users retrieved successfully")
        })
        public ResponseEntity<Page<UserResponse>> getAllUsers(Pageable pageable) {
                Page<UserResponse> users = userService.getAllUsers(pageable);
                return ResponseEntity.ok(users);
        }

        /**
         * Reset a user's password
         * 
         * @param id      the user ID
         * @param request the reset password request
         * @return success message with generated password if applicable
         */
        @PostMapping("/{id}/reset-password")
        @Operation(summary = "Reset user password", description = "Reset a user's password")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Password reset successfully"),
                        @ApiResponse(responseCode = "404", description = "User not found")
        })
        public ResponseEntity<Map<String, String>> resetPassword(
                        @PathVariable Long id,
                        @RequestBody ResetPasswordRequest request) {
                String newPassword = userService.resetPassword(id,
                                request.isGenerateBySystem() ? null : request.getPassword());

                return ResponseEntity.ok(Map.of(
                                "message", "Password reset successfully",
                                "generatedPassword", request.isGenerateBySystem() ? newPassword : ""));
        }

        /**
         * Update an existing user
         * 
         * @param id      user ID
         * @param request update request
         * @return updated user
         */
        @PutMapping("/{id}")
        @Operation(summary = "Update user", description = "Update an existing user's information")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "User updated successfully"),
                        @ApiResponse(responseCode = "404", description = "User not found")
        })
        public ResponseEntity<UserResponse> updateUser(
                        @PathVariable Long id,
                        @Valid @RequestBody UpdateUserRequest request) {
                UserResponse response = userService.updateUser(id, request);
                return ResponseEntity.ok(response);
        }

        /**
         * Delete a user
         * 
         * @param id user ID
         * @return no content
         */
        @DeleteMapping("/{id}")
        @Operation(summary = "Delete user", description = "Delete a user from the system")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "204", description = "User deleted successfully"),
                        @ApiResponse(responseCode = "404", description = "User not found")
        })
        public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
                userService.deleteUser(id);
                return ResponseEntity.noContent().build();
        }
}
