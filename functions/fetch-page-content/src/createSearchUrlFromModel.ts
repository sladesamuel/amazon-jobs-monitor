import FetchPageContentModel from "./FetchPageContentModel"
import config from "./config"

const searchUrl = "en-gb/search.json"

const category = "solutions-architect"
const scheduleTypeId = "Full-Time"
const normalizedCountryCode = "GBR"
const businessCategory = "amazon-web-services"
const radius = "24km"
const isManager = false // should be represented as 0
const sort = "recent"
const location = "United Kingdom" // loc_query=United%20Kingdom

const { itemsPerPage } = config

export default (baseUrl: string, { searchTerm, pageNumber }: FetchPageContentModel): string => {
  const queryParams = new URLSearchParams()
  queryParams.append("category[]", category)
  queryParams.append("schedule_type_id[]", scheduleTypeId)
  queryParams.append("normalized_country_code[]", normalizedCountryCode)
  queryParams.append("business_category[]", businessCategory)
  queryParams.append("radius[]", radius)
  queryParams.append("is_manager[]", isManager ? "1" : "0")
  queryParams.append("offset[]", (pageNumber - 1).toString())
  queryParams.append("result_limit[]", itemsPerPage.toString())
  queryParams.append("sort[]", sort)
  queryParams.append("loc_query[]", location)
  queryParams.append("base_query[]", searchTerm)

  return `${baseUrl}/${searchUrl}?${queryParams.toString()}`
}
