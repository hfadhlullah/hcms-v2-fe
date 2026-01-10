package com.example.hcms.common.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI/Swagger configuration for API documentation
 */
@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "HCMS Time & Attendance API",
        version = "0.1.0",
        description = "API for HCMS Time & Attendance Management System. " +
                "Provides endpoints for authentication, shift management, and attendance tracking.",
        contact = @Contact(
            name = "HCMS Team",
            url = "https://github.com/example/hcms"
        ),
        license = @License(
            name = "MIT License",
            url = "https://opensource.org/licenses/MIT"
        )
    ),
    servers = {
        @Server(
            url = "http://localhost:8080",
            description = "Development Server"
        ),
        @Server(
            url = "https://api.hcms.example.com",
            description = "Production Server"
        )
    }
)
public class OpenApiConfig {
}
