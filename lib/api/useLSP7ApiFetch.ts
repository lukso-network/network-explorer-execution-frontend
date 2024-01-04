import React from 'react';

import type { LSP7Response } from '../../types/api/lsp';
import type { SearchResultToken } from '../../types/api/search';

import type { Params as FetchParams } from 'lib/hooks/useFetch';

import { algoliaLSPSearch } from './algolia';
import { isUniversalProfileEnabled } from './isUniversalProfileEnabled';
import type { ResourceName, ResourcePathParams } from './resources';

export interface Params<R extends ResourceName> {
  pathParams?: ResourcePathParams<R>;
  queryParams?: Record<string, string | Array<string> | number | undefined>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'signal'>;
}

export default function useLSP7ApiFetch() {
  return React.useCallback(async(queryParams: string,
  ) => {
    if (!isUniversalProfileEnabled()) {
      return [] as Array<SearchResultToken>;
    }
    try {
      const { hits } = await algoliaLSPSearch.asset.search(queryParams);

      return hits
        .filter((hit) => {
          const lsp = hit as LSP7Response;
          return lsp.type === 'LSP7DigitalAsset';
        })
        .map<SearchResultToken>((hit) => {
        const lsp = hit as LSP7Response;
        return {
          type: 'token',
          name: lsp.name,
          symbol: lsp.symbol,
          address: lsp.address,
          token_url: lsp.linkUrl,
          address_url: lsp.linkUrl,
          icon_url: '',
          token_type: 'LSP7',
          exchange_rate: null,
          total_supply: null,
          is_verified_via_admin_panel: false,
          is_smart_contract_verified: false,
        };
      });
    } catch (error) {
      return error;
    }
  }, []);
}
