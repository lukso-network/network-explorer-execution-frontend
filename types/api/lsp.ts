export type LSP3Response = {
  type: string;
  hasProfileName: boolean;
  hasProfileImage: boolean;
  LSP3Profile: {
    name: string;
    profileImage: {
      [key: number]: {
        url: string;
      };
    };
  };
}

export type LSP7Response = {
  address: string;
  updatedAtBlockNameAndSymbol: number;
  symbol: string;
  hasTokenSymbol: boolean;
  name: string;
  hasTokenName: boolean;
  LSP4Metadata: {
    description: string;
    icon: {
      [key: number]: {
        url: string;
      };
    };
    images: {
      [key: number]: {
        [key: number]: {
          url: string;
        };
      };
    };
  };
  assetImageUrl: string;
  assetImageRawUrl: string;
  hasAssetImage: boolean;
  iconImageUrl: string;
  iconImageRawUrl: string;
  hasIconImage: boolean;
  updatedAtBlockMetadata: number;
  description: string;
  objectID: string;
  linkUrl: string;
}

export type LSPResponse = LSP3Response | LSP7Response
