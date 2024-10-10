import type { QueryOperation } from './graphTypes';

type QueryConstructor = (queryParams?: string) => string;

export const constructQuery = (operationType: QueryOperation, queryParams?: string) => {
  const queryConstruct = queryConstructors[operationType];

  return queryConstruct(queryParams);
};

export const searchProfileQuery = (queryParams?: string): string => `query search_profiles {
  search_profiles(args: { search: "${ queryParams }" }) {
    profileImages(order_by: { width: asc }) {
      src,
      width,
    },
    id,
    name,
    fullName,
  }
}`;

const queryConstructors: Record<QueryOperation, QueryConstructor> = {
  search_profiles: searchProfileQuery,
};
