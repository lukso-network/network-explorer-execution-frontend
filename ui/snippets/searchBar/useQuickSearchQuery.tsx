import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { SearchResultItem } from '../../../types/api/search';

import { isBech32Address, fromBech32Address } from 'lib/address/bech32';
import useApiQuery from 'lib/api/useApiQuery';
import useDebounce from 'lib/hooks/useDebounce';

import useUniversalProfileQuery from '../../../lib/api/useUniversalProfileQuery';

export default function useQuickSearchQuery() {
  const [ searchTerm, setSearchTerm ] = React.useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const quickSearchQuery = useApiQuery('quick_search', {
    queryParams: { q: isBech32Address(debouncedSearchTerm) ? fromBech32Address(debouncedSearchTerm) : debouncedSearchTerm },
    queryOptions: { enabled: debouncedSearchTerm.trim().length > 0 },
  });

  const redirectCheckQuery = useApiQuery('search_check_redirect', {
    // on pages with regular search bar we check redirect on every search term change
    // in order to prepend its result to suggest list since this resource is much faster than regular search
    queryParams: { q: debouncedSearchTerm },
    queryOptions: { enabled: Boolean(debouncedSearchTerm) },
  });

  const upQuery = useUniversalProfileQuery('universal_profile', {
    queryParams: { q: debouncedSearchTerm },
    queryOptions: { enabled: debouncedSearchTerm.trim().length > 0 },
  });

  const query = useQuery({
    queryKey: [ 'merged_query', quickSearchQuery, upQuery ],
    queryFn: () => {
      const q1 = quickSearchQuery.data as Array<SearchResultItem>;
      const q2 = upQuery.data as Array<SearchResultItem>;

      return [ ...q1, ...q2 ];
    },
  });

  return React.useMemo(() => ({
    searchTerm,
    debouncedSearchTerm,
    handleSearchTermChange: setSearchTerm,
    query,
    redirectCheckQuery,
  }), [ debouncedSearchTerm, query, redirectCheckQuery, searchTerm ]);
}
