import Job from "./Job"
import handler from "./index"

describe("handler", () => {
  it("should return an empty string when there are no jobs", async () => {
    const result = await handler([])

    expect(result).toEqual("")
  })

  it("should return HTML for one job when there is one job", async () => {
    const jobs: Job[] = [
      {
        id: "job1",
        title: "Job 1",
        job_path: "path1",
        posted_date: "today",
        url_next_step: "apply1"
      }
    ]

    const result = await handler(jobs)

    expect(result).toEqual(`<h2>New jobs</h2>

<a href="https://www.amazon.jobs/path1">Job 1</a>`)
  })

  it("should return HTML for 2 jobs when there are 2 jobs", async () => {
    const jobs: Job[] = [
      {
        id: "job1",
        title: "Job 1",
        job_path: "path1",
        posted_date: "today",
        url_next_step: "apply1"
      },
      {
        id: "job2",
        title: "Job 2",
        job_path: "path2",
        posted_date: "yesterday",
        url_next_step: "apply2"
      }
    ]

    const result = await handler(jobs)

    expect(result).toEqual(`<h2>New jobs</h2>

<a href="https://www.amazon.jobs/path1">Job 1</a>
<a href="https://www.amazon.jobs/path2">Job 2</a>`)
  })
})
