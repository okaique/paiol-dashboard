
import { useState, useMemo } from 'react';

export interface FilterOptions {
  searchTerm: string;
  dateFrom: string;
  dateTo: string;
  status: string;
  categoria: string;
}

export const useListFilters = (initialFilters: Partial<FilterOptions> = {}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    status: '',
    categoria: '',
    ...initialFilters,
  });

  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      dateFrom: '',
      dateTo: '',
      status: '',
      categoria: '',
    });
  };

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== '');
  }, [filters]);

  const setQuickDateFilter = (days: number) => {
    const today = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(today.getDate() - days);
    
    setFilters(prev => ({
      ...prev,
      dateFrom: dateFrom.toISOString().split('T')[0],
      dateTo: today.toISOString().split('T')[0],
    }));
  };

  return {
    filters,
    showFilters,
    setShowFilters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    setQuickDateFilter,
  };
};
