# HCMS Backend - Spring Boot API

REST API backend for the HCMS Time & Attendance System.

## 🚀 Quick Start

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Java | 21+ |
| Maven | 3.8+ |
| MariaDB/MySQL | 10.x+ / 8.x |

### 1. Database Setup

```bash
mysql -u root -p
CREATE DATABASE hcms;
```

### 2. Configure Database

Update `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mariadb://localhost:3306/hcms
    username: root
    password: your_password
```

### 3. Run the Application

```bash
# Development
mvn spring-boot:run

# Or build and run JAR
mvn clean package -DskipTests
java -jar target/difan-hcms-0.1.0-SNAPSHOT.jar
```

Server starts at: **http://localhost:8080**

---

## 📁 Project Structure

```
backend/
├── src/main/java/com/example/hcms/
│   ├── auth/                        # Authentication Module
│   │   ├── domain/                  # User, UserRole entities
│   │   ├── dto/                     # LoginRequest, LoginResponse, UserResponse
│   │   ├── repository/              # JPA repositories
│   │   ├── service/                 # AuthService, AuthAuditService
│   │   ├── controller/              # AuthController
│   │   ├── security/                # JWT, filters, rate limiting
│   │   └── exception/               # Custom exceptions
│   │
│   ├── attendance/                  # Attendance Module
│   │   ├── domain/                  # AttendanceGroup, Shift entities
│   │   ├── dto/                     # Create/Update DTOs
│   │   ├── repository/              # JPA repositories
│   │   ├── service/                 # AttendanceGroupService, ShiftService
│   │   └── controller/              # REST controllers
│   │
│   └── common/                      # Shared Components
│       ├── config/                  # Security, OpenAPI, CORS config
│       └── error/                   # Global exception handler
│
├── src/main/resources/
│   ├── db/migration/                # Flyway SQL migrations
│   └── application.yml              # Configuration
│
└── pom.xml                          # Maven dependencies
```

---

## 🛠 Tech Stack

- **Framework**: Spring Boot 3.2
- **Language**: Java 21
- **Database**: MariaDB / MySQL
- **ORM**: Spring Data JPA + Hibernate
- **Migrations**: Flyway
- **Security**: Spring Security + JWT (HS256)
- **API Docs**: SpringDoc OpenAPI (Swagger UI)
- **Testing**: JUnit 5, Testcontainers

---

## 📡 API Documentation

Once running, access:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

### Key Endpoints

#### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | User login |

#### Shifts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/shifts` | List all shifts (paginated) |
| GET | `/api/v1/shifts/{id}` | Get shift by ID |
| POST | `/api/v1/shifts` | Create new shift |
| PUT | `/api/v1/shifts/{id}` | Update shift |
| DELETE | `/api/v1/shifts/{id}` | Delete shift |

#### Attendance Groups

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/attendance-groups` | List all groups (paginated) |
| GET | `/api/v1/attendance-groups/{id}` | Get group by ID |
| POST | `/api/v1/attendance-groups` | Create new group |
| PUT | `/api/v1/attendance-groups/{id}` | Update group |
| DELETE | `/api/v1/attendance-groups/{id}` | Delete group |

---

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_URL` | `jdbc:mariadb://localhost:3306/hcms` | Database URL |
| `DB_USERNAME` | `root` | Database username |
| `DB_PASSWORD` | - | Database password |
| `JWT_SECRET` | - | JWT signing secret (256-bit) |
| `JWT_EXPIRATION_HOURS` | `8` | Token expiration time |

### application.yml

```yaml
server:
  port: 8080

spring:
  datasource:
    url: ${DB_URL:jdbc:mariadb://localhost:3306/hcms}
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:}
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false

  flyway:
    enabled: true
    locations: classpath:db/migration

app:
  security:
    jwt:
      secret: ${JWT_SECRET:your-256-bit-secret-key-change-in-production}
      expiration-hours: ${JWT_EXPIRATION_HOURS:8}
```

---

## 🧪 Testing

```bash
# Run unit tests
mvn test

# Run integration tests (requires Docker)
mvn verify

# Run specific test class
mvn test -Dtest=AuthServiceTest
```

---

## 📦 Build for Production

```bash
# Build JAR
mvn clean package -DskipTests

# Output
target/difan-hcms-0.1.0-SNAPSHOT.jar

# Run production
java -jar target/difan-hcms-0.1.0-SNAPSHOT.jar \
  --spring.profiles.active=prod \
  --DB_PASSWORD=your_password \
  --JWT_SECRET=your-production-secret
```

---

## 🔐 Security Features

1. **Password Hashing**: BCrypt with cost factor ≥ 10
2. **JWT Authentication**: HS256 signed tokens, 8-hour expiry
3. **Rate Limiting**: 5 failed login attempts per minute per IP
4. **Audit Logging**: All login attempts logged
5. **CORS**: Configurable allowed origins

---

## 🗃️ Database Migrations

Flyway manages database schema. Migrations are in `src/main/resources/db/migration/`:

```
V1__create_user_tables.sql
V2__create_shift_table.sql
V3__create_attendance_group_table.sql
...
```

Run migrations manually:

```bash
mvn flyway:migrate
```

---

## 🔧 Development

### Add New Entity

1. Create entity in `domain/`
2. Create repository in `repository/`
3. Create DTOs in `dto/`
4. Create service in `service/`
5. Create controller in `controller/`
6. Add Flyway migration

### Code Style

- Follow Java naming conventions
- Use records for DTOs where appropriate
- Add OpenAPI annotations for documentation

---

## 📄 License

MIT License
