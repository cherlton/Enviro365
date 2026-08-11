import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardBody } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Alert } from './ui/Alert';
import { useToast } from './ui/Toast';
import { createWithdrawalNotice } from '../services/api';

/**
 * Enviro365 Warm Green Withdrawal Form Component
 * Features: Entrance animation, live simulation calculator (projected balance, cap percentage, age check), toast feedback.
 */
export const WithdrawalForm = ({ investor, selectedProduct, onWithdrawalCreated }) => {
  const [productId, setProductId] = useState('');
  const [amount, setAmount] = useState('');
  const [noticeDate, setNoticeDate] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorResponse, setErrorResponse] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const toast = useToast();

  const allProducts = investor?.portfolios
    ? investor.portfolios.flatMap((p) => p.products || [])
    : [];

  useEffect(() => {
    if (selectedProduct) {
      setProductId(String(selectedProduct.id));
      toast.info('Product Selected', `${selectedProduct.name} loaded into withdrawal form.`);
    } else if (allProducts.length > 0 && !productId) {
      setProductId(String(allProducts[0].id));
    }
  }, [selectedProduct, investor]);

  const activeProduct = allProducts.find((p) => String(p.id) === String(productId));

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(val || 0);
  };

  const setPercentageAmount = (pct) => {
    if (!activeProduct || !activeProduct.balance) return;
    const calculated = (Number(activeProduct.balance) * (pct / 100)).toFixed(2);
    setAmount(calculated);
    toast.info('Quick Cap Applied', `Amount set to ${pct}%: R ${calculated}`);
  };

  const numAmount = Number(amount) || 0;
  const isRetirementViolation =
    activeProduct?.type === 'RETIREMENT' && (!investor || investor.age <= 65);
  const maxCap = activeProduct ? Number(activeProduct.balance) * 0.9 : 0;
  
  const numAmountCents = Math.round(numAmount * 100);
  const maxCapCents = Math.round(maxCap * 100);
  const balanceCents = Math.round((Number(activeProduct?.balance) || 0) * 100);

  const isExceedBalance = activeProduct && numAmountCents > balanceCents;
  const isCapViolation = activeProduct && numAmount > 0 && numAmountCents >= maxCapCents;

  // Simulation calculations
  const currentBalance = activeProduct ? Number(activeProduct.balance) : 0;
  const projectedRemainingBalance = Math.max(0, currentBalance - numAmount);
  const percentageOfBalance = currentBalance > 0 ? Math.min(100, (numAmount / currentBalance) * 100) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorResponse(null);
    setSuccessMessage(null);

    if (!productId || !amount || Number(amount) <= 0) {
      setErrorResponse({
        errorCode: 'INVALID_INPUT',
        message: 'Please select a valid product and enter a positive withdrawal amount.',
      });
      toast.warning('Invalid Input', 'Please select a valid product and enter a positive withdrawal amount.');
      return;
    }

    if (isExceedBalance) {
      const err = {
        errorCode: 'INSUFFICIENT_BALANCE',
        message: `Withdrawal rejected. Requested amount R ${numAmount.toFixed(2)} exceeds current available balance of R ${Number(activeProduct?.balance || 0).toFixed(2)} for product '${activeProduct?.name}'.`,
      };
      setErrorResponse(err);
      toast.error('Withdrawal Rejected', err.message);
      return;
    }

    if (isCapViolation) {
      const err = {
        errorCode: 'CAP_90_PERCENT_EXCEEDED',
        message: `Withdrawal rejected. Requested amount R ${numAmount.toFixed(2)} exceeds maximum allowed 90% cap (R ${maxCap.toFixed(2)}) for product '${activeProduct?.name}'.`,
      };
      setErrorResponse(err);
      toast.error('Withdrawal Rejected', err.message);
      return;
    }

    if (isRetirementViolation) {
      const err = {
        errorCode: 'RETIREMENT_AGE_RESTRICTION',
        message: `Retirement withdrawal rejected. Investor '${investor?.name}' is ${investor?.age} years old. Withdrawals from RETIREMENT products require investor age to be greater than 65.`,
      };
      setErrorResponse(err);
      toast.error('Withdrawal Rejected', err.message);
      return;
    }

    setIsLoading(true);
    toast.info('Processing', 'Submitting withdrawal notice for validation...');

    try {
      const payload = {
        investorId: investor.id,
        productId: Number(productId),
        amount: Number(amount),
        noticeDate: noticeDate || null,
        reason: reason || 'Client withdrawal request',
      };

      const result = await createWithdrawalNotice(payload);
      const msg = `Notice #${result.id} created! R${result.amount} deducted from ${result.productName}.`;
      setSuccessMessage(msg);
      setAmount('');
      setReason('');

      toast.success('Withdrawal Approved ✓', msg);

      if (onWithdrawalCreated) {
        onWithdrawalCreated(result);
      }
    } catch (err) {
      const errorMsg = err.message || 'Withdrawal rejected by backend validation rules.';
      setErrorResponse({
        errorCode: err.errorCode || 'BACKEND_REJECTED',
        message: errorMsg,
      });
      toast.error('Withdrawal Rejected', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const productOptions = allProducts.map((p) => ({
    value: String(p.id),
    label: `${p.name} (${p.type}) - Bal: R ${Number(p.balance).toLocaleString()}`,
  }));

  return (
    <div className="max-w-[700px] mx-auto w-full space-y-6 animate-page-entry">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Create Withdrawal Notice</CardTitle>
            <p className="text-[12px] font-medium text-[#57534E] mt-0.5">
              Submit withdrawal request for {investor?.name || 'Investor'}. Subject to business validation rules.
            </p>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorResponse && (
              <Alert
                type="error"
                title="Withdrawal Validation Rejected"
                errorCode={errorResponse.errorCode}
                message={errorResponse.message}
                onClose={() => setErrorResponse(null)}
              />
            )}

            {successMessage && (
              <Alert
                type="success"
                title="Withdrawal Approved"
                message={successMessage}
                onClose={() => setSuccessMessage(null)}
              />
            )}

            <Select
              id="product-select"
              label="Select Financial Holding / Product"
              required
              options={productOptions}
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Select a product"
            />

            {/* Product Summary Banner */}
            {activeProduct && (
              <div className="bg-[#F5F1EC] p-3.5 rounded-[8px] border border-[#E5E0D8] text-[12px] space-y-1.5">
                <div className="flex justify-between items-center text-[#57534E]">
                  <span>Product Balance:</span>
                  <span className="font-mono font-bold text-[#1A7A6D]">{formatCurrency(activeProduct.balance)}</span>
                </div>
                <div className="flex justify-between items-center text-[#78716C]">
                  <span>Maximum 90% Withdrawal Cap:</span>
                  <span className="font-mono font-semibold text-[#92400E]">{formatCurrency(maxCap)}</span>
                </div>
                <div className="flex justify-between items-center text-[#78716C]">
                  <span>Investor Age / Eligibility:</span>
                  <span className="font-medium text-[#1C1917]">
                    {investor?.age} yrs ({investor?.eligibleForRetirement ? 'Eligible (>65)' : 'Ineligible (<=65)'})
                  </span>
                </div>
              </div>
            )}

            {/* Live Client-Side Rule Warnings */}
            {isRetirementViolation && (
              <Alert
                type="warning"
                title="Retirement Rule Warning"
                message={`Investor '${investor?.name}' is ${investor?.age} years old. Retirement product withdrawals require age > 65.`}
              />
            )}

            {isCapViolation && !isExceedBalance && (
              <Alert
                type="warning"
                title="90% Cap Warning"
                message={`Requested amount R ${numAmount.toFixed(2)} reaches or exceeds the maximum allowed 90% withdrawal cap (R ${maxCap.toFixed(2)}). Withdrawals of 90% or more of total balance are disallowed.`}
              />
            )}

            {isExceedBalance && (
              <Alert
                type="error"
                title="Balance Exceeded Warning"
                message={`Requested amount R ${numAmount} exceeds total available balance R ${activeProduct?.balance}.`}
              />
            )}

            {/* Amount & Quick Percentage Shortcuts */}
            <div className="space-y-2">
              <Input
                id="withdrawal-amount"
                label="Withdrawal Amount (ZAR)"
                type="number"
                step="0.01"
                required
                placeholder="e.g. 25000.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              {activeProduct && (
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[11px] font-medium text-[#78716C]">Quick Cap:</span>
                  {[25, 50, 75, 90].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setPercentageAmount(pct)}
                      className="h-7 px-2.5 rounded-[6px] bg-white border border-[#E5E0D8] hover:bg-[#E8F5F2] hover:border-[#1A7A6D]/30 text-[12px] font-mono text-[#57534E] transition-colors cursor-pointer"
                    >
                      {pct}%{pct === 90 ? ' (Max)' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Live Withdrawal Simulation Widget */}
            {activeProduct && numAmount > 0 && (
              <div className="bg-[#FAF8F4] p-4 rounded-[8px] border border-[#E5E0D8] space-y-2.5">
                <div className="flex items-center justify-between text-[12px] font-semibold text-[#1C1917]">
                  <span>Withdrawal Simulation Impact</span>
                  <span className="text-[11px] text-[#1A7A6D] font-mono">{percentageOfBalance.toFixed(1)}% of product balance</span>
                </div>
                
                <div className="w-full h-2 bg-[#E5E0D8] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isCapViolation ? 'bg-[#DC2626]' : 'bg-[#1A7A6D]'
                    }`}
                    style={{ width: `${Math.min(100, percentageOfBalance)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-[#78716C]">Projected Remaining Balance:</span>
                  <span className="font-mono font-bold text-[#1C1917]">{formatCurrency(projectedRemainingBalance)}</span>
                </div>
              </div>
            )}

            {/* Notice Date & Reason */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input id="notice-date" label="Notice Date" type="date" value={noticeDate} onChange={(e) => setNoticeDate(e.target.value)} />
              <Input id="withdrawal-reason" label="Reason (Optional)" placeholder="e.g. Medical emergency" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading || isExceedBalance || isCapViolation || isRetirementViolation}
              >
                Submit Withdrawal Request
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default WithdrawalForm;
