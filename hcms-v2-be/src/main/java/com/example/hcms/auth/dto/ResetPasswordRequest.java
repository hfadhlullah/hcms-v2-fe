package com.example.hcms.auth.dto;

/**
 * Request DTO for resetting a user's password
 */
public class ResetPasswordRequest {

    private String password;
    private boolean generateBySystem;

    public ResetPasswordRequest() {
    }

    public ResetPasswordRequest(String password, boolean generateBySystem) {
        this.password = password;
        this.generateBySystem = generateBySystem;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isGenerateBySystem() {
        return generateBySystem;
    }

    public void setGenerateBySystem(boolean generateBySystem) {
        this.generateBySystem = generateBySystem;
    }
}
