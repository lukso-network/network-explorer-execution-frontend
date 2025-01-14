import { chakra, Box, Text, Flex } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import type { ItemsProps } from './types';
import type { SearchResultAddressOrContractOrUniversalProfile } from 'types/api/search';

import { toBech32Address } from 'lib/address/bech32';
import dayjs from 'lib/date/dayjs';
import highlightText from 'lib/highlightText';
import ContractCertifiedLabel from 'ui/shared/ContractCertifiedLabel';
import * as AddressEntity from 'ui/shared/entities/address/AddressEntity';
import { ADDRESS_REGEXP } from 'ui/shared/forms/validators/address';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

import { formattedLuksoName, getUniversalProfile } from '../../../shared/entities/address/IdenticonUniversalProfileQuery';

const SearchBarSuggestAddress = ({ data, isMobile, searchTerm, addressFormat }: ItemsProps<SearchResultAddressOrContractOrUniversalProfile>) => {
  const shouldHighlightHash = ADDRESS_REGEXP.test(searchTerm);
  const hash = data.filecoin_robust_address || (addressFormat === 'bech32' ? toBech32Address(data.address) : data.address);
  const queryClient = useQueryClient();
  const [ type, setType ] = useState(data.type);
  const [ displayedName, setDisplayedName ] = useState(hash);

  useEffect(() => { // this causes a sort of loading state where the address suddenly switches to up name - needs fix?
    (async() => {
      const upData = await getUniversalProfile(data.address, queryClient);
      if (upData === undefined) {
        return;
      }

      if (upData.LSP3Profile !== undefined) {
        setType('contract'); // when the type is contract the icon will know that it needs to get UP profile picture
        if (upData.hasProfileName) {
          setDisplayedName(formattedLuksoName(data.address, upData.LSP3Profile.name));
        }
      }
    })();
  }, [ data, queryClient, setType, setDisplayedName ]);

  const icon = (
    <AddressEntity.Icon
      address={{
        hash: data.address,
        is_contract: type === 'contract',
        name: '',
        is_verified: data.is_smart_contract_verified,
        ens_domain_name: null,
        implementations: null,
      }}
    />
  );
  const addressName = data.name || data.ens_info?.name;
  const expiresText = data.ens_info?.expiry_date ? ` (expires ${ dayjs(data.ens_info.expiry_date).fromNow() })` : '';

  const nameEl = addressName && (
    <Flex alignItems="center">
      <Text
        variant="secondary"
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
      >
        <chakra.span
          fontWeight={ 500 }
          dangerouslySetInnerHTML={{ __html: highlightText(data.type === 'universal_profile' ? data.address : addressName, searchTerm) }}
        />
        { data.ens_info && (
          data.ens_info.names_count > 1 ?
            <span> ({ data.ens_info.names_count > 39 ? '40+' : `+${ data.ens_info.names_count - 1 }` })</span> :
            <span>{ expiresText }</span>
        ) }
      </Text>
      { data.certified && <ContractCertifiedLabel boxSize={ 4 } iconSize={ 4 } ml={ 1 }/> }
    </Flex>
  );
  const addressEl = <HashStringShortenDynamic hash={ displayedName } isTooltipDisabled/>;

  if (isMobile) {
    return (
      <>
        <Flex alignItems="center">
          { icon }
          <Box
            as={ shouldHighlightHash ? 'mark' : 'span' }
            display="block"
            overflow="hidden"
            whiteSpace="nowrap"
            fontWeight={ 700 }
          >
            { addressEl }
          </Box>
        </Flex>
        { nameEl }
      </>
    );
  }

  return (
    <Flex alignItems="center">
      <Flex alignItems="center" w="450px" mr={ 2 }>
        { icon }
        <Box
          as={ shouldHighlightHash ? 'mark' : 'span' }
          display="block"
          overflow="hidden"
          whiteSpace="nowrap"
          fontWeight={ 700 }
        >
          { addressEl }
        </Box>
      </Flex>
      { nameEl }
    </Flex>
  );
};

export default React.memo(SearchBarSuggestAddress);
