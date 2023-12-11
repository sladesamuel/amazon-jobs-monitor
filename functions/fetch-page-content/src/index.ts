import axios from "axios"
import SearchResponse from "./SearchResponse"
import FetchPageContentModel from "./models/FetchPageContentModel"
import createSearchUrlFromModel from "./createSearchUrlFromModel"
import config from "./config"
import Page from "./models/Page"
import Job from "./models/Job"

const { baseUrl, itemsPerPage } = config

// Explicitly convert jobs so we drop any JS-based type info not represented
// in the TypeScript type, such as the lengthy string-based description
const convertJob = (job: Job): Job => ({
  id: job.id,
  id_icims: job.id_icims,
  title: job.title,
  job_path: job.job_path,
  posted_date: job.posted_date,
  url_next_step: job.url_next_step
})

export default async (model: FetchPageContentModel): Promise<FetchPageContentModel> => {
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
      pageNumber: index + 1,
      searchUrl
    }))

  const actualJobs = jobs.map(convertJob)
  return {
    ...model,
    pages,
    jobs: (model.includeJobs ?? false) ? actualJobs : []
  }
}
