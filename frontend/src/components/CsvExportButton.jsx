import React, { useState } from 'react';
import { Button } from './ui/Button';
import { useToast } from './ui/Toast';
import { downloadCsvStatements } from '../services/api';

/**
 * Enviro365 CSV Export Button with toast feedback
 */
export const CsvExportButton = ({ filterParams = {} }) => {
  const [isExporting, setIsExporting] = useState(false);
  const toast = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    toast.info('Exporting CSV', 'Generating your withdrawal statement CSV file...');
    try {
      await downloadCsvStatements(filterParams);
      toast.success('CSV Downloaded ✓', 'Withdrawal statement CSV has been downloaded successfully.');
    } catch (err) {
      toast.error('Export Failed', 'Failed to export CSV statement: ' + (err.message || 'Server error'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button variant="secondary" size="sm" onClick={handleExport} isLoading={isExporting}>
      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      Export CSV
    </Button>
  );
};

export default CsvExportButton;
