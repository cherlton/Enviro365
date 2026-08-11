import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardBody } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import CreatePortfolioModal from './investor/CreatePortfolioModal';
import AddProductModal from './investor/AddProductModal';
import EditProfileModal from './investor/EditProfileModal';

/**
 * Enviro365 Warm Green Portfolio Dashboard Component
 * Features: Page entrance animations, real data insertion buttons (Create Portfolio, Add Product, Edit Profile), 90% cap progress bar.
 */
export const PortfolioDashboard = ({
  investor,
  onSelectProductForWithdrawal,
  globalSearchQuery = '',
  onDataChanged,
}) => {
  const [filterType, setFilterType] = useState('ALL');
  const [isCreatePortfolioOpen, setIsCreatePortfolioOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  if (!investor) return null;

  const allProducts = investor.portfolios
    ? investor.portfolios.flatMap((p) =>
        (p.products || []).map((prod) => ({ ...prod, portfolioName: p.name, portfolioType: p.type }))
      )
    : [];

  const filteredProducts = allProducts.filter((p) => {
    const query = globalSearchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
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

  const handleDataRefresh = () => {
    if (onDataChanged) onDataChanged();
  };

  return (
    <div className="space-y-6 animate-page-entry font-sans">
      {/* Page Title Header & Data Insertion Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#1C1917] tracking-tight flex items-center gap-2">
            Portfolio Overview
            <span className="text-[11px] font-semibold bg-[#E8F5F2] text-[#1A7A6D] px-2 py-0.5 rounded-full border border-[#BDE8DF]">
              Live Feed
            </span>
          </h1>
          <p className="text-[13px] font-medium text-[#57534E]">
            Financial holdings, balance breakdown, and real data insertion for {investor.name}
          </p>
        </div>

        {/* Real Data Insertion Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreatePortfolioOpen(true)}
            className="px-3.5 py-1.5 bg-[#1A7A6D] hover:bg-[#13655A] text-white font-medium text-[12px] rounded-[8px] transition-colors shadow-xs flex items-center space-x-1 cursor-pointer"
          >
            <span>+ Create Portfolio</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddProductOpen(true)}
            className="px-3.5 py-1.5 bg-[#E8F5F2] hover:bg-[#D4ECE6] text-[#13655A] border border-[#1A7A6D]/30 font-medium text-[12px] rounded-[8px] transition-colors shadow-xs flex items-center space-x-1 cursor-pointer"
          >
            <span>+ Add Product</span>
          </button>
          <button
            type="button"
            onClick={() => setIsEditProfileOpen(true)}
            className="px-3.5 py-1.5 bg-[#F5F1EC] hover:bg-[#E8E3DB] text-[#57534E] font-medium text-[12px] rounded-[8px] transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <span>✎ Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Friendly Explanation Banner */}
      <div className="bg-[#E8F5F2] border border-[#1A7A6D]/20 p-4 rounded-[12px] text-[13px] text-[#13655A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1A7A6D] text-white flex items-center justify-center font-bold shrink-0 text-[15px]">
            💡
          </div>
          <div>
            <h4 className="font-bold text-[#1C1917] text-[14px]">How Your Money is Organized</h4>
            <p className="text-[#57534E] text-[12px] mt-0.5 leading-relaxed">
              A <strong>Portfolio</strong> is a savings bucket (like <em>"Retirement Savings"</em> or <em>"Rainy Day Fund"</em>). 
              Inside each portfolio, you have <strong>Products</strong> (individual investment funds). Grouping funds in portfolios helps you organize your money by goals!
            </p>
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Holdings */}
        <Card className="h-[115px] p-4 flex flex-col justify-between hover:shadow-[0_4px_12px_rgba(27,38,35,0.06)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">Total Money Saved</span>
            <span className="w-2 h-2 rounded-full bg-[#1A7A6D]" />
          </div>
          <div>
            <span className="text-[22px] font-bold text-[#1C1917] tracking-tight">{formatCurrency(totalPortfolioBalance)}</span>
            <span className="text-[11px] text-[#78716C] block mt-0.5">{allProducts.length} Active Funds</span>
          </div>
        </Card>

        {/* Max 90% Cash-out Limit */}
        <Card className="h-[115px] p-4 flex flex-col justify-between hover:shadow-[0_4px_12px_rgba(27,38,35,0.06)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">Max Cash-out (90% Limit)</span>
            <span className="text-[10px] font-bold text-[#92400E] bg-[#FEF3C7] px-1.5 py-0.5 rounded border border-[#FDE68A]">
              90% Limit
            </span>
          </div>
          <div>
            <span className="text-[22px] font-bold text-[#1C1917] tracking-tight">{formatCurrency(totalMaxCap)}</span>
            <span className="text-[11px] text-[#78716C] block mt-0.5">Keep 10% active in account</span>
          </div>
        </Card>

        {/* Active Portfolios */}
        <Card className="h-[115px] p-4 flex flex-col justify-between hover:shadow-[0_4px_12px_rgba(27,38,35,0.06)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">Savings Buckets</span>
            <svg className="w-4 h-4 text-[#1A7A6D]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12.75M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
          <div>
            <span className="text-[22px] font-bold text-[#1C1917] tracking-tight">{investor.portfolios?.length || 0}</span>
            <span className="text-[11px] text-[#78716C] block mt-0.5">Portfolios Created</span>
          </div>
        </Card>

        {/* Retirement Status */}
        <Card className="h-[115px] p-4 flex flex-col justify-between hover:shadow-[0_4px_12px_rgba(27,38,35,0.06)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">Retirement Status</span>
            <Badge variant={investor.eligibleForRetirement ? 'APPROVED' : 'neutral'}>
              Age {investor.age}
            </Badge>
          </div>
          <div>
            <span className={`text-[15px] font-bold tracking-tight block ${investor.eligibleForRetirement ? 'text-[#1A7A6D]' : 'text-[#DC2626]'}`}>
              {investor.eligibleForRetirement ? 'Ready (Age 65+)' : 'Locked Until Age 65'}
            </span>
            <span className="text-[11px] text-[#78716C] block mt-0.5">
              {investor.eligibleForRetirement ? 'Can withdraw retirement funds' : 'Savings & Tax-Free available now'}
            </span>
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
              No investment holdings found {globalSearchQuery ? `matching "${globalSearchQuery}"` : ''}. Use "+ Add Product" above to insert product holdings.
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

      {/* Modals for Investor Real Data Insertion */}
      <CreatePortfolioModal
        isOpen={isCreatePortfolioOpen}
        onClose={() => setIsCreatePortfolioOpen(false)}
        investorId={investor.id}
        onSuccess={handleDataRefresh}
      />

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        portfolios={investor.portfolios || []}
        onSuccess={handleDataRefresh}
        onRequestCreatePortfolio={() => setIsCreatePortfolioOpen(true)}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        investor={investor}
        onSuccess={handleDataRefresh}
      />
    </div>
  );
};

export default PortfolioDashboard;
