import type { LSPResponse } from '../../types/api/lsp';

import { getEnvValue } from '../../configs/app/utils';

export const fetchLsp = async <T extends LSPResponse>(address: string) => {
  const upApiUrl = getEnvValue('NEXT_PUBLIC_UNIVERSAL_PROFILES_API_URL') || '';
  const networkId = getEnvValue('NEXT_PUBLIC_NETWORK_ID') || '42';
  const url = `${ upApiUrl }/v1/${ networkId }/address/${ address }`;

  try {
    const resp = await fetch(url);
    const json = await resp.json();
    return json as T;
  } catch (err) {
    return undefined;
  }
};
