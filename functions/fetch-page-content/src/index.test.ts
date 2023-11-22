import axios from "axios"
jest.mock("axios")

process.env.AMAZON_JOBS_BASE_URL = "https://amazon.jobs"

import handler from "./index"
import SearchResponse from "./SearchResponse"

const axiosMock = axios as jest.Mocked<typeof axios>

describe("handler", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return 1 page when there are 4 hits", async () => {
    const mockResponse: SearchResponse = {
      error: null,
      hits: 4,
      jobs: []
    }

    let searchUrl: string = ""
    axiosMock.get.mockImplementationOnce(
      (url: string) => {
        searchUrl = url

        return Promise.resolve(({ data: mockResponse }))
      }
    )

    const result = await handler()

    expect(result.pages).toHaveLength(1)

    const [actualPage] = result.pages
    expect(actualPage.itemsPerPage).toEqual(10)
    expect(actualPage.page).toEqual(1)
    expect(actualPage.searchUrl).toEqual(searchUrl)
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

    const result = await handler()

    expect(result.pages).toHaveLength(3)

    const [page1, page2, page3] = result.pages
    expect(page1.itemsPerPage).toEqual(10)
    expect(page1.page).toEqual(1)
    expect(page1.searchUrl).toEqual(searchUrl)

    expect(page2.itemsPerPage).toEqual(10)
    expect(page2.page).toEqual(2)
    expect(page2.searchUrl).toEqual(searchUrl)

    expect(page3.itemsPerPage).toEqual(10)
    expect(page3.page).toEqual(3)
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

    await expect(handler())
      .rejects
      .toThrow("Search failed: Some error")
  })
})
