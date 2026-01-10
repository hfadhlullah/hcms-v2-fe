package com.example.hcms.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO for login response
 */
public class LoginResponse {
    @JsonProperty("token")
    private String token;

    @JsonProperty("user")
    private UserResponse user;

    @JsonProperty("expiresAt")
    private String expiresAt;

    public LoginResponse(String token, UserResponse user, String expiresAt) {
        this.token = token;
        this.user = user;
        this.expiresAt = expiresAt;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }

    public String getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(String expiresAt) {
        this.expiresAt = expiresAt;
    }
}
