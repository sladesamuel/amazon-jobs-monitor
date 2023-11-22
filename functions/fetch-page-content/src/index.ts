import axios from "axios"
import SearchResponse from "./SearchResponse"
import FetchPageContentModel from "./FetchPageContentModel"
import createSearchUrlFromModel from "./createSearchUrlFromModel"
import config from "./config"
import Page from "./Page"

const { baseUrl, itemsPerPage } = config

const defaultModel: FetchPageContentModel = {
  searchTerm: "Solutions Architect",
  pageNumber: 1,
  pages: []
}

export default async function (event?: any): Promise<FetchPageContentModel> {
  console.log(event)

  const searchUrl = createSearchUrlFromModel(baseUrl, defaultModel)
  console.log("Searching with URL", searchUrl)

  const response = await axios.get<SearchResponse>(searchUrl)
  console.log(response.data)

  if (response.data.error) {
    const error = response.data.error as string
    console.error(error)

    throw Error(`Search failed: ${error}`)
  }

  const pageCount = Math.ceil(response.data.hits / itemsPerPage)
  const pages: Page[] = [...new Array(pageCount)]
    .map((_, index: number) => ({
      itemsPerPage,
      page: index + 1,
      searchUrl
    }))

  return {
    searchTerm: defaultModel.searchTerm,
    pageNumber: defaultModel.pageNumber,
    pages
  }
}
