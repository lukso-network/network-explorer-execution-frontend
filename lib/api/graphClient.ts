import { getEnvValue } from "configs/app/utils";
import { UniversalProfileGraphResponse } from "types/api/universalProfile";
import { SearchProfileQueryResponse } from "./graphTypes";
import { universalProfile } from "nextjs/csp/policies";

const graphUrl = getEnvValue('NEXT_PUBLIC_GRAPH_URL') || '';

type GraphClient = {
  getProfiles: (queryParams: string) => Promise<UniversalProfileGraphResponse<SearchProfileQueryResponse> | null>; 
};

type fetchFunc<T> = (queryParams: string) => Promise<UniversalProfileGraphResponse<T> | null>

const queryParamsToGraphQuery = (operationName: string, query: string): string => {
  return JSON.stringify({
    operationName: operationName,
    query: query,
  }); 
}

const fetchQuery = <T>(operationName: string): fetchFunc<T> => {
  return async (queryParams: string): Promise<UniversalProfileGraphResponse<T> | null> => {
    const query = queryParamsToGraphQuery(operationName, queryParams);

    try {
      const resp = await fetch(graphUrl, {
        method: 'POST',
        headers: {},
        body: query,
      });
      const json = await resp.json();
      return json as UniversalProfileGraphResponse<T>;
    } catch (err) {
      return null;
    };
  }
}

const createGraphClient = (): GraphClient => ({
  getProfiles: fetchQuery<SearchProfileQueryResponse>('search_profiles'), 
});

export const graphClient: GraphClient = createGraphClient();

