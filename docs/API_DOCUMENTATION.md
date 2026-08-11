# 📑 Enviro365 REST API Documentation

Comprehensive technical documentation for all backend REST API endpoints, DTO contracts, and business validation error codes.

---

## 🌐 API Overview & Base URL

- **Base URL**: `http://localhost:8080/api`
- **Format**: JSON (`Content-Type: application/json`) & CSV (`Content-Type: text/csv`)

---

## 📌 Endpoints Reference

### 1. Retrieve Investor Portfolio & Holdings
Returns investor details, registered portfolios, and associated product holdings with calculated balances and maximum 90% withdrawal limits.

- **HTTP Method**: `GET`
- **Endpoint Path**: `/api/portfolios/{investorId}`
- **Path Parameter**: `investorId` (Long) - ID of the investor (e.g. `1` or `2`)

#### Response (`200 OK`)
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
        },
        {
          "id": 2,
          "name": "Allan Gray Balanced Fund",
          "type": "SAVINGS",
          "currentPrice": 320.50,
          "balance": 250000.00,
          "maxWithdrawalAllowed": 225000.00
        }
      ]
    }
  ]
}
```

---

### 2. Create Withdrawal Notice
Executes business validation rules, deducts the approved amount from the product balance, and creates a persisted withdrawal notice.

- **HTTP Method**: `POST`
- **Endpoint Path**: `/api/withdrawals`
- **Headers**: `Content-Type: application/json`

#### Request Body Payload (`WithdrawalRequestDTO`)
```json
{
  "investorId": 1,
  "productId": 1,
  "amount": 25000.00,
  "noticeDate": "2026-07-24",
  "reason": "Annual retirement income drawdown"
}
```

#### Successful Response (`201 Created`)
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

---

### 3. Retrieve Filtered Withdrawal Audit History
Retrieves past withdrawal notices with optional query filters.

- **HTTP Method**: `GET`
- **Endpoint Path**: `/api/withdrawals`
- **Query Parameters**:
  - `investorId` *(optional)*: Filter by investor ID (e.g. `1`)
  - `productId` *(optional)*: Filter by product ID
  - `startDate` *(optional)*: Filter by start date (`YYYY-MM-DD`)
  - `endDate` *(optional)*: Filter by end date (`YYYY-MM-DD`)

#### Response (`200 OK`)
```json
[
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
    "noticeDate": "2026-07-24"
  }
]
```

---

### 4. Export Filtered CSV Statements
Generates and downloads a CSV formatted statement report based on active filter criteria.

- **HTTP Method**: `GET`
- **Endpoint Path**: `/api/withdrawals/export/csv`
- **Query Parameters**: `investorId`, `productId`, `startDate`, `endDate`
- **Response Headers**:
  - `Content-Type: text/csv`
  - `Content-Disposition: attachment; filename="withdrawal_statements.csv"`

---

## 🛡️ Business Validation Error Codes

When a withdrawal request violates business rules, the API returns `HTTP 400 Bad Request` with structured JSON (`ErrorResponseDTO`):

```json
{
  "timestamp": "2026-07-24T21:30:00",
  "status": 400,
  "errorCode": "RETIREMENT_AGE_RESTRICTION",
  "message": "Retirement product withdrawal rejected. Investor 'Thabo Mbeki Jr' is 40 years old. Withdrawals from RETIREMENT products require investor age to be greater than 65."
}
```

| Error Code | HTTP Status | Description / Validation Trigger |
| :--- | :---: | :--- |
| `RETIREMENT_AGE_RESTRICTION` | **400** | Rejects retirement product withdrawals if investor age $\le 65$. |
| `INSUFFICIENT_BALANCE` | **400** | Rejects withdrawals where requested amount exceeds available product balance. |
| `CAP_90_PERCENT_EXCEEDED` | **400** | Rejects withdrawals where requested amount exceeds 90% of current product balance. |
| `RESOURCE_NOT_FOUND` | **404** | Returned when investor ID or product ID does not exist. |
