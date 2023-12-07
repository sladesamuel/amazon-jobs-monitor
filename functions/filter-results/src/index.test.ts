import Job from "./Job"
import handler from "./index"

const createJob = (id: string, title: string): Job => ({
  id,
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
      createJob("1", "Senior Solutions Architect (Startups)"),
      createJob("2", "Sr. Solutions Architect, Media & Entertainment, AWS Industries - Media, Entertainment & Sport"),
      createJob("3", "Solutions Architect, AWS Well-Architected")
    ]

    const actualJobs = await handler(jobs)

    expect(actualJobs).toHaveLength(3)
    expect(actualJobs[0].title).toEqual("Senior Solutions Architect (Startups)")
    expect(actualJobs[1].title).toEqual("Sr. Solutions Architect, Media & Entertainment, AWS Industries - Media, Entertainment & Sport")
    expect(actualJobs[2].title).toEqual("Solutions Architect, AWS Well-Architected")
  })

  it("should return 2 jobs out of 3 when the third doesn't macch the job title", async () => {
    const jobs: Job[] = [
      createJob("1", "Senior Solutions Architect (Startups)"),
      createJob("2", "Enterprise Service Manager, Industrial Manufacturing, AWSI Professional Services EMEA"),
      createJob("3", "Solutions Architect, AWS Well-Architected")
    ]

    const actualJobs = await handler(jobs)

    expect(actualJobs).toHaveLength(2)
    expect(actualJobs[0].title).toEqual("Senior Solutions Architect (Startups)")
    expect(actualJobs[1].title).toEqual("Solutions Architect, AWS Well-Architected")
  })

  it("should remove duplicate entries", async () => {
    const jobs: Job[] = [
      createJob("1", "Solutions Architect 1"),
      createJob("2", "Solutions Architect 2"),
      createJob("1", "Solutions Architect 1")
    ]

    const actualJobs = await handler(jobs)

    expect(actualJobs).toHaveLength(2)

    const [job1, job2] = actualJobs
    expect(job1.id).toEqual("1")
    expect(job1.title).toEqual("Solutions Architect 1")

    expect(job2.id).toEqual("2")
    expect(job2.title).toEqual("Solutions Architect 2")
  })
})
