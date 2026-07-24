# Enviro365 Investment Management & Withdrawal System

A full-stack, enterprise-grade Investment Management System built with **Spring Boot (Java 21)** and **React (Vite + Tailwind CSS)** following modern fintech design standards.

> **Base Package**: `com.enviro.assessment.junior.cherlton`  
> **Assessment**: Junior Software Developer Assessment 2026

---

## 📌 Project Overview

The Enviro365 Investment Management System enables investors to manage their portfolios (Retirement Annuities, Savings Funds, Tax-Free Savings), execute withdrawal notices against specific product holdings with automated balance deductions, enforce strict financial business rules, and export CSV statement reports.

The application features a warm, welcoming fintech UI/UX with interactive sidebar tooltips, live withdrawal impact simulations, real-time search filtering, responsive mobile drawer navigation, and popup toast feedback notifications.

---

## 📸 System Screenshots


### 1. Portfolio Overview Dashboard
![Portfolio Overview Dashboard](./docs/screenshots/01-portfolio-overview.png)
*View total portfolio balance, 90% withdrawal cap limit, registered portfolios, retirement eligibility status, and product holdings.*

### 2. Create Withdrawal Notice & Live Impact Simulation
![Create Withdrawal Notice Form](./docs/screenshots/02-withdrawal-form.png)
*Submit withdrawal requests with real-time balance simulation, quick percentage cap shortcuts (25%, 50%, 75%, 90% Max), and business rule validation alerts.*

### 3. Withdrawal Audit History & Filtered CSV Export
![Withdrawal History Table](./docs/screenshots/03-withdrawal-history.png)
*Audit log of submitted notices with date range filtering, status badges, and one-click CSV statement export.*

### 4. Responsive Mobile & Tablet Drawer Menu
![Mobile Drawer Interface](./docs/screenshots/04-mobile-drawer.png)
*Mobile-optimized navigation drawer with hamburger toggle menu and warm gradient theme.*

> 💡 **Screenshot Storage Location**: Saved screenshot image files are  in `docs/screenshots/` inside the project root:
> - `docs/screenshots/01-portfolio-overview.png`
> - `docs/screenshots/02-withdrawal-form.png`
> - `docs/screenshots/03-withdrawal-history.png`
> - `docs/screenshots/04-mobile-drawer.png`

---

## 🛠️ Technology Stack & Architecture

### Backend (Spring Boot 4.0.0 / Java 21)
- **Framework**: Spring Boot 4.0.0 (Java 21)
- **Persistence**: Spring Data JPA / Hibernate ORM
- **Database**: H2 In-Memory Database (`jdbc:h2:mem:investmentdb`; zero setup required, auto-seeded on startup)
- **Validation**: Jakarta Bean Validation (`@Valid`, `@NotNull`, `@Positive`, `@NotBlank`)
- **Testing**: JUnit 5 & Mockito

### Frontend (React 19 / Vite / Tailwind CSS)
- **Framework**: React 19 + Vite
- **Styling**: Custom Warm Fintech Theme Tokens (`#FAF8F4` warm cream paper background, `#1A7A6D` forest teal green brand accent)
- **Component Architecture**: Modular Atomic UI (`Button`, `Card`, `Badge`, `Alert`, `Input`, `Select`, `Toast`, `Sidebar`, `Navbar`)
- **UX Features**: Section entrance animations, live simulation calculator, global search, mobile slide-over drawer, and hover popover tooltips.

---

## ⚡ Setup & Quick Start Guide

### Prerequisites
- **Java JDK 21** or higher
- **Node.js 18** or higher (`npm` included)

### Step 1: Start the Backend Server (Spring Boot)
Open a terminal in the project root directory (`project-java`) and run:

```powershell
# Windows (using Maven wrapper)
.\mvnw.cmd spring-boot:run
```
or on Linux/macOS:
```bash
./mvnw spring-boot:run
```

- **Backend API Base URL**: `http://localhost:8080/api`
- **H2 Database Console**: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:investmentdb`, User: `sa`, Password: *[blank]*)

> ℹ️ **Pre-seeded Demo Data**:
> - **Investor 1** (ID: 1): `Dr. Sipho Ndlovu` — **Age 72** (Eligible for retirement withdrawals, Age $> 65$)
> - **Investor 2** (ID: 2): `Thabo Mbeki Jr` — **Age 40** (Ineligible for retirement withdrawals, Age $\le 65$)

### Step 2: Start the Frontend Application (React UI)
Open a second terminal window in the `frontend` directory and run:

```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:5173` in your browser.

---

## 📑 REST API Documentation

### 1. Retrieve Investor Portfolio
- **HTTP Method**: `GET`
- **Endpoint**: `/api/portfolios/{investorId}`
- **Description**: Fetches investor profile details along with associated portfolios, product holdings, available balances, and 90% withdrawal limits.
- **Sample Response (`200 OK`)**:
```json
{
  "id": 1,
  "name": "Dr. Sipho Ndlovu",
  "email": "sipho.ndlovu@example.com",
  "phone": "0821234567",
  "address": "123 Rosebank Road, Johannesburg",
  "dateOfBirth": "1954-05-12",
  "age": 72,
  "eligibleForRetirement": true,
  "portfolios": [
    {
      "id": 1,
      "name": "Sipho's Primary Investment Portfolio",
      "type": "RETIREMENT",
      "products": [
        {
          "id": 1,
          "name": "Old Mutual Retirement Annuity",
          "type": "RETIREMENT",
          "currentPrice": 150.00,
          "balance": 500000.00,
          "maxWithdrawalAllowed": 450000.00
        }
      ]
    }
  ]
}
```

### 2. Create Withdrawal Notice
- **HTTP Method**: `POST`
- **Endpoint**: `/api/withdrawals`
- **Header**: `Content-Type: application/json`
- **Sample Request Body**:
```json
{
  "investorId": 1,
  "productId": 1,
  "amount": 25000.00,
  "noticeDate": "2026-07-24",
  "reason": "Annual retirement income drawdown"
}
```
- **Sample Response (`201 Created`)**:
```json
{
  "id": 101,
  "investorId": 1,
  "investorName": "Dr. Sipho Ndlovu",
  "productId": 1,
  "productName": "Old Mutual Retirement Annuity",
  "productType": "RETIREMENT",
  "amount": 25000.00,
  "status": "APPROVED",
  "reason": "Annual retirement income drawdown",
  "noticeDate": "2026-07-24",
  "createdAt": "2026-07-24T21:00:00"
}
```

### 3. Retrieve Past Withdrawal Notices
- **HTTP Method**: `GET`
- **Endpoint**: `/api/withdrawals`
- **Query Parameters**: `investorId` (optional), `productId` (optional), `startDate` (optional), `endDate` (optional)
- **Sample Request**: `GET /api/withdrawals?investorId=1&startDate=2026-01-01`
- **Sample Response (`200 OK`)**: List of `WithdrawalNoticeDTO` objects.

### 4. Export CSV Statements
- **HTTP Method**: `GET`
- **Endpoint**: `/api/withdrawals/export/csv`
- **Query Parameters**: `investorId`, `productId`, `startDate`, `endDate`
- **Response Headers**: `Content-Type: text/csv`, `Content-Disposition: attachment; filename="withdrawal_statements.csv"`

---

## 🛡️ Business Rule Validation Engine

All withdrawal requests pass through a centralized validation component (`WithdrawalValidator.java`) prior to database execution:

| Rule | Description | Error Code | HTTP Status |
| :--- | :--- | :--- | :---: |
| **1. Retirement Age Restriction** | Withdrawals from `RETIREMENT` products require investor age to be strictly greater than 65 (`age > 65`). | `RETIREMENT_AGE_RESTRICTION` | 400 Bad Request |
| **2. Balance Sufficiency** | Requested withdrawal amount must not exceed current product balance (`amount <= balance`). | `INSUFFICIENT_BALANCE` | 400 Bad Request |
| **3. 90% Withdrawal Cap** | Requested withdrawal amount must not exceed 90% of available product balance (`amount <= balance * 0.90`). | `CAP_90_PERCENT_EXCEEDED` | 400 Bad Request |

---

## 🤖 AI Tooling & Pair-Programming Documentation

### Overview
During the development of the Enviro365 Investment Management System, **Antigravity AI (Google DeepMind Agentic Coding Assistant)** was utilized as an AI pair-programming partner. AI was leveraged strategically to accelerate research, troubleshoot runtime JVM environments, refine visual design systems, and assist with complex CSS keyframe animations.

### Key Areas of AI Utilization

1. **UI/UX Design Systems & Color Psychology Research**:
   - Leveraged AI research capabilities to explore modern fintech color psychology and design standards.
   - Selected a warm paper-cream background (`#FAF8F4`) paired with rich forest teal green accents (`#1A7A6D`) to promote visual calm, warmth, and financial trust—moving away from generic dark themes toward an enterprise-ready identity.

2. **CSS Animations & Micro-Interactions**:
   - Utilized AI assistance to write fluid keyframe transitions (`animate-page-entry`, `toast-slide-in`, `dropdownFadeIn`) for seamless section switching and popup feedback toasts without introducing external heavy animation libraries.

3. **Development Troubleshooting & Environment Diagnostics**:
   - Used AI diagnostics to troubleshoot JDK 21 ByteBuddy dynamic agent loading warnings during Maven unit testing (`.\mvnw.cmd test`), ensuring test execution and zero build errors.

4. **Component Prototyping & Test Case Generation**:
   - Accelerated the creation of atomic React UI components (`Toast`, `Alert`, `Badge`) and drafted comprehensive JUnit 5 and Mockito test edge cases for `WithdrawalValidatorTest` and `WithdrawalServiceTest`.

### Developer Verification & Control
- **Core Engineering**: All architecture, OOP entity design, REST API contracts, Spring Data JPA queries, and business validation rules were designed and verified me as the developer.
- **Code Audit**: Every AI-assisted code snippet was audited for performance, security, and strict adherence to the assessment requirements.
