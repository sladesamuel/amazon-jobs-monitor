import axios from "axios"
jest.mock("axios")

process.env.AMAZON_JOBS_BASE_URL = "https://amazon.jobs"

import handler from "./index"
import SearchResponse from "./SearchResponse"
import FetchPageContentModel from "./FetchPageContentModel"
import Job from "./Job"

const axiosMock = axios as jest.Mocked<typeof axios>

const model: FetchPageContentModel = {
  searchTerm: "Handler Tests",
  pageNumber: 1,
  pages: []
}

const createJob = (id: string, title: string): Job => ({
  id,
  title,
  job_path: `/job/path/${id}`,
  posted_date: new Date().toUTCString(),
  url_next_step: `https://amazon.jobs/apply/${id}`
})

describe("handler", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return 1 page when there are 4 hits, excluding jobs", async () => {
    const mockResponse: SearchResponse = {
      error: null,
      hits: 4,
      jobs: [
        createJob("one", "First Job")
      ]
    }

    let searchUrl: string = ""
    axiosMock.get.mockImplementationOnce(
      (url: string) => {
        searchUrl = url

        return Promise.resolve(({ data: mockResponse }))
      }
    )

    const { pages, jobs } = await handler(model)

    expect(pages).toHaveLength(1)

    const [actualPage] = pages ?? []
    expect(actualPage.itemsPerPage).toEqual(10)
    expect(actualPage.pageNumber).toEqual(1)
    expect(actualPage.searchUrl).toEqual(searchUrl)

    expect(jobs).toHaveLength(0)
  })

  it("should return 1 page when there are 4 hits, including jobs", async () => {
    const mockResponse: SearchResponse = {
      error: null,
      hits: 4,
      jobs: [
        createJob("one", "First Job")
      ]
    }

    let searchUrl: string = ""
    axiosMock.get.mockImplementationOnce(
      (url: string) => {
        searchUrl = url

        return Promise.resolve(({ data: mockResponse }))
      }
    )

    const { pages, jobs } = await handler({
      ...model,
      includeJobs: true
    })

    expect(pages).toHaveLength(1)

    const [actualPage] = pages ?? []
    expect(actualPage.itemsPerPage).toEqual(10)
    expect(actualPage.pageNumber).toEqual(1)
    expect(actualPage.searchUrl).toEqual(searchUrl)

    expect(jobs).toHaveLength(1)

    const [actualJob] = jobs ?? []
    expect(actualJob.id).toEqual("one")
    expect(actualJob.title).toEqual("First Job")
  })

  it("should return 3 pages when there are 27 hits", async () => {
    const mockResponse: SearchResponse = {
      error: null,
      hits: 27,
      jobs: []
    }

    let searchUrl: string = ""
    axiosMock.get.mockImplementationOnce(
      (url: string) => {
        searchUrl = url

        return Promise.resolve(({ data: mockResponse }))
      }
    )

    const result = await handler(model)

    expect(result.pages).toHaveLength(3)

    const [page1, page2, page3] = result.pages ?? []
    expect(page1.itemsPerPage).toEqual(10)
    expect(page1.pageNumber).toEqual(1)
    expect(page1.searchUrl).toEqual(searchUrl)

    expect(page2.itemsPerPage).toEqual(10)
    expect(page2.pageNumber).toEqual(2)
    expect(page2.searchUrl).toEqual(searchUrl)

    expect(page3.itemsPerPage).toEqual(10)
    expect(page3.pageNumber).toEqual(3)
    expect(page3.searchUrl).toEqual(searchUrl)
  })

  it("should throw an error when an error is returned", async () => {
    const mockResponse: SearchResponse = {
      error: "Some error",
      hits: 4,
      jobs: []
    }

    axiosMock.get.mockImplementationOnce(
      () => Promise.resolve(({ data: mockResponse })))

    await expect(handler(model))
      .rejects
      .toThrow("Search failed: Some error")
  })
})
