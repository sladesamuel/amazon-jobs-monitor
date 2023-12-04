type Job = {
  id: string
  title: string
  job_path: string // URL segment relative to the baseUrl
  url_next_step: string // absolute URL to apply for the job
  posted_date: string
}

export default Job
