import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { updateInvestorProfile } from '../../services/api';
import { useToast } from '../ui/Toast';

export default function EditProfileModal({ isOpen, onClose, investor, onSuccess }) {
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (investor) {
      setName(investor.name || '');
      setEmail(investor.email || '');
      setPhone(investor.phone || '');
      setAddress(investor.address || '');
      setDateOfBirth(investor.dateOfBirth || '');
    }
  }, [investor]);

  if (!isOpen || !investor) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateInvestorProfile(investor.id, {
        name,
        email,
        phone,
        address,
        dateOfBirth: dateOfBirth || null,
      });

      toast.success('Profile Updated', 'Your investor personal details have been saved.');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Profile Update Failed', err.message);
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
            <h3 className="text-[16px] font-bold text-[#1C1917]">Edit Your Profile</h3>
            <p className="text-[12px] text-[#78716C]">Update your contact details and date of birth</p>
          </div>
          <button onClick={onClose} className="text-[#78716C] hover:text-[#1C1917] font-bold cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-[12px] font-medium text-[#57534E] mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#57534E] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-[#57534E] mb-1">Phone (SA Mobile)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0821234567"
                className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#57534E] mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#57534E] mb-1">Physical Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address details..."
              className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D]"
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
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
