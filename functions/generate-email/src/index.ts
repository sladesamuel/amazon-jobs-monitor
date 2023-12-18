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

export default async (jobs: Job[]): Promise<string> => {
  console.log(jobs)

  await Promise.resolve()

  return "TODO: HTML for all jobs"
}
