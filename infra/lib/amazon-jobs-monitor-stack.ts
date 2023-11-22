import path = require("path")
import { Construct } from "constructs"
import * as cdk from "aws-cdk-lib"
import { aws_lambda as lambda } from "aws-cdk-lib"

const prefix = "amazon-jobs-monitor"
const lambdaPath = path.join(__dirname, "../../functions/fetch-page-content/lambda.zip")

export class AmazonJobsMonitorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    new lambda.Function(this, "FetchPageContent", {
      functionName: `${prefix}-fetch-page-content`,
      handler: "index.default",
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset(lambdaPath),

      environment: {
        AMAZON_JOBS_BASE_URL: "https://amazon.jobs"
      }
    })
  }
}
