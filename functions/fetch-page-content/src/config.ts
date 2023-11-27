export type Config = {
  baseUrl: string
  itemsPerPage: number
  includeJobsInResult: boolean
}

const config: Config = {
  baseUrl: process.env.AMAZON_JOBS_BASE_URL ?? "",
  itemsPerPage: 10,
  includeJobsInResult: process.env.INCLUDE_JOBS_IN_RESULT === "true"
}

if (!config.baseUrl) {
  throw new Error("Missing AMAZON_JOBS_BASE_URL from env vars")
}

export default config
