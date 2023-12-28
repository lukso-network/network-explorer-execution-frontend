import { useQuery } from '@tanstack/react-query';

import type { ResourceError, ResourceName, ResourcePayload } from './resources';
import type { Params } from './useApiQuery';
import { getResourceKey } from './useApiQuery';
import useLSP7ApiFetch from './useLSP7ApiFetch';

export default function useLSP7Query<R extends ResourceName, E = unknown>(
  resource: R,
  { queryOptions, pathParams, queryParams }: Params<R, E> = {},
) {
  const lspFetch = useLSP7ApiFetch();
  return useQuery<ResourcePayload<R>, ResourceError<E>, ResourcePayload<R>>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: getResourceKey(resource, { pathParams, queryParams }),
    queryFn: async() => {
      return await lspFetch(queryParams?.q as string) as Promise<ResourcePayload<R>>;
    },
    ...queryOptions,
  });
}
