import axios from "axios"

const baseUrl = "https://www.amazon.jobs"
const searchUrl = `${baseUrl}/en-gb/search.json`

const category = "solutions-architect"
const scheduleTypeId = "Full-Time"
const normalizedCountryCode = "GBR"
const businessCategory = "amazon-web-services"
const radius = "24km"
const isManager = false // should be represented as 0
const page: number = 1
const itemsPerPage: number = 10 // items per page
const sort = "recent"
const location = "United Kingdom" // loc_query=United%20Kingdom
const searchTerm = "Solutions Architect" // base_query=Solutions%20Architect

const queryParams = new URLSearchParams()
queryParams.append("category[]", category)
queryParams.append("schedule_type_id[]", scheduleTypeId)
queryParams.append("normalized_country_code[]", normalizedCountryCode)
queryParams.append("business_category[]", businessCategory)
queryParams.append("radius[]", radius)
queryParams.append("is_manager[]", isManager ? "1" : "0")
queryParams.append("offset[]", (page - 1).toString())
queryParams.append("result_limit[]", itemsPerPage.toString())
queryParams.append("sort[]", sort)
queryParams.append("loc_query[]", location)
queryParams.append("base_query[]", searchTerm)

const fullUrl = `${searchUrl}?${queryParams.toString()}`

type SearchResponse = {
  error: unknown
  hits: number // total number of results in the query
  jobs: Job[]
}

type Job = {
  id: string
  title: string
  job_path: string // URL segment relative to the baseUrl
  url_next_step: string // absolute URL to apply for the job
  posted_date: string
}

type Result = {
  pages: Page[]
}

type Page = {
  page: number
  itemsPerPage: number
  searchUrl: string
}

export default async function (): Promise<Result> {
  const response = await axios.get<SearchResponse>(fullUrl)
  console.log(response.data)

  if (response.data.error) {
    console.error(response.data.error)

    throw Error("Error in response from search")
  }

  const pageCount = response.data.hits / itemsPerPage
  const pages: Page[] = [...new Array(pageCount)]
    .map((_, index: number) => ({
      itemsPerPage,
      page: index + 1,
      searchUrl: fullUrl
    }))

  return { pages }
}
