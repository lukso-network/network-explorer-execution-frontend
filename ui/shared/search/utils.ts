import type { SearchResultItem } from 'types/api/search';
import type { MarketplaceAppOverview } from 'types/client/marketplace';

export type ApiCategory = 'token' | 'nft' | 'address' | 'public_tag' | 'transaction' | 'block' | 'universal_profile' | 'LSP7';
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
  { id: 'token', title: 'Tokens (ERC-20)' },
  { id: 'nft', title: 'NFTs (ERC-721 & 1155)' },
  { id: 'LSP7', title: 'Digital Assets (LSP7)' },
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
  LSP7: { itemTitle: 'LSP7 Digital asset', itemTitleShort: 'LSP7' },
};

export function getItemCategory(item: SearchResultItem | SearchResultAppItem): Category | undefined {
  switch (item.type) {
    case 'address':
    case 'contract': {
      return 'address';
    }
    case 'token': {
      switch (item.token_type) {
        case 'ERC-20':
          return 'token';
        case 'LSP7':
          return 'LSP7';
        default:
          return 'nft';
      }
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
