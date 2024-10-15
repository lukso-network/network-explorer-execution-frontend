import { Box, Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { create, windowScheduler, keyResolver } from '@yornaath/batshit';
import React from 'react';

import { graphClient } from 'lib/api/graphClient';
import type { SearchProfileQueryResponse } from 'lib/api/graphTypes';

interface Props {
  address: string;
  fallbackIcon: JSX.Element;
}

const profiles = create({
  fetcher: async(addresses: Array<string>) => {
    const resp = await graphClient.getProfiles(JSON.stringify(addresses));
    if (resp === null) {
      return [] as Array<SearchProfileQueryResponse>;
    }

    return resp.data.Profile;
  },

  resolver: keyResolver('id'),
  scheduler: windowScheduler(2000),
});

export const formattedLuksoName = (hash: string, name: string | null) => {
  return `@${ name } (${ hash })`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUniversalProfile = (address: string): UseQueryResult<SearchProfileQueryResponse | null> => {
  return useQuery({
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retryOnMount: false,
    staleTime: 60 * 60 * 1000,
    queryKey: [ 'universalProfile', address ],
    queryFn: async() => {
      return profiles.fetch(address.toLowerCase());
    },
  });
};

export const IdenticonUniversalProfile: React.FC<Props> = ({
  address,
  fallbackIcon,
}) => {
  const { data: up, isLoading } = useUniversalProfile(address.toLowerCase());
  let profileImageUrl = '';
  const hasProfileImages = up?.profileImages !== null && up?.profileImages !== undefined && up?.profileImages.length > 0;
  if (hasProfileImages) {
    const lastImageIndex =
      Object.values(up?.profileImages || {}).length - 1;

    profileImageUrl = hasProfileImages ?
      up?.profileImages[lastImageIndex].src :
      '';

  }

  return (
    <Skeleton isLoaded={ !isLoading }>
      { profileImageUrl ? (
        <Box mx={ 2 }>
          <lukso-profile
            size="x-small"
            profile-url={ profileImageUrl }
            profile-address={ address }
            has-identicon={ true }
          ></lukso-profile>
        </Box>
      ) : fallbackIcon }
    </Skeleton>
  );
};

export default IdenticonUniversalProfile;
