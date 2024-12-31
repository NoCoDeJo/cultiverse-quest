import { useState } from 'react';
import { Cult } from '@/types/cult';

export const useFilteredCults = (cults: Cult[] | undefined, currentUserId: string | undefined) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cultType, setCultType] = useState<'all' | 'dev' | 'agent'>('all');
  const [activeTab, setActiveTab] = useState<'discover' | 'my-cults'>('discover');

  const filteredCults = cults?.filter(cult => {
    // Filter by search query
    const matchesSearch = cult.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cult.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by cult type
    const matchesType = cultType === 'all' || cult.cult_type === cultType;

    // Filter by ownership
    const matchesTab = activeTab === 'discover' || 
      (activeTab === 'my-cults' && cult.founder_id === currentUserId);

    return matchesSearch && matchesType && matchesTab;
  });

  return {
    searchQuery,
    setSearchQuery,
    cultType,
    setCultType,
    activeTab,
    setActiveTab,
    filteredCults
  };
};