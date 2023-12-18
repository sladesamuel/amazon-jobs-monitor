import Job from "./Job"

// "Send notifications": {
//   "Type": "Map",
//   "ItemsPath": "$.results",
//   "ItemProcessor": {
//     "ProcessorConfig": {
//       "Mode": "INLINE"
//     },
//     "StartAt": "Send new results notification",
//     "States": {
//       "Send new results notification": {
//         "Type": "Task",
//         "Resource": "arn:aws:states:::sns:publish",
//         "Parameters": {
//           "TopicArn": "${JobNotificationsArn}",
//           "Subject": "Amazon Jobs Monitor",
//           "Message.$": "States.Format('{}\nhttps://www.amazon.jobs{}\n\nApply: https://account.amazon.jobs/en-GB/jobs/{}/apply', $.title, $.jobPath, $.shortId)"
//         },
//         "End": true
//       }
//     }
//   },
//   "End": true

const createJobLink = ({ title, job_path }: Job): string =>
  `<a href="https://www.amazon.jobs/${job_path}">${title}</a>`

export default async (jobs: Job[]): Promise<string> => {
  console.log(jobs)

  if (jobs.length === 0) {
    return ""
  }

  const header = "<h2>New jobs</h2>"
  const links = jobs.map(createJobLink)

  return [header, "", ...links].join("\n")
}
