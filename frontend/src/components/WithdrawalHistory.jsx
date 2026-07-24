import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardBody } from './ui/Card';
import { Badge } from './ui/Badge';
import { Input } from './ui/Input';
import { CsvExportButton } from './CsvExportButton';
import { useToast } from './ui/Toast';
import { getWithdrawalNotices } from '../services/api';

/**
 * Enviro365 Warm Green Withdrawal History Component
 * Features: Page entrance animations, date range filter bar, dynamic search query filter, right-aligned CSV action.
 */
export const WithdrawalHistory = ({ currentInvestorId, refreshTrigger, globalSearchQuery = '' }) => {
  const [notices, setNotices] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const data = await getWithdrawalNotices({
        investorId: currentInvestorId,
        startDate: startDate || null,
        endDate: endDate || null,
      });
      setNotices(data || []);
    } catch (err) {
      console.error('Failed to load withdrawal history:', err);
      toast.error('History Load Failed', 'Could not fetch withdrawal notices from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [currentInvestorId, startDate, endDate, refreshTrigger]);

  const filteredNotices = notices.filter((n) => {
    if (!globalSearchQuery) return true;
    const query = globalSearchQuery.toLowerCase().trim();
    return (
      String(n.id).includes(query) ||
      (n.noticeDate && n.noticeDate.toLowerCase().includes(query)) ||
      (n.investorName && n.investorName.toLowerCase().includes(query)) ||
      (n.productName && n.productName.toLowerCase().includes(query)) ||
      (n.productType && n.productType.toLowerCase().includes(query)) ||
      (n.status && n.status.toLowerCase().includes(query)) ||
      (n.reason && n.reason.toLowerCase().includes(query))
    );
  });

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    toast.info('Filters Reset', 'Date range filters cleared.');
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(val || 0);
  };

  const filterParams = {
    investorId: currentInvestorId,
    startDate: startDate || null,
    endDate: endDate || null,
  };

  return (
    <Card className="w-full animate-page-entry">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Withdrawal History & Notices</CardTitle>
          <p className="text-[12px] font-medium text-[#57534E] mt-0.5">
            Historical audit log of submitted withdrawal notices
          </p>
        </div>

        {/* CSV Export Action Button */}
        <CsvExportButton filterParams={filterParams} />
      </CardHeader>

      {/* Date Filter Bar */}
      <div className="px-5 py-3 bg-[#F5F1EC] border-b border-[#E5E0D8] flex flex-wrap items-center gap-3 text-[12px]">
        <span className="font-semibold text-[#57534E]">Filter Range:</span>
        <div className="w-40">
          <Input
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              if (e.target.value) toast.info('Filter Updated', `Start Date set to ${e.target.value}`);
            }}
          />
        </div>
        <div className="w-40">
          <Input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              if (e.target.value) toast.info('Filter Updated', `End Date set to ${e.target.value}`);
            }}
          />
        </div>
        {(startDate || endDate) && (
          <button
            onClick={handleClearFilters}
            className="text-[12px] text-[#1A7A6D] underline font-medium hover:opacity-80 cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      <CardBody className="p-0 overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-[#78716C] text-[13px]">
            <span className="inline-block w-4 h-4 border-2 border-[#1A7A6D] border-t-transparent rounded-full animate-spin mr-2" />
            Loading withdrawal history...
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="p-8 text-center text-[#78716C] text-[13px]">
            No past withdrawal notices found {globalSearchQuery ? `matching "${globalSearchQuery}"` : 'for selected criteria'}.
          </div>
        ) : (
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#F5F1EC] text-[11px] font-medium text-[#78716C] uppercase tracking-wider border-b border-[#E5E0D8]">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Notice Date</th>
                <th className="px-5 py-3">Investor</th>
                <th className="px-5 py-3">Product & Type</th>
                <th className="px-5 py-3">Withdrawal Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8] text-[#1C1917]">
              {filteredNotices.map((notice) => (
                <tr key={notice.id} className="h-[52px] hover:bg-[#F9F7F4] transition-colors">
                  <td className="px-5 py-3 font-mono text-[12px] text-[#78716C]">#{notice.id}</td>
                  <td className="px-5 py-3 text-[12px] font-mono text-[#57534E]">{notice.noticeDate}</td>
                  <td className="px-5 py-3 font-semibold text-[#1C1917]">{notice.investorName}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span>{notice.productName}</span>
                      <Badge variant={notice.productType}>{notice.productType}</Badge>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono font-bold text-[#1A7A6D]">
                    {formatCurrency(notice.amount)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={notice.status}>{notice.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-[#78716C]">
                    {notice.reason || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardBody>
    </Card>
  );
};

export default WithdrawalHistory;
