import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { createPortfolio } from '../../services/api';
import { useToast } from '../ui/Toast';

export default function CreatePortfolioModal({ isOpen, onClose, investorId, onSuccess }) {
  const toast = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('SAVINGS'); // RETIREMENT | SAVINGS | TAX_FREE
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await createPortfolio({
        investorId,
        name: name.trim(),
        description: description.trim(),
        type,
      });
      toast.success('Portfolio Created', `Successfully created new ${type.replace('_', ' ')} portfolio.`);
      onSuccess();
      onClose();
      setName('');
      setDescription('');
    } catch (err) {
      toast.error('Failed to Create Portfolio', err.message);
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
            <h3 className="text-[16px] font-bold text-[#1C1917]">Create a New Savings Bucket</h3>
            <p className="text-[12px] text-[#78716C]">Group your investments by financial goal</p>
          </div>
          <button onClick={onClose} className="text-[#78716C] hover:text-[#1C1917] font-bold cursor-pointer">✕</button>
        </div>

        {/* Simple Explanation Box */}
        <div className="mt-3 bg-[#E8F5F2] border border-[#1A7A6D]/20 p-3 rounded-[10px] text-[12px] text-[#13655A] space-y-1">
          <p className="font-bold">💡 What is a Portfolio?</p>
          <p>
            Think of a Portfolio as a folder or savings bucket (like <em>"Rainy Day Fund"</em> or <em>"Retirement Savings"</em>). 
            Creating a portfolio lets you group different investment products together so you can easily track your money!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-[12px] font-medium text-[#57534E] mb-1">Name Your Portfolio</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Retirement Bucket or Rainy Day Savings"
              className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] bg-white focus:outline-none focus:border-[#1A7A6D]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#57534E] mb-1">Portfolio Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D] bg-white cursor-pointer"
            >
              <option value="SAVINGS">Savings Account (Withdraw anytime)</option>
              <option value="RETIREMENT">Retirement Annuity (Locked until age 65)</option>
              <option value="TAX_FREE">Tax-Free Savings (Tax-free growth)</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#57534E] mb-1">Short Description (Optional)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you saving for? e.g. Savings goal for buying a home..."
              className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] bg-white focus:outline-none focus:border-[#1A7A6D]"
            />
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
              {isSubmitting ? 'Creating...' : 'Create Portfolio'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
