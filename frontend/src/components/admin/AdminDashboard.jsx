import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getAdminMetrics, getWithdrawalNotices, getAllInvestors, updateNoticeStatus, createSystemProduct } from '../../services/api';
import { useToast } from '../ui/Toast';

export default function AdminDashboard() {
  const toast = useToast();
  const [metrics, setMetrics] = useState(null);
  const [notices, setNotices] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [activeTab, setActiveTab] = useState('notices'); // 'notices' | 'investors' | 'products'
  const [isLoading, setIsLoading] = useState(true);

  // New Product Modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodType, setProdType] = useState('RETIREMENT');
  const [prodPrice, setProdPrice] = useState('');
  const [prodBalance, setProdBalance] = useState('');

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [m, n, inv] = await Promise.all([
        getAdminMetrics(),
        getWithdrawalNotices(),
        getAllInvestors(),
      ]);
      setMetrics(m);
      setNotices(n || []);
      setInvestors(inv || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
      toast.error('Admin Load Failed', 'Failed to fetch admin metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUpdateStatus = async (noticeId, newStatus) => {
    try {
      await updateNoticeStatus(noticeId, newStatus);
      toast.success('Notice Updated', `Withdrawal notice #${noticeId} marked as ${newStatus}`);
      loadAdminData();
    } catch (err) {
      toast.error('Update Failed', err.message);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice) return;
    try {
      await createSystemProduct({
        name: prodName.trim(),
        type: prodType,
        currentPrice: parseFloat(prodPrice),
        balance: prodBalance ? parseFloat(prodBalance) : 0.0,
      });
      toast.success('Product Added', `Created new system product ${prodName}`);
      setIsAddProductOpen(false);
      setProdName('');
      setProdPrice('');
      setProdBalance('');
      loadAdminData();
    } catch (err) {
      toast.error('Product Creation Failed', err.message);
    }
  };

  const formatZAR = (val) =>
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(val || 0);

  if (isLoading) {
    return (
      <div className="p-16 text-center text-[#78716C]">
        <span className="inline-block w-6 h-6 border-2 border-[#1A7A6D] border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-[13px]">Loading Admin Operations Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-page-entry font-sans">
      {/* Overview Analytics Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total AUM */}
        <div className="bg-white border border-[#E8E3DB] p-5 rounded-[14px] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-[12px] bg-[#E8F5F2] text-[#1A7A6D] flex items-center justify-center font-bold text-[20px]">
            R
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#78716C] uppercase tracking-wider">Total System AUM</p>
            <h3 className="text-[20px] font-extrabold text-[#1C1917] mt-0.5">
              {formatZAR(metrics?.totalAssetsUnderManagement)}
            </h3>
          </div>
        </div>

        {/* Total Investors */}
        <div className="bg-white border border-[#E8E3DB] p-5 rounded-[14px] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-[12px] bg-[#F5F1EC] text-[#57534E] flex items-center justify-center font-bold text-[18px]">
            👥
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#78716C] uppercase tracking-wider">Active Investors</p>
            <h3 className="text-[20px] font-extrabold text-[#1C1917] mt-0.5">
              {metrics?.totalInvestors || 0}
            </h3>
          </div>
        </div>

        {/* Pending Notices */}
        <div className="bg-white border border-[#E8E3DB] p-5 rounded-[14px] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-[12px] bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold text-[18px]">
            ⏳
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#78716C] uppercase tracking-wider">Pending Notices</p>
            <h3 className="text-[20px] font-extrabold text-[#1C1917] mt-0.5">
              {metrics?.pendingWithdrawalNotices || 0}
            </h3>
          </div>
        </div>

        {/* Total System Products */}
        <div className="bg-white border border-[#E8E3DB] p-5 rounded-[14px] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-[12px] bg-[#E8F5F2] text-[#13655A] flex items-center justify-center font-bold text-[18px]">
            📈
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#78716C] uppercase tracking-wider">Financial Products</p>
            <h3 className="text-[20px] font-extrabold text-[#1C1917] mt-0.5">
              {metrics?.totalProducts || 0}
            </h3>
          </div>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="bg-white border border-[#E8E3DB] rounded-[14px] p-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E8E3DB] pb-3 mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('notices')}
              className={`px-4 py-2 text-[13px] font-semibold rounded-[8px] transition-colors ${
                activeTab === 'notices'
                  ? 'bg-[#1A7A6D] text-white shadow-xs'
                  : 'bg-[#F5F1EC] text-[#57534E] hover:bg-[#E8E3DB]'
              }`}
            >
              Withdrawal Approvals ({notices.length})
            </button>
            <button
              onClick={() => setActiveTab('investors')}
              className={`px-4 py-2 text-[13px] font-semibold rounded-[8px] transition-colors ${
                activeTab === 'investors'
                  ? 'bg-[#1A7A6D] text-white shadow-xs'
                  : 'bg-[#F5F1EC] text-[#57534E] hover:bg-[#E8E3DB]'
              }`}
            >
              Investors Directory ({investors.length})
            </button>
          </div>

          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-3.5 py-2 bg-[#1C1917] hover:bg-black text-white font-medium text-[12px] rounded-[8px] transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <span>+ Add System Product</span>
          </button>
        </div>

        {/* Tab 1: Withdrawal Approvals Table */}
        {activeTab === 'notices' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr className="border-b border-[#E8E3DB] text-[#78716C] text-[11px] uppercase tracking-wider font-semibold bg-[#F9F7F4]">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Investor</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3DB]">
                {notices.map((notice) => (
                  <tr key={notice.id} className="hover:bg-[#F0FAF7]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#78716C]">#{notice.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#1C1917]">{notice.investorName}</div>
                      <div className="text-[11px] text-[#78716C]">{notice.investorEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#1C1917]">{notice.productName}</div>
                      <div className="text-[11px] text-[#78716C]">{notice.productType}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-[#1C1917]">
                      {formatZAR(notice.amount)}
                    </td>
                    <td className="py-3 px-4 text-[#57534E]">{notice.noticeDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${
                          notice.status === 'APPROVED'
                            ? 'bg-[#E8F5F2] text-[#13655A] border border-[#1A7A6D]/20'
                            : notice.status === 'REJECTED'
                            ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FCA5A5]/30'
                            : 'bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D]/40'
                        }`}
                      >
                        {notice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => handleUpdateStatus(notice.id, 'APPROVED')}
                          disabled={notice.status === 'APPROVED'}
                          className="px-2.5 py-1 bg-[#1A7A6D] hover:bg-[#13655A] disabled:opacity-30 text-white font-medium text-[11px] rounded-[6px] transition-colors shadow-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(notice.id, 'REJECTED')}
                          disabled={notice.status === 'REJECTED'}
                          className="px-2.5 py-1 bg-[#991B1B] hover:bg-[#7F1D1D] disabled:opacity-30 text-white font-medium text-[11px] rounded-[6px] transition-colors shadow-xs"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Investors Directory Table */}
        {activeTab === 'investors' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr className="border-b border-[#E8E3DB] text-[#78716C] text-[11px] uppercase tracking-wider font-semibold bg-[#F9F7F4]">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Investor Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4 text-center">Age</th>
                  <th className="py-3 px-4 text-center">Retirement Status</th>
                  <th className="py-3 px-4 text-right">Total Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3DB]">
                {investors.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F0FAF7]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#78716C]">#{inv.id}</td>
                    <td className="py-3 px-4 font-semibold text-[#1C1917]">{inv.name}</td>
                    <td className="py-3 px-4 text-[#57534E]">{inv.email}</td>
                    <td className="py-3 px-4 text-[#57534E]">{inv.phone || 'N/A'}</td>
                    <td className="py-3 px-4 text-center font-medium text-[#1C1917]">{inv.age} yrs</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                          inv.eligibleForRetirement
                            ? 'bg-[#E8F5F2] text-[#13655A]'
                            : 'bg-[#F5F1EC] text-[#78716C]'
                        }`}
                      >
                        {inv.eligibleForRetirement ? 'Eligible (>65)' : 'Under Age 65'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-[#1A7A6D]">
                      {formatZAR(inv.totalInvestmentValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add System Product Modal */}
      {isAddProductOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity" onClick={() => setIsAddProductOpen(false)} />
          <div className="relative bg-[#FFFDF9] border border-[#E8E3DB] rounded-[16px] shadow-2xl max-w-md w-full p-6 sm:p-7 z-10 font-sans my-auto animate-modal-pop max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3DB]">
              <div>
                <h3 className="text-[16px] font-bold text-[#1C1917]">Create Financial Product</h3>
                <p className="text-[12px] text-[#78716C]">Add new fund or ETF to system catalog</p>
              </div>
              <button onClick={() => setIsAddProductOpen(false)} className="text-[#78716C] hover:text-[#1C1917] font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 mt-4">
              <div>
                <label className="block text-[12px] font-medium text-[#57534E] mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Coronation Global Capital Plus"
                  className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#57534E] mb-1">Product Type</label>
                <select
                  value={prodType}
                  onChange={(e) => setProdType(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D] bg-white cursor-pointer"
                >
                  <option value="RETIREMENT">RETIREMENT</option>
                  <option value="SAVINGS">SAVINGS</option>
                  <option value="TAX_FREE">TAX_FREE</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#57534E] mb-1">Unit Price (ZAR)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="250.00"
                    className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#57534E] mb-1">Initial Pool (ZAR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prodBalance}
                    onChange={(e) => setProdBalance(e.target.value)}
                    placeholder="100000.00"
                    className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D]"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="flex-1 py-2 bg-[#F5F1EC] text-[#57534E] font-medium text-[13px] rounded-[8px] hover:bg-[#E8E3DB] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1A7A6D] hover:bg-[#13655A] text-white font-medium text-[13px] rounded-[8px] shadow-sm cursor-pointer"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
