import { Construct } from "constructs"
import * as cdk from "aws-cdk-lib"
import { aws_s3 as s3 } from "aws-cdk-lib"

export class AmazonJobsMonitorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    new s3.Bucket(this, "DummyBucket", {
      bucketName: "slade-dummy-bucket"
    })
  }
}
