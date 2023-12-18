import path = require("path")
import { Construct } from "constructs"
import * as cdk from "aws-cdk-lib"
import {
  aws_iam as iam,
  aws_lambda as lambda,
  aws_dynamodb as dynamodb,
  aws_events as events,
  aws_events_targets as targets,
  aws_sqs as sqs,
  aws_sns as sns,
  aws_sns_subscriptions as sns_subs,
  aws_stepfunctions as sfn
} from "aws-cdk-lib"
import transformFileTemplate from "./transformFileTemplate"
import { ServicePrincipal } from "aws-cdk-lib/aws-iam"
import { VerifySesEmailAddress } from "@seeebiii/ses-verify-identities"

const prefix = "amazon-jobs-monitor"
const functionsPath = path.join(__dirname, "../../functions")

export class AmazonJobsMonitorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    cdk.Tags.of(this).add("Application", "AmazonJobsMonitor")
    cdk.Tags.of(this).add("Environment", "prod")

    // Parameters
    const phoneNumber = this.node.getContext("phoneNumber") as string
    const emailAddress = this.node.getContext("emailAddress") as string

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

    // Lambda Function: filter-results
    const filterResultsLambdaPath = path.join(functionsPath, "filter-results/lambda.zip")
    const filterResultsLambda = new lambda.Function(this, "FilterResults", {
      functionName: `${prefix}-filter-results`,
      handler: "index.default",
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset(filterResultsLambdaPath)
    })

    // Lambda Function: generate-email
    const generateEmailLambdaPath = path.join(functionsPath, "generate-email/lambda.zip")
    const generateEmailLambda = new lambda.Function(this, "GenerateEmail", {
      functionName: `${prefix}-generate-email`,
      handler: "index.default",
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset(generateEmailLambdaPath)
    })

    // DynamoDB Table: jobs
    const jobsTable = new dynamodb.Table(this, "JobsTable", {
      tableName: `${prefix}-jobs`,
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
    })

    // SNS Topic and SMS Configuration
    const topic = new sns.Topic(this, "JobNotifications", {
      topicName: `${prefix}-notifications`
    })

    const notificationsDlq = new sqs.Queue(this, "NotificationsDlq", {
      queueName: `${prefix}-notifications-dlq`
    })

    notificationsDlq.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [
        new ServicePrincipal("sns.amazonaws.com")
      ],
      actions: [
        "sqs:SendMessage"
      ],
      conditions: {
        "ArnEquals": {
          "aws:SourceArn": topic.topicArn
        }
      }
    }))

    const smsSubscription = new sns_subs.SmsSubscription(phoneNumber, {
      deadLetterQueue: notificationsDlq
    })

    topic.addSubscription(smsSubscription)

    new VerifySesEmailAddress(this, "VerifiedSenderEmail", {
      emailAddress
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
              filterResultsLambda.functionArn,
              generateEmailLambda.functionArn
            ]
          }
        ]
      })
    })

    new iam.Policy(this, "MonitorWorkflowPublishNotification", {
      policyName: `${prefix}-workflow-publish-notifications`,
      roles: [stepFunctionIamRole],
      document: iam.PolicyDocument.fromJson({
        "Version": "2012-10-17",
        "Statement": [
          {
            "Sid": "AllowPublishNotifications",
            "Effect": "Allow",
            "Action": "sns:Publish",
            "Resource": topic.topicArn
          }
        ]
      })
    })

    new iam.Policy(this, "MonitorWorkflowReadWriteJobsTablePolicy", {
      policyName: `${prefix}-workflow-read-write-jobs-table`,
      roles: [stepFunctionIamRole],
      document: iam.PolicyDocument.fromJson({
        "Version": "2012-10-17",
        "Statement": [
          {
            "Sid": "AllowReadWriteDynamo",
            "Effect": "Allow",
            "Action": [
              "dynamodb:GetItem",
              "dynamodb:PutItem"
            ],
            "Resource": jobsTable.tableArn
          }
        ]
      })
    })

    new iam.Policy(this, "MonitorWorkflowSendEmailsPolicy", {
      policyName: `${prefix}-workflow-send-emails`,
      roles: [stepFunctionIamRole],
      document: iam.PolicyDocument.fromJson({
        "Version": "2012-10-17",
        "Statement": [
          {
            "Sid": "AllowSendEmails",
            "Effect": "Allow",
            "Action": "ses:SendEmail",
            "Resource": `arn:aws:ses:${this.region}:${this.account}:identity/${emailAddress}`
          }
        ]
      })
    })

    const stepFunctionDefinitionFilePath = path.join(__dirname, "./workflow.asl.json")
    const stepFunctionDefinition = transformFileTemplate(stepFunctionDefinitionFilePath, {
      "FetchPageContentLambdaArn": fetchPageContentLambda.functionArn,
      "FilterResultsLambdaArn": filterResultsLambda.functionArn,
      "GenerateEmailLambdaArn": generateEmailLambda.functionArn,
      "JobsTableName": jobsTable.tableName,
      "JobNotificationsArn": topic.topicArn,
      "EmailAddress": emailAddress
    })

    const workflow = new sfn.StateMachine(this, "MonitorWorkflow", {
      stateMachineName: `${prefix}-workflow`,
      role: stepFunctionIamRole,
      definitionBody: sfn.DefinitionBody.fromString(stepFunctionDefinition)
    })

    new events.Rule(this, "RunWorkflowDaily", {
      ruleName: `${prefix}-run-workflow-daily`,
      schedule: events.Schedule.cron({
        minute: "0",
        hour: "12"
      }),
      description: "Triggers the jobs monitor workflow to run once every day at midday",
      targets: [
        new targets.SfnStateMachine(workflow, {
          input: events.RuleTargetInput.fromObject({
            searchTerm: "Solutions Architect"
          })
        })
      ]
    })
  }
}
