import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { addProductToPortfolio } from '../../services/api';
import { useToast } from '../ui/Toast';

export default function AddProductModal({ isOpen, onClose, portfolios = [], onSuccess, onRequestCreatePortfolio }) {
  const toast = useToast();
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(portfolios[0]?.id || '');
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('SAVINGS');
  const [currentBalance, setCurrentBalance] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync selected portfolio when modal opens or portfolios change
  React.useEffect(() => {
    if (portfolios.length > 0) {
      if (!selectedPortfolioId || !portfolios.some(p => String(p.id) === String(selectedPortfolioId))) {
        setSelectedPortfolioId(portfolios[0].id);
      }
    }
  }, [portfolios]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPortfolioId || !productName.trim() || !currentBalance || !unitPrice) {
      toast.error('Validation Error', 'Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addProductToPortfolio(selectedPortfolioId, {
        name: productName.trim(),
        type: productType,
        currentBalance: parseFloat(currentBalance),
        unitPrice: parseFloat(unitPrice),
      });

      toast.success('Product Added', `Added ${productName} with initial balance of R ${parseFloat(currentBalance).toLocaleString()}`);
      onSuccess();
      onClose();
      setProductName('');
      setCurrentBalance('');
      setUnitPrice('');
    } catch (err) {
      toast.error('Failed to Add Product', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-[#FFFDF9] border border-[#E8E3DB] rounded-[16px] shadow-2xl max-w-md w-full p-6 sm:p-7 z-10 font-sans my-auto animate-modal-pop max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E3DB]">
          <div>
            <h3 className="text-[16px] font-bold text-[#1C1917]">Add Money Fund / Product</h3>
            <p className="text-[12px] text-[#78716C]">Step 2: Add an investment fund inside a Portfolio bucket</p>
          </div>
          <button onClick={onClose} className="text-[#78716C] hover:text-[#1C1917] font-bold cursor-pointer">✕</button>
        </div>

        {/* Workflow & Explanation Box */}
        <div className="mt-3 bg-[#E8F5F2] border border-[#1A7A6D]/20 p-3 rounded-[10px] text-[12px] text-[#13655A] space-y-1">
          <p className="font-bold">💡 Step 2 of 2: Adding a Product</p>
          <p>
            Products (like <em>"Growth Savings"</em> or <em>"Retirement Preserver"</em>) are individual money funds that sit inside a <strong>Portfolio bucket</strong>.
          </p>
        </div>

        {portfolios.length === 0 ? (
          <div className="mt-4 bg-[#FEF3C7] border border-[#F59E0B]/30 p-4 rounded-[10px] text-center space-y-3">
            <p className="text-[13px] font-bold text-[#92400E]">⚠️ You need a Portfolio bucket first!</p>
            <p className="text-[12px] text-[#78716C]">
              You don't have any portfolio buckets created yet. Products must belong to a portfolio bucket.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onRequestCreatePortfolio) onRequestCreatePortfolio();
              }}
              className="w-full py-2 bg-[#1A7A6D] hover:bg-[#13655A] text-white font-bold text-[13px] rounded-[8px] transition-colors cursor-pointer"
            >
              + Create Portfolio First
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-[12px] font-medium text-[#57534E] mb-1">Select Target Portfolio Bucket</label>
              <select
                value={selectedPortfolioId}
                onChange={(e) => setSelectedPortfolioId(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D] bg-white cursor-pointer"
              >
                {portfolios.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#57534E] mb-1">Product Name</label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Coronation Wealth Builder or Growth Savings"
                className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] bg-white focus:outline-none focus:border-[#1A7A6D]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#57534E] mb-1">Product Category</label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D] bg-white cursor-pointer"
              >
                <option value="SAVINGS">Savings (Flexible cash-outs)</option>
                <option value="RETIREMENT">Retirement (Locked until age 65)</option>
                <option value="TAX_FREE">Tax-Free (Tax-free growth)</option>
                <option value="EQUITY">Equity / Stock Fund</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-[#57534E] mb-1">Starting Balance (R)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(e.target.value)}
                  placeholder="50000.00"
                  className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] bg-white focus:outline-none focus:border-[#1A7A6D]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#57534E] mb-1">Unit Share Price (R)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="150.00"
                  className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] bg-white focus:outline-none focus:border-[#1A7A6D]"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 bg-[#F5F1EC] text-[#57534E] font-medium text-[13px] rounded-[8px] hover:bg-[#E8E3DB] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2 bg-[#1A7A6D] hover:bg-[#13655A] text-white font-medium text-[13px] rounded-[8px] shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
