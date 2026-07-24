const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Helper to handle fetch responses and parse error JSON payload.
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorData = { message: 'An unexpected error occurred', status: response.status };
    try {
      errorData = await response.json();
    } catch (e) {
      // Fallback if not JSON
    }
    const error = new Error(errorData.message || 'Request failed');
    error.status = response.status;
    error.errorCode = errorData.errorCode || errorData.error || 'ERROR';
    error.data = errorData;
    throw error;
  }
  return response.json();
}

/**
 * Fetches investor details and product holdings.
 * Requirement 1: GET /api/portfolios/{investorId}
 */
export async function getInvestorPortfolio(investorId) {
  const response = await fetch(`${API_BASE_URL}/portfolios/${investorId}`);
  return handleResponse(response);
}

/**
 * Creates a new withdrawal notice.
 * Requirement 2: POST /api/withdrawals
 */
export async function createWithdrawalNotice(payload) {
  const response = await fetch(`${API_BASE_URL}/withdrawals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

/**
 * Fetches past withdrawal notices with optional query filters.
 */
export async function getWithdrawalNotices({ investorId, productId, startDate, endDate } = {}) {
  const params = new URLSearchParams();
  if (investorId) params.append('investorId', investorId);
  if (productId) params.append('productId', productId);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const url = `${API_BASE_URL}/withdrawals?${params.toString()}`;
  const response = await fetch(url);
  return handleResponse(response);
}

/**
 * Downloads CSV statement file from backend endpoint.
 * Requirement 3: GET /api/withdrawals/export/csv
 */
export async function downloadCsvStatements({ investorId, productId, startDate, endDate } = {}) {
  const params = new URLSearchParams();
  if (investorId) params.append('investorId', investorId);
  if (productId) params.append('productId', productId);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const url = `${API_BASE_URL}/withdrawals/export/csv?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to export CSV statement');
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `withdrawal_statement_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
}
