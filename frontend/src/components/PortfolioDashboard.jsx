import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardBody } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

/**
 * Enviro365 Warm Green Portfolio Dashboard Component
 * Features: Page entrance animations, product search filter connected to global top search bar, 90% cap progress bar.
 */
export const PortfolioDashboard = ({ investor, onSelectProductForWithdrawal, globalSearchQuery = '' }) => {
  const [filterType, setFilterType] = useState('ALL');

  if (!investor) return null;

  const allProducts = investor.portfolios
    ? investor.portfolios.flatMap((p) =>
        (p.products || []).map((prod) => ({ ...prod, portfolioName: p.name, portfolioType: p.type }))
      )
    : [];

  const filteredProducts = allProducts.filter((p) => {
    const query = globalSearchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
                          p.name.toLowerCase().includes(query) ||
                          p.type.toLowerCase().includes(query) ||
                          p.portfolioName.toLowerCase().includes(query);
    const matchesType = filterType === 'ALL' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalPortfolioBalance = allProducts.reduce(
    (sum, prod) => sum + (Number(prod.balance) || 0),
    0
  );

  const totalMaxCap = allProducts.reduce(
    (sum, prod) => sum + ((Number(prod.balance) || 0) * 0.9),
    0
  );

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(val || 0);
  };

  return (
    <div className="space-y-6 animate-page-entry">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#1C1917] tracking-tight flex items-center gap-2">
            Portfolio Overview
            <span className="text-[11px] font-semibold bg-[#E8F5F2] text-[#1A7A6D] px-2 py-0.5 rounded-full border border-[#BDE8DF]">
              Live Feed
            </span>
          </h1>
          <p className="text-[13px] font-medium text-[#57534E]">
            Financial holdings, balance breakdown, and withdrawal limits for {investor.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={investor.eligibleForRetirement ? 'APPROVED' : 'neutral'}>
            Age {investor.age} Years • {investor.eligibleForRetirement ? 'Eligible for Retirement (>65)' : 'Age <= 65'}
          </Badge>
        </div>
      </div>

      {/* 4 Stat Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Holdings */}
        <Card className="h-[115px] p-4 flex flex-col justify-between hover:shadow-[0_4px_12px_rgba(27,38,35,0.06)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">Total Holdings</span>
            <span className="w-2 h-2 rounded-full bg-[#1A7A6D]" />
          </div>
          <div>
            <span className="text-[22px] font-bold text-[#1C1917] tracking-tight">{formatCurrency(totalPortfolioBalance)}</span>
            <span className="text-[11px] text-[#78716C] block mt-0.5">{allProducts.length} Active Products</span>
          </div>
        </Card>

        {/* Max 90% Cap */}
        <Card className="h-[115px] p-4 flex flex-col justify-between hover:shadow-[0_4px_12px_rgba(27,38,35,0.06)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">Max 90% Cap</span>
            <span className="text-[10px] font-bold text-[#92400E] bg-[#FEF3C7] px-1.5 py-0.5 rounded border border-[#FDE68A]">
              90% Max
            </span>
          </div>
          <div>
            <span className="text-[22px] font-bold text-[#1C1917] tracking-tight">{formatCurrency(totalMaxCap)}</span>
            <span className="text-[11px] text-[#78716C] block mt-0.5">Maximum allowed withdrawal</span>
          </div>
        </Card>

        {/* Active Portfolios */}
        <Card className="h-[115px] p-4 flex flex-col justify-between hover:shadow-[0_4px_12px_rgba(27,38,35,0.06)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">Portfolios</span>
            <svg className="w-4 h-4 text-[#1A7A6D]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12.75M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
          <div>
            <span className="text-[22px] font-bold text-[#1C1917] tracking-tight">{investor.portfolios?.length || 0}</span>
            <span className="text-[11px] text-[#78716C] block mt-0.5">Portfolios Registered</span>
          </div>
        </Card>

        {/* Retirement Health */}
        <Card className="h-[115px] p-4 flex flex-col justify-between hover:shadow-[0_4px_12px_rgba(27,38,35,0.06)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">Retirement Status</span>
            <svg className="w-4 h-4 text-[#78716C]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className={`text-[16px] font-bold tracking-tight ${investor.eligibleForRetirement ? 'text-[#1A7A6D]' : 'text-[#DC2626]'}`}>
              {investor.eligibleForRetirement ? 'Eligible (>65)' : 'Ineligible (<=65)'}
            </span>
            <span className="text-[11px] text-[#78716C] block mt-0.5">DOB: {investor.dateOfBirth}</span>
          </div>
        </Card>
      </div>

      {/* Holdings & Products Table Card with Search Bar */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Financial Holdings & Product Balances</CardTitle>
            <p className="text-[12px] font-medium text-[#57534E] mt-0.5">
              Available products across {investor.portfolios?.length || 0} portfolio(s)
            </p>
          </div>

          {/* Type Filter Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#78716C]">Category:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-8 bg-[#FAF8F4] border border-[#E5E0D8] rounded-[6px] text-[12px] text-[#1C1917] px-2.5 font-medium focus:outline-none focus:border-[#1A7A6D] cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="RETIREMENT">Retirement</option>
              <option value="SAVINGS">Savings</option>
              <option value="TAX_FREE">Tax-Free</option>
            </select>
          </div>
        </CardHeader>

        <CardBody className="p-0 overflow-x-auto">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-[#78716C] text-[13px]">
              No investment holdings found {globalSearchQuery ? `matching "${globalSearchQuery}"` : ''}.
            </div>
          ) : (
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#F5F1EC] text-[11px] font-medium text-[#78716C] uppercase tracking-wider border-b border-[#E5E0D8]">
                <tr>
                  <th className="px-5 py-3">Product Name</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Portfolio</th>
                  <th className="px-5 py-3">Current Price</th>
                  <th className="px-5 py-3">Available Balance</th>
                  <th className="px-5 py-3">Max 90% Withdrawal</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8] text-[#1C1917]">
                {filteredProducts.map((prod) => {
                  const maxCapVal = prod.maxWithdrawalAllowed || prod.balance * 0.9;
                  return (
                    <tr key={prod.id} className="h-[56px] hover:bg-[#F9F7F4] transition-colors group">
                      <td className="px-5 py-3">
                        <span className="font-semibold text-[#1C1917] block">{prod.name}</span>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={prod.type}>{prod.type}</Badge>
                      </td>
                      <td className="px-5 py-3 text-[#78716C] text-[12px]">{prod.portfolioName}</td>
                      <td className="px-5 py-3 font-mono text-[12px] text-[#57534E]">{formatCurrency(prod.currentPrice)}</td>
                      <td className="px-5 py-3 font-mono font-bold text-[#1A7A6D]">
                        {formatCurrency(prod.balance)}
                      </td>
                      <td className="px-5 py-3 font-mono text-[#57534E] text-[12px]">
                        <div>{formatCurrency(maxCapVal)}</div>
                        <div className="w-24 h-1.5 bg-[#E5E0D8] rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-[#1A7A6D] rounded-full w-[90%]" />
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button size="sm" variant="primary" onClick={() => onSelectProductForWithdrawal(prod)}>
                          Withdraw
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default PortfolioDashboard;
