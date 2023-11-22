import Page from "./Page"

type FetchPageContentModel = {
  // The page of results to be fetched
  pageNumber: number

  // The search term to apply
  searchTerm: string

  // Populated in the respoonse model
  pages: Page[]
}

export default FetchPageContentModel
