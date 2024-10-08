import { Query, queryResponse } from "lib/api/graphTypes";

export type UniversalProfileProxyResponse = {
  type: string;
  hasProfileName: boolean;
  hasProfileImage: boolean;
  LSP3Profile: {
    name: string;
    profileImage: {
      [key: number]: {
        url: string;
      };
    };
  };
}

export type UniversalProfileAlgoliaResponse = {
  type: string;
  hasProfileName: boolean;
  hasProfileImage: boolean;
  LSP3Profile: {
    name: string;
    profileImage: {
      [key: number]: {
        url: string;
      };
    };
  };
}

export type UniversalProfileGraphResponse<T> = {
  data: {
    [key in Query]: T;
  };
}

