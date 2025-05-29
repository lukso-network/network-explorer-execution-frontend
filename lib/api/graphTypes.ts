export type ProfileImage = {
  src: string;
  width: number;
};

export type SearchProfileQueryResponse = {
  profileImages: Array<ProfileImage>;
  id: string;
  name: string | null;
  fullName: string | null;
};

export type GraphQuery = {
  operationName: string;
  query: string;
};

export type QueryOperation = 'search_profiles' | 'Profile';
