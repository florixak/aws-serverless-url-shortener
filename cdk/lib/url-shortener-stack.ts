import * as cdk from "aws-cdk-lib/core";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class UrlShortenerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "LinksTable", {
      tableName: "links-table",
      partitionKey: { name: "shortCode", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const createFn = new NodejsFunction(this, "CreateLinkFunction", {
      entry: "./handlers/create-lambda.mjs",
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    table.grantWriteData(createFn);

    const redirectFn = new NodejsFunction(this, "RedirectLinkFunction", {
      entry: "./handlers/redirect-lambda.mjs",
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    table.grantReadWriteData(redirectFn);

    const api = new apigateway.HttpApi(this, "UrlShortenerApi");

    api.addRoutes({
      path: "/links",
      methods: [apigateway.HttpMethod.POST],
      integration: new HttpLambdaIntegration("CreateIntegration", createFn),
    });

    api.addRoutes({
      path: "/{code}",
      methods: [apigateway.HttpMethod.GET],
      integration: new HttpLambdaIntegration("RedirectIntegration", redirectFn),
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url ?? "",
    });

    createFn.addEnvironment("BASE_URL", api.url ?? "");
  }
}
