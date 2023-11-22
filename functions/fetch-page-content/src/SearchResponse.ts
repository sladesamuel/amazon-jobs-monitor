import Job from "./Job"

type SearchResponse = {
  error: unknown
  hits: number // total number of results in the query
  jobs: Job[]
}

export default SearchResponse
