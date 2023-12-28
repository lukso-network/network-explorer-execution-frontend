import React from 'react';

import type { LSP3Response } from '../../types/api/lsp';
import type { SearchResultAddressOrContractOrUniversalProfile } from '../../types/api/search';

import type { Params as FetchParams } from 'lib/hooks/useFetch';

import { algoliaLSPSearch } from './algolia';
import { isUniversalProfileEnabled } from './isUniversalProfileEnabled';
import type { ResourceName, ResourcePathParams } from './resources';

export interface Params<R extends ResourceName> {
  pathParams?: ResourcePathParams<R>;
  queryParams?: Record<string, string | Array<string> | number | undefined>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'signal'>;
}

export default function useUniversalProfileApiFetch() {
  return React.useCallback(async(queryParams: string,
  ) => {
    if (!isUniversalProfileEnabled()) {
      return [] as Array<SearchResultAddressOrContractOrUniversalProfile>;
    }
    try {
      const { hits } = await algoliaLSPSearch.profile.search(queryParams);
      return hits.map<SearchResultAddressOrContractOrUniversalProfile>((hit) => {
        const hitAsUp = hit as unknown as LSP3Response;
        return {
          type: 'universal_profile',
          name: hitAsUp.hasProfileName ? hitAsUp.LSP3Profile.name : null,
          address: hit.objectID,
          is_smart_contract_verified: false,
        };
      });
    } catch (error) {
      return error;
    }
  }, []);
}
