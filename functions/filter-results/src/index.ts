import Job from "./Job"

export default async (jobs: Job[]): Promise<Job[]> => {
  console.log(jobs)

  return jobs.filter(
    ({ title }: Job) => /Solution/g.test(title) && /Architect/g.test(title))
}
