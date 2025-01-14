import { Box } from '@chakra-ui/react';
import type { QueryClient } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import type { UniversalProfileProxyResponse } from '../../../../types/api/universalProfile';

import { getEnvValue } from '../../../../configs/app/utils';
import { isUniversalProfileEnabled } from '../../../../lib/api/isUniversalProfileEnabled';

interface Props {
  address: string;
  fallbackIcon: React.JSX.Element;
}

export const formattedLuksoName = (hash: string, name: string | null) => {
  return `@${ name } (${ hash })`;
};

export const getUniversalProfile = async(address: string, queryClient: QueryClient) => {
  if (!isUniversalProfileEnabled()) {
    return undefined;
  }
  const query = queryClient.getQueryData<UniversalProfileProxyResponse>([ 'universalProfile', { address: address } ]);
  if (query !== undefined) {
    return query;
  }

  return await queryClient.fetchQuery({
    queryKey: [ 'universalProfile', { address: address } ],
    queryFn: async() => {
      const upApiUrl = getEnvValue('NEXT_PUBLIC_UNIVERSAL_PROFILES_API_URL') || '';
      const networkId = getEnvValue('NEXT_PUBLIC_NETWORK_ID') || '42';

      const url = `${ upApiUrl }/v1/${ networkId }/address/${ address }`;
      try {
        const resp = await fetch(url);
        const json = await resp.json();
        return json as UniversalProfileProxyResponse;
      } catch (err) {
        return undefined;
      }
    },
  });
};

export const IdenticonUniversalProfile: React.FC<Props> = ({ address, fallbackIcon }) => {
  const [ up, setUp ] = useState({} as UniversalProfileProxyResponse);
  const queryClient = useQueryClient();
  useEffect(() => {
    (async() => {
      const upData = await getUniversalProfile(address, queryClient);
      if (upData !== undefined) {
        setUp(upData);

        return;
      }
    })();
  }, [ address, setUp, queryClient ]);

  if (up === undefined || up.LSP3Profile === undefined) {
    return fallbackIcon;
  }

  let profileImageUrl = '';
  if (up.LSP3Profile.profileImage !== null) {
    const lastImageIndex = Object.values(up.LSP3Profile.profileImage).length - 1;

    profileImageUrl = up.hasProfileImage ? up.LSP3Profile.profileImage[lastImageIndex].url : '';
  }

  return (
    <Box mr={ 2 }>
      <lukso-profile
        size="x-small"
        profile-url={ profileImageUrl }
        profile-address={ address }
        has-identicon={ true }
      ></lukso-profile>
    </Box>
  );
};

export default IdenticonUniversalProfile;
