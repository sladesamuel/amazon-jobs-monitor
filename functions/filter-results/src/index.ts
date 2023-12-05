import Job from "./Job"

export default async (jobs: Job[]): Promise<Job[]> =>
  jobs.filter(({ title }: Job) => /Solution/g.test(title) && /Architect/g.test(title))
