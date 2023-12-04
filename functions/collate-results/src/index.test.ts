import FetchPageContentModel from "./models/FetchPageContentModel"
import Job from "./models/Job"
import handler from "./index"

const createModel = (...jobs: Job[]): FetchPageContentModel => ({
  pageNumber: 1,
  searchTerm: "test",
  jobs: jobs
})

const createJob = (id: string): Job => ({
  id,
  title: id,
  job_path: id,
  posted_date: new Date().toString(),
  url_next_step: id
})

describe("index", () => {
  it("should return an empty array when there are no results", async () => {
    const models: FetchPageContentModel[] = []

    const jobs = await handler(models)

    expect(jobs).toHaveLength(0)
  })

  it("should return 2 jobs when there is 1 result with 2 jobs", async () => {
    const models: FetchPageContentModel[] = [
      createModel(createJob("one"), createJob("two"))
    ]

    const jobs = await handler(models)

    expect(jobs).toHaveLength(2)
    expect(jobs[0].id).toEqual("one")
    expect(jobs[1].id).toEqual("two")
  })

  it("should return 5 jobs when there are 3 results with 2 jobs, 1 job and 2 jobs, respectively", async () => {
    const models: FetchPageContentModel[] = [
      createModel(createJob("one"), createJob("two")),
      createModel(createJob("three")),
      createModel(createJob("four"), createJob("five"))
    ]

    const jobs = await handler(models)

    expect(jobs).toHaveLength(5)
    expect(jobs[0].id).toEqual("one")
    expect(jobs[1].id).toEqual("two")
    expect(jobs[2].id).toEqual("three")
    expect(jobs[3].id).toEqual("four")
    expect(jobs[4].id).toEqual("five")
  })
})
