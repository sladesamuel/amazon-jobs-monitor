import Job from "./Job"

export default async (jobs: Job[]): Promise<Job[]> => {
  console.log(jobs)

  const seenIds: string[] = []
  return jobs.filter(({ id, title }: Job) => {
    if (!/Solution/g.test(title) || !/Architect/g.test(title)) {
      return false
    }

    if (seenIds.includes(id)) {
      return false
    }

    seenIds.push(id)

    return true
  })
}
