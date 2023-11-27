export type Config = {
  baseUrl: string
  itemsPerPage: number
}

const config: Config = {
  baseUrl: process.env.AMAZON_JOBS_BASE_URL ?? "",
  itemsPerPage: 10
}

if (!config.baseUrl) {
  throw new Error("Missing AMAZON_JOBS_BASE_URL from env vars")
}

export default config
