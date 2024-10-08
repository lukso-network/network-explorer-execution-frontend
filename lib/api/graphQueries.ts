export const searchProfileQuery = (query: string): string => `
search_profiles(args: { search: "${ query }" }) {
    profileImages(order_by: { width: asc }) {
      src,
      width,
    },
    id,
    name,
    fullName,
  }
`

