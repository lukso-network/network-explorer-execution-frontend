import type { SearchIndex } from 'algoliasearch';
import algoliasearch from 'algoliasearch';

import { getEnvValue } from '../../configs/app/utils';

interface AlgoliaSearcher {
  profile: SearchIndex;
  asset: SearchIndex;
}

const algoliaEnvs = {
  appId: getEnvValue('NEXT_PUBLIC_ALGOLIA_APP_ID') || '',
  apiKey: getEnvValue('NEXT_PUBLIC_ALGOLIA_API_KEY') || '',
  profileIndex: getEnvValue('NEXT_PUBLIC_ALGOLIA_PROFILE_INDEX_NAME') || '',
  assetIndex: getEnvValue('NEXT_PUBLIC_ALGOLIA_ASSETS_INDEX_NAME') || '',
};

const algoliaClient = algoliasearch(algoliaEnvs.appId, algoliaEnvs.apiKey);

export const algoliaLSPSearch: AlgoliaSearcher = {
  profile: algoliaClient.initIndex(algoliaEnvs.profileIndex),
  asset: algoliaClient.initIndex(algoliaEnvs.assetIndex),
};
