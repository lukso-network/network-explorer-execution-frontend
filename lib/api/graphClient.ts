import { getEnvValue } from "configs/app/utils";
import { UniversalProfileGraphResponse } from "types/api/universalProfile";

type GraphClient = {
  getProfile: (queryParamas: string) => Promise<UniversalProfileGraphResponse> | null; 
};

const createGraphClient = (): GraphClient => ({
  async getProfile(queryParams): Promise<UniversalProfileGraphResponse> | null {
      const url = getEnvValue('NEXT_PUBLIC_GRAPH_URL') || '';
      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers: {

          },
          body: JSON.stringify("asd"),
        });
        const json = await resp.json();
        return json as UniversalProfileGraphResponse;
      } catch (err) {
        return null;
      }
    

    return {
      result: queryParams, 
    }; 
  },
});

export const graphClient: GraphClient = createGraphClient();

