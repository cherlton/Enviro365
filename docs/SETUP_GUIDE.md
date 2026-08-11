# ⚡ Enviro365 Setup & Installation Guide

Complete step-by-step setup guide for compiling, running, and testing the Enviro365 Investment Management System.

---

## 📋 System Requirements & Prerequisites

To run the full-stack system locally, ensure you have the following installed:

- **Java Development Kit (JDK)**: Version 21 or higher
- **Node.js**: Version 18.0.0 or higher
- **NPM**: Version 9.0.0 or higher
- **Web Browser**: Google Chrome, Microsoft Edge, or Mozilla Firefox

---

## 🚀 Step 1: Backend Server Setup (Spring Boot)

The backend is built with Spring Boot 4.0.0 and utilizes an in-memory **H2 Database**, requiring zero database installation or configuration.

### 1. Navigate to Project Root
Open a terminal in the root directory `project-java`:
```powershell
cd c:\Users\Tumi\Documents\project-java
```

### 2. Build and Launch Backend
Run the Spring Boot application using the included Maven Wrapper:

- **Windows (PowerShell)**:
  ```powershell
  .\mvnw.cmd spring-boot:run
  ```
- **Linux / macOS**:
  ```bash
  ./mvnw spring-boot:run
  ```

### 3. Verify Backend Launch
Once initialized, the terminal will display:
```text
Started InvestmentManagementApplication in X.XXX seconds
```
- **REST API Base URL**: `http://localhost:8080/api`
- **H2 Console URL**: `http://localhost:8080/h2-console`
  - **JDBC URL**: `jdbc:h2:mem:investmentdb`
  - **Username**: `sa`
  - **Password**: *(leave blank)*

---

## 👥 Seeded Demo Investor Accounts

On startup, the system automatically populates initial demo data for testing business rules:

| Investor ID | Full Name | Date of Birth | Age | Retirement Withdrawal Eligibility |
| :---: | :--- | :---: | :---: | :---: |
| **1** | Dr. Sipho Ndlovu | `1954-05-12` | **72** | **ELIGIBLE** ($> 65$ years old) |
| **2** | Thabo Mbeki Jr | `1985-09-24` | **40** | **INELIGIBLE** ($\le 65$ years old) |

---

## 🎨 Step 2: Frontend Application Setup (React + Vite)

The frontend is built with React 19, Vite, and Tailwind CSS.

### 1. Open Frontend Directory
Open a second terminal window in the `frontend` folder:
```powershell
cd c:\Users\Tumi\Documents\project-java\frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access Dashboard
Open your web browser and navigate to:
```text
http://localhost:5173
```

---

## 🧪 Step 3: Running Automated Test Suites

To execute the automated JUnit 5 & Mockito test suite for business rules and services, run:

```powershell
.\mvnw.cmd test
```

Expected output:
```text
[INFO] Running com.enviro.assessment.junior.cherlton.validation.WithdrawalValidatorTest
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.enviro.assessment.junior.cherlton.service.WithdrawalServiceTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```
