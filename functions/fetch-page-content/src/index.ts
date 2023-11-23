import axios from "axios"
import SearchResponse from "./SearchResponse"
import FetchPageContentModel from "./FetchPageContentModel"
import createSearchUrlFromModel from "./createSearchUrlFromModel"
import config from "./config"
import Page from "./Page"

const { baseUrl, itemsPerPage } = config

export default async function (model: FetchPageContentModel): Promise<FetchPageContentModel> {
  console.log(model)

  const searchUrl = createSearchUrlFromModel(baseUrl, model)
  console.log("Searching with URL", searchUrl)

  const response = await axios.get<SearchResponse>(searchUrl)
  console.log(response.data)

  const {
    error,
    hits,
    jobs
  } = response.data

  if (error) {
    const errorDetail = error as string
    console.error(errorDetail)

    throw Error(`Search failed: ${errorDetail}`)
  }

  const pageCount = Math.ceil(hits / itemsPerPage)
  const pages: Page[] = [...new Array(pageCount)]
    .map((_, index: number) => ({
      itemsPerPage,
      page: index + 1,
      searchUrl
    }))

  return {
    ...model,
    pages,
    jobs
  }
}
