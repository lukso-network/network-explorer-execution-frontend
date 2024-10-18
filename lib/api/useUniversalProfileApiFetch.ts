import React from 'react';

import type { SearchResultAddressOrContractOrUniversalProfile } from '../../types/api/search';

import getCheckedSummedAddress from 'lib/address/getCheckedSummedAddress';
import type { Params as FetchParams } from 'lib/hooks/useFetch';

import { graphClient } from './graphClient';
import type { SearchProfileQueryResponse } from './graphTypes';
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
      const result = await graphClient.searchProfiles(queryParams);
      if (result == null) {
        return [] as Array<SearchResultAddressOrContractOrUniversalProfile>;
      }

      const hits = result.data.search_profiles as Array<SearchProfileQueryResponse>;

      return hits.map<SearchResultAddressOrContractOrUniversalProfile>((hit: SearchProfileQueryResponse) => {
        const hitAsUp = hit as unknown as SearchProfileQueryResponse;
        return {
          type: 'universal_profile',
          name: hitAsUp.name !== '' ? hitAsUp.name.trim() : null,
          address: getCheckedSummedAddress(hit.id),
          is_smart_contract_verified: false,
        };
      });
    } catch (error) {
      return error;
    }
  }, []);
}
