import path = require("path")
import { Construct } from "constructs"
import * as cdk from "aws-cdk-lib"
import {
  aws_iam as iam,
  aws_lambda as lambda,
  aws_stepfunctions as sfn
} from "aws-cdk-lib"
import transformFileTemplate from "./transformFileTemplate"
import { ServicePrincipal } from "aws-cdk-lib/aws-iam"

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

    // Lambda Function: collate-results
    const collateResultsLambdaPath = path.join(functionsPath, "collate-results/lambda.zip")
    const collateResultsLambda = new lambda.Function(this, "CollateResults", {
      functionName: `${prefix}-collate-results`,
      handler: "index.default",
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset(collateResultsLambdaPath)
    })

    // Step Function: monitor-wprkflow
    const stepFunctionIamRole = new iam.Role(this, "MonitorWorkflowRole", {
      roleName: `${prefix}-workflow`,
      assumedBy: new ServicePrincipal("states.amazonaws.com")
    })

    new iam.Policy(this, "MonitorWorkflowInvokeLambdasPolicy", {
      policyName: `${prefix}-workflow-invoke-lambdas`,
      roles: [stepFunctionIamRole],
      document: iam.PolicyDocument.fromJson({
        "Version": "2012-10-17",
        "Statement": [
          {
            "Sid": "AllowInvokeLambdas",
            "Effect": "Allow",
            "Action": "lambda:InvokeFunction",
            "Resource": [
              fetchPageContentLambda.functionArn,
              collateResultsLambda.functionArn
            ]
          }
        ]
      })
    })

    const stepFunctionDefinitionFilePath = path.join(__dirname, "./workflow.asl.json")
    const stepFunctionDefinition = transformFileTemplate(stepFunctionDefinitionFilePath, {
      "FetchPageContentLambdaArn": fetchPageContentLambda.functionArn,
      "CollateResultsLambdaArn": collateResultsLambda.functionArn
    })

    new sfn.StateMachine(this, "MonitorWorkflow", {
      stateMachineName: `${prefix}-workflow`,
      role: stepFunctionIamRole,
      definitionBody: sfn.DefinitionBody.fromString(stepFunctionDefinition)
    })
  }
}
