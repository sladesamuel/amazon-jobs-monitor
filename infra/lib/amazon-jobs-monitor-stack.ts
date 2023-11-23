import path = require("path")
import { Construct } from "constructs"
import * as cdk from "aws-cdk-lib"
import { aws_lambda as lambda, aws_stepfunctions as sfn } from "aws-cdk-lib"
import transformFileTemplate from "./transformFileTemplate"

const jobSearchTerm = "Solutions Architect"

const prefix = "amazon-jobs-monitor"
const functionsPath = path.join(__dirname, "../../functions")

export class AmazonJobsMonitorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Lambda Function: fetch-page-content
    const fetchPageContentLambdaPath = path.join(functionsPath, "fetch-page-content/lambda.zip")
    const fetchPageContentLambda = new lambda.Function(this, "FetchPageContent", {
      functionName: `${prefix}-fetch-page-content`,
      handler: "index.default",
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset(fetchPageContentLambdaPath),

      environment: {
        AMAZON_JOBS_BASE_URL: "https://amazon.jobs"
      }
    })

    // Step Function: monitor-wprkflow
    const stepFunctionDefinitionFilePath = path.join(__dirname, "./workflow.asl.json")
    const stepFunctionDefinition = transformFileTemplate(stepFunctionDefinitionFilePath, {
      "JobSearchTerm": jobSearchTerm,
      "FetchPageContentLambdaArn": fetchPageContentLambda.functionArn
    })

    new sfn.StateMachine(this, "MonitorWorkflow", {
      stateMachineName: `${prefix}-workflow`,
      definitionBody: sfn.DefinitionBody.fromString(stepFunctionDefinition)
    })
  }
}
