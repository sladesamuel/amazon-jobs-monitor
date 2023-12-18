import Job from "./Job"

const createJobLink = ({ title, jobPath }: Job): string =>
  `<a href="https://www.amazon.jobs${jobPath}">${title}</a>`

export default async (jobs: Job[]): Promise<string> => {
  console.log(jobs)

  if (jobs.length === 0) {
    return ""
  }

  const header = "<h2>New jobs</h2>"
  const links = jobs.map(createJobLink)

  return [header, "", ...links].join("<br />")
}
