import Job from "../fetch-page-content/src/Job"
import Page from "../fetch-page-content/src/Page"

type FetchPageContentModel = {
  // The page of results to be fetched
  pageNumber: number

  // The search term to apply
  searchTerm: string

  // Populated in the respoonse model
  pages?: Page[]

  jobs?: Job[]
  includeJobs?: boolean
}

export default FetchPageContentModel
