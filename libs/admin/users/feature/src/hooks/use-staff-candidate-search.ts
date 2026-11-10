import { useSearchStaffCandidatesQuery } from '@admin/users/data-access';
import { minCandidateSearchLength } from '@admin/users/model';
import { useEffect, useState } from 'react';

const searchDelayMs = 300;

/** Debounced server search of existing non-staff accounts for the «З бази» picker. */
export function useStaffCandidateSearch() {
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSearch(text.trim()), searchDelayMs);
    return () => clearTimeout(timer);
  }, [text]);

  const tooShort = search.length < minCandidateSearchLength;
  const query = useSearchStaffCandidatesQuery(search, { skip: tooShort });

  return {
    candidates: tooShort ? [] : (query.currentData ?? []),
    loading: !tooShort && query.isFetching,
    onSearch: setText,
  };
}
