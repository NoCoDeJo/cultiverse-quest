import { useState } from 'react';
import { Cult } from '@/types/cult';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useFilteredCults = (cults: Cult[] | undefined, currentUserId: string | undefined) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cultType, setCultType] = useState<'all' | 'dev' | 'agent'>('all');
  const [activeTab, setActiveTab] = useState<'discover' | 'my-cults'>('discover');

  // Fetch cult memberships for the current user
  const { data: memberships } = useQuery({
    queryKey: ['cult-memberships', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const { data } = await supabase
        .from('cult_members')
        .select('cult_id')
        .eq('profile_id', currentUserId);
      return data || [];
    },
    enabled: !!currentUserId,
  });

  // Create a Set of cult IDs where the user is a member
  const memberCultIds = new Set(memberships?.map(m => m.cult_id));

  const filteredCults = cults?.filter(cult => {
    const isFounder = cult.founder_id === currentUserId;
    const isMember = memberCultIds.has(cult.id);

    // Filter by search query
    const matchesSearch = cult.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cult.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by cult type
    const matchesType = cultType === 'all' || cult.cult_type === cultType;

    // Filter by ownership/membership
    const matchesTab = activeTab === 'discover' || 
      (activeTab === 'my-cults' && (isFounder || isMember));

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