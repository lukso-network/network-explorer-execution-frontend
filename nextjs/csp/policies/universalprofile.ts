import type CspDev from 'csp-dev';

export function universalProfile(): CspDev.DirectiveDescriptor {
  return {
    'connect-src': [
      'api.universalprofile.cloud',
      '*.algolianet.com',
      '*.algolia.net',
      'envio.mainnet.lukso.dev',
      'envio.lukso-mainnet.universal.tech',
      'envio.lukso-testnet.universal.tech',
    ],
    'frame-ancestors': [
      'universaleverything.io',
    ],
  };
}
