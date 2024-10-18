import type { GraphResponse } from 'types/api/universalProfile';

import { getEnvValue } from 'configs/app/utils';

import { constructQuery } from './graphQueries';
import type { QueryOperation, SearchProfileQueryResponse } from './graphTypes';

const graphUrl = getEnvValue('NEXT_PUBLIC_GRAPH_URL') || '';

type FetchFunc<T> = (queryParams?: string) => Promise<GraphResponse<T> | null>;

type GraphClient = {
  searchProfiles: FetchFunc<SearchProfileQueryResponse>;
  getProfiles: FetchFunc<SearchProfileQueryResponse>;
};

const queryParamsToGraphQuery = (operationName: QueryOperation, queryParams?: string): string => {
  const query = constructQuery(operationName, queryParams);

  return JSON.stringify({
    operationName: operationName,
    query: query,
  });
};

const fetchQuery = <T>(operationName: QueryOperation): FetchFunc<T> => {
  return async(queryParams?: string): Promise<GraphResponse<T> | null> => {
    const query = queryParamsToGraphQuery(operationName, queryParams);

    try {
      const resp = await fetch(graphUrl, {
        method: 'POST',
        headers: {},
        body: query,
      });
      const json = await resp.json();
      return json as GraphResponse<T>;
    } catch (err) {
      return null;
    }
  };
};

const createGraphClient = (): GraphClient => ({
  searchProfiles: fetchQuery<SearchProfileQueryResponse>('search_profiles'),
  getProfiles: fetchQuery<SearchProfileQueryResponse>('Profile'),
});

export const graphClient: GraphClient = createGraphClient();
