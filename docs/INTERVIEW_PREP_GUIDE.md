# 🎓 Enviro365 Project - Interview Preparation Guide

This guide breaks down the architecture, business rule implementation, backend/frontend folder roles, build commands, and H2 database usage to prepare you for your technical interview.

---

## 1. 🛡️ Business Rules Implementation (Where & How)

The core business logic enforces three financial rules. These are applied in **both** the backend and frontend to ensure security and smooth UI user experience (defense-in-depth).

| Business Rule | Condition | Backend Exception Code | Frontend UI Behavior |
| :--- | :--- | :--- | :--- |
| **1. Retirement Age Restriction** | Investor age must be $> 65$ for `RETIREMENT` product withdrawals. | `RETIREMENT_AGE_RESTRICTION` | Shows warning alert banner; grays out submit button if investor age $\le 65$. |
| **2. Balance Sufficiency** | Requested amount cannot exceed current product balance. | `INSUFFICIENT_BALANCE` | Shows error alert banner; grays out submit button. |
| **3. 90% Withdrawal Cap** | Requested amount cannot reach or exceed 90% of product balance (`amount >= balance * 0.90`). | `CAP_90_PERCENT_EXCEEDED` | Displays **90% Cap Warning** alert; grays out submit button; turns simulation bar red. |

### Where Logic Lives in Code:

1. **Backend Validation Component**:
   - Location: `src/main/java/com/enviro/assessment/junior/cherlton/validation/`[WithdrawalValidator.java](file:///c:/Users/Tumi/Documents/project-java/src/main/java/com/enviro/assessment/junior/cherlton/validation/WithdrawalValidator.java)
   - Domain Model: `src/main/java/com/enviro/assessment/junior/cherlton/model/`[Product.java](file:///c:/Users/Tumi/Documents/project-java/src/main/java/com/enviro/assessment/junior/cherlton/model/Product.java#L145-L148) (`exceeds90PercentCap`)
   - How it works: `WithdrawalServiceImpl` calls `WithdrawalValidator.validate()` before modifying database records. If any rule fails, an `InvalidWithdrawalException` is thrown, catching bad requests at the API boundary with HTTP 400.

2. **Frontend Validation Component**:
   - Location: `frontend/src/components/`[WithdrawalForm.jsx](file:///c:/Users/Tumi/Documents/project-java/frontend/src/components/WithdrawalForm.jsx#L52-L58)
   - How it works: Evaluates `isCapViolation`, `isExceedBalance`, and `isRetirementViolation` in real time. It uses cents calculation (`numAmountCents >= maxCapCents`) for precision safety, automatically graying out the submit button (`disabled={...}`).

---

## 2. 📁 Java Backend Folder Structure (`src/main/java/`)

The backend follows the standard **Layered Architecture (N-Tier)**:

```text
com.enviro.assessment.junior.cherlton
 ├── config          # App startup configuration & security
 ├── controller      # REST Controllers (HTTP Endpoints)
 ├── dto             # Data Transfer Objects (Request/Response schemas)
 ├── exception       # Custom exceptions & Global Error Handler
 ├── model           # JPA Domain Entities (Database mappings)
 ├── repository      # Data Access Layer (Spring Data JPA Repositories)
 ├── service         # Business Logic Layer
 └── validation      # Dedicated Business Rule Validators
```

### Folder Responsibilities:

- **`model/`**: Contains JPA Entities mapped to H2 SQL tables ([Product.java](file:///c:/Users/Tumi/Documents/project-java/src/main/java/com/enviro/assessment/junior/cherlton/model/Product.java), [Investor.java](file:///c:/Users/Tumi/Documents/project-java/src/main/java/com/enviro/assessment/junior/cherlton/model/Investor.java), [WithdrawalNotice.java](file:///c:/Users/Tumi/Documents/project-java/src/main/java/com/enviro/assessment/junior/cherlton/model/WithdrawalNotice.java)). Defines fields, relationships (`@ManyToMany`, `@ManyToOne`), and domain methods.
- **`repository/`**: Interfaces extending `JpaRepository` (e.g., `ProductRepository`). Provides built-in SQL methods (`findById`, `save`, `findAll`) without writing raw SQL.
- **`service/`**: Holds service interfaces and implementation classes (e.g., `WithdrawalServiceImpl`). Contains transaction logic (`@Transactional`), handles database persistence, and coordinates validation.
- **`controller/`**: REST Controllers exposing JSON APIs (e.g., `WithdrawalController`). Annotations like `@PostMapping` and `@GetMapping` map incoming HTTP requests to Java logic.
- **`dto/`**: Data Transfer Objects (e.g., `WithdrawalRequestDTO`). Separates external HTTP payload structure from internal database entities for security and clean decoupling.
- **`exception/`**: Centralized exception handling (`GlobalExceptionHandler`). Intercepts errors and formats them into clean JSON error responses for the frontend.
- **`validation/`**: Isolated validation layer (`WithdrawalValidator`) ensuring business rules are easily auditable, testable, and reusable.

---

## 3. ⚙️ Compile, Run & Build Commands (Backend)

Run these PowerShell commands in the root `project-java` directory:

| Command | Purpose | Why We Use It |
| :--- | :--- | :--- |
| `.\mvnw.cmd test` | Runs all JUnit 5 unit tests. | Verifies business rules and service logic without launching the server. |
| `.\mvnw.cmd spring-boot:run` | Launches Spring Boot application on port `8080`. | Runs dev server with live restart capability for local development. |
| `.\mvnw.cmd clean package` | Compiles code, runs tests, and packages a standalone `.jar` file in `target/`. | Prepares production build executable ready for server deployment. |

### What is `mvnw` (Maven Wrapper)?
The **Maven Wrapper** allows anyone to run Maven commands without needing Maven manually installed on their operating system. It automatically downloads the exact required Maven version locally, guaranteeing reproducible builds across different machines.

---

## 4. 🗄️ H2 Database: What it is & How to Query

### What does "H2" mean?
**H2** stands for **Hypersonic SQL Database Engine**. It is a lightweight, open-source SQL database written entirely in Java. In this application, it runs as an **In-Memory Database** stored inside RAM, which means zero installation overhead and instant startup.

### How to Access H2 Console:
1. Ensure the Spring Boot backend is running (`.\mvnw.cmd spring-boot:run`).
2. Open your web browser and navigate to: `http://localhost:8080/h2-console`
3. Enter the connection settings matching `application.properties`:
   - **JDBC URL**: `jdbc:h2:mem:investmentdb`
   - **User Name**: `sa`
   - **Password**: *(leave blank)*
4. Click **Connect**.

### How to Select All Stored Elements (SQL):
To view all database tables, run these standard SQL queries in the H2 Console query box:

```sql
-- View all investors
SELECT * FROM INVESTORS;

-- View all savings portfolios
SELECT * FROM PORTFOLIOS;

-- View all product holdings and current balances
SELECT * FROM PRODUCTS;

-- View all processed withdrawal notices
SELECT * FROM WITHDRAWAL_NOTICES;
```

---

## 💡 Quick Talking Points for Your Interview

1. **Architecture**: *"I used a layered architecture in Spring Boot with clean separation of concerns: REST Controllers for HTTP request mapping, DTOs for decoupled payloads, JPA Repositories for data access, and Service layers with domain validation."*
2. **Business Rule Enforcement**: *"I implemented defense-in-depth: client-side validation in React prevents invalid form submission, while server-side validation in `WithdrawalValidator` guarantees data integrity at the API boundary."*
3. **Database & Testing**: *"The app uses an H2 in-memory database with Spring Data JPA for rapid execution, backed by JUnit 5 unit tests for business validation rules."*
