import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        icon={ChevronLeft}
      >
        Previous
      </Button>

      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        icon={ChevronRight}
        iconPosition="right"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
