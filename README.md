# Enviro365 Investment Management & Withdrawal System

A full-stack, enterprise-grade Investment Management System built with **Spring Boot (Java 21)** and **React (Vite + Tailwind CSS)** following modern fintech design standards.

> **Base Package**: `com.enviro.assessment.junior.cherlton`  
> **Assessment**: Junior Software Developer Assessment 2026

---

## 📚 Dedicated Documentation Hub

The project documentation has been organized into separate dedicated files:

1. ⚡ [**Setup & Installation Guide**](./docs/SETUP_GUIDE.md) — Step-by-step instructions for running Spring Boot (port 8080) and React (port 5173), demo data, and unit tests.
2. 📑 [**REST API Documentation**](./docs/API_DOCUMENTATION.md) — Complete endpoint reference, request/response DTO schemas, and business validation error codes.
3. 🤖 [**AI Tooling & Pair-Programming Documentation**](./docs/AI_USAGE_DOCUMENTATION.md) — Technical breakdown of AI usage for UI template research, warm color psychology, CSS micro-animations, and environment troubleshooting.
4. 📸 [**System Screenshots & Visual Documentation**](./docs/SYSTEM_SCREENSHOTS.md) — Visual walkthrough of the dashboard, withdrawal form simulation, history table, and mobile responsive drawer.
5. 🖨️ [**Printable Documentation Bundle (HTML for PDF Export)**](./docs/DOCUMENTATION_BUNDLE.html) — Combined documentation bundle ready to convert into a single PDF.

---

## 📌 Project Executive Summary

The Enviro365 Investment Management System enables investors to view their portfolios (Retirement Annuities, Savings Funds, Tax-Free Savings), execute withdrawal notices against specific product holdings with automated balance deductions, enforce strict financial business rules, and export CSV statement reports.

The application features a warm, welcoming fintech UI/UX with interactive sidebar tooltips, live withdrawal impact simulations, real-time search filtering, responsive mobile drawer navigation, and popup toast feedback notifications.

---

## ⚡ Quick Start (TL;DR)

### Backend (Spring Boot 4.0.0 / Java 21)
```powershell
.\mvnw.cmd spring-boot:run
```
- **API Base URL**: `http://localhost:8080/api`
- **H2 Console**: `http://localhost:8080/h2-console` (`jdbc:h2:mem:investmentdb`, User: `sa`, Password: *[blank]*)

### Frontend (React 19 / Vite)
```bash
cd frontend
npm install
npm run dev
```
- **UI URL**: `http://localhost:5173`

---

## 👥 Seeded Demo Investor Accounts

On startup, the system automatically populates initial demo data for testing business rules:

- **Investor 1** (ID: 1): `Dr. Sipho Ndlovu` — **Age 72** (Eligible for retirement withdrawals, Age $> 65$)
- **Investor 2** (ID: 2): `Thabo Mbeki Jr` — **Age 40** (Ineligible for retirement withdrawals, Age $\le 65$)

---

## 🛡️ Business Validation Rules Matrix

| Rule | Description | Error Code | HTTP Status |
| :--- | :--- | :--- | :---: |
| **1. Retirement Age Restriction** | Withdrawals from `RETIREMENT` products require investor age to be strictly greater than 65 (`age > 65`). | `RETIREMENT_AGE_RESTRICTION` | 400 Bad Request |
| **2. Balance Sufficiency** | Requested withdrawal amount must not exceed current product balance (`amount <= balance`). | `INSUFFICIENT_BALANCE` | 400 Bad Request |
| **3. 90% Withdrawal Cap** | Requested withdrawal amount must not exceed 90% of available product balance (`amount <= balance * 0.90`). | `CAP_90_PERCENT_EXCEEDED` | 400 Bad Request |

---

For full details, please refer to the dedicated documentation files linked above in `./docs/`.
