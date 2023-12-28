import type { SearchResultItem } from 'types/api/search';
import type { MarketplaceAppOverview } from 'types/client/marketplace';

import { isUniversalProfileEnabled } from '../../../lib/api/isUniversalProfileEnabled';

export type ApiCategory = 'token' | 'nft' | 'address' | 'public_tag' | 'transaction' | 'block' | 'universal_profile';
export type Category = ApiCategory | 'app';

export type ItemsCategoriesMap =
Record<ApiCategory, Array<SearchResultItem>> &
Record<'app', Array<MarketplaceAppOverview>>;

export type SearchResultAppItem = {
  type: 'app';
  app: MarketplaceAppOverview;
}

export const searchCategories: Array<{id: Category; title: string }> = [
  { id: 'app', title: 'Apps' },
  { id: 'token', title: isUniversalProfileEnabled() ? 'Tokens (ERC-20 & LSP7)' : 'Tokens (ERC-20)' },
  { id: 'nft', title: isUniversalProfileEnabled() ? 'NFTs (ERC-721 & 1155 & LSP8)' : 'NFTs (ERC-721 & 1155)' },
  { id: 'address', title: 'Addresses' },
  { id: 'public_tag', title: 'Public tags' },
  { id: 'transaction', title: 'Transactions' },
  { id: 'block', title: 'Blocks' },
  { id: 'universal_profile', title: 'Universal Profiles' },
];

export const searchItemTitles: Record<Category, { itemTitle: string; itemTitleShort: string }> = {
  app: { itemTitle: 'App', itemTitleShort: 'App' },
  token: { itemTitle: 'Token', itemTitleShort: 'Token' },
  nft: { itemTitle: 'NFT', itemTitleShort: 'NFT' },
  address: { itemTitle: 'Address', itemTitleShort: 'Address' },
  public_tag: { itemTitle: 'Public tag', itemTitleShort: 'Tag' },
  transaction: { itemTitle: 'Transaction', itemTitleShort: 'Txn' },
  block: { itemTitle: 'Block', itemTitleShort: 'Block' },
  universal_profile: { itemTitle: 'Universal Profile', itemTitleShort: 'UP' },
};

export function getItemCategory(item: SearchResultItem | SearchResultAppItem): Category | undefined {
  switch (item.type) {
    case 'address':
    case 'contract': {
      return 'address';
    }
    case 'token': {
      if (item.token_type === 'ERC-20') {
        return 'token';
      }
      return 'nft';
    }
    case 'block': {
      return 'block';
    }
    case 'label': {
      return 'public_tag';
    }
    case 'transaction': {
      return 'transaction';
    }
    case 'app': {
      return 'app';
    }
    case 'universal_profile': {
      return 'universal_profile';
    }
  }
}
