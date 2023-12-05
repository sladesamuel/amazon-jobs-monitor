import Job from "./Job"
import handler from "./index"

const createJob = (title: string): Job => ({
  id: "id",
  title,
  job_path: "path",
  posted_date: new Date().toString(),
  url_next_step: "next"
})

describe("index", () => {
  it("should return an empty array when there are no jobs", async () => {
    const actualJobs = await handler([])

    expect(actualJobs).toHaveLength(0)
  })

  it("should return all jobs when they all match the job title", async () => {
    const jobs: Job[] = [
      createJob("Senior Solutions Architect (Startups)"),
      createJob("Sr. Solutions Architect, Media & Entertainment, AWS Industries - Media, Entertainment & Sport"),
      createJob("Solutions Architect, AWS Well-Architected")
    ]

    const actualJobs = await handler(jobs)

    expect(actualJobs).toHaveLength(3)
    expect(actualJobs[0].title).toEqual("Senior Solutions Architect (Startups)")
    expect(actualJobs[1].title).toEqual("Sr. Solutions Architect, Media & Entertainment, AWS Industries - Media, Entertainment & Sport")
    expect(actualJobs[2].title).toEqual("Solutions Architect, AWS Well-Architected")
  })

  it("should return 2 jobs out of 3 when the third doesn't macch the job title", async () => {
    const jobs: Job[] = [
      createJob("Senior Solutions Architect (Startups)"),
      createJob("Enterprise Service Manager, Industrial Manufacturing, AWSI Professional Services EMEA"),
      createJob("Solutions Architect, AWS Well-Architected")
    ]

    const actualJobs = await handler(jobs)

    expect(actualJobs).toHaveLength(2)
    expect(actualJobs[0].title).toEqual("Senior Solutions Architect (Startups)")
    expect(actualJobs[1].title).toEqual("Solutions Architect, AWS Well-Architected")
  })
})
