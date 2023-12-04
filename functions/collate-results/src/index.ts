import FetchPageContentModel from "../../models/FetchPageContentModel"
import Job from "../../models/Job"

export default async (models: FetchPageContentModel[]): Promise<Job[]> => {
  console.log(`Received ${models.length} result sets`)
  console.log(JSON.stringify(models))

  const jobs: Job[] = []
  for (const model of models) {
    jobs.push(...(model.jobs ?? []))
  }

  return jobs
}
