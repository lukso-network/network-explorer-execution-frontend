import { chakra } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import shortenString from 'lib/shortenString';
import { Tooltip } from 'toolkit/chakra/tooltip';

import { isUniversalProfileEnabled } from '../../lib/api/isUniversalProfileEnabled';
import shortenUniversalProfile from '../../lib/shortenUniversalProfile';

interface Props {
  hash: string;
  noTooltip?: boolean;
  tooltipInteractive?: boolean;
  type?: 'long' | 'short';
  as?: React.ElementType;
}

const HashStringShorten = ({ hash, noTooltip, as = 'span', type, tooltipInteractive }: Props) => {
  const charNumber = type === 'long' ? 16 : 8;
  const [ shortenedString, setShortenedString ] = useState(shortenString(hash, charNumber));
  useEffect(() => {
    if (isUniversalProfileEnabled() && hash.includes(' (')) {
      setShortenedString(shortenUniversalProfile(hash));
    }
  }, [ hash ]);

  if (hash.length <= charNumber) {
    return <chakra.span as={ as }>{ hash }</chakra.span>;
  }

  const content = <chakra.span as={ as }>{ shortenedString }</chakra.span>;

  if (noTooltip) {
    return content;
  }

  return (
    <Tooltip content={ hash } interactive={ tooltipInteractive }>
      { content }
    </Tooltip>
  );
};

export default HashStringShorten;
